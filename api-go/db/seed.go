package db

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// Run seeds the database with initial data if it is empty.
func Seed() error {
	var count int
	if err := DB.QueryRow("SELECT COUNT(*) FROM utilizadores").Scan(&count); err != nil {
		return fmt.Errorf("seed check: %w", err)
	}
	if count > 0 {
		log.Println("Database already seeded, skipping")
		return nil
	}

	log.Println("Seeding database...")

	if err := seedAdmin(); err != nil {
		return fmt.Errorf("seed admin: %w", err)
	}
	if err := seedFornecedores(); err != nil {
		return fmt.Errorf("seed fornecedores: %w", err)
	}
	if err := seedTransportador(); err != nil {
		return fmt.Errorf("seed transportador: %w", err)
	}
	if err := seedCategorias(); err != nil {
		return fmt.Errorf("seed categorias: %w", err)
	}
	if err := seedProdutos(); err != nil {
		return fmt.Errorf("seed produtos: %w", err)
	}
	if err := seedSupplyChain(); err != nil {
		return fmt.Errorf("seed supply chain: %w", err)
	}

	log.Println("Database seeded successfully")
	return nil
}

// svgPlaceholder creates a base64 data URI SVG placeholder image.
func svgPlaceholder(text, bgColor string) string {
	svg := fmt.Sprintf(`<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%%" height="100%%" fill="#%s"/><text x="50%%" y="50%%" font-family="Arial,sans-serif" font-size="24" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">%s</text></svg>`, bgColor, text)
	return "data:image/svg+xml;base64," + base64.StdEncoding.EncodeToString([]byte(svg))
}

// subcategoryImages maps Portuguese subcategory names to static image paths served by Go.
var subcategoryImages = map[string]string{
	// Eletrónica
	"Smartphones":        "/images/subcategories/eletronicos/telemoveis.png",
	"Computadores":       "/images/subcategories/computadores/portateis.png",
	"Tablets":            "/images/subcategories/eletronicos/televisoes.png",
	// Roupa
	"Sapatos":            "/images/subcategories/roupa/sapatos.png",
	"Calças":             "/images/subcategories/roupa/calcas.png",
	"T-Shirts":           "/images/subcategories/roupa/tshirts.png",
	"Camisas":            "/images/subcategories/roupa/camisas.png",
	// Casa
	"Mobília":            "/images/subcategories/casa/mesa.png",
	"Decoração":          "/images/subcategories/casa/candeeiro.png",
	"Eletrodomésticos":   "/images/subcategories/eletronicos/frigorificos.png",
	// Desporto
	"Calçado Desportivo": "/images/subcategories/desporto/roupaDesportiva.png",
	"Equipamento":        "/images/subcategories/desporto/material.png",
	"Acessórios":         "/images/subcategories/desporto/acessorios.png",
	// Livros
	"Ficção":             "/images/subcategories/entretenimento/jogos.png",
	"Não-Ficção":         "/images/subcategories/entretenimento/quadros.png",
	"Educacional":        "/images/subcategories/entretenimento/quadros.png",
	// Beleza
	"Cosméticos":         "/images/subcategories/saude/pele.png",
	"Cuidados da Pele":   "/images/subcategories/saude/pele.png",
	"Perfumes":           "/images/subcategories/saude/cabelo.png",
	// Alimentação
	"Orgânico":           "/images/subcategories/comidas/frutas.png",
	"Vegan":              "/images/subcategories/comidas/frutas.png",
	"Local":              "/images/subcategories/comidas/sumos.png",
	// Crianças
	"Roupa":              "/images/subcategories/crianca/roupa.png",
	"Brinquedos":         "/images/subcategories/crianca/brinquedos.png",
}

// productImageURL returns the static image path for a product based on its subcategory.
func productImageURL(subcategoria, _ string) string {
	if path, ok := subcategoryImages[subcategoria]; ok {
		return path
	}
	return "/images/subcategories/eletronicos/telemoveis.png"
}

func mustJSON(v any) string {
	b, _ := json.Marshal(v)
	return string(b)
}

// ---- Seed functions ----

