package handlers

import (
	"net/http"

	"baylit/db"

	"github.com/gin-gonic/gin"
)

// ListConsumidores GET /api/utilizador/admin/consumidores  (JWT: admin)
func ListConsumidores(c *gin.Context) {
	rows, err := db.DB.Query(`
		SELECT c.id, c.nome, u.email, u.estado, u.created_at
		FROM consumidores c JOIN utilizadores u ON u.id=c.utilizador_id
		ORDER BY u.created_at DESC`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}
	defer rows.Close()

	type item struct {
		ID        string `json:"id"`
		Nome      string `json:"nome"`
		Email     string `json:"email"`
		Estado    string `json:"estado"`
		CreatedAt string `json:"created_at"`
	}
	var list []item
	for rows.Next() {
		var r item
		if err := rows.Scan(&r.ID, &r.Nome, &r.Email, &r.Estado, &r.CreatedAt); err != nil {
			continue
		}
		list = append(list, r)
	}
	if list == nil {
		list = []item{}
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": list})
}

// ListFornecedoresAdmin GET /api/utilizador/admin/fornecedores  (JWT: admin)
func ListFornecedoresAdmin(c *gin.Context) {
	rows, err := db.DB.Query(`
		SELECT f.id, f.nome, u.email, u.estado, u.created_at
		FROM fornecedores f JOIN utilizadores u ON u.id=f.utilizador_id
		ORDER BY u.created_at DESC`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}
	defer rows.Close()

	type item struct {
		ID        string `json:"id"`
		Nome      string `json:"nome"`
		Email     string `json:"email"`
		Estado    string `json:"estado"`
		CreatedAt string `json:"created_at"`
	}
	var list []item
	for rows.Next() {
		var r item
		if err := rows.Scan(&r.ID, &r.Nome, &r.Email, &r.Estado, &r.CreatedAt); err != nil {
			continue
		}
		list = append(list, r)
	}
	if list == nil {
		list = []item{}
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": list})
}

// ListTransportadoresAdmin GET /api/utilizador/admin/transportadores  (JWT: admin)
func ListTransportadoresAdmin(c *gin.Context) {
	rows, err := db.DB.Query(`
		SELECT t.id, t.nome, u.email, u.estado, u.created_at
		FROM transportadores t JOIN utilizadores u ON u.id=t.utilizador_id
		ORDER BY u.created_at DESC`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}
	defer rows.Close()

	type item struct {
		ID        string `json:"id"`
		Nome      string `json:"nome"`
		Email     string `json:"email"`
		Estado    string `json:"estado"`
		CreatedAt string `json:"created_at"`
	}
	var list []item
	for rows.Next() {
		var r item
		if err := rows.Scan(&r.ID, &r.Nome, &r.Email, &r.Estado, &r.CreatedAt); err != nil {
			continue
		}
		list = append(list, r)
	}
	if list == nil {
		list = []item{}
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": list})
}

// UpdateUtilizadorEstado PUT /api/utilizador/admin/utilizador/:id/estado  (JWT: admin)
func UpdateUtilizadorEstado(c *gin.Context) {
	uid := c.Param("id")
	var req struct {
		Estado string `json:"estado" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido"})
		return
	}

	if _, err := db.DB.Exec(`UPDATE utilizadores SET estado=? WHERE id=?`, req.Estado, uid); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Estado atualizado"})
}

// GetSustentabilidade GET /api/utilizador/admin/sustentabilidade  (JWT: admin)
func GetSustentabilidade(c *gin.Context) {
	type stats struct {
		TotalProducoes    int     `json:"total_producoes"`
		TotalTransportes  int     `json:"total_transportes"`
		TotalEmissoesCO2  float64 `json:"total_emissoes_co2_kg"`
		MediaEmissoesCO2  float64 `json:"media_emissoes_co2_por_transporte"`
		TransportesEco    int     `json:"transportes_emissoes_zero"`
	}
	var s stats

	db.DB.QueryRow(`SELECT COUNT(*) FROM producoes`).Scan(&s.TotalProducoes)
	db.DB.QueryRow(`SELECT COUNT(*) FROM transportes`).Scan(&s.TotalTransportes)
	db.DB.QueryRow(`SELECT COALESCE(SUM(emissoes_co2),0) FROM transportes`).Scan(&s.TotalEmissoesCO2)
	if s.TotalTransportes > 0 {
		s.MediaEmissoesCO2 = s.TotalEmissoesCO2 / float64(s.TotalTransportes)
	}
	db.DB.QueryRow(`SELECT COUNT(*) FROM transportes WHERE emissoes_co2=0`).Scan(&s.TransportesEco)

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": s})
}
