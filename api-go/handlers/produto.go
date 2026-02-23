package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"baylit/db"
	mw "baylit/middleware"
	"baylit/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// scanProduto scans a product row and loads its specifics.
func scanProduto(row *sql.Row) (*models.Produto, error) {
	var p models.Produto
	var descricao, fornecedorID, categoriaID, subcategoria sql.NullString
	err := row.Scan(&p.ID, &p.Nome, &descricao, &fornecedorID, &categoriaID, &subcategoria, &p.Estado, &p.CreatedAt)
	if err != nil {
		return nil, err
	}
	p.Descricao = descricao.String
	p.FornecedorID = fornecedorID.String
	p.CategoriaID = categoriaID.String
	p.Subcategoria = subcategoria.String
	return &p, nil
}

func loadEspecificos(produtoID string) []models.ProdutoEspecifico {
	rows, err := db.DB.Query(`SELECT id, produto_id, preco, stock, atributos, imagens, estado FROM produto_especificos WHERE produto_id=? AND estado='ativo'`, produtoID)
	if err != nil {
		return nil
	}
	defer rows.Close()
	var list []models.ProdutoEspecifico
	for rows.Next() {
		var pe models.ProdutoEspecifico
		var attrJSON, imgJSON string
		if err := rows.Scan(&pe.ID, &pe.ProdutoID, &pe.Preco, &pe.Stock, &attrJSON, &imgJSON, &pe.Estado); err != nil {
			continue
		}
		_ = json.Unmarshal([]byte(attrJSON), &pe.Atributos)
		_ = json.Unmarshal([]byte(imgJSON), &pe.Imagens)
		if pe.Atributos == nil {
			pe.Atributos = map[string]string{}
		}
		if pe.Imagens == nil {
			pe.Imagens = []string{}
		}
		list = append(list, pe)
	}
	return list
}

func attachFornecedor(p *models.Produto) {
	if p.FornecedorID == "" {
		return
	}
	var f models.FornecedorSimple
	if err := db.DB.QueryRow(`SELECT id, nome FROM fornecedores WHERE id=?`, p.FornecedorID).Scan(&f.ID, &f.Nome); err == nil {
		p.Fornecedor = &f
	}
}

func attachCategoria(p *models.Produto) {
	if p.CategoriaID == "" {
		return
	}
	var cat models.CategoriaSimple
	if err := db.DB.QueryRow(`SELECT id, nome FROM categorias WHERE id=?`, p.CategoriaID).Scan(&cat.ID, &cat.Nome); err == nil {
		p.Categoria = &cat
	}
}