func seedAdmin() error {
	hash, _ := bcrypt.GenerateFromPassword([]byte("badPwd2."), bcrypt.DefaultCost)
	uid := uuid.NewString()
	aid := uuid.NewString()

	tx, err := DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if _, err := tx.Exec(`INSERT INTO utilizadores(id,tipo,email,password_hash,estado) VALUES(?,?,?,?,?)`,
		uid, "admin", "admin@baylit.com", string(hash), "ativo"); err != nil {
		return err
	}
	if _, err := tx.Exec(`INSERT INTO administradores(id,utilizador_id,nome) VALUES(?,?,?)`,
		aid, uid, "Admin"); err != nil {
		return err
	}
	return tx.Commit()
}

// Seed IDs (package-level so seedProdutos can reference them)
var (
	fornecedor1ID string
	fornecedor2ID string
)

func seedFornecedores() error {
	hash, _ := bcrypt.GenerateFromPassword([]byte("Fornecedor1!"), bcrypt.DefaultCost)

	tx, err := DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Fornecedor 1 — EcoTech Ibérica
	uid1 := uuid.NewString()
	fornecedor1ID = uuid.NewString()
	if _, err := tx.Exec(`INSERT INTO utilizadores(id,tipo,email,password_hash,nif,telemovel,estado) VALUES(?,?,?,?,?,?,?)`,
		uid1, "fornecedor", "ecotech@baylit.com", string(hash), 500123456, 912345678, "ativo"); err != nil {
		return err
	}
	if _, err := tx.Exec(`INSERT INTO fornecedores(id,utilizador_id,nome,nif,morada) VALUES(?,?,?,?,?)`,
		fornecedor1ID, uid1, "EcoTech Ibérica", 500123456, "Rua da Tecnologia, 42, Lisboa"); err != nil {
		return err
	}

	// Fornecedor 2 — Verde Natura
	hash2, _ := bcrypt.GenerateFromPassword([]byte("Fornecedor2!"), bcrypt.DefaultCost)
	uid2 := uuid.NewString()
	fornecedor2ID = uuid.NewString()
	if _, err := tx.Exec(`INSERT INTO utilizadores(id,tipo,email,password_hash,nif,telemovel,estado) VALUES(?,?,?,?,?,?,?)`,
		uid2, "fornecedor", "verdenatura@baylit.com", string(hash2), 500654321, 961234567, "ativo"); err != nil {
		return err
	}
	if _, err := tx.Exec(`INSERT INTO fornecedores(id,utilizador_id,nome,nif,morada) VALUES(?,?,?,?,?)`,
		fornecedor2ID, uid2, "Verde Natura", 500654321, "Avenida Verde, 15, Porto"); err != nil {
		return err
	}

	// Armazéns
	arm1 := uuid.NewString()
	arm2 := uuid.NewString()
	localArm1 := mustJSON(map[string]any{"morada": "Parque Industrial de Lisboa", "cidade": "Lisboa", "cp": "1500-100", "pais": "Portugal", "lat": 38.7369, "lng": -9.1395})
	localArm2 := mustJSON(map[string]any{"morada": "Zona Industrial do Porto", "cidade": "Porto", "cp": "4100-200", "pais": "Portugal", "lat": 41.1579, "lng": -8.6291})
	if _, err := tx.Exec(`INSERT INTO armazens(id,fornecedor_id,nome,local,capacidade) VALUES(?,?,?,?,?)`,
		arm1, fornecedor1ID, "Armazém Central Lisboa", localArm1, 10000); err != nil {
		return err
	}
	if _, err := tx.Exec(`INSERT INTO armazens(id,fornecedor_id,nome,local,capacidade) VALUES(?,?,?,?,?)`,
		arm2, fornecedor2ID, "Armazém Porto Norte", localArm2, 5000); err != nil {
		return err
	}

	return tx.Commit()
}

