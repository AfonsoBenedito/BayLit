package handlers

import (
	"encoding/json"
	"net/http"

	"baylit/db"
	"baylit/models"

	"github.com/gin-gonic/gin"
)

// ListCategorias GET /api/categoria
func ListCategorias(c *gin.Context) {
	rows, err := db.DB.Query(`SELECT id, nome, imagem, subcategorias, atributos FROM categorias`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}
	defer rows.Close()

	var cats []models.Categoria
	for rows.Next() {
		var cat models.Categoria
		var subsJSON, attrsJSON string
		if err := rows.Scan(&cat.ID, &cat.Nome, &cat.Imagem, &subsJSON, &attrsJSON); err != nil {
			continue
		}
		_ = json.Unmarshal([]byte(subsJSON), &cat.Subcategorias)
		_ = json.Unmarshal([]byte(attrsJSON), &cat.Atributos)
		if cat.Subcategorias == nil {
			cat.Subcategorias = []models.SubCategoria{}
		}
		if cat.Atributos == nil {
			cat.Atributos = []models.Atributo{}
		}
		cats = append(cats, cat)
	}
	if cats == nil {
		cats = []models.Categoria{}
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": cats})
}

// GetCategoria GET /api/categoria/:id
func GetCategoria(c *gin.Context) {
	id := c.Param("id")
	var cat models.Categoria
	var subsJSON, attrsJSON string
	err := db.DB.QueryRow(`SELECT id, nome, imagem, subcategorias, atributos FROM categorias WHERE id=?`, id).
		Scan(&cat.ID, &cat.Nome, &cat.Imagem, &subsJSON, &attrsJSON)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Categoria não encontrada"})
		return
	}
	_ = json.Unmarshal([]byte(subsJSON), &cat.Subcategorias)
	_ = json.Unmarshal([]byte(attrsJSON), &cat.Atributos)
	if cat.Subcategorias == nil {
		cat.Subcategorias = []models.SubCategoria{}
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Success", "data": cat})
}
