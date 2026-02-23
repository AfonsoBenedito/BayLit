package handlers

import (
	"net/http"
	"strconv"

	"baylit/db"
	mw "baylit/middleware"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// tipoToDisplay maps DB tipo → display tipo (capitalized, as React expects)
func tipoToDisplay(dbTipo string) string {
	switch dbTipo {
	case "consumidor":
		return "Consumidor"
	case "fornecedor":
		return "Fornecedor"
	case "transportador":
		return "Transportador"
	case "admin":
		return "Administrador"
	}
	return dbTipo
}

type registerConsumidorReq struct {
	Nome     string `json:"nome" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type registerFornecedorReq struct {
	Nome      string `json:"nome" binding:"required"`
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=6"`
	Morada    string `json:"morada"`
	NIF       any    `json:"nif"`
	Telemovel any    `json:"telemovel"`
}

type registerTransportadorReq struct {
	Nome            string  `json:"nome" binding:"required"`
	Email           string  `json:"email" binding:"required,email"`
	Password        string  `json:"password" binding:"required,min=6"`
	Morada          string  `json:"morada"`
	NIF             any     `json:"nif"`
	Telemovel       any     `json:"telemovel"`
	PortesEncomenda any     `json:"portes_encomenda"`
}

type loginReq struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// RegisterConsumidor POST /api/auth/register/consumidor
func RegisterConsumidor(c *gin.Context) {
	var req registerConsumidorReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido: " + err.Error()})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}

	uid := uuid.NewString()
	cid := uuid.NewString()
	carrinhoID := uuid.NewString()

	tx, err := db.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}
	defer tx.Rollback()

	if _, err := tx.Exec(`INSERT INTO utilizadores(id,tipo,email,password_hash,estado) VALUES(?,?,?,?,?)`,
		uid, "consumidor", req.Email, string(hash), "ativo"); err != nil {
		c.JSON(http.StatusConflict, gin.H{"code": 409, "message": "Email já registado"})
		return
	}
	if _, err := tx.Exec(`INSERT INTO consumidores(id,utilizador_id,nome,locais_entrega,carrinho_id) VALUES(?,?,?,?,?)`,
		cid, uid, req.Nome, "[]", carrinhoID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}
	if _, err := tx.Exec(`INSERT INTO carrinhos(id,consumidor_id,items) VALUES(?,?,?)`,
		carrinhoID, cid, "[]"); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}
	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}

	token, _ := mw.SignToken(uid, "Consumidor")
	c.JSON(http.StatusCreated, gin.H{
		"code": 201, "message": "Success",
		"data": gin.H{"user": gin.H{"tipo": "Consumidor", "id": uid}, "auth_token": token, "expires": "120m"},
	})
}

// RegisterFornecedor POST /api/auth/register/fornecedor
func RegisterFornecedor(c *gin.Context) {
	var req registerFornecedorReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido: " + err.Error()})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}

	uid := uuid.NewString()
	fid := uuid.NewString()

	tx, err := db.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}
	defer tx.Rollback()

	if _, err := tx.Exec(`INSERT INTO utilizadores(id,tipo,email,password_hash,nif,telemovel,estado) VALUES(?,?,?,?,?,?,?)`,
		uid, "fornecedor", req.Email, string(hash), nz(req.NIF), nz(req.Telemovel), "ativo"); err != nil {
		c.JSON(http.StatusConflict, gin.H{"code": 409, "message": "Email já registado"})
		return
	}
	if _, err := tx.Exec(`INSERT INTO fornecedores(id,utilizador_id,nome,nif,morada) VALUES(?,?,?,?,?)`,
		fid, uid, req.Nome, nz(req.NIF), req.Morada); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}
	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}

	token, _ := mw.SignToken(uid, "Fornecedor")
	c.JSON(http.StatusCreated, gin.H{
		"code": 201, "message": "Success",
		"data": gin.H{"user": gin.H{"tipo": "Fornecedor", "id": uid}, "auth_token": token, "expires": "120m"},
	})
}

