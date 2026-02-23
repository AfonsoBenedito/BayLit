package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"
	"strings"

	"baylit/db"
	"baylit/handlers"
	mw "baylit/middleware"

	"github.com/gin-gonic/gin"
)

//go:embed static
var staticFiles embed.FS

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	dbPath := os.Getenv("DATABASE_PATH")
	if dbPath == "" {
		dbPath = "/tmp/baylit.db"
	}
	ginMode := os.Getenv("GIN_MODE")
	if ginMode == "" {
		ginMode = "release"
	}
	gin.SetMode(ginMode)

	if err := db.Init(dbPath); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	if err := db.Seed(); err != nil {
		log.Printf("WARNING: Failed to seed database: %v", err)
	}

	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(gin.Logger())
	r.Use(mw.CORS())

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "baylit"})
	})

	api := r.Group("/api")

	// ── Public auth ──────────────────────────────────────────────────────────
	auth := api.Group("/auth")
	auth.POST("/register/consumidor", handlers.RegisterConsumidor)
	auth.POST("/register/fornecedor", handlers.RegisterFornecedor)
	auth.POST("/register/transportador", handlers.RegisterTransportador)
	auth.POST("/register/nao_autenticado", handlers.RegisterNaoAutenticado)
	auth.POST("/login", handlers.Login)
	auth.POST("/login/administrador", handlers.LoginAdministrador)
	auth.POST("/login/verify_token", mw.Auth(), handlers.VerifyToken)

	// ── Public product / category routes (React URL structure) ───────────────
	produto := api.Group("/produto")
	produto.GET("", handlers.ProdutoHandler)
	produto.GET("/pesquisa", handlers.ProdutoPesquisaHandler)
	produto.GET("/especifico", handlers.ProdutoEspecificoHandler)
	produto.GET("/categoria", handlers.ProdutoCategoriaHandler)
	produto.GET("/categoria/subcategoria", handlers.ProdutoCategoriaSubcategoriaHandler)
	produto.GET("/categoria/subcategoria/atributo", handlers.ProdutoCategoriaAtributoHandler)
	produto.GET("/producao/recursos", handlers.ProdutoCategoriaRecursos)
	produto.GET("/producao/poluicao", handlers.ProdutoCategoriaPoluicao)
	// Supply chain (public read)
	produto.GET("/:id/cadeia", handlers.GetCadeia)
	// Authenticated product mutations
	produtoAuthed := produto.Group("")
	produtoAuthed.Use(mw.Auth())
	produtoAuthed.POST("/:id/producao", handlers.AddProducao)
	produtoAuthed.POST("/:id/transporte", handlers.AddTransporte)
	produtoAuthed.POST("/:id/armazenamento", handlers.AddArmazenamento)

	// ── Public user lookups (no auth — React's getUserById sends no token) ──────
	api.GET("/utilizador/consumidor", handlers.GetConsumidorPublic)
	api.GET("/utilizador/fornecedor", handlers.GetFornecedorPublic)
	api.GET("/utilizador/transportador", handlers.GetTransportadorPublic)
	// Public stock check
	api.GET("/utilizador/fornecedor/armazem/inventario/stock", handlers.GetEspecificoStockPublic)

	// ── Authenticated utilizador routes ───────────────────────────────────────
	util := api.Group("/utilizador")
	util.Use(mw.Auth())

	// Favourites + notifications (Consumidor)
	util.GET("/favoritos/produto", handlers.GetFavoritos)
	util.POST("/favoritos/produto", handlers.AddFavorito)
	util.DELETE("/favoritos/produto", handlers.RemoveFavorito)
	util.GET("/notificacoes", handlers.GetNotificacoes)

	// Cart (Consumidor + NaoAutenticado)
	util.GET("/carrinho", handlers.GetCarrinhoCompat)
	util.GET("/carrinho/cadeia_logistica/sumario", handlers.GetCarrinhoSumarioCadeia)
	util.POST("/carrinho/produto", handlers.AddToCarrinhoCompat)
	util.DELETE("/carrinho/produto", handlers.RemoveFromCarrinhoCompat)
	util.PUT("/carrinho/produto", handlers.UpdateCarrinhoCompat)
	util.POST("/carrinho/compra", handlers.CheckoutCompat)
	util.POST("/carrinho/compra/confirmar", handlers.ConfirmCheckoutCompat)

	// Consumidor profile (GET is public above; only mutations need auth here)
	consumidor := util.Group("")
	consumidor.Use(mw.Require("Consumidor"))
	consumidor.PUT("/consumidor", handlers.UpdateConsumidor)
	consumidor.GET("/consumidor/encomenda", handlers.GetConsumidorEncomendas)
	consumidor.POST("/consumidor/local", handlers.AddLocalEntrega)
	consumidor.DELETE("/consumidor/local/:id", handlers.DeleteLocalEntrega)

	// Fornecedor profile (GET is public above)
	fornecedor := util.Group("")
	fornecedor.Use(mw.Require("Fornecedor"))
	fornecedor.PUT("/fornecedor", handlers.UpdateFornecedor)
	fornecedor.GET("/fornecedor/produtos", handlers.GetFornecedorProdutos)
	fornecedor.POST("/fornecedor/produto", handlers.CreateProduto)
	fornecedor.PUT("/fornecedor/produto/:id", handlers.UpdateProduto)
	fornecedor.GET("/fornecedor/venda", handlers.GetFornecedorVendas)
	fornecedor.POST("/fornecedor/armazem", handlers.AddArmazem)
	fornecedor.GET("/fornecedor/analytics", handlers.GetFornecedorAnalytics)

	// Transportador profile (GET is public above)
	transportador := util.Group("")
	transportador.Use(mw.Require("Transportador"))
	transportador.POST("/transportador/condutor", handlers.AddCondutor)
	transportador.POST("/transportador/meio_transporte", handlers.AddMeioTransporte)

	// Admin
	admin := util.Group("/administrador")
	admin.Use(mw.Require("Administrador"))
	admin.GET("/consumidores", handlers.ListConsumidores)
	admin.GET("/fornecedores", handlers.ListFornecedoresAdmin)
	admin.GET("/transportadores", handlers.ListTransportadoresAdmin)
	admin.PUT("/utilizador/:id/estado", handlers.UpdateUtilizadorEstado)
	admin.GET("/sustentabilidade", handlers.GetSustentabilidade)
	admin.GET("/analytics", handlers.GetAdminAnalytics)

	// ── SPA catch-all ────────────────────────────────────────────────────────
	staticFS, err := fs.Sub(staticFiles, "static")
	if err != nil {
		log.Fatalf("Failed to create static sub-FS: %v", err)
	}
	fileServer := http.FileServer(http.FS(staticFS))

	r.NoRoute(func(c *gin.Context) {
		path := c.Request.URL.Path
		if strings.HasPrefix(path, "/api/") {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "Rota não encontrada"})
			return
		}
		if hasExtension(path) {
			fileServer.ServeHTTP(c.Writer, c.Request)
			return
		}
		c.Request.URL.Path = "/"
		fileServer.ServeHTTP(c.Writer, c.Request)
	})

	log.Printf("BayLit starting on :%s (db: %s)", port, dbPath)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}

func hasExtension(path string) bool {
	for i := len(path) - 1; i >= 0; i-- {
		if path[i] == '.' {
			return true
		}
		if path[i] == '/' {
			return false
		}
	}
	return false
}
