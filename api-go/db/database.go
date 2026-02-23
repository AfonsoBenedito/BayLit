package db

import (
	"database/sql"
	"embed"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"

	_ "modernc.org/sqlite"
)

//go:embed schema.sql
var schemaFS embed.FS

var DB *sql.DB

func Init(dbPath string) error {
	// Ensure parent directory exists
	if dir := parentDir(dbPath); dir != "" && dir != "." {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return fmt.Errorf("create db dir: %w", err)
		}
	}

	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return fmt.Errorf("open db: %w", err)
	}

	// Tune for Cloud Run single-writer workload
	pragmas := []string{
		"PRAGMA journal_mode=WAL",
		"PRAGMA synchronous=NORMAL",
		"PRAGMA cache_size=-16000",
		"PRAGMA foreign_keys=ON",
		"PRAGMA busy_timeout=5000",
	}
	for _, p := range pragmas {
		if _, err := db.Exec(p); err != nil {
			return fmt.Errorf("pragma %q: %w", p, err)
		}
	}

	// Apply schema
	schema, err := schemaFS.ReadFile("schema.sql")
	if err != nil {
		return fmt.Errorf("read schema: %w", err)
	}
	if _, err := db.Exec(string(schema)); err != nil {
		return fmt.Errorf("apply schema: %w", err)
	}

	// Migrations: add columns that may not exist in older DBs (errors ignored if already present)
	db.Exec(`ALTER TABLE consumidores ADD COLUMN favoritos TEXT NOT NULL DEFAULT '[]'`)

	// Replace placeholder product images (SVG, Picsum, or loremflickr) with real static file paths
	migrateProductImages(db)

	// Replace placeholder subcategory images (SVG) with real static file paths
	migrateSubcategoryImages(db)

	// Restore category images to file paths (in case a previous run stored SVG data URIs)
	categoryImages := map[string]string{
		"Crianças":    "/images/categories/criancas.jpg",
		"Roupa":       "/images/categories/roupa.jpg",
		"Eletrónica":  "/images/categories/eletronica.jpg",
		"Casa":        "/images/categories/casa.jpg",
		"Desporto":    "/images/categories/desporto.jpg",
		"Livros":      "/images/categories/livros.jpg",
		"Beleza":      "/images/categories/beleza.jpg",
		"Alimentação": "/images/categories/alimentacao.jpg",
	}
	for nome, path := range categoryImages {
		db.Exec(`UPDATE categorias SET imagem=? WHERE nome=? AND imagem NOT LIKE '/images/%'`, path, nome)
	}

	DB = db
	log.Printf("Database initialized at %s", dbPath)
	return nil
}

// migrateProductImages updates all produto_especificos that still have placeholder
// images (SVG data URIs, Picsum, or loremflickr URLs) to use real static file paths.
func migrateProductImages(db *sql.DB) {
	rows, err := db.Query(`
		SELECT pe.id, pe.produto_id, p.subcategoria
		FROM produto_especificos pe
		JOIN produtos p ON p.id = pe.produto_id
		WHERE pe.imagens LIKE '%data:image/svg%'
		   OR pe.imagens LIKE '%picsum.photos%'
		   OR pe.imagens LIKE '%loremflickr%'
	`)
	if err != nil {
		return
	}
	defer rows.Close()

	type row struct{ id, produtoID, subcategoria string }
	var toUpdate []row
	for rows.Next() {
		var r row
		if err := rows.Scan(&r.id, &r.produtoID, &r.subcategoria); err == nil {
			toUpdate = append(toUpdate, r)
		}
	}
	rows.Close()

	for _, r := range toUpdate {
		imgURL := productImageURL(r.subcategoria, r.produtoID)
		imgJSON := `["` + imgURL + `"]`
		db.Exec(`UPDATE produto_especificos SET imagens=? WHERE id=?`, imgJSON, r.id)
	}
}

// migrateSubcategoryImages updates subcategory imagem fields stored in the
// categorias.subcategorias JSON column, replacing SVG placeholders with real paths.
func migrateSubcategoryImages(db *sql.DB) {
	rows, err := db.Query(`
		SELECT id, subcategorias FROM categorias
		WHERE subcategorias LIKE '%data:image/svg%'
		   OR subcategorias LIKE '%loremflickr%'
	`)
	if err != nil {
		return
	}
	defer rows.Close()

	type subItem struct {
		ID        string          `json:"id"`
		Nome      string          `json:"nome"`
		Imagem    string          `json:"imagem"`
		Atributos json.RawMessage `json:"atributos"`
	}

	type update struct {
		id   string
		subs string
	}
	var updates []update

	for rows.Next() {
		var id, subsJSON string
		if err := rows.Scan(&id, &subsJSON); err != nil {
			continue
		}
		var subs []subItem
		if err := json.Unmarshal([]byte(subsJSON), &subs); err != nil {
			continue
		}
		changed := false
		for i, sub := range subs {
			if strings.Contains(sub.Imagem, "data:image/svg") || strings.Contains(sub.Imagem, "loremflickr") {
				if path, ok := subcategoryImages[sub.Nome]; ok {
					subs[i].Imagem = path
					changed = true
				}
			}
		}
		if changed {
			if newJSON, err := json.Marshal(subs); err == nil {
				updates = append(updates, update{id, string(newJSON)})
			}
		}
	}
	rows.Close()

	for _, u := range updates {
		db.Exec(`UPDATE categorias SET subcategorias=? WHERE id=?`, u.subs, u.id)
	}
}

func parentDir(path string) string {
	for i := len(path) - 1; i >= 0; i-- {
		if path[i] == '/' || path[i] == '\\' {
			return path[:i]
		}
	}
	return ""
}
