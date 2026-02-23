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

// getCarrinhoID returns the cart ID for the authenticated user (Consumidor or NaoAutenticado)
func getCarrinhoID(userID, tipo string) (string, string, bool) {
	if tipo == "Consumidor" {
		var cid, carrinhoID string
		if err := db.DB.QueryRow(`SELECT id, carrinho_id FROM consumidores WHERE utilizador_id=?`, userID).Scan(&cid, &carrinhoID); err != nil {
			return "", "", false
		}
		return cid, carrinhoID, true
	}
	// NaoAutenticado: carrinho ID = userID
	// Ensure it exists
	db.DB.Exec(`INSERT OR IGNORE INTO carrinhos(id,consumidor_id,items) VALUES(?,NULL,'[]')`, userID)
	return userID, userID, true
}

// GetCarrinhoCompat GET /api/utilizador/carrinho?utilizador=ID
func GetCarrinhoCompat(c *gin.Context) {
	userID := mw.UserID(c)
	tipo := mw.UserTipo(c)

	_, carrinhoID, ok := getCarrinhoID(userID, tipo)
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Carrinho não encontrado"})
		return
	}

	var itemsJSON string
	if err := db.DB.QueryRow(`SELECT items FROM carrinhos WHERE id=?`, carrinhoID).Scan(&itemsJSON); err != nil {
		db.DB.Exec(`INSERT OR IGNORE INTO carrinhos(id,consumidor_id,items) VALUES(?,NULL,'[]')`, carrinhoID)
		itemsJSON = "[]"
	}

	var rawItems []map[string]any
	_ = json.Unmarshal([]byte(itemsJSON), &rawItems)
	if rawItems == nil {
		rawItems = []map[string]any{}
	}
	// React's getUsersShoppingCart reads produtos[k].produto as the especifico ID
	for i, item := range rawItems {
		if id, ok := item["produto_especifico_id"].(string); ok {
			rawItems[i]["produto"] = id
		}
	}
	c.JSON(http.StatusOK, gin.H{
		"code": 200, "message": "Success",
		"data": gin.H{"carrinho": gin.H{
			"_id": carrinhoID, "id": carrinhoID,
			"utilizador": userID, "produtos": rawItems,
		}},
	})
}

