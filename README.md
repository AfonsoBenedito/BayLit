<div align="center">

<img src="./Front-End/projeto-baylit/src/BaylitConsumidor/Images/logo_baylit_black.svg" alt="BayLit Logo" width="160"/>

# BayLit

### The Green E-Commerce Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e.svg?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-17-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

[About](#-about) &nbsp;·&nbsp; [Goals](#-goals) &nbsp;·&nbsp; [Features](#-features) &nbsp;·&nbsp; [Tech Stack](#-tech-stack) &nbsp;·&nbsp; [Getting Started](#-getting-started) &nbsp;·&nbsp; [Architecture](#-architecture) &nbsp;·&nbsp; [API Docs](#-api-documentation) &nbsp;·&nbsp; [Team](#-team) &nbsp;·&nbsp; [Contributing](#-contributing)

</div>

---

## 🌱 About

**BayLit** is an eco-conscious e-commerce platform that empowers consumers to make environmentally informed purchasing decisions. Think Amazon or eBay — but with a green twist.

Every product listing on BayLit includes detailed sustainability data covering **production resources**, **transportation emissions**, and **storage costs**. Shoppers get the full picture before they buy, and businesses are incentivised to clean up their supply chains.

> *"Shop smarter. Shop greener."*

---

## 🎯 Goals

BayLit was built around three core principles:

| | Goal | Description |
|:---:|---|---|
| 🔍 | **Transparency** | Surface the real environmental cost of every product — resources consumed, pollution generated during production, transport, and storage |
| 💡 | **Empowerment** | Give consumers the data they need to make the most ecologically sound choice at the moment of purchase |
| 📈 | **Incentive** | Drive businesses to reduce their emissions by making sustainability a direct competitive advantage on the platform |

---

## ✨ Features

- 🛒 &nbsp;**Full e-commerce experience** — Browse, search, filter, and purchase products across multiple categories
- 🌍 &nbsp;**Sustainability scores** — Each product displays its environmental footprint in clear, digestible metrics
- ⚖️ &nbsp;**Side-by-side comparison** — Compare products including their eco metrics before deciding
- 👤 &nbsp;**User accounts** — Full profile management with order history and saved favourites
- 🔒 &nbsp;**Secure authentication** — JWT-based auth with bcrypt password hashing
- 💳 &nbsp;**Integrated payments** — Stripe-powered checkout flow
- 📊 &nbsp;**Admin dashboard** — Data visualisations and platform analytics via Google Charts
- 🌱 &nbsp;**Supply chain tracking** — Full production → storage → transport data per product
- 🐳 &nbsp;**Docker ready** — Fully containerised setup, up and running in two commands

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 17 · React Router v6 · Bootstrap 5 · Bootstrap Icons · Axios |
| **Backend** | Node.js · Express 4 · JWT · Bcrypt · Multer · Nodemailer |
| **Database** | MongoDB 6 · Mongoose ODM |
| **Payments** | Stripe |
| **DevOps** | Docker · Docker Compose · Nginx |
| **Testing** | Jest |
| **API Spec** | OpenAPI / Swagger |

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/)

### Quick Start

```bash
# 1. Clone the repository
git clone <repository-url>
cd BayLit

# 2. Start all services — MongoDB, Backend API, and Frontend
make run-docker

# 3. Seed the database (categories, products, admin user)
docker compose exec backend node db/init-all.js
```

Once running, access the application at:

| Service | URL |
|---|---|
| 🖥️ Frontend | http://localhost:3000 |
| ⚙️ Backend API | http://localhost:8080 |
| 🗄️ MongoDB | `localhost:27017` |

### Default Credentials

| Account | Username / Email | Password |
|---|---|---|
| MongoDB | `admin` | `admin123` |
| Admin user | `admin` | `admin123` |

> ⚠️ Change all default credentials before any production deployment.

### Makefile commands

| Command | Description |
|---|---|
| `make run-docker` | Build and start all containers |
| `make stop-docker` | Stop and remove all containers |
| `make run-backend` | Start the Node.js backend locally |
| `make run-frontend` | Start the React dev server locally |
| `make lint` | Run ESLint on the frontend |
| `make build-check` | Verify the React production build succeeds |

### Other useful commands

```bash
# View live logs from all services
docker compose logs -f

# Rebuild containers after code changes
docker compose up --build -d

# Reset everything, including the database
docker compose down -v
```

<details>
<summary>Manual database initialisation (step by step)</summary>

If products don't appear after startup, you can initialise each layer separately:

```bash
# Admin user
docker compose exec backend node db/init-db.js

# Categories, subcategories, and attributes
docker compose exec backend node db/init-categories.js

# Mock products
docker compose exec backend node db/init-products.js
```

> After `docker compose down -v`, the database is wiped. Re-run `init-all.js` to repopulate.

</details>

> For backend setup, API reference, and Docker details see [Back-End/README.md](Back-End/README.md).

---

## 🏗 Architecture

BayLit follows a clean **three-layer architecture** on the backend, fully decoupled from the React frontend via a RESTful API.

### Backend Layers

| Layer | Location | Description |
|---|---|---|
| **API Layer** | `Back-End/api/` | Express routes, request validation, and OpenAPI specification |
| **Logic Layer** | `Back-End/handlers/` | Business logic distributed across feature-specific handlers |
| **Data Layer** | `Back-End/gateway/` + `models/` | Mongoose models and gateways that abstract all database access |

### Repository Structure

```
BayLit/
├── Front-End/
│   └── projeto-baylit/
│       ├── src/
│       │   ├── BaylitConsumidor/    # Consumer-facing pages & components
│       │   ├── BaylitAdmin/         # Admin dashboard
│       │   └── BaylitDashboard/     # Supplier analytics dashboard
│       └── public/
│           └── favicon.ico
├── Back-End/
│   ├── api/                         # Express routes & OpenAPI spec
│   ├── handlers/                    # Business logic layer
│   ├── gateway/                     # Data access abstraction
│   ├── models/                      # Mongoose schemas
│   └── db/                          # Database initialisation scripts
├── docker-compose.yml
├── Makefile
└── Scripts/
```

---

## 📖 API Documentation

The full REST API specification is available on SwaggerHub:

**[📋 View API Documentation →](https://app.swaggerhub.com/apis-docs/tiaguu/bay-lit_api/2.0.0#/)**

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

## 🤝 Contributing

Contributions are welcome! To get involved:

1. Browse the [open issues](../../issues) and pick one to work on
2. Fork the repository and create your feature branch
3. Implement your fix or feature
4. Open a **Pull Request** — the team will review and deliberate on whether to merge it

---

## 📄 License

This project is licensed under the **MIT License** — see the [`LICENSE`](LICENSE) file for details.

---

<div align="center">

Built with 💚 for a greener planet &nbsp;·&nbsp; [Faculdade de Ciências da Universidade de Lisboa](https://ciencias.ulisboa.pt/)

</div>
