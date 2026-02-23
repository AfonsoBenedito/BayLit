package models

import "time"

type CartItem struct {
	ID                 string            `json:"id"`
	ProdutoEspecificoID string           `json:"produto_especifico_id"`
	ProdutoID          string            `json:"produto_id,omitempty"`
	Nome               string            `json:"nome,omitempty"`
	Preco              float64           `json:"preco"`
	Quantidade         int               `json:"quantidade"`
	Atributos          map[string]string `json:"atributos,omitempty"`
	Imagem             string            `json:"imagem,omitempty"`
}

type Carrinho struct {
	ID           string     `json:"id"`
	ConsumidorID string     `json:"consumidor_id,omitempty"`
	Items        []CartItem `json:"items"`
}

type OrderItem struct {
	ProdutoEspecificoID string            `json:"produto_especifico_id"`
	ProdutoID           string            `json:"produto_id,omitempty"`
	Nome                string            `json:"nome,omitempty"`
	Preco               float64           `json:"preco"`
	Quantidade          int               `json:"quantidade"`
	Atributos           map[string]string `json:"atributos,omitempty"`
}

type Encomenda struct {
	ID           string      `json:"id"`
	ConsumidorID string      `json:"consumidor_id"`
	FornecedorID string      `json:"fornecedor_id,omitempty"`
	Items        []OrderItem `json:"items"`
	LocalEntrega any         `json:"local_entrega"`
	Estado       string      `json:"estado"`
	Total        float64     `json:"total"`
	CreatedAt    time.Time   `json:"created_at"`
}

type Venda struct {
	ID          string    `json:"id"`
	EncomendaID string    `json:"encomenda_id"`
	Valor       float64   `json:"valor"`
	CreatedAt   time.Time `json:"created_at"`
}

type Pagamento struct {
	ID                  string    `json:"id"`
	EncomendaID         string    `json:"encomenda_id"`
	Valor               float64   `json:"valor"`
	Metodo              string    `json:"metodo"`
	Estado              string    `json:"estado"`
	StripePaymentIntent string    `json:"stripe_payment_intent,omitempty"`
	CreatedAt           time.Time `json:"created_at"`
}

type Desconto struct {
	ID          string  `json:"id"`
	Codigo      string  `json:"codigo"`
	Percentagem float64 `json:"percentagem"`
	DataFim     string  `json:"data_fim,omitempty"`
	Ativo       bool    `json:"ativo"`
}
