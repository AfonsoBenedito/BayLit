<div align="center">

<img src="./projeto-baylit/src/BaylitConsumidor/Images/logo_baylit_black.svg" alt="BayLit Logo" width="100"/>

# BayLit — Front-End

**React · React Router v6 · Bootstrap 5 · Axios**

[![React](https://img.shields.io/badge/React-17-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![React Router](https://img.shields.io/badge/React_Router-v6-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Axios](https://img.shields.io/badge/Axios-0.27-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)
[![Nginx](https://img.shields.io/badge/Served_by-Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)](https://nginx.org/)

</div>

---

## Overview

The BayLit frontend is a **React 17 single-page application** split into three independent sub-apps routed from a single entry point:

| Sub-App | Path | Audience |
|---|---|---|
| **Consumer App** | `/*` | Shoppers browsing and purchasing products |
| **Dashboard** | `/dashboard/*` | Suppliers and transporters managing their operations |
| **Admin Panel** | `/admin/*` | Platform administrators |

All three share a common set of helper utilities for API communication and are served in production by **Nginx** inside a Docker container.

---

## Project Structure

```
projeto-baylit/
├── public/
│   └── favicon.ico
├── src/
│   ├── App.js                        # Root router — dispatches to the three sub-apps
│   ├── BaylitConsumidor/             # Consumer-facing e-commerce app
│   │   ├── AppConsumidor.js          # Consumer routes
│   │   ├── Pages/                    # Page components
│   │   ├── Components/               # Reusable UI components
│   │   ├── Images/                   # Brand assets and page imagery
│   │   └── Standards/                # CSS variables (colors, typography, spacing)
│   ├── BaylitAdmin/                  # Admin panel
│   │   ├── AppAdmin.js               # Admin routes
│   │   ├── Pages/                    # Admin page components
│   │   └── Components/               # Admin UI components
│   ├── BaylitDashboard/              # Supplier & transporter portal
│   │   ├── AppDashboard.js           # Dashboard routes
│   │   ├── Pages/                    # Dashboard page components
│   │   └── Components/               # Dashboard UI components
│   └── Helpers/                      # Shared API & utility functions
```

---

## Consumer App

The main storefront where shoppers browse, compare, and purchase products — with sustainability metrics front and centre.

### Pages

| Route | Page | Description |
|---|---|---|
| `/` | `Home` | Landing page with featured products and hero banners |
| `/shop` | `Shop` | Browsable product catalogue with filters |
| `/shopallproducts` | `ShopAllProducts` | Full product listing |
| `/shopcategory` | `ShopCategory` | Category-specific product grid |
| `/product/:id` | `ProductPage` | Product detail — specs, eco metrics, reviews |
| `/pesquisa` | `Pesquisa` | Search results |
| `/compare` | `Compare` | Side-by-side product comparison including eco scores |
| `/shoppingcar` | `ShoppingCar` | Cart review and Stripe checkout |
| `/perfil` | `Perfil` | User profile and order history |
| `/signup` | `SignUp` | Account registration |
| `/aboutus` | `AboutUs` | About the BayLit project |
| `/sustentabilidade` | `Sustentabilidade` | BayLit's sustainability mission and methodology |
| `/faq` | `FAQ` | Frequently asked questions |
| `/confirmEmail` | `ConfirmEmail` | Email verification landing page |
| `/Sucess` | `ConfirmPagamento` | Post-checkout payment confirmation |

### Key Components

**Layout**

| Component | Description |
|---|---|
| `Header.js` | Top navigation — logo, search bar, user menu, cart icon |
| `SideMenu.js` | Mobile slide-out navigation |
| `FooterBaylit.js` | Site footer with links and contact |
| `Login.js` | Authentication modal |

**Products & Filtering**

| Component | Description |
|---|---|
| `Product.js` | Product card |
| `SearchBar.js` | Keyword search |
| `FilterButton.js` | Single filter toggle |
| `AllFilterButtons.js` | Filter group |
| `PopUpFilters.js` | Mobile filter overlay |
| `LeafSVG.jsx` | Sustainability leaf rating icon |

---

## Dashboard (Supplier & Transporter Portal)

The operational portal where suppliers manage their product catalogue, warehouses, and staff, and transporters manage drivers, vehicles, and shipments.

### Pages

| Route | Page | Description |
|---|---|---|
| `/dashboard/authentication` | `Authentication` | Dashboard login |
| `/dashboard/` | `Dashboard` | Overview and KPIs |
| `/dashboard/Products/*` | `ProductsPage` | Product listing and management |
| `/dashboard/AddProduct` | `AddProduct` | Create a new product |
| `/dashboard/SpecificProduct/:id` | `SpecificProductPage` | Manage product variants / SKUs |
| `/dashboard/Warehouses` | `Warehouses` | Warehouse list and status |
| `/dashboard/Warehouses/:id` | `WarehouseProducts` | Inventory within a warehouse |
| `/dashboard/Sedes` | `Sedes` | Business headquarters / locations |
| `/dashboard/Employees` | `Employees` | Staff management |
| `/dashboard/Condutores` | `Condutores` | Driver management |
| `/dashboard/Transportes` | `Transportes` | Active and past shipments |
| `/dashboard/Servicos` | `Servicos` | Transport service offerings |
| `/dashboard/Servico/:id` | `ServicoIndividual` | Individual service details |
| `/dashboard/Orders` | `Orders` | Order tracking and fulfillment |
| `/dashboard/Reports` | `Reports` | Analytics and charts (Google Charts) |
| `/dashboard/Messages` | `Messages` | Internal messaging system |
| `/dashboard/Support` | `Support` | Help and support requests |
| `/dashboard/Definitions` | `Definitions` | Account settings and configuration |

### Key Components

| Component | Description |
|---|---|
| `MainNav.js` | Sidebar navigation |
| `MobileNav.js` | Responsive mobile navigation |
| `NotificacaoCard.js` | Notification display card |
| `AddProduct/` | Multi-step product creation form |
| `AddSpecificProduct/` | Product variant form |
| `AddEmployee/` | Staff onboarding form |
| `AddCondutor/` | Driver registration form |
| `AddTransporte/` | Transport route creation |
| `AddWarehouse/` | Warehouse setup form |

---

## Admin Panel

Internal platform for administrators to manage all users and view sustainability metrics across the platform.

### Pages

| Route | Page | Description |
|---|---|---|
| `/admin/consumidores` | `Consumidores` | View and moderate consumer accounts |
| `/admin/fornecedores` | `Fornecedores` | View and moderate supplier accounts |
| `/admin/transportadores` | `Transportadores` | View and moderate transporter accounts |
| `/admin/sustentabilidade` | `Sustentabilidade` | Platform-wide sustainability data |

---

## Shared Helpers

All three sub-apps share a set of API helpers in `src/Helpers/` that abstract communication with the backend:

| Helper | Responsibility |
|---|---|
| `AuthVerification.jsx` | Token validation and session checks |
| `AuthenticationHelper.jsx` | Login, logout, and registration API calls |
| `ProdutoHelper.jsx` | Product search, fetch, and CRUD |
| `CategoryHelper.jsx` | Category and subcategory retrieval |
| `EncomendasHelper.jsx` | Order management API calls |
| `FornecedorHelper.jsx` | Supplier API calls |
| `TransportadorHelper.jsx` | Transporter API calls |
| `UserHelper.jsx` | User profile and account management |
| `SustainabilityHelper.jsx` | Sustainability metrics and calculations |
| `NotificacoesHelper.jsx` | Notification system API calls |

---

## Getting Started

### With Docker (Recommended)

From the project root:

```bash
make run-docker
```

The frontend is embedded in the Go binary and served at **http://localhost:8080** (no separate Nginx container).

### Development Server

```bash
cd projeto-baylit

# Install dependencies
npm install

# Start the development server (hot reload)
npm start
```

The app runs at **http://localhost:3000** and proxies API calls to the backend at `http://localhost:8080`.

### Build for Production

```bash
npm run build
```

Outputs an optimized static bundle to `projeto-baylit/build/`, which Nginx serves in the Docker container.

---

## Key Dependencies

| Package | Purpose |
|---|---|
| `react` + `react-dom` | UI library |
| `react-router-dom` | Client-side routing |
| `axios` | HTTP client for API communication |
| `bootstrap` + `bootstrap-icons` | UI components and icon library |
| `react-google-charts` | Data visualization in the dashboard |
| `react-cookie` | Cookie-based session handling |