// ListProdutos GET /api/produto
func ListProdutos(c *gin.Context) {
	query := `SELECT id, nome, descricao, fornecedor_id, categoria_id, subcategoria, estado, created_at FROM produtos WHERE estado='ativo'`
	args := []any{}

	if search := c.Query("q"); search != "" {
		query += ` AND (nome LIKE ? OR descricao LIKE ?)`
		s := "%" + search + "%"
		args = append(args, s, s)
	}
	if cat := c.Query("categoria"); cat != "" {
		query += ` AND categoria_id=?`
		args = append(args, cat)
	}
	if sub := c.Query("subcategoria"); sub != "" {
		query += ` AND subcategoria=?`
		args = append(args, sub)
	}

	limitStr := c.DefaultQuery("limit", "50")
	offsetStr := c.DefaultQuery("offset", "0")
	limit, _ := strconv.Atoi(limitStr)
	offset, _ := strconv.Atoi(offsetStr)
	if limit <= 0 || limit > 100 {
		limit = 50
	}
	query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`
	args = append(args, limit, offset)

	rows, err := db.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}
	defer rows.Close()

	var products []models.Produto
	for rows.Next() {
		var p models.Produto
		var descricao, fornecedorID, categoriaID, subcategoria sql.NullString
		if err := rows.Scan(&p.ID, &p.Nome, &descricao, &fornecedorID, &categoriaID, &subcategoria, &p.Estado, &p.CreatedAt); err != nil {
			continue
		}
		p.Descricao = descricao.String
		p.FornecedorID = fornecedorID.String
		p.CategoriaID = categoriaID.String
		p.Subcategoria = subcategoria.String
		p.Especificos = loadEspecificos(p.ID)
		attachFornecedor(&p)
		attachCategoria(&p)
		products = append(products, p)
	}
	if products == nil {
		products = []models.Produto{}
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": products})
}

// GetProduto GET /api/produto/:id
func GetProduto(c *gin.Context) {
	id := c.Param("id")
	var p models.Produto
	var descricao, fornecedorID, categoriaID, subcategoria sql.NullString
	err := db.DB.QueryRow(`SELECT id, nome, descricao, fornecedor_id, categoria_id, subcategoria, estado, created_at FROM produtos WHERE id=? AND estado='ativo'`, id).
		Scan(&p.ID, &p.Nome, &descricao, &fornecedorID, &categoriaID, &subcategoria, &p.Estado, &p.CreatedAt)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Produto não encontrado"})
		return
	}
	p.Descricao = descricao.String
	p.FornecedorID = fornecedorID.String
	p.CategoriaID = categoriaID.String
	p.Subcategoria = subcategoria.String
	p.Especificos = loadEspecificos(p.ID)
	attachFornecedor(&p)
	attachCategoria(&p)

	// Load reviews
	type reviewResp struct {
		ID           string `json:"id"`
		ConsumidorID string `json:"consumidor_id"`
		Rating       int    `json:"rating"`
		Comentario   string `json:"comentario"`
		CreatedAt    string `json:"created_at"`
	}
	rRows, _ := db.DB.Query(`SELECT id, consumidor_id, rating, COALESCE(comentario,''), created_at FROM reviews WHERE produto_id=?`, id)
	var reviews []reviewResp
	if rRows != nil {
		defer rRows.Close()
		for rRows.Next() {
			var r reviewResp
			_ = rRows.Scan(&r.ID, &r.ConsumidorID, &r.Rating, &r.Comentario, &r.CreatedAt)
			reviews = append(reviews, r)
		}
	}
	if reviews == nil {
		reviews = []reviewResp{}
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": gin.H{"produto": p, "reviews": reviews}})
}

// ListProdutosByCategoria GET /api/produto/categoria/:id
func ListProdutosByCategoria(c *gin.Context) {
	catID := c.Param("id")
	rows, err := db.DB.Query(`SELECT id, nome, descricao, fornecedor_id, categoria_id, subcategoria, estado, created_at FROM produtos WHERE categoria_id=? AND estado='ativo' ORDER BY created_at DESC`, catID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}
	defer rows.Close()

	var products []models.Produto
	for rows.Next() {
		var p models.Produto
		var descricao, fornecedorID, categoriaID, subcategoria sql.NullString
		if err := rows.Scan(&p.ID, &p.Nome, &descricao, &fornecedorID, &categoriaID, &subcategoria, &p.Estado, &p.CreatedAt); err != nil {
			continue
		}
		p.Descricao = descricao.String
		p.FornecedorID = fornecedorID.String
		p.CategoriaID = categoriaID.String
		p.Subcategoria = subcategoria.String
		p.Especificos = loadEspecificos(p.ID)
		attachFornecedor(&p)
		products = append(products, p)
	}
	if products == nil {
		products = []models.Produto{}
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": products})
}

// CreateProduto POST /api/utilizador/fornecedor/produto  (JWT: fornecedor)
func CreateProduto(c *gin.Context) {
	userID := mw.UserID(c)
	var fid string
	if err := db.DB.QueryRow(`SELECT id FROM fornecedores WHERE utilizador_id=?`, userID).Scan(&fid); err != nil {
		c.JSON(http.StatusForbidden, gin.H{"code": 403, "message": "Não é fornecedor"})
		return
	}

	var req struct {
		Nome        string `json:"nome" binding:"required"`
		Descricao   string `json:"descricao"`
		CategoriaID string `json:"categoria_id"`
		Subcategoria string `json:"subcategoria"`
		Preco       float64 `json:"preco"`
		Stock       int     `json:"stock"`
		Atributos   map[string]string `json:"atributos"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido"})
		return
	}

	pid := uuid.NewString()
	psid := uuid.NewString()

	tx, _ := db.DB.Begin()
	defer tx.Rollback()

	if _, err := tx.Exec(`INSERT INTO produtos(id,nome,descricao,fornecedor_id,categoria_id,subcategoria,estado) VALUES(?,?,?,?,?,?,?)`,
		pid, req.Nome, req.Descricao, fid, req.CategoriaID, req.Subcategoria, "ativo"); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}

	attrJSON, _ := json.Marshal(req.Atributos)
	if _, err := tx.Exec(`INSERT INTO produto_especificos(id,produto_id,preco,stock,atributos,imagens,estado) VALUES(?,?,?,?,?,?,?)`,
		psid, pid, req.Preco, req.Stock, string(attrJSON), "[]", "ativo"); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}

	tx.Commit()
	c.JSON(http.StatusCreated, gin.H{"code": 201, "message": "Produto criado", "data": gin.H{"id": pid}})
}

