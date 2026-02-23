package handlers

import (
	"database/sql"
	"net/http"

	"baylit/db"
	mw "baylit/middleware"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GetTransportadorPublic GET /api/utilizador/transportador  (public — accepts ?id=X)
func GetTransportadorPublic(c *gin.Context) {
	idParam := c.Query("id")
	if idParam == "" {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido"})
		return
	}
	type resp struct {
		ID              string  `json:"id"`
		Nome            string  `json:"nome"`
		Email           string  `json:"email"`
		NIF             *int64  `json:"nif,omitempty"`
		Morada          string  `json:"morada,omitempty"`
		PortesEncomenda float64 `json:"portes_encomenda"`
	}
	var r resp
	var nif sql.NullInt64
	err := db.DB.QueryRow(`
		SELECT t.id, t.nome, u.email, t.nif, COALESCE(t.morada,''), t.portes_encomenda
		FROM transportadores t JOIN utilizadores u ON u.id=t.utilizador_id
		WHERE t.utilizador_id=? OR t.id=?`, idParam, idParam).Scan(&r.ID, &r.Nome, &r.Email, &nif, &r.Morada, &r.PortesEncomenda)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Transportador não encontrado"})
		return
	}
	if nif.Valid {
		r.NIF = &nif.Int64
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": []any{r}})
}

// GetTransportador GET /api/utilizador/transportador  (JWT: transportador)
func GetTransportador(c *gin.Context) {
	userID := mw.UserID(c)
	type resp struct {
		ID              string  `json:"id"`
		Nome            string  `json:"nome"`
		Email           string  `json:"email"`
		NIF             *int64  `json:"nif,omitempty"`
		Morada          string  `json:"morada,omitempty"`
		PortesEncomenda float64 `json:"portes_encomenda"`
	}
	var r resp
	var nif sql.NullInt64
	err := db.DB.QueryRow(`
		SELECT t.id, t.nome, u.email, t.nif, COALESCE(t.morada,''), t.portes_encomenda
		FROM transportadores t JOIN utilizadores u ON u.id=t.utilizador_id
		WHERE t.utilizador_id=?`, userID).Scan(&r.ID, &r.Nome, &r.Email, &nif, &r.Morada, &r.PortesEncomenda)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Transportador não encontrado"})
		return
	}
	if nif.Valid {
		r.NIF = &nif.Int64
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": r})
}

// AddCondutor POST /api/utilizador/transportador/condutor  (JWT: transportador)
func AddCondutor(c *gin.Context) {
	userID := mw.UserID(c)
	var tid string
	if err := db.DB.QueryRow(`SELECT id FROM transportadores WHERE utilizador_id=?`, userID).Scan(&tid); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Transportador não encontrado"})
		return
	}

	var req struct {
		Nome    string `json:"nome" binding:"required"`
		Licenca string `json:"licenca"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido"})
		return
	}

	cid := uuid.NewString()
	if _, err := db.DB.Exec(`INSERT INTO condutores(id,transportador_id,nome,licenca) VALUES(?,?,?,?)`,
		cid, tid, req.Nome, req.Licenca); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"code": 201, "message": "Condutor adicionado", "data": gin.H{"id": cid}})
}

// AddMeioTransporte POST /api/utilizador/transportador/meio_transporte  (JWT: transportador)
func AddMeioTransporte(c *gin.Context) {
	userID := mw.UserID(c)
	var tid string
	if err := db.DB.QueryRow(`SELECT id FROM transportadores WHERE utilizador_id=?`, userID).Scan(&tid); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Transportador não encontrado"})
		return
	}

	var req struct {
		Tipo        string  `json:"tipo" binding:"required"`
		Capacidade  float64 `json:"capacidade"`
		EmissaoBase float64 `json:"emissao_base"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido"})
		return
	}

	mid := uuid.NewString()
	if _, err := db.DB.Exec(`INSERT INTO meios_transporte(id,transportador_id,tipo,capacidade,emissao_base) VALUES(?,?,?,?,?)`,
		mid, tid, req.Tipo, req.Capacidade, req.EmissaoBase); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"code": 201, "message": "Meio de transporte adicionado", "data": gin.H{"id": mid}})
}