func seedTransportador() error {
	hash, _ := bcrypt.GenerateFromPassword([]byte("Transport1!"), bcrypt.DefaultCost)
	tx, err := DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	uid := uuid.NewString()
	tid := uuid.NewString()
	if _, err := tx.Exec(`INSERT INTO utilizadores(id,tipo,email,password_hash,nif,telemovel,estado) VALUES(?,?,?,?,?,?,?)`,
		uid, "transportador", "velocidade@baylit.com", string(hash), 500789012, 936789012, "ativo"); err != nil {
		return err
	}
	if _, err := tx.Exec(`INSERT INTO transportadores(id,utilizador_id,nome,nif,morada,portes_encomenda) VALUES(?,?,?,?,?,?)`,
		tid, uid, "Velocidade Verde Transportes", 500789012, "Estrada Nacional 10, Setúbal", 3.99); err != nil {
		return err
	}

	// Meios de transporte
	mt1 := uuid.NewString()
	mt2 := uuid.NewString()
	if _, err := tx.Exec(`INSERT INTO meios_transporte(id,transportador_id,tipo,capacidade,emissao_base) VALUES(?,?,?,?,?)`,
		mt1, tid, "Furgão Elétrico", 500.0, 0.0); err != nil {
		return err
	}
	if _, err := tx.Exec(`INSERT INTO meios_transporte(id,transportador_id,tipo,capacidade,emissao_base) VALUES(?,?,?,?,?)`,
		mt2, tid, "Bicicleta de Carga", 50.0, 0.0); err != nil {
		return err
	}

	// Condutores
	c1 := uuid.NewString()
	c2 := uuid.NewString()
	if _, err := tx.Exec(`INSERT INTO condutores(id,transportador_id,nome,licenca) VALUES(?,?,?,?)`,
		c1, tid, "Carlos Mendes", "B-EV-2021"); err != nil {
		return err
	}
	if _, err := tx.Exec(`INSERT INTO condutores(id,transportador_id,nome,licenca) VALUES(?,?,?,?)`,
		c2, tid, "Ana Ferreira", "BIKE-2022"); err != nil {
		return err
	}

	return tx.Commit()
}

type subcatDef struct {
	Name       string
	Attributes []string
	Color      string
}

type catDef struct {
	Name  string
	Image string
	Color string
	Subs  []subcatDef
}

var categoryDefs = []catDef{
	{Name: "Crianças", Image: "/images/categories/criancas.jpg", Color: "FF6B9D", Subs: []subcatDef{
		{Name: "Sapatos", Attributes: []string{"Cor", "Tamanho do Calçado", "Idade"}, Color: "FF6B9D"},
		{Name: "Roupa", Attributes: []string{"Cor", "Tamanho da Roupa", "Idade"}, Color: "4ECDC4"},
		{Name: "Brinquedos", Attributes: []string{"Idade"}, Color: "95E1D3"},
		{Name: "Acessórios", Attributes: []string{"Cor", "Idade"}, Color: "F38181"},
	}},
	{Name: "Roupa", Image: "/images/categories/roupa.jpg", Color: "AA96DA", Subs: []subcatDef{
		{Name: "Sapatos", Attributes: []string{"Cor", "Tamanho do Calçado", "Sexo"}, Color: "FF6B9D"},
		{Name: "Calças", Attributes: []string{"Cor", "Tamanho da Roupa", "Sexo"}, Color: "AA96DA"},
		{Name: "T-Shirts", Attributes: []string{"Cor", "Tamanho da Roupa", "Sexo"}, Color: "FCBAD3"},
		{Name: "Camisas", Attributes: []string{"Cor", "Tamanho da Roupa", "Sexo"}, Color: "FFD93D"},
	}},
	{Name: "Eletrónica", Image: "/images/categories/eletronica.jpg", Color: "4D96FF", Subs: []subcatDef{
		{Name: "Smartphones", Attributes: []string{"Marca", "Capacidade", "Cor"}, Color: "6BCB77"},
		{Name: "Computadores", Attributes: []string{"Marca", "RAM", "Armazenamento"}, Color: "4D96FF"},
		{Name: "Tablets", Attributes: []string{"Marca", "Tamanho do Ecrã", "Capacidade"}, Color: "FF6B6B"},
	}},
	{Name: "Casa", Image: "/images/categories/casa.jpg", Color: "95A5A6", Subs: []subcatDef{
		{Name: "Mobília", Attributes: []string{"Cor", "Material", "Dimensões"}, Color: "95A5A6"},
		{Name: "Decoração", Attributes: []string{"Cor", "Estilo", "Material"}, Color: "E74C3C"},
		{Name: "Eletrodomésticos", Attributes: []string{"Marca", "Potência", "Cor"}, Color: "3498DB"},
	}},
	{Name: "Desporto", Image: "/images/categories/desporto.jpg", Color: "1ABC9C", Subs: []subcatDef{
		{Name: "Calçado Desportivo", Attributes: []string{"Tamanho", "Cor", "Tipo"}, Color: "1ABC9C"},
		{Name: "Equipamento", Attributes: []string{"Tipo", "Tamanho", "Material"}, Color: "9B59B6"},
		{Name: "Acessórios", Attributes: []string{"Tipo", "Cor", "Material"}, Color: "F38181"},
	}},
	{Name: "Livros", Image: "/images/categories/livros.jpg", Color: "8E44AD", Subs: []subcatDef{
		{Name: "Ficção", Attributes: []string{"Autor", "Editora", "Idioma"}, Color: "8E44AD"},
		{Name: "Não-Ficção", Attributes: []string{"Autor", "Editora", "Idioma"}, Color: "2C3E50"},
		{Name: "Educacional", Attributes: []string{"Editora", "Idioma"}, Color: "27AE60"},
	}},
	{Name: "Beleza", Image: "/images/categories/beleza.jpg", Color: "E91E8C", Subs: []subcatDef{
		{Name: "Cosméticos", Attributes: []string{"Tipo", "Marca", "Cor"}, Color: "E91E8C"},
		{Name: "Cuidados da Pele", Attributes: []string{"Tipo", "Marca"}, Color: "FF5722"},
		{Name: "Perfumes", Attributes: []string{"Marca", "Fragrância", "Volume"}, Color: "9C27B0"},
	}},
	{Name: "Alimentação", Image: "/images/categories/alimentacao.jpg", Color: "4CAF50", Subs: []subcatDef{
		{Name: "Orgânico", Attributes: []string{"Tipo", "Origem"}, Color: "4CAF50"},
		{Name: "Vegan", Attributes: []string{"Tipo", "Origem"}, Color: "8BC34A"},
		{Name: "Local", Attributes: []string{"Tipo", "Origem"}, Color: "CDDC39"},
	}},
}

