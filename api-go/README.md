<div align="center">

<img src="../Front-End/projeto-baylit/src/BaylitConsumidor/Images/logo_baylit_black.svg" alt="BayLit Logo" width="100"/>

# BayLit — API (Go)

**Go · Gin · SQLite · Cloud Run**

[![Go](https://img.shields.io/badge/Go-1.24-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev/)
[![Gin](https://img.shields.io/badge/Gin-HTTP%20Framework-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://gin-gonic.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Cloud Run](https://img.shields.io/badge/Cloud%20Run-Deployed-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)](https://cloud.google.com/run)

</div>

---

## Overview

This is the Go backend for the `for-cloud-run` branch. It replaces the original Node.js + MongoDB + Nginx triple-container setup with a **single binary** that serves the full REST API, the React SPA, and all static assets from one process.

| | Node.js stack (`main`) | Go stack (this branch) |
|:---:|:---:|:---:|
| Containers | 3 | **1** |
| Image size | ~300 MB | **~25 MB** |
| Cold start | ~5–10 s | **~100 ms** |
| Memory | 512 MB+ | **256 MB** |
| Database | MongoDB (external) | SQLite (embedded) |
| DB init | Manual script | **Automatic at boot** |

---

## Architecture

```
api-go/
├── main.go              # Gin setup, route registration, go:embed, startup
├── go.mod / go.sum
├── db/
│   ├── database.go      # SQLite init, WAL/PRAGMA setup, migrations
│   ├── schema.sql       # CREATE TABLE statements
│   └── seed.go          # Mock data — seeded automatically on first boot
├── handlers/            # Route handlers (one file per domain)
│   ├── auth.go          # Register + login, JWT issuance
│   ├── produto_compat.go
│   ├── categoria_compat.go
│   ├── consumidor.go
│   ├── fornecedor.go
│   ├── transportador.go
│   ├── carrinho_compat.go
│   ├── favoritos.go
│   └── admin.go
├── middleware/
│   ├── auth.go          # JWT Bearer token validation
│   └── cors.go          # CORS headers
├── models/              # Go structs mirroring the SQL schema
└── static/              # Embedded React build + images (go:embed)
    ├── index.html
    └── images/
```

### Database

SQLite runs embedded in the same process with these PRAGMA settings for performance:

```sql
PRAGMA journal_mode = WAL;     -- concurrent reads + single writer
PRAGMA synchronous  = NORMAL;  -- safe and fast
PRAGMA cache_size   = -16000;  -- 16 MB page cache
PRAGMA foreign_keys = ON;
```

### Seed data (auto-inserted at first boot)

| Data | Count |
|---|---|
| Categories | 8 with subcategories and attributes |
| Products | 50+ across all categories |
| Test users | 4 (admin, 2 suppliers, 1 transporter) |

---

## API Routes

```
GET  /health

# Public
GET  /api/produto
GET  /api/produto/:id
GET  /api/produto/pesquisa
GET  /api/categoria
GET  /api/categoria/:id
GET  /api/subcategoria/:id
GET  /api/atributo/:id

# Auth
POST /api/auth/register/consumidor
POST /api/auth/register/fornecedor
POST /api/auth/register/transportador
POST /api/auth/login

# Consumidor (JWT required)
GET  /api/utilizador/consumidor
PUT  /api/utilizador/consumidor
GET  /api/utilizador/consumidor/encomendas
POST /api/utilizador/consumidor/local
DELETE /api/utilizador/consumidor/local/:id
GET  /api/utilizador/carrinho
POST /api/utilizador/carrinho/add
DELETE /api/utilizador/carrinho/:item_id
POST /api/utilizador/favoritos/produto
DELETE /api/utilizador/favoritos/produto
GET  /api/utilizador/favoritos/produto
POST /api/utilizador/checkout
POST /api/utilizador/checkout/confirm

# Fornecedor (JWT required)
GET  /api/utilizador/fornecedor
PUT  /api/utilizador/fornecedor
GET  /api/utilizador/fornecedor/produtos
POST /api/utilizador/fornecedor/produto
GET  /api/utilizador/fornecedor/vendas
POST /api/utilizador/fornecedor/armazem
GET  /api/utilizador/fornecedor/analytics

# Supply chain (JWT required)
GET  /api/produto/:id/cadeia
POST /api/produto/:id/producao
POST /api/produto/:id/transporte
POST /api/produto/:id/armazenamento

# Transportador (JWT required)
GET  /api/utilizador/transportador
POST /api/utilizador/transportador/condutor
POST /api/utilizador/transportador/meio_transporte

# Admin (JWT required)
GET  /api/utilizador/admin/consumidores
GET  /api/utilizador/admin/fornecedores
GET  /api/utilizador/admin/transportadores
PUT  /api/utilizador/admin/utilizador/:id/estado
GET  /api/utilizador/admin/sustentabilidade
GET  /api/utilizador/admin/analytics

# React SPA (catch-all)
GET  /*  →  embedded index.html
```

---

## Running Locally

### With Docker (Recommended)

From the project root:

```bash
make run-docker        # docker compose up --build -d

open http://localhost:8080
```

The database is seeded on first boot — no manual init step needed.

### Without Docker (Go directly)

```bash
# Build the React frontend first
cd Front-End/projeto-baylit
npm ci
REACT_APP_API_URL=/api npm run build
cp -r build/ ../../api-go/static/

# Run the Go server
cd ../../api-go
DATABASE_PATH=./baylit.db TOKEN_SECRET=dev-secret go run .
```

Or use the Makefile shortcut:

```bash
make run-go
```

### Endpoints

| URL | Description |
|---|---|
| http://localhost:8080 | React SPA |
| http://localhost:8080/api | REST API |
| http://localhost:8080/health | Health check → `{"status":"ok"}` |

### Test Accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@baylit.com` | `badPwd2.` |
| Fornecedor | `ecotech@baylit.com` | `Fornecedor1!` |
| Fornecedor | `verdenatura@baylit.com` | `Fornecedor2!` |
| Transportador | `velocidade@baylit.com` | `Transport1!` |

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8080` | HTTP listen port |
| `DATABASE_PATH` | `/tmp/baylit.db` | SQLite file path |
| `TOKEN_SECRET` | `local-dev-secret-change-in-prod` | JWT signing secret |
| `GIN_MODE` | `release` | Gin mode (`debug` / `release`) |

---

## Key Dependencies

| Package | Purpose |
|---|---|
| `github.com/gin-gonic/gin` | HTTP framework |
| `github.com/gin-contrib/cors` | CORS middleware |
| `modernc.org/sqlite` | Pure-Go SQLite — no CGO, fully static binary |
| `github.com/golang-jwt/jwt/v5` | JWT generation and validation |
| `golang.org/x/crypto` | bcrypt password hashing |
| `github.com/google/uuid` | UUID generation |

---

## Cloud Run Deployment

Pushing to the `for-cloud-run` branch triggers automatic deployment via GitHub Actions:

```
push → for-cloud-run
         │
         ├── lint-go        (go vet + CGO_ENABLED=0 go build)
         ├── lint-frontend  (eslint + npm run build)
         │
         └── deploy         (docker build → Artifact Registry → gcloud run deploy)
```

### GCP Setup (one-time)

```bash
# Enable APIs
gcloud services enable run.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com

# Create Artifact Registry repo
gcloud artifacts repositories create baylit \
  --repository-format=docker --location=europe-southwest1

# Create JWT secret
echo -n "$(openssl rand -base64 32)" | gcloud secrets create baylit-token-secret --data-file=-

# Create and configure service account
PROJECT_ID=$(gcloud config get-value project)
gcloud iam service-accounts create baylit-deploy \
  --display-name="BayLit GitHub Actions Deployer"

SA="baylit-deploy@${PROJECT_ID}.iam.gserviceaccount.com"
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:${SA}" --role="roles/run.admin"
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:${SA}" --role="roles/artifactregistry.writer"
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:${SA}" --role="roles/secretmanager.secretAccessor"
gcloud iam service-accounts add-iam-policy-binding $SA --member="serviceAccount:${SA}" --role="roles/iam.serviceAccountUser"

# Export JSON key
gcloud iam service-accounts keys create baylit-sa-key.json --iam-account=$SA
```

### GitHub Secrets

Add these two secrets in **Settings → Secrets and variables → Actions**:

| Secret | Value |
|---|---|
| `GCP_PROJECT_ID` | Your GCP project ID |
| `GCP_SA_KEY` | Full contents of `baylit-sa-key.json` |

### Verify Deployment

```bash
SERVICE_URL=$(gcloud run services describe baylit --region=europe-southwest1 --format="value(status.url)")

curl "${SERVICE_URL}/health"
curl "${SERVICE_URL}/api/categoria"
curl -X POST "${SERVICE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@baylit.com","password":"badPwd2."}'
```

### Cloud Run Service Settings

| Setting | Value |
|---|---|
| Region | `europe-southwest1` |
| Memory | `256Mi` |
| CPU | `1` |
| Min instances | `0` (scale to zero) |
| Max instances | `10` |
| Concurrency | `100` |
| Timeout | `30s` |

### Ephemeral Database

Cloud Run containers are stateless. On each cold start, if the SQLite file doesn't exist, seed data is recreated automatically. **User registrations and orders are lost on container restart** — this is intentional for this demo deployment.

For persistent data, mount a Cloud Filestore NFS volume or migrate to Cloud SQL.
