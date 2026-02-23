package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"baylit/db"
	mw "baylit/middleware"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GetFornecedorPublic GET /api/utilizador/fornecedor  (public — accepts ?id=X)
func GetFornecedorPublic(c *gin.Context) {
	idParam := c.Query("id")
	if idParam == "" {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido"})
		return
	}
	type resp struct {
		ID       string `json:"id"`
		Nome     string `json:"nome"`
		Email    string `json:"email"`
		NIF      *int64 `json:"nif,omitempty"`
		Morada   string `json:"morada,omitempty"`
		Armazens []any  `json:"armazens"`
	}
	var r resp
	var armazensJSON string
	var nif sql.NullInt64
	err := db.DB.QueryRow(`
		SELECT f.id, f.nome, u.email, f.nif, COALESCE(f.morada,''), f.armazens
		FROM fornecedores f JOIN utilizadores u ON u.id=f.utilizador_id
		WHERE f.utilizador_id=? OR f.id=?`, idParam, idParam).Scan(&r.ID, &r.Nome, &r.Email, &nif, &r.Morada, &armazensJSON)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Fornecedor não encontrado"})
		return
	}
	if nif.Valid {
		r.NIF = &nif.Int64
	}
	_ = json.Unmarshal([]byte(armazensJSON), &r.Armazens)
	if r.Armazens == nil {
		r.Armazens = []any{}
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": []any{r}})
}

// GetFornecedor GET /api/utilizador/fornecedor  (JWT: fornecedor)
func GetFornecedor(c *gin.Context) {
	userID := mw.UserID(c)
	type resp struct {
		ID       string `json:"id"`
		Nome     string `json:"nome"`
		Email    string `json:"email"`
		NIF      *int64 `json:"nif,omitempty"`
		Morada   string `json:"morada,omitempty"`
		Armazens []any  `json:"armazens"`
	}
	var r resp
	var armazensJSON string
	var nif sql.NullInt64
	err := db.DB.QueryRow(`
		SELECT f.id, f.nome, u.email, f.nif, COALESCE(f.morada,''), f.armazens
		FROM fornecedores f JOIN utilizadores u ON u.id=f.utilizador_id
		WHERE f.utilizador_id=?`, userID).Scan(&r.ID, &r.Nome, &r.Email, &nif, &r.Morada, &armazensJSON)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Fornecedor não encontrado"})
		return
	}
	if nif.Valid {
		r.NIF = &nif.Int64
	}
	_ = json.Unmarshal([]byte(armazensJSON), &r.Armazens)
	if r.Armazens == nil {
		r.Armazens = []any{}
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": r})
}

// UpdateFornecedor PUT /api/utilizador/fornecedor  (JWT: fornecedor)
func UpdateFornecedor(c *gin.Context) {
	userID := mw.UserID(c)
	var req struct {
		Nome   string `json:"nome"`
		Morada string `json:"morada"`
	}
	c.ShouldBindJSON(&req)
	if req.Nome != "" {
		db.DB.Exec(`UPDATE fornecedores SET nome=? WHERE utilizador_id=?`, req.Nome, userID)
	}
	if req.Morada != "" {
		db.DB.Exec(`UPDATE fornecedores SET morada=? WHERE utilizador_id=?`, req.Morada, userID)
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Perfil atualizado"})
}

// GetFornecedorProdutos GET /api/utilizador/fornecedor/produtos  (JWT: fornecedor)
func GetFornecedorProdutos(c *gin.Context) {
	userID := mw.UserID(c)
	var fid string
	if err := db.DB.QueryRow(`SELECT id FROM fornecedores WHERE utilizador_id=?`, userID).Scan(&fid); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Fornecedor não encontrado"})
		return
	}

	rows, err := db.DB.Query(`SELECT id, nome, descricao, categoria_id, subcategoria, estado, created_at FROM produtos WHERE fornecedor_id=?`, fid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}
	defer rows.Close()

	type prodResp struct {
		ID          string `json:"id"`
		Nome        string `json:"nome"`
		Descricao   string `json:"descricao"`
		CategoriaID string `json:"categoria_id"`
		Subcategoria string `json:"subcategoria"`
		Estado      string `json:"estado"`
		CreatedAt   string `json:"created_at"`
	}
	var prods []prodResp
	for rows.Next() {
		var p prodResp
		var descricao, catID, sub sql.NullString
		if err := rows.Scan(&p.ID, &p.Nome, &descricao, &catID, &sub, &p.Estado, &p.CreatedAt); err != nil {
			continue
		}
		p.Descricao = descricao.String
		p.CategoriaID = catID.String
		p.Subcategoria = sub.String
		prods = append(prods, p)
	}
	if prods == nil {
		prods = []prodResp{}
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": prods})
}

// GetFornecedorVendas GET /api/utilizador/fornecedor/vendas  (JWT: fornecedor)
func GetFornecedorVendas(c *gin.Context) {
	userID := mw.UserID(c)
	var fid string
	if err := db.DB.QueryRow(`SELECT id FROM fornecedores WHERE utilizador_id=?`, userID).Scan(&fid); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Fornecedor não encontrado"})
		return
	}

	rows, err := db.DB.Query(`
		SELECT v.id, v.encomenda_id, v.valor, v.created_at, e.estado, e.items
		FROM vendas v JOIN encomendas e ON e.id=v.encomenda_id
		WHERE e.fornecedor_id=? ORDER BY v.created_at DESC`, fid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}
	defer rows.Close()

	type vendaResp struct {
		ID          string  `json:"id"`
		EncomendaID string  `json:"encomenda_id"`
		Valor       float64 `json:"valor"`
		CreatedAt   string  `json:"created_at"`
		Estado      string  `json:"estado"`
		Items       []any   `json:"items"`
	}
	var vendas []vendaResp
	for rows.Next() {
		var v vendaResp
		var itemsJSON string
		if err := rows.Scan(&v.ID, &v.EncomendaID, &v.Valor, &v.CreatedAt, &v.Estado, &itemsJSON); err != nil {
			continue
		}
		_ = json.Unmarshal([]byte(itemsJSON), &v.Items)
		if v.Items == nil {
			v.Items = []any{}
		}
		vendas = append(vendas, v)
	}
	if vendas == nil {
		vendas = []vendaResp{}
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": vendas})
}

// AddArmazem POST /api/utilizador/fornecedor/armazem  (JWT: fornecedor)
func AddArmazem(c *gin.Context) {
	userID := mw.UserID(c)
	var fid string
	if err := db.DB.QueryRow(`SELECT id FROM fornecedores WHERE utilizador_id=?`, userID).Scan(&fid); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Fornecedor não encontrado"})
		return
	}

	var req struct {
		Nome       string         `json:"nome" binding:"required"`
		Local      map[string]any `json:"local"`
		Capacidade int            `json:"capacidade"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido"})
		return
	}

	aid := uuid.NewString()
	localJSON, _ := json.Marshal(req.Local)
	if _, err := db.DB.Exec(`INSERT INTO armazens(id,fornecedor_id,nome,local,capacidade) VALUES(?,?,?,?,?)`,
		aid, fid, req.Nome, string(localJSON), req.Capacidade); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"code": 201, "message": "Armazém criado", "data": gin.H{"id": aid}})
}