// UpdateProduto PUT /api/utilizador/fornecedor/produto/:id  (JWT: fornecedor)
func UpdateProduto(c *gin.Context) {
	userID := mw.UserID(c)
	pid := c.Param("id")

	var fid string
	if err := db.DB.QueryRow(`SELECT id FROM fornecedores WHERE utilizador_id=?`, userID).Scan(&fid); err != nil {
		c.JSON(http.StatusForbidden, gin.H{"code": 403, "message": "Não é fornecedor"})
		return
	}

	// Verify product belongs to this fornecedor
	var check string
	if err := db.DB.QueryRow(`SELECT id FROM produtos WHERE id=? AND fornecedor_id=?`, pid, fid).Scan(&check); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Produto não encontrado"})
		return
	}

	var req struct {
		Nome        string `json:"nome"`
		Descricao   string `json:"descricao"`
		Subcategoria string `json:"subcategoria"`
		Estado      string `json:"estado"`
	}
	c.ShouldBindJSON(&req)

	if req.Nome != "" {
		db.DB.Exec(`UPDATE produtos SET nome=? WHERE id=?`, req.Nome, pid)
	}
	if req.Descricao != "" {
		db.DB.Exec(`UPDATE produtos SET descricao=? WHERE id=?`, req.Descricao, pid)
	}
	if req.Estado != "" {
		db.DB.Exec(`UPDATE produtos SET estado=? WHERE id=?`, req.Estado, pid)
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Produto atualizado"})
}

// AddReview POST /api/produto/:id/review  (JWT: consumidor)
func AddReview(c *gin.Context) {
	pid := c.Param("id")
	userID := mw.UserID(c)

	var cid string
	if err := db.DB.QueryRow(`SELECT id FROM consumidores WHERE utilizador_id=?`, userID).Scan(&cid); err != nil {
		c.JSON(http.StatusForbidden, gin.H{"code": 403, "message": "Não é consumidor"})
		return
	}

	var req struct {
		Rating     int    `json:"rating" binding:"required,min=1,max=5"`
		Comentario string `json:"comentario"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido"})
		return
	}

	rid := uuid.NewString()
	if _, err := db.DB.Exec(`INSERT INTO reviews(id,produto_id,consumidor_id,rating,comentario) VALUES(?,?,?,?,?)`,
		rid, pid, cid, req.Rating, req.Comentario); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"code": 201, "message": "Review adicionada"})
}
