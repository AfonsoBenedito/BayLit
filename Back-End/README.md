<div align="center">

<img src="../Front-End/projeto-baylit/src/BaylitConsumidor/Images/logo_baylit_black.svg" alt="BayLit Logo" width="100"/>

# BayLit — Back-End

**Node.js · Express · MongoDB · Mongoose**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Jest](https://img.shields.io/badge/Testing-Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)

</div>

---

## Overview

This is the REST API server for BayLit. It runs on **Node.js + Express** and follows a clean **three-layer architecture** — API routes, business logic handlers, and a data gateway layer that abstracts all MongoDB access.

The server listens on port **8080** and exposes a JSON API consumed by the React frontend.

---

## Architecture

```
Back-End/
├── api/
│   ├── routes/                  # Express route definitions (one file per domain)
│   ├── api_auth.js              # JWT token generation & validation middleware
│   └── index.js                 # App entry point — Express setup, middleware, route mounting
├── handlers/                    # Business logic layer
│   ├── BackgroundJobs/          # Scheduled jobs (order cancellation, discount expiry, etc.)
│   └── MailGenerator/           # Transactional email templates
├── gateway/                     # Data access layer — one gateway per Mongoose model
├── models/                      # Mongoose schema definitions
├── db/                          # Database initialization scripts
├── classes/                     # Shared utility classes
└── utils.js                     # Shared helper functions
```

### Three Layers

| Layer | Location | Responsibility |
|---|---|---|
| **API Layer** | `api/routes/` | Receives HTTP requests, validates input, calls handlers, returns responses |
| **Logic Layer** | `handlers/` | Business rules, data processing, orchestration between gateways |
| **Data Layer** | `gateway/` + `models/` | All MongoDB queries abstracted behind a gateway per entity |

---

## API Routes

| Route File | Base Path | Responsibility |
|---|---|---|
| `auth.js` | `/auth` | Registration, login, JWT issuance, email verification |
| `consumidor.js` | `/utilizador` | Consumer profile read & update |
| `fornecedor.js` | `/utilizador` | Supplier account management |
| `transportador.js` | `/utilizador` | Transporter account management |
| `utilizador.js` | `/utilizador` | General user operations with role-based access control |
| `produto.js` | `/produto` | Product CRUD, search by category / supplier / subcategory, image upload |
| `cadeia.js` | `/produto` | Supply chain tracking — storage and transport legs |
| `compra.js` | `/utilizador` | Shopping cart — get, add, remove, update items |
| `checkout.js` | `/utilizador` | Stripe session creation and payment confirmation |
| `pagamento.js` | `/utilizador` | Payment record management |

Full API specification: **[SwaggerHub Docs →](https://app.swaggerhub.com/apis-docs/tiaguu/bay-lit_api/2.0.0#/)**

---

## Authentication

Authentication uses **JWT Bearer tokens** with a 120-minute expiration.

| Function | Description |
|---|---|
| `signUser()` | Issues a token for a regular user |
| `signAdmin()` | Issues a token for an admin user |
| `validateToken()` | Verifies token authenticity |
| `verifyToken()` | Express middleware — protects routes |

Tokens are sent in the `Authorization: Bearer <token>` header.

---

## Data Models

The database has **52 Mongoose schemas** organized into these domains:

<details>
<summary>👤 Users</summary>

| Model | Description |
|---|---|
| `Utilizador` | Base user record — tracks type and frozen status |
| `Consumidor` | Consumer/buyer profile |
| `Fornecedor` | Supplier/vendor profile |
| `Transportador` | Logistics provider profile |
| `Administrador` | Admin user |
| `*PorConfirmar` | Pending registration records (awaiting email confirmation) |
| `*Historico` | Historical snapshots of user profiles |

</details>

<details>
<summary>🛒 E-Commerce</summary>

| Model | Description |
|---|---|
| `Produto` | Product listing — name, supplier, category, photos, sustainability metrics |
| `ProdutoEspecifico` | Product variant / SKU |
| `Encomenda` | Order — buyer, value breakdown, delivery address, status, items |
| `Carrinho` | Shopping cart — user ID + product list with quantities |
| `Venda` | Sale transaction record |
| `Item` | Individual stock unit in a warehouse |
| `Review` | Product review and rating |
| `Desconto` | Discount / promo code |
| `Promocao` | Promotional campaign |

</details>

<details>
<summary>🌍 Sustainability & Supply Chain</summary>

| Model | Description |
|---|---|
| `Producao` | Production phase data |
| `Poluicao` | Pollution tracking per product/stage |
| `Recurso` | Resource consumption |
| `Transporte` | Shipment — transporter, driver, vehicle, route, emissions, status |
| `Etapa` | Transport milestone / stage |
| `Armazem` | Warehouse — supplier, staff, inventory, daily operating cost |
| `Armazenamento` | Storage operation tracking |
| `MeioTransporte` | Transport vehicle type |
| `Condutor` | Driver profile |

</details>

<details>
<summary>💳 Payments & Messaging</summary>

| Model | Description |
|---|---|
| `Pagamento` | Payment record |
| `Pago` | Payment confirmation |
| `MetodoPagamento` | Payment method (card, PayPal, etc.) |
| `Cartao` | Credit card details |
| `Mensagem` | User-to-user message |
| `Notificacao` | System notification |

</details>

---

## Background Jobs

Long-running tasks are handled by scheduled jobs in `handlers/BackgroundJobs/`:

| Job | Description |
|---|---|
| `CancelEncomendasNaoConfirmadas.js` | Auto-cancel orders that were never confirmed |
| `CheckValidade.js` | Check product and listing validity / expiration |
| `EndDescontos.js` | Expire promotional discount codes |
| `GenerateNewTransports.js` | Trigger generation of new transport routes |
| `UpdateArmazenamentos.js` | Sync storage records |

---

## Email Notifications

Transactional emails are generated from templates in `handlers/MailGenerator/`:

| Template | Trigger |
|---|---|
| `verification.js` | User email verification on registration |
| `encomenda.js` | Order placed / confirmation |
| `transporte.js` | Shipment dispatched / status update |
| `venda.js` | Sale notification to supplier |
| `default.js` | Generic notifications |

> In the Docker development setup, emails are printed to the console instead of being sent.

---

## Getting Started

### With Docker (Recommended)

From the project root:

```bash
docker-compose up -d
```

The backend will be available at **http://localhost:8080**.

### Manually

```bash
# Install dependencies
npm install

# Start the server
npm start
```

> Requires a running MongoDB instance. Set the `MONGODB_URI` environment variable accordingly.

### Environment Variables

| Variable | Description | Default (Docker) |
|---|---|---|
| `MONGODB_URI` | MongoDB connection string | `mongodb://admin:admin123@mongodb:27017/Baylit?authSource=admin` |
| `TOKEN_SECRET` | JWT signing secret | `baylit-docker-secret-key-change-in-production` |
| `NODE_ENV` | Environment (`production` / `development`) | `production` |

---

## Testing

```bash
npm test
```

Tests are written with **Jest** and run sequentially (`--runInBand`) since they interact with the database. Test timeout is set to **30 seconds** per test.

---

## Key Dependencies

| Package | Purpose |
|---|---|
| `express` | HTTP server and routing |
| `mongoose` | MongoDB ODM |
| `bcrypt` | Password hashing |
| `jsonwebtoken` | JWT generation and verification |
| `multer` | Multipart file uploads |
| `nodemailer` | Email sending |
| `stripe` | Payment processing |
| `helmet` | HTTP security headers |
| `morgan` | HTTP request logging |
| `cors` | Cross-origin resource sharing |
| `jest` | Test runner |
