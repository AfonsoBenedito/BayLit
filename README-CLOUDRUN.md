# BayLit — Cloud Run Deployment Guide

This branch (`for-cloud-run`) replaces the original MERN stack (MongoDB + Node.js + React) with a single-container deployment optimised for Google Cloud Run:

| | Before | After |
|---|---|---|
| Backend | Node.js + Express | Go + Gin |
| Database | MongoDB (external) | SQLite (embedded) |
| Frontend | Separate React container | Embedded in Go binary |
| Cold start | ~5–10s | ~100ms |
| Container count | 3 | 1 |
| Memory | 512MB+ | 256MB |
| Image size | ~300MB | ~25MB |

---

## Local Development

### Prerequisites
- Docker + Docker Compose
- Go 1.22+ (for local dev without Docker)
- Node.js 20+ (for React development)

### Run with Docker Compose

```bash
# Build and start (first run seeds the DB automatically)
docker compose up --build

# Access the app
open http://localhost:8080          # React SPA
curl http://localhost:8080/health   # → {"status":"ok"}
curl http://localhost:8080/api/categoria
```

### Test accounts (seeded at boot)

| Role | Email | Password |
|---|---|---|
| Admin | admin@baylit.com | badPwd2. |
| Fornecedor | ecotech@baylit.com | Fornecedor1! |
| Fornecedor | verdenatura@baylit.com | Fornecedor2! |
| Transportador | velocidade@baylit.com | Transport1! |

### Run Go backend locally (no Docker)

```bash
cd api-go
# Build React first
cd ../Front-End/projeto-baylit && npm ci && npm run build
cp -r build/ ../api-go/static/

# Run
cd ../api-go
DATABASE_PATH=/tmp/baylit.db TOKEN_SECRET=dev-secret go run .
```

---

## Google Cloud Run Deployment

### 1. GCP Prerequisites

```bash
# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com

# Create Artifact Registry repository
gcloud artifacts repositories create baylit \
  --repository-format=docker \
  --location=europe-west1 \
  --description="BayLit container images"

# Create Secret Manager secret for JWT key
echo -n "$(openssl rand -base64 32)" | \
  gcloud secrets create baylit-token-secret --data-file=-
```

### 2. Workload Identity Federation (recommended over JSON keys)

```bash
PROJECT_ID=$(gcloud config get-value project)
PROJECT_NUM=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")

# Create service account
gcloud iam service-accounts create baylit-deploy \
  --display-name="BayLit GitHub Actions Deployer"

SA="baylit-deploy@${PROJECT_ID}.iam.gserviceaccount.com"

# Grant permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA}" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA}" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA}" \
  --role="roles/secretmanager.secretAccessor"

gcloud iam service-accounts add-iam-policy-binding $SA \
  --member="serviceAccount:${SA}" \
  --role="roles/iam.serviceAccountUser"

# Create Workload Identity Pool
gcloud iam workload-identity-pools create github-pool \
  --location="global" \
  --display-name="GitHub Actions Pool"

gcloud iam workload-identity-pools providers create-oidc github-provider \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --display-name="GitHub Actions Provider" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --attribute-condition="assertion.repository=='YOUR_GITHUB_ORG/BayLit'"

POOL_ID=$(gcloud iam workload-identity-pools describe github-pool \
  --location=global --format="value(name)")

gcloud iam service-accounts add-iam-policy-binding $SA \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/${POOL_ID}/attribute.repository/YOUR_GITHUB_ORG/BayLit"
```

### 3. GitHub Secrets

Add these secrets to your GitHub repository:

| Secret | Value |
|---|---|
| `GCP_PROJECT_ID` | Your GCP project ID |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | `projects/PROJECT_NUM/locations/global/workloadIdentityPools/github-pool/providers/github-provider` |
| `GCP_SERVICE_ACCOUNT` | `baylit-deploy@PROJECT_ID.iam.gserviceaccount.com` |

### 4. Deploy

Push to the `for-cloud-run` branch — GitHub Actions deploys automatically:

```bash
git push origin for-cloud-run
```

Or trigger manually from the Actions tab.

### 5. Verify deployment

```bash
SERVICE_URL=$(gcloud run services describe baylit --region=europe-west1 --format="value(status.url)")

curl "${SERVICE_URL}/health"
curl "${SERVICE_URL}/api/categoria"
curl -X POST "${SERVICE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@baylit.com","password":"badPwd2."}'
```

---

## Architecture Notes

### Ephemeral Database
Cloud Run containers are stateless. On each cold start, if `/tmp/baylit.db` doesn't exist, the seed data is automatically re-created (categories, products, mock users). **User registrations and orders are lost on container restart** — this is intentional for this demo setup.

For persistent data, mount a Cloud Filestore NFS volume or switch to Cloud SQL.

### Image Size
```
Stage 1 (node:20-alpine)     → React build artifacts
Stage 2 (golang:1.22-alpine) → Go binary with embedded static files
Stage 3 (alpine:3.19)        → Final ~25MB image (binary + ca-certs + tzdata)
```

### Cold Start
```
Go binary init:    ~10ms
SQLite open:       ~20ms
Seed check:        ~30ms
HTTP server ready: ~100ms total
```

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8080` | HTTP listen port |
| `DATABASE_PATH` | `/tmp/baylit.db` | SQLite file path |
| `TOKEN_SECRET` | `local-dev-secret-...` | JWT signing secret |
| `GIN_MODE` | `release` | Gin mode (`debug`/`release`) |
