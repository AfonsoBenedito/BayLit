package handlers

import (
	"net/http"

	"baylit/db"
	mw "baylit/middleware"

	"github.com/gin-gonic/gin"
)

// GetAdminAnalytics GET /api/utilizador/admin/analytics  (JWT: admin)
func GetAdminAnalytics(c *gin.Context) {
	type analytics struct {
		TotalUtilizadores    int     `json:"total_utilizadores"`
		TotalConsumidores    int     `json:"total_consumidores"`
		TotalFornecedores    int     `json:"total_fornecedores"`
		TotalTransportadores int     `json:"total_transportadores"`
		TotalProdutos        int     `json:"total_produtos"`
		TotalEncomendas      int     `json:"total_encomendas"`
		TotalVendas          int     `json:"total_vendas"`
		ReceitaTotal         float64 `json:"receita_total"`
		EncomendsPendentes   int     `json:"encomendas_pendentes"`
		EncomendasConfirmadas int    `json:"encomendas_confirmadas"`
	}

	var a analytics
	db.DB.QueryRow(`SELECT COUNT(*) FROM utilizadores`).Scan(&a.TotalUtilizadores)
	db.DB.QueryRow(`SELECT COUNT(*) FROM consumidores`).Scan(&a.TotalConsumidores)
	db.DB.QueryRow(`SELECT COUNT(*) FROM fornecedores`).Scan(&a.TotalFornecedores)
	db.DB.QueryRow(`SELECT COUNT(*) FROM transportadores`).Scan(&a.TotalTransportadores)
	db.DB.QueryRow(`SELECT COUNT(*) FROM produtos WHERE estado='ativo'`).Scan(&a.TotalProdutos)
	db.DB.QueryRow(`SELECT COUNT(*) FROM encomendas`).Scan(&a.TotalEncomendas)
	db.DB.QueryRow(`SELECT COUNT(*) FROM vendas`).Scan(&a.TotalVendas)
	db.DB.QueryRow(`SELECT COALESCE(SUM(valor),0) FROM vendas`).Scan(&a.ReceitaTotal)
	db.DB.QueryRow(`SELECT COUNT(*) FROM encomendas WHERE estado='pendente'`).Scan(&a.EncomendsPendentes)
	db.DB.QueryRow(`SELECT COUNT(*) FROM encomendas WHERE estado='confirmado'`).Scan(&a.EncomendasConfirmadas)

	// Top products by order count
	type topProd struct {
		ProdutoID   string `json:"produto_id"`
		Nome        string `json:"nome"`
		TotalVendido int   `json:"total_vendido"`
	}
	// SQLite JSON query: count items in encomendas  (simplified approach)
	rows, _ := db.DB.Query(`
		SELECT p.id, p.nome, COUNT(e.id) as cnt
		FROM produtos p
		LEFT JOIN encomendas e ON e.fornecedor_id = p.fornecedor_id
		WHERE p.estado='ativo'
		GROUP BY p.id, p.nome
		ORDER BY cnt DESC
		LIMIT 5`)
	var topProducts []topProd
	if rows != nil {
		defer rows.Close()
		for rows.Next() {
			var tp topProd
			rows.Scan(&tp.ProdutoID, &tp.Nome, &tp.TotalVendido)
			topProducts = append(topProducts, tp)
		}
	}
	if topProducts == nil {
		topProducts = []topProd{}
	}

	c.JSON(http.StatusOK, gin.H{
		"code": 200, "message": "Success",
		"data": gin.H{
			"overview":     a,
			"top_produtos": topProducts,
		},
	})
}

// GetFornecedorAnalytics GET /api/utilizador/fornecedor/analytics  (JWT: fornecedor)
func GetFornecedorAnalytics(c *gin.Context) {
	userID := mw.UserID(c)
	var fid string
	if err := db.DB.QueryRow(`SELECT id FROM fornecedores WHERE utilizador_id=?`, userID).Scan(&fid); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Fornecedor não encontrado"})
		return
	}

	type analytics struct {
		TotalProdutos        int     `json:"total_produtos"`
		TotalEncomendas      int     `json:"total_encomendas"`
		TotalVendas          int     `json:"total_vendas"`
		ReceitaTotal         float64 `json:"receita_total"`
		EncomendsPendentes   int     `json:"encomendas_pendentes"`
		EncomendasEntregues  int     `json:"encomendas_entregues"`
	}
	var a analytics

	db.DB.QueryRow(`SELECT COUNT(*) FROM produtos WHERE fornecedor_id=? AND estado='ativo'`, fid).Scan(&a.TotalProdutos)
	db.DB.QueryRow(`SELECT COUNT(*) FROM encomendas WHERE fornecedor_id=?`, fid).Scan(&a.TotalEncomendas)
	db.DB.QueryRow(`SELECT COUNT(*) FROM vendas v JOIN encomendas e ON e.id=v.encomenda_id WHERE e.fornecedor_id=?`, fid).Scan(&a.TotalVendas)
	db.DB.QueryRow(`SELECT COALESCE(SUM(v.valor),0) FROM vendas v JOIN encomendas e ON e.id=v.encomenda_id WHERE e.fornecedor_id=?`, fid).Scan(&a.ReceitaTotal)
	db.DB.QueryRow(`SELECT COUNT(*) FROM encomendas WHERE fornecedor_id=? AND estado='pendente'`, fid).Scan(&a.EncomendsPendentes)
	db.DB.QueryRow(`SELECT COUNT(*) FROM encomendas WHERE fornecedor_id=? AND estado='entregue'`, fid).Scan(&a.EncomendasEntregues)

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": a})
}
