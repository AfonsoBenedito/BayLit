package handlers

import (
	"encoding/json"
	"net/http"

	"baylit/db"
	mw "baylit/middleware"

	"github.com/gin-gonic/gin"
)

// GetFavoritos GET /api/utilizador/favoritos/produto  (JWT: consumidor)
func GetFavoritos(c *gin.Context) {
	userID := mw.UserID(c)
	var favJSON string
	if err := db.DB.QueryRow(`SELECT COALESCE(favoritos,'[]') FROM consumidores WHERE utilizador_id=?`, userID).Scan(&favJSON); err != nil {
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": gin.H{"favoritos": []any{}}})
		return
	}
	var favs []any
	_ = json.Unmarshal([]byte(favJSON), &favs)
	if favs == nil {
		favs = []any{}
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": gin.H{"favoritos": favs}})
}

// AddFavorito POST /api/utilizador/favoritos/produto  (JWT: consumidor)
// body: {utilizador, favorito: produto_id}
func AddFavorito(c *gin.Context) {
	userID := mw.UserID(c)
	var req struct {
		Favorito string `json:"favorito" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido"})
		return
	}

	var cid, favJSON string
	if err := db.DB.QueryRow(`SELECT id, COALESCE(favoritos,'[]') FROM consumidores WHERE utilizador_id=?`, userID).Scan(&cid, &favJSON); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Consumidor não encontrado"})
		return
	}

	var favs []string
	_ = json.Unmarshal([]byte(favJSON), &favs)
	for _, f := range favs {
		if f == req.Favorito {
			c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Já é favorito"})
			return
		}
	}
	favs = append(favs, req.Favorito)
	newJSON, _ := json.Marshal(favs)
	db.DB.Exec(`UPDATE consumidores SET favoritos=? WHERE id=?`, string(newJSON), cid)
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Favorito adicionado"})
}

// RemoveFavorito DELETE /api/utilizador/favoritos/produto  (JWT: consumidor)
// body: {utilizador, favorito: produto_id}
func RemoveFavorito(c *gin.Context) {
	userID := mw.UserID(c)
	var req struct {
		Favorito string `json:"favorito" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido"})
		return
	}

	var cid, favJSON string
	if err := db.DB.QueryRow(`SELECT id, COALESCE(favoritos,'[]') FROM consumidores WHERE utilizador_id=?`, userID).Scan(&cid, &favJSON); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Consumidor não encontrado"})
		return
	}

	var favs []string
	_ = json.Unmarshal([]byte(favJSON), &favs)
	newFavs := make([]string, 0, len(favs))
	for _, f := range favs {
		if f != req.Favorito {
			newFavs = append(newFavs, f)
		}
	}
	newJSON, _ := json.Marshal(newFavs)
	db.DB.Exec(`UPDATE consumidores SET favoritos=? WHERE id=?`, string(newJSON), cid)
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Favorito removido"})
}

// GetNotificacoes GET /api/utilizador/notificacoes  (JWT)
// Returns an empty list — notifications not implemented in this deployment.
func GetNotificacoes(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": gin.H{"notificacoes": []any{}}})
}

// GetCarrinhoSumarioCadeia GET /api/utilizador/carrinho/cadeia_logistica/sumario  (JWT)
// Returns an aggregate supply chain rating across all products in the cart.
func GetCarrinhoSumarioCadeia(c *gin.Context) {
	userID := mw.UserID(c)
	tipo := mw.UserTipo(c)

	_, carrinhoID, ok := getCarrinhoID(userID, tipo)
	if !ok {
		returnDefaultCadeia(c)
		return
	}

	var itemsJSON string
	if err := db.DB.QueryRow(`SELECT items FROM carrinhos WHERE id=?`, carrinhoID).Scan(&itemsJSON); err != nil {
		returnDefaultCadeia(c)
		return
	}

	var items []map[string]any
	_ = json.Unmarshal([]byte(itemsJSON), &items)

	if len(items) == 0 {
		returnDefaultCadeia(c)
		return
	}

	// Average the cadeia scores across all products in the cart
	totalProducao, totalArmazenamento, totalTransporte := 0.0, 0.0, 0.0
	count := 0
	for _, item := range items {
		pid, _ := item["produto_id"].(string)
		if pid == "" {
			continue
		}
		resumo := buildCadeiaResumo(pid)
		if prod, ok := resumo["producao"].(map[string]any); ok {
			if v, ok := prod["classificacao"].(float64); ok {
				totalProducao += v
			}
		}
		if arm, ok := resumo["armazenamento"].(map[string]any); ok {
			if v, ok := arm["classificacao"].(float64); ok {
				totalArmazenamento += v
			}
		}
		if tr, ok := resumo["transporte_armazem"].(map[string]any); ok {
			if v, ok := tr["classificacao"].(float64); ok {
				totalTransporte += v
			}
		}
		count++
	}
	if count == 0 {
		returnDefaultCadeia(c)
		return
	}
	n := float64(count)
	pScore := totalProducao / n
	aScore := totalArmazenamento / n
	tScore := totalTransporte / n
	overall := (pScore + aScore + tScore) / 3.0

	c.JSON(http.StatusOK, gin.H{
		"code": 200, "message": "Success",
		"data": gin.H{"cadeia": gin.H{
			"classificacao":      overall,
			"producao":           gin.H{"classificacao": pScore},
			"armazenamento":      gin.H{"classificacao": aScore},
			"transporte_armazem": gin.H{"classificacao": tScore},
		}},
	})
}

func returnDefaultCadeia(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"code": 200, "message": "Success",
		"data": gin.H{"cadeia": gin.H{
			"classificacao":      3.0,
			"producao":           gin.H{"classificacao": 3.0},
			"armazenamento":      gin.H{"classificacao": 3.0},
			"transporte_armazem": gin.H{"classificacao": 3.0},
		}},
	})
}
