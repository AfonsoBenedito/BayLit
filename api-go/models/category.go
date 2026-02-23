package models

type Atributo struct {
	Nome   string   `json:"nome"`
	Valores []string `json:"valores"`
}

type SubCategoria struct {
	ID        string     `json:"id"`
	Nome      string     `json:"nome"`
	Imagem    string     `json:"imagem,omitempty"`
	Atributos []Atributo `json:"atributos"`
}

type Categoria struct {
	ID            string         `json:"id"`
	Nome          string         `json:"nome"`
	Imagem        string         `json:"imagem,omitempty"`
	Subcategorias []SubCategoria `json:"subcategorias"`
	Atributos     []Atributo     `json:"atributos"`
}
