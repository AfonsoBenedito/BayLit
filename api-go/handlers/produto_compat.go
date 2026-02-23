package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"baylit/db"

	"github.com/gin-gonic/gin"
)

// ProdutoHandler handles GET /api/produto with query params:
// ?id=X, ?categoria=X, ?fornecedor=X, ?subcategoria=X
func ProdutoHandler(c *gin.Context) {
	id := c.Query("id")
	categoria := c.Query("categoria")
	fornecedor := c.Query("fornecedor")
	subcategoria := c.Query("subcategoria")

	if id != "" {
		// Single product
		p := loadProdutoFull(id)
		if p == nil {
			c.JSON(http.StatusOK, gin.H{"code": 204, "message": "No content"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": []any{p}})
		return
	}

	query := `SELECT id, nome, COALESCE(descricao,''), COALESCE(fornecedor_id,''), COALESCE(categoria_id,''), COALESCE(subcategoria,''), estado, created_at FROM produtos WHERE estado='ativo'`
	args := []any{}

	if categoria != "" {
		query += ` AND categoria_id=?`
		args = append(args, categoria)
	}
	if fornecedor != "" {
		query += ` AND fornecedor_id=?`
		args = append(args, fornecedor)
	}
	if subcategoria != "" {
		// DB stores subcategory name; React passes UUID — resolve either way
		query += ` AND subcategoria=?`
		args = append(args, resolveSubcategoriaNome(subcategoria))
	}
	query += ` ORDER BY created_at DESC LIMIT 100`

	rows, err := db.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}
	defer rows.Close()

	var products []any
	for rows.Next() {
		var pid, nome, descricao, fid, cid, sub, estado, createdAt string
		if err := rows.Scan(&pid, &nome, &descricao, &fid, &cid, &sub, &estado, &createdAt); err != nil {
			continue
		}
		p := buildProdutoMap(pid, nome, descricao, fid, cid, sub, estado, createdAt)
		products = append(products, p)
	}

	if len(products) == 0 {
		c.JSON(http.StatusOK, gin.H{"code": 204, "message": "No content"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": products})
}

// ProdutoPesquisaHandler handles GET /api/produto/pesquisa
func ProdutoPesquisaHandler(c *gin.Context) {
	nome := c.Query("nome")
	categoria := c.Query("categoria")
	subcategoria := c.Query("subcategoria")

	query := `SELECT id, nome, COALESCE(descricao,''), COALESCE(fornecedor_id,''), COALESCE(categoria_id,''), COALESCE(subcategoria,''), estado, created_at FROM produtos WHERE estado='ativo'`
	args := []any{}

	if nome != "" {
		query += ` AND (nome LIKE ? OR descricao LIKE ?)`
		s := "%" + nome + "%"
		args = append(args, s, s)
	}
	if categoria != "" {
		query += ` AND categoria_id=?`
		args = append(args, categoria)
	}
	if subcategoria != "" {
		// DB stores subcategory name; React passes UUID — resolve either way
		query += ` AND subcategoria=?`
		args = append(args, resolveSubcategoriaNome(subcategoria))
	}
	query += ` ORDER BY created_at DESC LIMIT 100`

	rows, err := db.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}
	defer rows.Close()

	var products []any
	for rows.Next() {
		var pid, pnome, descricao, fid, cid, sub, estado, createdAt string
		if err := rows.Scan(&pid, &pnome, &descricao, &fid, &cid, &sub, &estado, &createdAt); err != nil {
			continue
		}
		p := buildProdutoMap(pid, pnome, descricao, fid, cid, sub, estado, createdAt)
		products = append(products, p)
	}

	if products == nil {
		products = []any{}
	}
	// Return as a flat array — React's adicionarPrecoAoResultMultiplo iterates result directly
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": products})
}

// ProdutoEspecificoHandler handles GET /api/produto/especifico
// ?produto=ID → all especificos for product
// ?especifico=ID → single especifico
func ProdutoEspecificoHandler(c *gin.Context) {
	produtoID := c.Query("produto")
	especificoID := c.Query("especifico")

	if especificoID != "" {
		var pid, attrJSON, imgJSON, estado string
		var preco float64
		var stock int
		err := db.DB.QueryRow(`SELECT id, produto_id, preco, stock, atributos, imagens, estado FROM produto_especificos WHERE id=?`, especificoID).
			Scan(&especificoID, &pid, &preco, &stock, &attrJSON, &imgJSON, &estado)
		if err != nil {
			c.JSON(http.StatusOK, gin.H{"code": 204, "message": "No content"})
			return
		}
		var attrs, imgs any
		_ = json.Unmarshal([]byte(attrJSON), &attrs)
		_ = json.Unmarshal([]byte(imgJSON), &imgs)
		c.JSON(http.StatusOK, gin.H{
			"code": 200, "message": "Success",
			"data": gin.H{"especifico": gin.H{
				"_id": especificoID, "id": especificoID,
				"produto_id": pid, "produto": pid,
				"preco": preco, "stock": stock,
				"atributos": attrs, "imagens": imgs, "estado": estado,
				"especificidade": atributosToEspecificidade(attrs),
			}},
		})
		return
	}

	if produtoID != "" {
		rows, err := db.DB.Query(`SELECT id, produto_id, preco, stock, atributos, imagens, estado FROM produto_especificos WHERE produto_id=? AND estado='ativo'`, produtoID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
			return
		}
		defer rows.Close()
		var list []any
		for rows.Next() {
			var eid, pid, estado, attrJSON, imgJSON string
			var preco float64
			var stock int
			if err := rows.Scan(&eid, &pid, &preco, &stock, &attrJSON, &imgJSON, &estado); err != nil {
				continue
			}
			var attrs, imgs any
			_ = json.Unmarshal([]byte(attrJSON), &attrs)
			_ = json.Unmarshal([]byte(imgJSON), &imgs)
			list = append(list, gin.H{
				"_id": eid, "id": eid,
				"produto_id": pid, "produto": pid,
				"preco": preco, "stock": stock,
				"atributos": attrs, "imagens": imgs, "estado": estado,
				"especificidade": atributosToEspecificidade(attrs),
			})
		}
		if list == nil {
			list = []any{}
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": gin.H{"especificos": list}})
		return
	}

	c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido"})
}

// loadProdutoFull loads a single product with all its details
func loadProdutoFull(id string) map[string]any {
	var nome, descricao, fid, cid, sub, estado, createdAt string
	err := db.DB.QueryRow(`SELECT id, nome, COALESCE(descricao,''), COALESCE(fornecedor_id,''), COALESCE(categoria_id,''), COALESCE(subcategoria,''), estado, created_at FROM produtos WHERE id=? AND estado='ativo'`, id).
		Scan(&id, &nome, &descricao, &fid, &cid, &sub, &estado, &createdAt)
	if err != nil {
		return nil
	}
	return buildProdutoMap(id, nome, descricao, fid, cid, sub, estado, createdAt)
}

func buildProdutoMap(id, nome, descricao, fid, cid, sub, estado, createdAt string) map[string]any {
	p := map[string]any{
		"_id": id, "id": id,
		"nome": nome, "descricao": descricao,
		"informacao_adicional": descricao, // alias React's ProductPage reads
		"fornecedor_id": fid, "categoria_id": cid,
		"subcategoria": sub, "estado": estado,
		"created_at": createdAt,
	}

	// Attach fornecedor
	if fid != "" {
		var fnome string
		if err := db.DB.QueryRow(`SELECT nome FROM fornecedores WHERE id=?`, fid).Scan(&fnome); err == nil {
			p["fornecedor"] = map[string]any{"_id": fid, "id": fid, "nome": fnome}
		}
	}

	// Attach categoria
	if cid != "" {
		var cnome, subsJSON string
		if err := db.DB.QueryRow(`SELECT nome, subcategorias FROM categorias WHERE id=?`, cid).Scan(&cnome, &subsJSON); err == nil {
			p["categoria"] = map[string]any{"_id": cid, "id": cid, "nome": cnome}
			// Attach subcategoria object and set subcategoria to UUID so React's
			// getSubCategoria(produto.subcategoria) can look it up by ID
			if sub != "" {
				var subs []map[string]any
				if err := json.Unmarshal([]byte(subsJSON), &subs); err == nil {
					for _, s := range subs {
						if s["nome"] == sub {
							// Add fotografia alias expected by React
							if img, ok := s["imagem"].(string); ok {
								s["fotografia"] = img
							}
							p["subcategoriaObj"] = s
							// Overwrite subcategoria with UUID so React getSubCategoria works
							if subID, ok := s["id"].(string); ok && subID != "" {
								p["subcategoria"] = subID
							}
							break
						}
					}
				}
			}
		}
	}

	// Build cadeia summary that ShopCategory reads as produto.cadeia.rating etc.
	p["cadeia"] = buildCadeiaResumo(id)

	// Attach especificos
	esRows, err := db.DB.Query(`SELECT id, preco, stock, atributos, imagens, estado FROM produto_especificos WHERE produto_id=? AND estado='ativo'`, id)
	if err == nil {
		defer esRows.Close()
		var especificos []any
		var allImagens []any
		for esRows.Next() {
			var eid, attrJSON, imgJSON, esEstado string
			var preco float64
			var stock int
			_ = esRows.Scan(&eid, &preco, &stock, &attrJSON, &imgJSON, &esEstado)
			var attrs, imgs any
			_ = json.Unmarshal([]byte(attrJSON), &attrs)
			_ = json.Unmarshal([]byte(imgJSON), &imgs)
			especificos = append(especificos, map[string]any{
				"_id": eid, "id": eid,
				"produto_id": id, "produto": id,
				"preco": preco, "stock": stock,
				"atributos": attrs, "imagens": imgs, "estado": esEstado,
				"especificidade": atributosToEspecificidade(attrs),
			})
			// Collect images from the first especifico for the top-level fotografia field
			if len(allImagens) == 0 {
				if imgList, ok := imgs.([]any); ok {
					allImagens = append(allImagens, imgList...)
				}
			}
		}
		if especificos == nil {
			especificos = []any{}
		}
		p["especificos"] = especificos
		if len(allImagens) > 0 {
			p["fotografia"] = allImagens
		} else {
			p["fotografia"] = []any{}
		}
	}

	return p
}

// resolveSubcategoriaNome converts a subcategory UUID to its stored name.
// If the input is already a name (or not found as a UUID), it's returned as-is.
func resolveSubcategoriaNome(idOrNome string) string {
	rows, err := db.DB.Query(`SELECT subcategorias FROM categorias`)
	if err != nil {
		return idOrNome
	}
	defer rows.Close()
	for rows.Next() {
		var subsJSON string
		if err := rows.Scan(&subsJSON); err != nil {
			continue
		}
		var subs []map[string]any
		if err := json.Unmarshal([]byte(subsJSON), &subs); err != nil {
			continue
		}
		for _, sub := range subs {
			if id, ok := sub["id"].(string); ok && id == idOrNome {
				if nome, ok := sub["nome"].(string); ok {
					return nome
				}
			}
		}
	}
	return idOrNome // already a name, or unknown — pass through unchanged
}

// buildCadeiaResumo returns the cadeia summary object that ShopCategory reads as
// produto.cadeia.rating, produto.cadeia.producao.classificacao, etc.
// Ratings are on a 1–5 scale. Products with supply chain data score higher.
func buildCadeiaResumo(produtoID string) map[string]any {
	// Count supply chain entries for this product
	var nProducao, nTransporte, nArmazenamento int
	db.DB.QueryRow(`SELECT COUNT(*) FROM producoes WHERE produto_id=?`, produtoID).Scan(&nProducao)
	db.DB.QueryRow(`SELECT COUNT(*) FROM transportes WHERE produto_id=?`, produtoID).Scan(&nTransporte)
	db.DB.QueryRow(`
		SELECT COUNT(*) FROM armazenamentos a
		JOIN produto_especificos pe ON pe.id=a.produto_especifico_id
		WHERE pe.produto_id=?`, produtoID).Scan(&nArmazenamento)

	// Simple scoring: 3 baseline, +1 for each stage present, max 5
	score := func(n int) float64 {
		if n > 0 {
			return 5.0
		}
		return 3.0
	}

	producaoScore := score(nProducao)
	armazenamentoScore := score(nArmazenamento)
	transporteScore := score(nTransporte)

	// Overall rating: average of the three stages
	overall := (producaoScore + armazenamentoScore + transporteScore) / 3.0

	return map[string]any{
		"rating": overall,
		"producao": map[string]any{
			"classificacao": producaoScore,
			"recursos":      []any{}, // CadeiaLogistica iterates this — must be an array
			"poluicao":      []any{}, // CadeiaLogistica iterates this — must be an array
			"local":         nil,
			"tipo":          "",
		},
		"armazenamento": map[string]any{
			"classificacao": armazenamentoScore,
			"duracao":       0,
			"consumo":       "N/A",
		},
		"transporte_armazem": map[string]any{
			"classificacao": transporteScore,
			"distancia":     0,
			"consumo":       0.0,
			"emissao":       0.0,
			"n_itens":       1,
		},
	}
}

// atributosToEspecificidade converts {"Cor":"Verde","Tamanho":"M"} → [{atributo:"Cor",valor:"Verde"},...]
// React's ProductPage iterates especificos[i].especificidade for attribute selectors and the table.
func atributosToEspecificidade(attrs any) []any {
	m, ok := attrs.(map[string]any)
	if !ok {
		return []any{}
	}
	out := make([]any, 0, len(m))
	for k, v := range m {
		out = append(out, map[string]any{"atributo": k, "valor": v})
	}
	return out
}

// GetEspecificoStockPublic handles GET /api/utilizador/fornecedor/armazem/inventario/stock
// This is registered as a PUBLIC route so the product page works for all user types.
// React's getStockProdutoEspecifico calls this to filter variants with stock > 0.
func GetEspecificoStockPublic(c *gin.Context) {
	id := c.Query("produto_especifico")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido"})
		return
	}
	var stock int
	if err := db.DB.QueryRow(`SELECT stock FROM produto_especificos WHERE id=? AND estado='ativo'`, id).Scan(&stock); err != nil {
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": 0})
		return
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": stock})
}

// Compile-time check to avoid "declared but not used" for sql import
var _ = sql.ErrNoRows