// RegisterTransportador POST /api/auth/register/transportador
func RegisterTransportador(c *gin.Context) {
	var req registerTransportadorReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido: " + err.Error()})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}

	uid := uuid.NewString()
	tid := uuid.NewString()

	tx, err := db.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}
	defer tx.Rollback()

	if _, err := tx.Exec(`INSERT INTO utilizadores(id,tipo,email,password_hash,nif,telemovel,estado) VALUES(?,?,?,?,?,?,?)`,
		uid, "transportador", req.Email, string(hash), nz(req.NIF), nz(req.Telemovel), "ativo"); err != nil {
		c.JSON(http.StatusConflict, gin.H{"code": 409, "message": "Email já registado"})
		return
	}
	if _, err := tx.Exec(`INSERT INTO transportadores(id,utilizador_id,nome,nif,morada,portes_encomenda) VALUES(?,?,?,?,?,?)`,
		tid, uid, req.Nome, nz(req.NIF), req.Morada, nzFloat(req.PortesEncomenda)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}
	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "Erro interno"})
		return
	}

	token, _ := mw.SignToken(uid, "Transportador")
	c.JSON(http.StatusCreated, gin.H{
		"code": 201, "message": "Success",
		"data": gin.H{"user": gin.H{"tipo": "Transportador", "id": uid}, "auth_token": token, "expires": "120m"},
	})
}

// RegisterNaoAutenticado POST /api/auth/register/nao_autenticado
// Creates a guest session (no DB record needed, just a JWT).
func RegisterNaoAutenticado(c *gin.Context) {
	guestID := uuid.NewString()
	// Create a carrinho for the guest keyed by their ID
	db.DB.Exec(`INSERT OR IGNORE INTO carrinhos(id,consumidor_id,items) VALUES(?,?,?)`, guestID, nil, "[]")

	token, _ := mw.SignToken(guestID, "NaoAutenticado")
	c.JSON(http.StatusCreated, gin.H{
		"code": 201, "message": "Success",
		"data": gin.H{"user": gin.H{"tipo": "NaoAutenticado", "id": guestID}, "auth_token": token, "expires": "120m"},
	})
}

// Login POST /api/auth/login
func Login(c *gin.Context) {
	var req loginReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido"})
		return
	}

	var id, dbTipo, hash string
	err := db.DB.QueryRow(`SELECT id, tipo, password_hash FROM utilizadores WHERE email=? AND estado='ativo'`, req.Email).Scan(&id, &dbTipo, &hash)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "Credenciais inválidas"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "Credenciais inválidas"})
		return
	}

	displayTipo := tipoToDisplay(dbTipo)
	token, _ := mw.SignToken(id, displayTipo)
	c.JSON(http.StatusOK, gin.H{
		"code": 200, "message": "Success",
		"data": gin.H{"user": gin.H{"tipo": displayTipo, "id": id}, "auth_token": token, "expires": "120m"},
	})
}

// LoginAdministrador POST /api/auth/login/administrador
func LoginAdministrador(c *gin.Context) {
	var req struct {
		Nome     string `json:"nome" binding:"required"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		// Also try email field
		var req2 loginReq
		if err2 := c.ShouldBindJSON(&req2); err2 != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "Pedido inválido"})
			return
		}
	}

	// Try by email or by "nome" (which maps to email for admin)
	var id, hash string
	err := db.DB.QueryRow(`SELECT u.id, u.password_hash FROM utilizadores u WHERE u.tipo='admin' AND u.estado='ativo' AND (u.email=? OR EXISTS (SELECT 1 FROM administradores a WHERE a.utilizador_id=u.id AND a.nome=?))`, req.Nome, req.Nome).Scan(&id, &hash)
	if err != nil {
		// Try by email
		err = db.DB.QueryRow(`SELECT id, password_hash FROM utilizadores WHERE email=? AND tipo='admin' AND estado='ativo'`, req.Nome).Scan(&id, &hash)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "Credenciais inválidas"})
			return
		}
	}

	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "Credenciais inválidas"})
		return
	}

	token, _ := mw.SignToken(id, "Administrador")
	c.JSON(http.StatusOK, gin.H{
		"code": 200, "message": "Success",
		"data": gin.H{"user": gin.H{"tipo": "Administrador", "id": id}, "auth_token": token, "expires": "120m"},
	})
}

// VerifyToken POST /api/auth/login/verify_token
func VerifyToken(c *gin.Context) {
	// Auth middleware already validated the token; just return success
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "Token válido."})
}

// nzFloat converts any JSON value (string or number) to float64 for portes_encomenda.
func nzFloat(v any) float64 {
	switch val := v.(type) {
	case float64:
		return val
	case string:
		f, err := strconv.ParseFloat(val, 64)
		if err != nil {
			return 0
		}
		return f
	}
	return 0
}

// nz returns nil when value is zero/empty (handles string or number from JSON).
func nz(v any) any {
	switch val := v.(type) {
	case float64:
		if val == 0 {
			return nil
		}
		return int64(val)
	case string:
		if val == "" {
			return nil
		}
		n, err := strconv.ParseInt(val, 10, 64)
		if err != nil {
			return nil
		}
		return n
	case int64:
		if val == 0 {
			return nil
		}
		return val
	}
	return nil
}
