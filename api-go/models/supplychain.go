package models

type Recurso struct {
	Nome      string  `json:"nome"`
	Quantidade float64 `json:"quantidade"`
	Unidade   string  `json:"unidade"`
}

type Poluicao struct {
	CO2Kg       float64 `json:"co2_kg"`
	AguaLitros  float64 `json:"agua_litros"`
	ResiduosKg  float64 `json:"residuos_kg"`
}

type Producao struct {
	ID         string    `json:"id"`
	ProdutoID  string    `json:"produto_id"`
	Local      any       `json:"local"`
	Recursos   []Recurso `json:"recursos"`
	Poluicao   Poluicao  `json:"poluicao"`
	DataInicio string    `json:"data_inicio,omitempty"`
	DataFim    string    `json:"data_fim,omitempty"`
}

type Etapa struct {
	Descricao string `json:"descricao"`
	Data      string `json:"data"`
}

type Transporte struct {
	ID              string   `json:"id"`
	ProdutoID       string   `json:"produto_id,omitempty"`
	MeioTransporteID string  `json:"meio_transporte_id,omitempty"`
	CondutorID      string   `json:"condutor_id,omitempty"`
	Origem          any      `json:"origem"`
	Destino         any      `json:"destino"`
	Etapas          []Etapa  `json:"etapas"`
	EmissoesCO2     float64  `json:"emissoes_co2"`
	Estado          string   `json:"estado"`
}

type Armazem struct {
	ID          string  `json:"id"`
	FornecedorID string `json:"fornecedor_id"`
	Nome        string  `json:"nome"`
	Local       any     `json:"local"`
	Capacidade  int     `json:"capacidade"`
}

type Armazenamento struct {
	ID                  string `json:"id"`
	ProdutoEspecificoID string `json:"produto_especifico_id"`
	ArmazemID           string `json:"armazem_id"`
	Quantidade          int    `json:"quantidade"`
	DataEntrada         string `json:"data_entrada,omitempty"`
	DataSaida           string `json:"data_saida,omitempty"`
}

type MeioTransporte struct {
	ID              string  `json:"id"`
	TransportadorID string  `json:"transportador_id"`
	Tipo            string  `json:"tipo"`
	Capacidade      float64 `json:"capacidade"`
	EmissaoBase     float64 `json:"emissao_base"`
}

type Condutor struct {
	ID              string `json:"id"`
	TransportadorID string `json:"transportador_id"`
	Nome            string `json:"nome"`
	Licenca         string `json:"licenca,omitempty"`
}

type CadeiaFornecimento struct {
	Produto     *any       `json:"produto,omitempty"`
	Producoes   []Producao `json:"producoes"`
	Transportes []Transporte `json:"transportes"`
	Armazenamentos []Armazenamento `json:"armazenamentos"`
}
