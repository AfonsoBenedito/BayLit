package handlers

import (
	"encoding/json"
	"net/http"

	"baylit/db"

	"github.com/gin-gonic/gin"
)

// ProdutoCategoriaHandler handles GET /api/produto/categoria
// ?categoria=ID → single category
// (no param)   → all categories
func ProdutoCategoriaHandler(c *gin.Context) {
	catID := c.Query("categoria")
	if catID != "" {
		// Return single category
		var id, nome, imagem, subsJSON, attrsJSON string
		err := db.DB.QueryRow(`SELECT id, nome, COALESCE(imagem,''), subcategorias, atributos FROM categorias WHERE id=?`, catID).
			Scan(&id, &nome, &imagem, &subsJSON, &attrsJSON)
		if err != nil {
			c.JSON(http.StatusOK, gin.H{"code": 404, "message": "Categoria não encontrada"})
			return
		}
		var subs, attrs any
		_ = json.Unmarshal([]byte(subsJSON), &subs)
		_ = json.Unmarshal([]byte(attrsJSON), &attrs)
		c.JSON(http.StatusOK, gin.H{
			"code": 200, "message": "Success",
			"data": gin.H{"categoria": gin.H{
				"_id": id, "id": id, "nome": nome, "imagem": imagem, "fotografia": imagem,
				"subcategorias": addFotografiaToSubs(subs), "atributos": attrs,
			}},
		})
		return
	}

	// Return all categories
	rows, err := db.DB.Query(`SELECT id, nome, COALESCE(imagem,''), subcategorias FROM categorias`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}
	defer rows.Close()

	var cats []any
	for rows.Next() {
		var id, nome, imagem, subsJSON string
		if err := rows.Scan(&id, &nome, &imagem, &subsJSON); err != nil {
			continue
		}
		var subs any
		_ = json.Unmarshal([]byte(subsJSON), &subs)
		cats = append(cats, gin.H{
			"_id": id, "id": id, "nome": nome, "imagem": imagem, "fotografia": imagem,
			"subcategorias": addFotografiaToSubs(subs),
		})
	}
	if cats == nil {
		cats = []any{}
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": gin.H{"categorias": cats}})
}

// ProdutoCategoriaSubcategoriaHandler handles GET /api/produto/categoria/subcategoria
// ?categoria=ID   → all subcategories for that category
// ?subcategoria=ID → single subcategory
func ProdutoCategoriaSubcategoriaHandler(c *gin.Context) {
	catID := c.Query("categoria")
	subID := c.Query("subcategoria")

	if catID != "" {
		// All subcategories for this category
		var subsJSON string
		err := db.DB.QueryRow(`SELECT subcategorias FROM categorias WHERE id=?`, catID).Scan(&subsJSON)
		if err != nil {
			c.JSON(http.StatusOK, gin.H{"code": 404, "message": "Categoria não encontrada"})
			return
		}
		var subs []any
		_ = json.Unmarshal([]byte(subsJSON), &subs)
		if subs == nil {
			subs = []any{}
		}
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": gin.H{"subcategorias": addFotografiaToSubs(subs)}})
		return
	}

	if subID != "" {
		// Find subcategory by ID across all categories
		rows, err := db.DB.Query(`SELECT subcategorias FROM categorias`)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
			return
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
				if id, ok := sub["id"].(string); ok && id == subID {
					if img, ok := sub["imagem"].(string); ok {
						sub["fotografia"] = img
					}
					sub["_id"] = id
					// Convert atributos: [{nome,valores},...] → ["nome",...]
					if attrs, ok := sub["atributos"].([]any); ok {
						names := make([]any, 0, len(attrs))
						for _, a := range attrs {
							if am, ok := a.(map[string]any); ok {
								if nome, ok := am["nome"].(string); ok {
									names = append(names, nome)
								}
							}
						}
						sub["atributos"] = names
					}
					c.JSON(http.StatusOK, gin.H{
						"code": 200, "message": "Success",
						"data": gin.H{"subcategoria": sub},
					})
					return
				}
			}
		}
		c.JSON(http.StatusOK, gin.H{"code": 404, "message": "Subcategoria não encontrada"})
		return
	}

	c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido"})
}