var attributeValues = map[string][]string{
	"Cor":               {"Azul", "Vermelho", "Verde", "Amarelo", "Preto", "Branco", "Rosa", "Cinza"},
	"Tamanho do Calçado": {"36", "37", "38", "39", "40", "41", "42", "43", "44"},
	"Tamanho da Roupa":  {"XS", "S", "M", "L", "XL", "XXL"},
	"Idade":             {"0-2", "3-5", "6-8", "9-12", "12+"},
	"Sexo":              {"Masculino", "Feminino", "Unissex"},
	"Marca":             {"Samsung", "Apple", "Nike", "Adidas", "Sony", "LG"},
	"Capacidade":        {"64GB", "128GB", "256GB", "512GB"},
	"RAM":               {"8GB", "16GB", "32GB"},
	"Armazenamento":     {"256GB", "512GB", "1TB"},
	"Tamanho do Ecrã":   {"10 polegadas", "11 polegadas", "12 polegadas"},
	"Material":          {"Algodão", "Poliester", "Couro", "Madeira", "Metal"},
	"Dimensões":         {"Pequeno", "Médio", "Grande"},
	"Estilo":            {"Moderno", "Clássico", "Minimalista", "Vintage"},
	"Potência":          {"500W", "1000W", "2000W"},
	"Tamanho":           {"P", "M", "G", "GG"},
	"Tipo":              {"Standard", "Premium", "Eco"},
	"Autor":             {"Vários", "Nacional"},
	"Editora":           {"Porto Editora", "Leya", "Outras"},
	"Idioma":            {"Português", "Inglês", "Espanhol"},
	"Fragrância":        {"Floral", "Amadeirado", "Cítrico", "Fresco"},
	"Volume":            {"30ml", "50ml", "100ml"},
	"Origem":            {"Local", "Nacional", "Regional"},
}

// category IDs keyed by name (populated during seedCategorias)
var catIDs = map[string]string{}