// AddToCarrinhoCompat POST /api/utilizador/carrinho/produto
func AddToCarrinhoCompat(c *gin.Context) {
	userID := mw.UserID(c)
	tipo := mw.UserTipo(c)

	_, carrinhoID, ok := getCarrinhoID(userID, tipo)
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Carrinho não encontrado"})
		return
	}

	var req struct {
		ProdutoEspecificoID string `json:"produto_especifico" binding:"required"`
		Quantidade          int    `json:"quantidade" binding:"required,min=1"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido"})
		return
	}

	var pe models.ProdutoEspecifico
	var attrJSON, imgJSON string
	var produtoID string
	if err := db.DB.QueryRow(`SELECT id, produto_id, preco, stock, atributos, imagens FROM produto_especificos WHERE id=? AND estado='ativo'`, req.ProdutoEspecificoID).
		Scan(&pe.ID, &produtoID, &pe.Preco, &pe.Stock, &attrJSON, &imgJSON); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Produto não encontrado"})
		return
	}
	_ = json.Unmarshal([]byte(attrJSON), &pe.Atributos)
	_ = json.Unmarshal([]byte(imgJSON), &pe.Imagens)

	var nome string
	db.DB.QueryRow(`SELECT nome FROM produtos WHERE id=?`, produtoID).Scan(&nome)

	var itemsJSON string
	if err := db.DB.QueryRow(`SELECT items FROM carrinhos WHERE id=?`, carrinhoID).Scan(&itemsJSON); err != nil {
		db.DB.Exec(`INSERT INTO carrinhos(id,consumidor_id,items) VALUES(?,NULL,'[]')`, carrinhoID)
		itemsJSON = "[]"
	}

	var items []models.CartItem
	_ = json.Unmarshal([]byte(itemsJSON), &items)

	found := false
	for i, item := range items {
		if item.ProdutoEspecificoID == req.ProdutoEspecificoID {
			items[i].Quantidade += req.Quantidade
			found = true
			break
		}
	}
	if !found {
		img := ""
		if len(pe.Imagens) > 0 {
			img = pe.Imagens[0]
		}
		items = append(items, models.CartItem{
			ID:                  uuid.NewString(),
			ProdutoEspecificoID: req.ProdutoEspecificoID,
			ProdutoID:           produtoID,
			Nome:                nome,
			Preco:               pe.Preco,
			Quantidade:          req.Quantidade,
			Atributos:           pe.Atributos,
			Imagem:              img,
		})
	}

	newJSON, _ := json.Marshal(items)
	db.DB.Exec(`UPDATE carrinhos SET items=? WHERE id=?`, string(newJSON), carrinhoID)
	c.JSON(http.StatusOK, gin.H{
		"code": 200, "message": "Produto adicionado",
		"data": gin.H{"carrinho": gin.H{"_id": carrinhoID, "produtos": items}},
	})
}

// RemoveFromCarrinhoCompat DELETE /api/utilizador/carrinho/produto
func RemoveFromCarrinhoCompat(c *gin.Context) {
	userID := mw.UserID(c)
	tipo := mw.UserTipo(c)

	_, carrinhoID, ok := getCarrinhoID(userID, tipo)
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Carrinho não encontrado"})
		return
	}

	var req struct {
		ProdutoEspecificoID string `json:"produto_especifico"`
	}
	c.ShouldBindJSON(&req)

	var itemsJSON string
	db.DB.QueryRow(`SELECT items FROM carrinhos WHERE id=?`, carrinhoID).Scan(&itemsJSON)

	var items []models.CartItem
	_ = json.Unmarshal([]byte(itemsJSON), &items)

	newItems := make([]models.CartItem, 0)
	for _, item := range items {
		if item.ProdutoEspecificoID != req.ProdutoEspecificoID {
			newItems = append(newItems, item)
		}
	}

	newJSON, _ := json.Marshal(newItems)
	db.DB.Exec(`UPDATE carrinhos SET items=? WHERE id=?`, string(newJSON), carrinhoID)
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Produto removido"})
}

// UpdateCarrinhoCompat PUT /api/utilizador/carrinho/produto
func UpdateCarrinhoCompat(c *gin.Context) {
	userID := mw.UserID(c)
	tipo := mw.UserTipo(c)

	_, carrinhoID, ok := getCarrinhoID(userID, tipo)
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Carrinho não encontrado"})
		return
	}

	var req struct {
		ProdutoEspecificoID string `json:"produto_especifico"`
		Quantidade          int    `json:"quantidade"`
	}
	c.ShouldBindJSON(&req)

	var itemsJSON string
	db.DB.QueryRow(`SELECT items FROM carrinhos WHERE id=?`, carrinhoID).Scan(&itemsJSON)

	var items []models.CartItem
	_ = json.Unmarshal([]byte(itemsJSON), &items)

	for i, item := range items {
		if item.ProdutoEspecificoID == req.ProdutoEspecificoID {
			if req.Quantidade <= 0 {
				items = append(items[:i], items[i+1:]...)
			} else {
				items[i].Quantidade = req.Quantidade
			}
			break
		}
	}

	newJSON, _ := json.Marshal(items)
	db.DB.Exec(`UPDATE carrinhos SET items=? WHERE id=?`, string(newJSON), carrinhoID)
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Carrinho atualizado"})
}

// CheckoutCompat POST /api/utilizador/carrinho/compra
func CheckoutCompat(c *gin.Context) {
	userID := mw.UserID(c)

	var cid string
	if err := db.DB.QueryRow(`SELECT id FROM consumidores WHERE utilizador_id=?`, userID).Scan(&cid); err != nil {
		c.JSON(http.StatusForbidden, gin.H{"code": 403, "message": "Apenas consumidores podem fazer encomendas"})
		return
	}

	var carrinhoID string
	db.DB.QueryRow(`SELECT carrinho_id FROM consumidores WHERE id=?`, cid).Scan(&carrinhoID)

	var req struct {
		LocalEntrega   map[string]any `json:"local_entrega"`
		DescontoCodigo string         `json:"desconto_codigo"`
	}
	c.ShouldBindJSON(&req)

	var itemsJSON string
	db.DB.QueryRow(`SELECT items FROM carrinhos WHERE id=?`, carrinhoID).Scan(&itemsJSON)

	var items []models.CartItem
	_ = json.Unmarshal([]byte(itemsJSON), &items)
	if len(items) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Carrinho vazio"})
		return
	}

	var total float64
	for _, item := range items {
		total += item.Preco * float64(item.Quantidade)
	}

	var fornecedorID string
	if len(items) > 0 && items[0].ProdutoID != "" {
		db.DB.QueryRow(`SELECT fornecedor_id FROM produtos WHERE id=?`, items[0].ProdutoID).Scan(&fornecedorID)
	}

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

	tx.Exec(`INSERT INTO encomendas(id,consumidor_id,fornecedor_id,items,local_entrega,estado,total) VALUES(?,?,?,?,?,?,?)`,
		eid, cid, fornecedorID, string(itemsOrderJSON), string(localJSON), "pendente", total)
	tx.Exec(`UPDATE carrinhos SET items='[]' WHERE id=?`, carrinhoID)

	stripePI := "pi_mock_" + uuid.NewString()[:12]
	pagID := uuid.NewString()
	tx.Exec(`INSERT INTO pagamentos(id,encomenda_id,valor,metodo,estado,stripe_payment_intent) VALUES(?,?,?,?,?,?)`,
		pagID, eid, total, "stripe", "pendente", stripePI)

	tx.Commit()

	c.JSON(http.StatusCreated, gin.H{
		"code": 201, "message": "Encomenda criada",
		"data": gin.H{
			"encomenda_id":          eid,
			"total":                 total,
			"stripe_payment_intent": stripePI,
			"client_secret":         "cs_mock_" + uuid.NewString()[:16],
		},
	})
}

// ConfirmCheckoutCompat POST /api/utilizador/carrinho/compra/confirmar
func ConfirmCheckoutCompat(c *gin.Context) {
	userID := mw.UserID(c)

	var cid string
	if err := db.DB.QueryRow(`SELECT id FROM consumidores WHERE utilizador_id=?`, userID).Scan(&cid); err != nil {
		c.JSON(http.StatusForbidden, gin.H{"code": 403, "message": "Sem permissão"})
		return
	}

	var req struct {
		EncomendaID   string `json:"encomenda_id"`
		PaymentIntent string `json:"payment_intent"`
	}
	c.ShouldBindJSON(&req)

	var total float64
	if err := db.DB.QueryRow(`SELECT total FROM encomendas WHERE id=? AND consumidor_id=?`, req.EncomendaID, cid).Scan(&total); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Encomenda não encontrada"})
		return
	}

	tx, _ := db.DB.Begin()
	defer tx.Rollback()

	tx.Exec(`UPDATE encomendas SET estado='confirmado' WHERE id=?`, req.EncomendaID)
	tx.Exec(`UPDATE pagamentos SET estado='pago' WHERE encomenda_id=?`, req.EncomendaID)
	vid := uuid.NewString()
	tx.Exec(`INSERT INTO vendas(id,encomenda_id,valor) VALUES(?,?,?)`, vid, req.EncomendaID, total)

	tx.Commit()
	c.JSON(http.StatusOK, gin.H{
		"code": 200, "message": "Pagamento confirmado",
		"data": gin.H{"encomenda_id": req.EncomendaID, "estado": "confirmado"},
	})
}
