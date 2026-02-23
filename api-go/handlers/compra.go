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

// GetCarrinho GET /api/utilizador/carrinho  (JWT: consumidor)
func GetCarrinho(c *gin.Context) {
	userID := mw.UserID(c)
	var cid, carrinhoID string
	if err := db.DB.QueryRow(`SELECT id, carrinho_id FROM consumidores WHERE utilizador_id=?`, userID).Scan(&cid, &carrinhoID); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Consumidor não encontrado"})
		return
	}

	var itemsJSON string
	if err := db.DB.QueryRow(`SELECT items FROM carrinhos WHERE id=?`, carrinhoID).Scan(&itemsJSON); err != nil {
		// Auto-create cart
		db.DB.Exec(`INSERT INTO carrinhos(id,consumidor_id,items) VALUES(?,?,?)`, carrinhoID, cid, "[]")
		itemsJSON = "[]"
	}

	var items []models.CartItem
	_ = json.Unmarshal([]byte(itemsJSON), &items)
	if items == nil {
		items = []models.CartItem{}
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": gin.H{"id": carrinhoID, "items": items}})
}

// AddToCarrinho POST /api/utilizador/carrinho/add  (JWT: consumidor)
func AddToCarrinho(c *gin.Context) {
	userID := mw.UserID(c)
	var cid, carrinhoID string
	if err := db.DB.QueryRow(`SELECT id, carrinho_id FROM consumidores WHERE utilizador_id=?`, userID).Scan(&cid, &carrinhoID); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Consumidor não encontrado"})
		return
	}

	var req struct {
		ProdutoEspecificoID string `json:"produto_especifico_id" binding:"required"`
		Quantidade          int    `json:"quantidade" binding:"required,min=1"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido"})
		return
	}

	// Load product especifico details
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

	// Load and update cart
	var itemsJSON string
	if err := db.DB.QueryRow(`SELECT items FROM carrinhos WHERE id=?`, carrinhoID).Scan(&itemsJSON); err != nil {
		db.DB.Exec(`INSERT INTO carrinhos(id,consumidor_id,items) VALUES(?,?,?)`, carrinhoID, cid, "[]")
		itemsJSON = "[]"
	}

	var items []models.CartItem
	_ = json.Unmarshal([]byte(itemsJSON), &items)

	// Check if item already in cart
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
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Item adicionado ao carrinho", "data": gin.H{"id": carrinhoID, "items": items}})
}

// RemoveFromCarrinho DELETE /api/utilizador/carrinho/:item_id  (JWT: consumidor)
func RemoveFromCarrinho(c *gin.Context) {
	userID := mw.UserID(c)
	itemID := c.Param("item_id")

	var cid, carrinhoID string
	if err := db.DB.QueryRow(`SELECT id, carrinho_id FROM consumidores WHERE utilizador_id=?`, userID).Scan(&cid, &carrinhoID); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Consumidor não encontrado"})
		return
	}

	var itemsJSON string
	db.DB.QueryRow(`SELECT items FROM carrinhos WHERE id=?`, carrinhoID).Scan(&itemsJSON)

	var items []models.CartItem
	_ = json.Unmarshal([]byte(itemsJSON), &items)

	newItems := make([]models.CartItem, 0)
	for _, item := range items {
		if item.ID != itemID && item.ProdutoEspecificoID != itemID {
			newItems = append(newItems, item)
		}
	}

	newJSON, _ := json.Marshal(newItems)
	db.DB.Exec(`UPDATE carrinhos SET items=? WHERE id=?`, string(newJSON), carrinhoID)
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Item removido", "data": gin.H{"id": carrinhoID, "items": newItems}})
}

// UpdateCarrinho PUT /api/utilizador/carrinho/update  (JWT: consumidor)
func UpdateCarrinho(c *gin.Context) {
	userID := mw.UserID(c)
	var cid, carrinhoID string
	if err := db.DB.QueryRow(`SELECT id, carrinho_id FROM consumidores WHERE utilizador_id=?`, userID).Scan(&cid, &carrinhoID); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Consumidor não encontrado"})
		return
	}

	var req struct {
		ItemID     string `json:"item_id" binding:"required"`
		Quantidade int    `json:"quantidade" binding:"required,min=1"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido"})
		return
	}

	var itemsJSON string
	db.DB.QueryRow(`SELECT items FROM carrinhos WHERE id=?`, carrinhoID).Scan(&itemsJSON)

	var items []models.CartItem
	_ = json.Unmarshal([]byte(itemsJSON), &items)

	for i, item := range items {
		if item.ID == req.ItemID || item.ProdutoEspecificoID == req.ItemID {
			items[i].Quantidade = req.Quantidade
			break
		}
	}

	newJSON, _ := json.Marshal(items)
	db.DB.Exec(`UPDATE carrinhos SET items=? WHERE id=?`, string(newJSON), carrinhoID)
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Carrinho atualizado", "data": gin.H{"id": carrinhoID, "items": items}})
}