func seedCategorias() error {
	tx, err := DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	for _, cat := range categoryDefs {
		catID := uuid.NewString()
		catIDs[cat.Name] = catID

		// Build subcategorias JSON
		type attrJSON struct {
			Nome    string   `json:"nome"`
			Valores []string `json:"valores"`
		}
		type subJSON struct {
			ID        string      `json:"id"`
			Nome      string      `json:"nome"`
			Imagem    string      `json:"imagem"`
			Atributos []attrJSON  `json:"atributos"`
		}

		var subs []subJSON
		for _, sub := range cat.Subs {
			var attrs []attrJSON
			for _, a := range sub.Attributes {
				vals := attributeValues[a]
				if vals == nil {
					vals = []string{}
				}
				attrs = append(attrs, attrJSON{Nome: a, Valores: vals})
			}
			subs = append(subs, subJSON{
				ID:        uuid.NewString(),
				Nome:      sub.Name,
				Imagem:    productImageURL(sub.Name, ""),
				Atributos: attrs,
			})
		}

		subsJSON := mustJSON(subs)
		if _, err := tx.Exec(
			`INSERT INTO categorias(id,nome,imagem,subcategorias,atributos) VALUES(?,?,?,?,?)`,
			catID, cat.Name, cat.Image, subsJSON, "[]",
		); err != nil {
			return err
		}
	}
	return tx.Commit()
}

type productDef struct {
	Nome       string
	Descricao  string
	Categoria  string
	Subcat     string
	Fornecedor string // "f1" or "f2"
	Preco      float64
	Stock      int
	Atributos  map[string]string
}

