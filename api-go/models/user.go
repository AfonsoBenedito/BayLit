package models

import "time"

type Utilizador struct {
	ID           string    `json:"id"`
	Tipo         string    `json:"tipo"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	NIF          *int64    `json:"nif,omitempty"`
	Telemovel    *int64    `json:"telemovel,omitempty"`
	Estado       string    `json:"estado"`
	CreatedAt    time.Time `json:"created_at"`
}

type Consumidor struct {
	ID             string `json:"id"`
	UtilizadorID   string `json:"utilizador_id"`
	Nome           string `json:"nome"`
	LocaisEntrega  []any  `json:"locais_entrega"`
	CarrinhoID     string `json:"carrinho_id,omitempty"`
	Email          string `json:"email,omitempty"`
	Estado         string `json:"estado,omitempty"`
}

type Fornecedor struct {
	ID           string `json:"id"`
	UtilizadorID string `json:"utilizador_id"`
	Nome         string `json:"nome"`
	NIF          *int64 `json:"nif,omitempty"`
	Morada       string `json:"morada,omitempty"`
	Armazens     []any  `json:"armazens"`
	Email        string `json:"email,omitempty"`
	Estado       string `json:"estado,omitempty"`
}

type Transportador struct {
	ID              string  `json:"id"`
	UtilizadorID    string  `json:"utilizador_id"`
	Nome            string  `json:"nome"`
	NIF             *int64  `json:"nif,omitempty"`
	Morada          string  `json:"morada,omitempty"`
	PortesEncomenda float64 `json:"portes_encomenda"`
	MeiosTransporte []any   `json:"meios_transporte"`
	Email           string  `json:"email,omitempty"`
	Estado          string  `json:"estado,omitempty"`
}

type Administrador struct {
	ID           string `json:"id"`
	UtilizadorID string `json:"utilizador_id"`
	Nome         string `json:"nome"`
}

type LocalEntrega struct {
	ID      string  `json:"id"`
	Morada  string  `json:"morada"`
	CP      string  `json:"cp"`
	Cidade  string  `json:"cidade"`
	Pais    string  `json:"pais"`
	Lat     float64 `json:"lat,omitempty"`
	Lng     float64 `json:"lng,omitempty"`
	Default bool    `json:"default,omitempty"`
}
