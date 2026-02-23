package handlers

import (
	"encoding/json"
	"net/http"

	"baylit/db"
	mw "baylit/middleware"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GetConsumidorPublic GET /api/utilizador/consumidor  (public — accepts ?id=X)
// Used by React's getUserById which does not send an auth token.
func GetConsumidorPublic(c *gin.Context) {
	idParam := c.Query("id")
	if idParam == "" {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido"})
		return
	}
	type resp struct {
		ID            string `json:"id"`
		Nome          string `json:"nome"`
		Email         string `json:"email"`
		LocaisEntrega []any  `json:"locais_entrega"`
		CarrinhoID    string `json:"carrinho_id"`
	}
	var r resp
	var locaisJSON string
	// idParam may be utilizador_id or consumidor_id — try both
	err := db.DB.QueryRow(`
		SELECT c.id, c.nome, u.email, c.locais_entrega, c.carrinho_id
		FROM consumidores c JOIN utilizadores u ON u.id=c.utilizador_id
		WHERE c.utilizador_id=? OR c.id=?`, idParam, idParam).Scan(&r.ID, &r.Nome, &r.Email, &locaisJSON, &r.CarrinhoID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Consumidor não encontrado"})
		return
	}
	_ = json.Unmarshal([]byte(locaisJSON), &r.LocaisEntrega)
	if r.LocaisEntrega == nil {
		r.LocaisEntrega = []any{}
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": []any{r}})
}

// GetConsumidor GET /api/utilizador/consumidor  (JWT: consumidor)
func GetConsumidor(c *gin.Context) {
	userID := mw.UserID(c)
	type resp struct {
		ID             string `json:"id"`
		Nome           string `json:"nome"`
		Email          string `json:"email"`
		LocaisEntrega  []any  `json:"locais_entrega"`
		CarrinhoID     string `json:"carrinho_id"`
	}
	var r resp
	var locaisJSON string
	err := db.DB.QueryRow(`
		SELECT c.id, c.nome, u.email, c.locais_entrega, c.carrinho_id
		FROM consumidores c JOIN utilizadores u ON u.id=c.utilizador_id
		WHERE c.utilizador_id=?`, userID).Scan(&r.ID, &r.Nome, &r.Email, &locaisJSON, &r.CarrinhoID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Consumidor não encontrado"})
		return
	}
	_ = json.Unmarshal([]byte(locaisJSON), &r.LocaisEntrega)
	if r.LocaisEntrega == nil {
		r.LocaisEntrega = []any{}
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": r})
}

// UpdateConsumidor PUT /api/utilizador/consumidor  (JWT: consumidor)
func UpdateConsumidor(c *gin.Context) {
	userID := mw.UserID(c)
	var req struct {
		Nome string `json:"nome"`
	}
	c.ShouldBindJSON(&req)
	if req.Nome != "" {
		db.DB.Exec(`UPDATE consumidores SET nome=? WHERE utilizador_id=?`, req.Nome, userID)
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Perfil atualizado"})
}

// GetConsumidorEncomendas GET /api/utilizador/consumidor/encomendas  (JWT: consumidor)
func GetConsumidorEncomendas(c *gin.Context) {
	userID := mw.UserID(c)
	var cid string
	if err := db.DB.QueryRow(`SELECT id FROM consumidores WHERE utilizador_id=?`, userID).Scan(&cid); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Consumidor não encontrado"})
		return
	}

	rows, err := db.DB.Query(`SELECT id, fornecedor_id, items, local_entrega, estado, total, created_at FROM encomendas WHERE consumidor_id=? ORDER BY created_at DESC`, cid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}
	defer rows.Close()

	type enc struct {
		ID           string  `json:"id"`
		FornecedorID string  `json:"fornecedor_id"`
		Items        []any   `json:"items"`
		LocalEntrega any     `json:"local_entrega"`
		Estado       string  `json:"estado"`
		Total        float64 `json:"total"`
		CreatedAt    string  `json:"created_at"`
	}
	var encomendas []enc
	for rows.Next() {
		var e enc
		var itemsJSON, localJSON, fid string
		var createdAt string
		if err := rows.Scan(&e.ID, &fid, &itemsJSON, &localJSON, &e.Estado, &e.Total, &createdAt); err != nil {
			continue
		}
		e.FornecedorID = fid
		e.CreatedAt = createdAt
		_ = json.Unmarshal([]byte(itemsJSON), &e.Items)
		_ = json.Unmarshal([]byte(localJSON), &e.LocalEntrega)
		if e.Items == nil {
			e.Items = []any{}
		}
		encomendas = append(encomendas, e)
	}
	if encomendas == nil {
		encomendas = []enc{}
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": encomendas})
}

// AddLocalEntrega POST /api/utilizador/consumidor/local  (JWT: consumidor)
func AddLocalEntrega(c *gin.Context) {
	userID := mw.UserID(c)
	var cid, locaisJSON string
	if err := db.DB.QueryRow(`SELECT id, locais_entrega FROM consumidores WHERE utilizador_id=?`, userID).Scan(&cid, &locaisJSON); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Consumidor não encontrado"})
		return
	}

	var req map[string]any
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido"})
		return
	}

	var locais []any
	_ = json.Unmarshal([]byte(locaisJSON), &locais)
	req["id"] = uuid.NewString()
	locais = append(locais, req)

	newJSON, _ := json.Marshal(locais)
	db.DB.Exec(`UPDATE consumidores SET locais_entrega=? WHERE id=?`, string(newJSON), cid)
	c.JSON(http.StatusCreated, gin.H{"code": 201, "message": "Local adicionado", "data": req})
}

// DeleteLocalEntrega DELETE /api/utilizador/consumidor/local/:id  (JWT: consumidor)
func DeleteLocalEntrega(c *gin.Context) {
	userID := mw.UserID(c)
	localID := c.Param("id")

	var cid, locaisJSON string
	if err := db.DB.QueryRow(`SELECT id, locais_entrega FROM consumidores WHERE utilizador_id=?`, userID).Scan(&cid, &locaisJSON); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Consumidor não encontrado"})
		return
	}

	var locais []map[string]any
	_ = json.Unmarshal([]byte(locaisJSON), &locais)

	newLocais := make([]map[string]any, 0)
	for _, l := range locais {
		if id, ok := l["id"].(string); ok && id == localID {
			continue
		}
		newLocais = append(newLocais, l)
	}

	newJSON, _ := json.Marshal(newLocais)
	db.DB.Exec(`UPDATE consumidores SET locais_entrega=? WHERE id=?`, string(newJSON), cid)
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Local removido"})
}