var productDefs = []productDef{
	// Eletrónica - Smartphones
	{Nome: "EcoPhone X12", Descricao: "Smartphone eco-friendly com bateria reciclada e carcaça biodegradável.", Categoria: "Eletrónica", Subcat: "Smartphones", Fornecedor: "f1", Preco: 399.99, Stock: 50, Atributos: map[string]string{"Marca": "Samsung", "Capacidade": "128GB", "Cor": "Verde"}},
	{Nome: "GreenMobile Pro", Descricao: "Telemóvel com carregador solar e materiais sustentáveis.", Categoria: "Eletrónica", Subcat: "Smartphones", Fornecedor: "f1", Preco: 549.99, Stock: 30, Atributos: map[string]string{"Marca": "Apple", "Capacidade": "256GB", "Cor": "Cinza"}},
	{Nome: "BioPhone Lite", Descricao: "Smartphone de entrada com embalagem 100% reciclável.", Categoria: "Eletrónica", Subcat: "Smartphones", Fornecedor: "f2", Preco: 199.99, Stock: 80, Atributos: map[string]string{"Marca": "LG", "Capacidade": "64GB", "Cor": "Branco"}},
	// Eletrónica - Computadores
	{Nome: "EcoBook Air", Descricao: "Portátil ultrafino com chassis de alumínio reciclado.", Categoria: "Eletrónica", Subcat: "Computadores", Fornecedor: "f1", Preco: 899.99, Stock: 20, Atributos: map[string]string{"Marca": "Apple", "RAM": "16GB", "Armazenamento": "512GB"}},
	{Nome: "GreenLaptop 15", Descricao: "Computador portátil eficiente energeticamente com certificação Energy Star.", Categoria: "Eletrónica", Subcat: "Computadores", Fornecedor: "f1", Preco: 649.99, Stock: 25, Atributos: map[string]string{"Marca": "LG", "RAM": "8GB", "Armazenamento": "256GB"}},
	// Eletrónica - Tablets
	{Nome: "EcoTab 10", Descricao: "Tablet com ecrã de baixo consumo e bateria de longa duração.", Categoria: "Eletrónica", Subcat: "Tablets", Fornecedor: "f1", Preco: 299.99, Stock: 35, Atributos: map[string]string{"Marca": "Samsung", "Tamanho do Ecrã": "10 polegadas", "Capacidade": "128GB"}},
	// Roupa - T-Shirts
	{Nome: "T-Shirt Orgânica Básica", Descricao: "T-shirt 100% algodão orgânico certificado GOTS.", Categoria: "Roupa", Subcat: "T-Shirts", Fornecedor: "f2", Preco: 24.99, Stock: 150, Atributos: map[string]string{"Cor": "Branco", "Tamanho da Roupa": "M", "Sexo": "Unissex"}},
	{Nome: "T-Shirt Bambu Verde", Descricao: "Tecido de bambu sustentável, suave e antibacteriano.", Categoria: "Roupa", Subcat: "T-Shirts", Fornecedor: "f2", Preco: 29.99, Stock: 100, Atributos: map[string]string{"Cor": "Verde", "Tamanho da Roupa": "L", "Sexo": "Feminino"}},
	{Nome: "T-Shirt Reciclada Sport", Descricao: "Feita com garrafas PET recicladas, ideal para desporto.", Categoria: "Roupa", Subcat: "T-Shirts", Fornecedor: "f2", Preco: 34.99, Stock: 80, Atributos: map[string]string{"Cor": "Azul", "Tamanho da Roupa": "XL", "Sexo": "Masculino"}},
	// Roupa - Calças
	{Nome: "Calças Jeans Recicladas", Descricao: "Denim feito com 50% algodão reciclado.", Categoria: "Roupa", Subcat: "Calças", Fornecedor: "f2", Preco: 59.99, Stock: 60, Atributos: map[string]string{"Cor": "Azul", "Tamanho da Roupa": "M", "Sexo": "Unissex"}},
	{Nome: "Calças Linho Sustentável", Descricao: "Linho cultivado sem pesticidas, lavagem a frio.", Categoria: "Roupa", Subcat: "Calças", Fornecedor: "f2", Preco: 49.99, Stock: 45, Atributos: map[string]string{"Cor": "Cinza", "Tamanho da Roupa": "L", "Sexo": "Feminino"}},
	// Roupa - Camisas
	{Nome: "Camisa Cânhamo Natural", Descricao: "Cânhamo orgânico, tecido respirável e durável.", Categoria: "Roupa", Subcat: "Camisas", Fornecedor: "f2", Preco: 44.99, Stock: 55, Atributos: map[string]string{"Cor": "Branco", "Tamanho da Roupa": "L", "Sexo": "Masculino"}},
	// Casa - Mobília
	{Nome: "Mesa de Café Madeira Reciclada", Descricao: "Mesa de café em madeira de pinheiro recuperada.", Categoria: "Casa", Subcat: "Mobília", Fornecedor: "f2", Preco: 189.99, Stock: 15, Atributos: map[string]string{"Cor": "Castanho", "Material": "Madeira", "Dimensões": "Médio"}},
	{Nome: "Cadeira Bambu Design", Descricao: "Cadeira ergonómica em bambu de crescimento rápido.", Categoria: "Casa", Subcat: "Mobília", Fornecedor: "f2", Preco: 129.99, Stock: 20, Atributos: map[string]string{"Cor": "Natural", "Material": "Madeira", "Dimensões": "Médio"}},
	// Casa - Decoração
	{Nome: "Candeeiro Cortiça Artesanal", Descricao: "Iluminação decorativa em cortiça natural portuguesa.", Categoria: "Casa", Subcat: "Decoração", Fornecedor: "f2", Preco: 49.99, Stock: 30, Atributos: map[string]string{"Cor": "Natural", "Estilo": "Moderno", "Material": "Couro"}},
	{Nome: "Vaso Cerâmica Artesanal", Descricao: "Vaso feito à mão com barro local e corantes naturais.", Categoria: "Casa", Subcat: "Decoração", Fornecedor: "f2", Preco: 34.99, Stock: 40, Atributos: map[string]string{"Cor": "Terracota", "Estilo": "Clássico", "Material": "Metal"}},
	// Desporto - Calçado Desportivo
	{Nome: "Sapatilhas Eco Runner", Descricao: "Calçado desportivo com sola de borracha natural reciclada.", Categoria: "Desporto", Subcat: "Calçado Desportivo", Fornecedor: "f1", Preco: 89.99, Stock: 60, Atributos: map[string]string{"Tamanho": "M", "Cor": "Verde", "Tipo": "Eco"}},
	{Nome: "Ténis BioTrail", Descricao: "Para trilho, impermeável com materiais bio-based.", Categoria: "Desporto", Subcat: "Calçado Desportivo", Fornecedor: "f1", Preco: 119.99, Stock: 35, Atributos: map[string]string{"Tamanho": "G", "Cor": "Preto", "Tipo": "Premium"}},
	// Desporto - Equipamento
	{Nome: "Tapete Yoga Natural", Descricao: "Tapete de yoga em borracha natural, antiderrapante.", Categoria: "Desporto", Subcat: "Equipamento", Fornecedor: "f2", Preco: 39.99, Stock: 70, Atributos: map[string]string{"Tipo": "Eco", "Tamanho": "M", "Material": "Borracha Natural"}},
	{Nome: "Garrafa Reutilizável Aço", Descricao: "Garrafa térmica em aço inoxidável, sem BPA.", Categoria: "Desporto", Subcat: "Acessórios", Fornecedor: "f2", Preco: 24.99, Stock: 100, Atributos: map[string]string{"Tipo": "Standard", "Cor": "Cinza", "Material": "Metal"}},
	// Livros
	{Nome: "O Futuro Verde", Descricao: "Guia prático para um estilo de vida sustentável.", Categoria: "Livros", Subcat: "Não-Ficção", Fornecedor: "f2", Preco: 14.99, Stock: 50, Atributos: map[string]string{"Autor": "Nacional", "Editora": "Porto Editora", "Idioma": "Português"}},
	{Nome: "Economia Circular", Descricao: "Introdução aos princípios da economia circular.", Categoria: "Livros", Subcat: "Educacional", Fornecedor: "f2", Preco: 19.99, Stock: 30, Atributos: map[string]string{"Editora": "Leya", "Idioma": "Português"}},
	// Beleza
	{Nome: "Creme Hidratante Aloe", Descricao: "Hidratante com aloe vera orgânico, vegan, sem parabenos.", Categoria: "Beleza", Subcat: "Cuidados da Pele", Fornecedor: "f2", Preco: 17.99, Stock: 80, Atributos: map[string]string{"Tipo": "Premium", "Marca": "Verde"}},
	{Nome: "Perfume Flores do Campo", Descricao: "Perfume natural com ingredientes florais portugueses.", Categoria: "Beleza", Subcat: "Perfumes", Fornecedor: "f2", Preco: 49.99, Stock: 25, Atributos: map[string]string{"Marca": "BioScent", "Fragrância": "Floral", "Volume": "50ml"}},
	// Alimentação
	{Nome: "Mel Silvestre Bio", Descricao: "Mel de colmeia silvestre, produção local certificada.", Categoria: "Alimentação", Subcat: "Orgânico", Fornecedor: "f2", Preco: 9.99, Stock: 120, Atributos: map[string]string{"Tipo": "Mel", "Origem": "Local"}},
	{Nome: "Azeite Extra Virgem DOP", Descricao: "Azeite de produção sustentável, colheita manual.", Categoria: "Alimentação", Subcat: "Local", Fornecedor: "f2", Preco: 12.99, Stock: 90, Atributos: map[string]string{"Tipo": "Azeite", "Origem": "Regional"}},
	{Nome: "Mix Sementes Vegan", Descricao: "Mistura de sementes orgânicas para refeições vegan.", Categoria: "Alimentação", Subcat: "Vegan", Fornecedor: "f2", Preco: 7.99, Stock: 150, Atributos: map[string]string{"Tipo": "Sementes", "Origem": "Nacional"}},
	// Crianças
	{Nome: "Conjunto Roupa Bebé Orgânico", Descricao: "Conjunto roupa bebé 100% algodão orgânico certificado.", Categoria: "Crianças", Subcat: "Roupa", Fornecedor: "f2", Preco: 34.99, Stock: 40, Atributos: map[string]string{"Cor": "Branco", "Tamanho da Roupa": "S", "Idade": "0-2"}},
	{Nome: "Brinquedo Madeira Natural", Descricao: "Brinquedo educativo em madeira de eucalipto certificado.", Categoria: "Crianças", Subcat: "Brinquedos", Fornecedor: "f2", Preco: 22.99, Stock: 55, Atributos: map[string]string{"Idade": "3-5"}},
}

