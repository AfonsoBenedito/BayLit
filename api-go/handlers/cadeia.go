package handlers

import (
	"encoding/json"
	"net/http"

	"baylit/db"
	mw "baylit/middleware"
	"baylit/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GetCadeia GET /api/produto/:id/cadeia
func GetCadeia(c *gin.Context) {
	produtoID := c.Param("id")

	// Producoes
	pRows, err := db.DB.Query(`SELECT id, produto_id, local, recursos, poluicao, COALESCE(data_inicio,''), COALESCE(data_fim,'') FROM producoes WHERE produto_id=?`, produtoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}
	defer pRows.Close()

	var producoes []models.Producao
	for pRows.Next() {
		var p models.Producao
		var localJSON, recursosJSON, poluicaoJSON string
		if err := pRows.Scan(&p.ID, &p.ProdutoID, &localJSON, &recursosJSON, &poluicaoJSON, &p.DataInicio, &p.DataFim); err != nil {
			continue
		}
		_ = json.Unmarshal([]byte(localJSON), &p.Local)
		_ = json.Unmarshal([]byte(recursosJSON), &p.Recursos)
		_ = json.Unmarshal([]byte(poluicaoJSON), &p.Poluicao)
		if p.Recursos == nil {
			p.Recursos = []models.Recurso{}
		}
		producoes = append(producoes, p)
	}
	if producoes == nil {
		producoes = []models.Producao{}
	}

	// Transportes
	tRows, err := db.DB.Query(`SELECT id, produto_id, COALESCE(meio_transporte_id,''), COALESCE(condutor_id,''), origem, destino, etapas, emissoes_co2, estado FROM transportes WHERE produto_id=?`, produtoID)
	var transportes []models.Transporte
	if err == nil {
		defer tRows.Close()
		for tRows.Next() {
			var t models.Transporte
			var origemJSON, destinoJSON, etapasJSON string
			if err := tRows.Scan(&t.ID, &t.ProdutoID, &t.MeioTransporteID, &t.CondutorID, &origemJSON, &destinoJSON, &etapasJSON, &t.EmissoesCO2, &t.Estado); err != nil {
				continue
			}
			_ = json.Unmarshal([]byte(origemJSON), &t.Origem)
			_ = json.Unmarshal([]byte(destinoJSON), &t.Destino)
			_ = json.Unmarshal([]byte(etapasJSON), &t.Etapas)
			if t.Etapas == nil {
				t.Etapas = []models.Etapa{}
			}
			transportes = append(transportes, t)
		}
	}
	if transportes == nil {
		transportes = []models.Transporte{}
	}

	// Armazenamentos (via produto_especificos)
	aRows, err := db.DB.Query(`
		SELECT a.id, a.produto_especifico_id, a.armazem_id, a.quantidade,
		       COALESCE(a.data_entrada,''), COALESCE(a.data_saida,'')
		FROM armazenamentos a
		JOIN produto_especificos pe ON pe.id=a.produto_especifico_id
		WHERE pe.produto_id=?`, produtoID)
	var armazenamentos []models.Armazenamento
	if err == nil {
		defer aRows.Close()
		for aRows.Next() {
			var a models.Armazenamento
			if err := aRows.Scan(&a.ID, &a.ProdutoEspecificoID, &a.ArmazemID, &a.Quantidade, &a.DataEntrada, &a.DataSaida); err != nil {
				continue
			}
			armazenamentos = append(armazenamentos, a)
		}
	}
	if armazenamentos == nil {
		armazenamentos = []models.Armazenamento{}
	}

	c.JSON(http.StatusOK, gin.H{
		"code": 200, "message": "Success",
		"data": gin.H{
			"producoes":      producoes,
			"transportes":    transportes,
			"armazenamentos": armazenamentos,
		},
	})
}

// AddProducao POST /api/produto/:id/producao  (JWT required)
func AddProducao(c *gin.Context) {
	produtoID := c.Param("id")
	_ = mw.UserID(c) // require auth

	var req struct {
		Local      map[string]any `json:"local"`
		Recursos   []map[string]any `json:"recursos"`
		Poluicao   map[string]any `json:"poluicao"`
		DataInicio string         `json:"data_inicio"`
		DataFim    string         `json:"data_fim"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido"})
		return
	}

	localJSON, _ := json.Marshal(req.Local)
	recursosJSON, _ := json.Marshal(req.Recursos)
	poluicaoJSON, _ := json.Marshal(req.Poluicao)

	pid := uuid.NewString()
	if _, err := db.DB.Exec(`INSERT INTO producoes(id,produto_id,local,recursos,poluicao,data_inicio,data_fim) VALUES(?,?,?,?,?,?,?)`,
		pid, produtoID, string(localJSON), string(recursosJSON), string(poluicaoJSON),
		nullStr(req.DataInicio), nullStr(req.DataFim)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"code": 201, "message": "Produção registada", "data": gin.H{"id": pid}})
}

// AddTransporte POST /api/produto/:id/transporte  (JWT required)
func AddTransporte(c *gin.Context) {
	produtoID := c.Param("id")
	_ = mw.UserID(c)

	var req struct {
		MeioTransporteID string         `json:"meio_transporte_id"`
		CondutorID       string         `json:"condutor_id"`
		Origem           map[string]any `json:"origem"`
		Destino          map[string]any `json:"destino"`
		EmissoesCO2      float64        `json:"emissoes_co2"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido"})
		return
	}

	origemJSON, _ := json.Marshal(req.Origem)
	destinoJSON, _ := json.Marshal(req.Destino)

	tid := uuid.NewString()
	if _, err := db.DB.Exec(`INSERT INTO transportes(id,produto_id,meio_transporte_id,condutor_id,origem,destino,etapas,emissoes_co2,estado) VALUES(?,?,?,?,?,?,?,?,?)`,
		tid, produtoID, nullStr(req.MeioTransporteID), nullStr(req.CondutorID),
		string(origemJSON), string(destinoJSON), "[]", req.EmissoesCO2, "pendente"); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"code": 201, "message": "Transporte registado", "data": gin.H{"id": tid}})
}

// AddArmazenamento POST /api/produto/:id/armazenamento  (JWT required)
func AddArmazenamento(c *gin.Context) {
	produtoID := c.Param("id")
	_ = mw.UserID(c)

	var req struct {
		ProdutoEspecificoID string `json:"produto_especifico_id" binding:"required"`
		ArmazemID           string `json:"armazem_id" binding:"required"`
		Quantidade          int    `json:"quantidade"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido"})
		return
	}

	// Verify product especifico belongs to product
	var check string
	if err := db.DB.QueryRow(`SELECT id FROM produto_especificos WHERE id=? AND produto_id=?`, req.ProdutoEspecificoID, produtoID).Scan(&check); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Produto específico não pertence a este produto"})
		return
	}

	aid := uuid.NewString()
	if _, err := db.DB.Exec(`INSERT INTO armazenamentos(id,produto_especifico_id,armazem_id,quantidade) VALUES(?,?,?,?)`,
		aid, req.ProdutoEspecificoID, req.ArmazemID, req.Quantidade); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"code": 201, "message": "Armazenamento registado", "data": gin.H{"id": aid}})
}

func nullStr(s string) any {
	if s == "" {
		return nil
	}
	return s
}
