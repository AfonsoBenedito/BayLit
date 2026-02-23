package handlers

import (
	"encoding/json"
	"net/http"

	"baylit/db"
	mw "baylit/middleware"
	"baylit/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// Checkout POST /api/utilizador/checkout  (JWT: consumidor)
// Creates a pending order from the cart.
func Checkout(c *gin.Context) {
	userID := mw.UserID(c)

	var cid, carrinhoID string
	if err := db.DB.QueryRow(`SELECT id, carrinho_id FROM consumidores WHERE utilizador_id=?`, userID).Scan(&cid, &carrinhoID); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Consumidor não encontrado"})
		return
	}

	var req struct {
		LocalEntrega map[string]any `json:"local_entrega" binding:"required"`
		DescontoCod  string         `json:"desconto_codigo"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido"})
		return
	}

	// Load cart
	var itemsJSON string
	if err := db.DB.QueryRow(`SELECT items FROM carrinhos WHERE id=?`, carrinhoID).Scan(&itemsJSON); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Carrinho não encontrado"})
		return
	}

	var items []models.CartItem
	_ = json.Unmarshal([]byte(itemsJSON), &items)
	if len(items) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Carrinho vazio"})
		return
	}

	// Calculate total
	var total float64
	for _, item := range items {
		total += item.Preco * float64(item.Quantidade)
	}

	// Apply discount
	discountPct := 0.0
	if req.DescontoCod != "" {
		var pct float64
		err := db.DB.QueryRow(`SELECT percentagem FROM descontos WHERE codigo=? AND ativo=1 AND (data_fim IS NULL OR data_fim > datetime('now'))`, req.DescontoCod).Scan(&pct)
		if err == nil {
			discountPct = pct
			total = total * (1 - pct/100)
		}
	}

	// Determine fornecedor from first item
	var fornecedorID string
	if len(items) > 0 {
		var pid string
		db.DB.QueryRow(`SELECT produto_id FROM produto_especificos WHERE id=?`, items[0].ProdutoEspecificoID).Scan(&pid)
		db.DB.QueryRow(`SELECT fornecedor_id FROM produtos WHERE id=?`, pid).Scan(&fornecedorID)
	}

	// Build order items
	orderItems := make([]models.OrderItem, len(items))
	for i, ci := range items {
		orderItems[i] = models.OrderItem{
			ProdutoEspecificoID: ci.ProdutoEspecificoID,
			ProdutoID:           ci.ProdutoID,
			Nome:                ci.Nome,
			Preco:               ci.Preco,
			Quantidade:          ci.Quantidade,
			Atributos:           ci.Atributos,
		}
	}

	eid := uuid.NewString()
	itemsOrderJSON, _ := json.Marshal(orderItems)
	localJSON, _ := json.Marshal(req.LocalEntrega)

	tx, _ := db.DB.Begin()
	defer tx.Rollback()

	if _, err := tx.Exec(`INSERT INTO encomendas(id,consumidor_id,fornecedor_id,items,local_entrega,estado,total) VALUES(?,?,?,?,?,?,?)`,
		eid, cid, fornecedorID, string(itemsOrderJSON), string(localJSON), "pendente", total); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro ao criar encomenda"})
		return
	}

	// Clear cart
	tx.Exec(`UPDATE carrinhos SET items='[]' WHERE id=?`, carrinhoID)

	// Mock Stripe payment intent
	stripePI := "pi_mock_" + uuid.NewString()[:12]
	pid2 := uuid.NewString()
	tx.Exec(`INSERT INTO pagamentos(id,encomenda_id,valor,metodo,estado,stripe_payment_intent) VALUES(?,?,?,?,?,?)`,
		pid2, eid, total, "stripe", "pendente", stripePI)

	tx.Commit()

	c.JSON(http.StatusCreated, gin.H{
		"code": 201, "message": "Encomenda criada",
		"data": gin.H{
			"encomenda_id":           eid,
			"total":                  total,
			"desconto_aplicado":       discountPct,
			"stripe_payment_intent":   stripePI,
			"client_secret":           "cs_mock_" + uuid.NewString()[:16],
		},
	})
}

// ConfirmCheckout POST /api/utilizador/checkout/confirm  (JWT: consumidor)
// Confirms payment and finalises the order.
func ConfirmCheckout(c *gin.Context) {
	userID := mw.UserID(c)
	var cid string
	if err := db.DB.QueryRow(`SELECT id FROM consumidores WHERE utilizador_id=?`, userID).Scan(&cid); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Consumidor não encontrado"})
		return
	}

	var req struct {
		EncomendaID string `json:"encomenda_id" binding:"required"`
		PaymentIntent string `json:"payment_intent"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido"})
		return
	}

	// Verify encomenda belongs to this consumer
	var eid string
	var total float64
	if err := db.DB.QueryRow(`SELECT id, total FROM encomendas WHERE id=? AND consumidor_id=?`, req.EncomendaID, cid).Scan(&eid, &total); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Encomenda não encontrada"})
		return
	}

	tx, _ := db.DB.Begin()
	defer tx.Rollback()

	// Update order status
	tx.Exec(`UPDATE encomendas SET estado='confirmado' WHERE id=?`, eid)
	// Update payment status
	tx.Exec(`UPDATE pagamentos SET estado='pago' WHERE encomenda_id=?`, eid)
	// Create venda record
	vid := uuid.NewString()
	tx.Exec(`INSERT INTO vendas(id,encomenda_id,valor) VALUES(?,?,?)`, vid, eid, total)

	// Update stock for each item
	var itemsJSON, fid string
	tx.QueryRow(`SELECT items, fornecedor_id FROM encomendas WHERE id=?`, eid).Scan(&itemsJSON, &fid)
	var items []models.OrderItem
	_ = json.Unmarshal([]byte(itemsJSON), &items)
	for _, item := range items {
		tx.Exec(`UPDATE produto_especificos SET stock=MAX(0,stock-?) WHERE id=?`, item.Quantidade, item.ProdutoEspecificoID)
	}

	tx.Commit()

	c.JSON(http.StatusOK, gin.H{
		"code": 200, "message": "Pagamento confirmado",
		"data": gin.H{"encomenda_id": eid, "estado": "confirmado"},
	})
}