// prodIDs maps product nome → ID (used for supply chain seeding)
var prodIDs = map[string]string{}

func seedProdutos() error {
	tx, err := DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	fornecedorByKey := map[string]string{"f1": fornecedor1ID, "f2": fornecedor2ID}

	for _, pd := range productDefs {
		pid := uuid.NewString()
		prodIDs[pd.Nome] = pid
		fid := fornecedorByKey[pd.Fornecedor]
		cid := catIDs[pd.Categoria]

		if _, err := tx.Exec(
			`INSERT INTO produtos(id,nome,descricao,fornecedor_id,categoria_id,subcategoria,estado) VALUES(?,?,?,?,?,?,?)`,
			pid, pd.Nome, pd.Descricao, fid, cid, pd.Subcat, "ativo",
		); err != nil {
			return fmt.Errorf("insert product %q: %w", pd.Nome, err)
		}

		// Product specific (one variant per product for simplicity)
		psid := uuid.NewString()
		attrJSON := mustJSON(pd.Atributos)
		img := productImageURL(pd.Subcat, pid)
		imgsJSON := mustJSON([]string{img})
		if _, err := tx.Exec(
			`INSERT INTO produto_especificos(id,produto_id,preco,stock,atributos,imagens,estado) VALUES(?,?,?,?,?,?,?)`,
			psid, pid, pd.Preco, pd.Stock, attrJSON, imgsJSON, "ativo",
		); err != nil {
			return fmt.Errorf("insert product_especifico %q: %w", pd.Nome, err)
		}
	}
	return tx.Commit()
}

