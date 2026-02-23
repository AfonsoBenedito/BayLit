package handlers

import (
	"net/http"

	"baylit/db"
	mw "baylit/middleware"

	"github.com/gin-gonic/gin"
)

// GetPagamento GET /api/utilizador/pagamento/:encomenda_id  (JWT: consumidor)
func GetPagamento(c *gin.Context) {
	encomendaID := c.Param("encomenda_id")
	userID := mw.UserID(c)

	// Verify encomenda belongs to consumer
	var cid string
	db.DB.QueryRow(`SELECT id FROM consumidores WHERE utilizador_id=?`, userID).Scan(&cid)

	type pagResp struct {
		ID          string  `json:"id"`
		EncomendaID string  `json:"encomenda_id"`
		Valor       float64 `json:"valor"`
		Metodo      string  `json:"metodo"`
		Estado      string  `json:"estado"`
		CreatedAt   string  `json:"created_at"`
	}
	var p pagResp
	err := db.DB.QueryRow(`
		SELECT pag.id, pag.encomenda_id, pag.valor, pag.metodo, pag.estado, pag.created_at
		FROM pagamentos pag
		JOIN encomendas e ON e.id=pag.encomenda_id
		WHERE pag.encomenda_id=? AND e.consumidor_id=?`, encomendaID, cid).
		Scan(&p.ID, &p.EncomendaID, &p.Valor, &p.Metodo, &p.Estado, &p.CreatedAt)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Pagamento não encontrado"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": p})
}