// ProdutoCategoriaAtributoHandler handles GET /api/produto/categoria/subcategoria/atributo
// ?atributo=NOME — the attribute name is used as its ID (e.g. "Cor", "Tamanho")
func ProdutoCategoriaAtributoHandler(c *gin.Context) {
	attrNome := c.Query("atributo")
	if attrNome == "" {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido"})
		return
	}

	// Scan all subcategorias for an atributo whose nome matches the query param
	rows, err := db.DB.Query(`SELECT subcategorias FROM categorias`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
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
			if attrs, ok := sub["atributos"].([]any); ok {
				for _, attr := range attrs {
					if attrMap, ok := attr.(map[string]any); ok {
						if nome, ok := attrMap["nome"].(string); ok && nome == attrNome {
							// Use the name as _id/id so React can round-trip lookups
							attrMap["_id"] = nome
							attrMap["id"] = nome
							c.JSON(http.StatusOK, gin.H{
								"code": 200, "message": "Success",
								"data": gin.H{"atributo": attrMap},
							})
							return
						}
					}
				}
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{"code": 404, "message": "Atributo não encontrado"})
}

// ProdutoCategoriaRecursos handles GET /api/produto/producao/recursos
func ProdutoCategoriaRecursos(c *gin.Context) {
	recursos := []gin.H{
		{"_id": "r1", "nome": "Energia Solar", "unidade": "kWh", "tipo": "energia"},
		{"_id": "r2", "nome": "Energia Eólica", "unidade": "kWh", "tipo": "energia"},
		{"_id": "r3", "nome": "Água", "unidade": "litros", "tipo": "agua"},
		{"_id": "r4", "nome": "Algodão Orgânico", "unidade": "kg", "tipo": "material"},
		{"_id": "r5", "nome": "Alumínio Reciclado", "unidade": "kg", "tipo": "material"},
		{"_id": "r6", "nome": "Plástico Reciclado", "unidade": "kg", "tipo": "material"},
		{"_id": "r7", "nome": "Madeira Certificada", "unidade": "kg", "tipo": "material"},
		{"_id": "r8", "nome": "Cânhamo", "unidade": "kg", "tipo": "material"},
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": recursos})
}

// ProdutoCategoriaPoluicao handles GET /api/produto/producao/poluicao
func ProdutoCategoriaPoluicao(c *gin.Context) {
	tipos := []gin.H{
		{"_id": "p1", "nome": "CO2", "unidade": "kg", "descricao": "Emissões de dióxido de carbono"},
		{"_id": "p2", "nome": "CH4", "unidade": "kg", "descricao": "Emissões de metano"},
		{"_id": "p3", "nome": "Resíduos Sólidos", "unidade": "kg", "descricao": "Resíduos sólidos produzidos"},
		{"_id": "p4", "nome": "Água Residual", "unidade": "litros", "descricao": "Água residual gerada"},
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": tipos})
}

// addFotografiaToSubs normalises each subcategory map for the React frontend:
//   - adds "fotografia" alias from "imagem"
//   - adds "_id" alias from "id"  (CategoryBlock uses ._id for navigation URLs)
//   - converts "atributos" from [{nome,valores},...] to ["nome",...] (ID strings)
//     so React's getAtributo("nome") can look each one up individually
func addFotografiaToSubs(subs any) any {
	list, ok := subs.([]any)
	if !ok {
		return subs
	}
	out := make([]any, len(list))
	for i, item := range list {
		m, ok := item.(map[string]any)
		if !ok {
			out[i] = item
			continue
		}
		// shallow copy so we don't mutate the original
		cp := make(map[string]any, len(m)+2)
		for k, v := range m {
			cp[k] = v
		}
		if img, ok := cp["imagem"].(string); ok {
			cp["fotografia"] = img
		}
		if id, ok := cp["id"].(string); ok {
			cp["_id"] = id
		}
		// Convert atributos: [{nome,valores},...] → ["nome",...] so that
		// React's getAtributo("Cor") can fetch each attribute individually.
		if attrs, ok := cp["atributos"].([]any); ok {
			names := make([]any, 0, len(attrs))
			for _, a := range attrs {
				if am, ok := a.(map[string]any); ok {
					if nome, ok := am["nome"].(string); ok {
						names = append(names, nome)
					}
				}
			}
			cp["atributos"] = names
		}
		out[i] = cp
	}
	return out
}