func seedSupplyChain() error {
	tx, err := DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	localLisboa := mustJSON(map[string]any{"morada": "Parque Industrial de Lisboa", "cidade": "Lisboa", "pais": "Portugal", "lat": 38.7369, "lng": -9.1395})
	localPorto := mustJSON(map[string]any{"morada": "Zona Industrial do Porto", "cidade": "Porto", "pais": "Portugal", "lat": 41.1579, "lng": -8.6291})

	// Seed production data for the first 5 products
	names := []string{"EcoPhone X12", "GreenMobile Pro", "EcoBook Air", "T-Shirt Orgânica Básica", "Calças Jeans Recicladas"}
	recursos := mustJSON([]map[string]any{
		{"nome": "Energia Solar", "quantidade": 100, "unidade": "kWh"},
		{"nome": "Alumínio Reciclado", "quantidade": 0.5, "unidade": "kg"},
	})
	poluicao := mustJSON(map[string]any{"co2_kg": 2.5, "agua_litros": 50, "residuos_kg": 0.1})

	for i, name := range names {
		pid, ok := prodIDs[name]
		if !ok {
			continue
		}
		loc := localLisboa
		if i%2 == 0 {
			loc = localPorto
		}
		dataInicio := time.Now().AddDate(0, -3, -i*5).Format("2006-01-02T15:04:05Z")
		dataFim := time.Now().AddDate(0, -2, -i*5).Format("2006-01-02T15:04:05Z")
		if _, err := tx.Exec(
			`INSERT INTO producoes(id,produto_id,local,recursos,poluicao,data_inicio,data_fim) VALUES(?,?,?,?,?,?,?)`,
			uuid.NewString(), pid, loc, recursos, poluicao, dataInicio, dataFim,
		); err != nil {
			return err
		}
	}

	// Seed transport for first 3 products
	var mtID string
	if err := tx.QueryRow(`SELECT id FROM meios_transporte LIMIT 1`).Scan(&mtID); err == nil {
		var condID string
		_ = tx.QueryRow(`SELECT id FROM condutores LIMIT 1`).Scan(&condID)

		transportNames := []string{"EcoPhone X12", "GreenMobile Pro", "EcoBook Air"}
		for _, name := range transportNames {
			pid, ok := prodIDs[name]
			if !ok {
				continue
			}
			etapas := mustJSON([]map[string]any{
				{"descricao": "Recolha em armazém", "data": time.Now().AddDate(0, -1, 0).Format(time.RFC3339)},
				{"descricao": "Entrega no destino", "data": time.Now().AddDate(0, 0, -7).Format(time.RFC3339)},
			})
			if _, err := tx.Exec(
				`INSERT INTO transportes(id,produto_id,meio_transporte_id,condutor_id,origem,destino,etapas,emissoes_co2,estado) VALUES(?,?,?,?,?,?,?,?,?)`,
				uuid.NewString(), pid, mtID, condID, localPorto, localLisboa, etapas, 1.2, "concluido",
			); err != nil {
				return err
			}
		}
	}

	return tx.Commit()
}
