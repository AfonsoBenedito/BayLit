<div align="center">

<img src="./Front-End/projeto-baylit/src/BaylitConsumidor/Images/logo_baylit_black.svg" alt="BayLit Logo" width="160"/>

# BayLit

### The Green E-Commerce Platform &nbsp;·&nbsp; Cloud Run Edition

[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e.svg?style=for-the-badge)](LICENSE)
[![Go](https://img.shields.io/badge/Go-1.24-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev/)
[![React](https://img.shields.io/badge/React-17-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Cloud Run](https://img.shields.io/badge/Cloud%20Run-Deployed-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)](https://cloud.google.com/run)
[![Docker](https://img.shields.io/badge/Docker-~25MB%20image-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

> **Branch:** `for-cloud-run` &nbsp;·&nbsp; Single-container deployment for Google Cloud Run

[About](#-about) &nbsp;·&nbsp; [What Changed](#-what-changed) &nbsp;·&nbsp; [Features](#-features) &nbsp;·&nbsp; [Tech Stack](#-tech-stack) &nbsp;·&nbsp; [Getting Started](#-getting-started) &nbsp;·&nbsp; [Architecture](#-architecture) &nbsp;·&nbsp; [Deploy](#-deploy-to-cloud-run) &nbsp;·&nbsp; [Team](#-team)

</div>

---

## 🌱 About

**BayLit** is an eco-conscious e-commerce platform that empowers consumers to make environmentally informed purchasing decisions. Every product listing includes detailed sustainability data — production resources, transportation emissions, and storage costs — so shoppers get the full environmental picture before they buy.

> *"Shop smarter. Shop greener."*

This branch (`for-cloud-run`) reimplements the server stack as a **single Go binary** with an embedded SQLite database and embedded React build, optimised for Google Cloud Run's scale-to-zero model.

---

## ⚡ What Changed

This branch replaces the original 3-container MERN stack with a single, self-contained container:

| | `main` (MERN) | `for-cloud-run` (this branch) |
|:---:|:---:|:---:|
| **Backend** | Node.js + Express | Go 1.24 + Gin |
| **Database** | MongoDB (external) | SQLite (embedded) |
| **Frontend** | Separate container (Nginx) | Embedded in Go binary |
| **Containers** | 3 | **1** |
| **Cold start** | ~5–10 s | **~100 ms** |
| **Image size** | ~300 MB | **~25 MB** |
| **Memory** | 512 MB+ | **256 MB** |
| **DB init** | Manual (`init-all.js`) | **Automatic at boot** |

---

## ✨ Features

- 🛒 &nbsp;**Full e-commerce experience** — Browse, search, filter, and purchase across multiple categories
- 🌍 &nbsp;**Sustainability scores** — Each product displays its full environmental footprint in digestible metrics
- ⚖️ &nbsp;**Side-by-side comparison** — Compare products on eco metrics before deciding
- 👤 &nbsp;**User accounts** — Profile management, order history, and saved favourites
- 🔒 &nbsp;**Secure authentication** — JWT-based auth with bcrypt password hashing
- 💳 &nbsp;**Checkout flow** — Complete order flow with transport selection and payment
- 📊 &nbsp;**Admin & supplier dashboards** — Platform analytics and sustainability reporting
- 🌱 &nbsp;**Supply chain tracking** — Full production → storage → transport data per product
- ⚡ &nbsp;**Instant cold start** — ~100 ms from zero to serving, enabling true scale-to-zero on Cloud Run

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 17 · React Router v6 · Bootstrap 5 · Bootstrap Icons |
| **Backend** | Go 1.24 · Gin · JWT (`golang-jwt/jwt`) · bcrypt · UUID |
| **Database** | SQLite 3 via `modernc.org/sqlite` — pure Go, no CGO required |
| **Serving** | React build + static assets embedded via `go:embed` |
| **DevOps** | Docker · Docker Compose · GitHub Actions · Google Cloud Run · Artifact Registry |

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/)

### Run locally

```bash
# 1. Clone and switch to this branch
git clone <repository-url>
cd BayLit
git checkout for-cloud-run

# 2. Build and start — DB is seeded automatically on first boot
make run-docker

# 3. Open the app
open http://localhost:8080
```

No manual database initialisation required. The container seeds all categories, products, and test accounts on first startup.

### Endpoints

| | URL |
|---|---|
| 🖥️ React SPA | http://localhost:8080 |
| ⚙️ REST API | http://localhost:8080/api |
| ❤️ Health | http://localhost:8080/health |

### Test accounts

| Role | Email | Password |
|---|---|---|
| 👤 Admin | `admin@baylit.com` | `badPwd2.` |
| 🏪 Fornecedor | `ecotech@baylit.com` | `Fornecedor1!` |
| 🏪 Fornecedor | `verdenatura@baylit.com` | `Fornecedor2!` |
| 🚚 Transportador | `velocidade@baylit.com` | `Transport1!` |

### Makefile commands

| Command | Description |
|---|---|
| `make run-docker` | Build and start the container |
| `make stop-docker` | Stop and remove the container |
| `make run-go` | Run the Go backend locally without Docker |
| `make lint` | Run `go vet` + ESLint |
| `make build-check` | Verify both Go and React builds succeed |

> For local dev, Docker setup, API reference, and Cloud Run deployment see [api-go/README.md](api-go/README.md).

---

## 🏗 Architecture

### Single container

```
Cloud Run Container  (~25 MB image · 256 MB memory · ~100 ms cold start)
├── /baylit              ← Go binary
│   ├── Gin HTTP router  — all API routes + SPA fallback
│   ├── JWT middleware   — Bearer token auth (120 min expiry)
│   └── go:embed static  — React build + images baked into binary
└── /tmp/baylit.db       ← SQLite file (auto-seeded on first boot)
```

### Multi-stage Dockerfile

```
Stage 1 · node:20-alpine      → npm run build   → React /build
Stage 2 · golang:1.24-alpine  → go build        → /baylit binary (CGO_ENABLED=0)
Stage 3 · alpine:3.19         → binary only     → ~25 MB final image
```

### Repository structure

```
BayLit/
├── api-go/                       # Go backend
│   ├── main.go                   # Gin app, routes, startup
│   ├── db/
│   │   ├── database.go           # SQLite init, migrations, PRAGMA
│   │   ├── schema.sql            # CREATE TABLE statements
│   │   └── seed.go               # Mock data (auto-seeded at boot)
│   ├── handlers/                 # Route handlers per domain
│   ├── middleware/               # JWT + CORS
│   └── static/                  # Embedded React build + images
├── Front-End/
│   └── projeto-baylit/           # React app (unchanged from main)
├── Dockerfile                    # Multi-stage build
├── docker-compose.yml            # Single-service local dev
├── Makefile
└── .github/
    └── workflows/
        ├── ci.yml                # Lint + build checks (PRs)
        └── deploy-cloudrun.yml   # Auto-deploy on push to this branch
```

---

## ☁️ Deploy to Cloud Run

Pushing to this branch triggers the GitHub Actions pipeline automatically:

```
push → for-cloud-run
         │
         ├── lint-go        (go vet + CGO_ENABLED=0 go build)
         ├── lint-frontend  (eslint + npm run build)
         │
         └── deploy         (docker build → Artifact Registry → gcloud run deploy)
```

Full GCP setup instructions, required secrets, and environment variable reference are in **[api-go/README.md](api-go/README.md)**.

---

## 👥 Team

BayLit was developed as a **Bachelor's Final Project** by 6 students from the Information Technologies degree at [Faculdade de Ciências da Universidade de Lisboa](https://ciencias.ulisboa.pt/).

| Name |
|---|
| Afonso Coelho |
| Afonso Silva |
| Gonçalo Cruz |
| Renato Ramires |
| Tiago Teodoro |
| Tomás Ndlate |

---

## 📄 License

This project is licensed under the **MIT License** — see the [`LICENSE`](LICENSE) file for details.

---

<div align="center">

Built with 💚 for a greener planet &nbsp;·&nbsp; [Faculdade de Ciências da Universidade de Lisboa](https://ciencias.ulisboa.pt/)

</div>
