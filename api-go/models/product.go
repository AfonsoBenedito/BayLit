package models

import "time"

type Produto struct {
	ID          string    `json:"id"`
	Nome        string    `json:"nome"`
	Descricao   string    `json:"descricao,omitempty"`
	FornecedorID string   `json:"fornecedor_id,omitempty"`
	CategoriaID  string   `json:"categoria_id,omitempty"`
	Subcategoria string   `json:"subcategoria,omitempty"`
	Estado       string   `json:"estado"`
	CreatedAt    time.Time `json:"created_at"`
	Especificos  []ProdutoEspecifico `json:"especificos,omitempty"`
	Fornecedor   *FornecedorSimple   `json:"fornecedor,omitempty"`
	Categoria    *CategoriaSimple    `json:"categoria,omitempty"`
}

type ProdutoEspecifico struct {
	ID        string            `json:"id"`
	ProdutoID string            `json:"produto_id"`
	Preco     float64           `json:"preco"`
	Stock     int               `json:"stock"`
	Atributos map[string]string `json:"atributos"`
	Imagens   []string          `json:"imagens"`
	Estado    string            `json:"estado"`
}

type FornecedorSimple struct {
	ID   string `json:"id"`
	Nome string `json:"nome"`
}

type CategoriaSimple struct {
	ID   string `json:"id"`
	Nome string `json:"nome"`
}

type Review struct {
	ID           string    `json:"id"`
	ProdutoID    string    `json:"produto_id"`
	ConsumidorID string    `json:"consumidor_id"`
	Rating       int       `json:"rating"`
	Comentario   string    `json:"comentario,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
}
