<div align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Express-5-black?logo=express" alt="Express 5" />
  <img src="https://img.shields.io/badge/Prisma-7-green?logo=prisma" alt="Prisma 7" />
  <img src="https://img.shields.io/badge/SQLite-22A5DC?logo=sqlite" alt="SQLite" />
  <img src="https://img.shields.io/badge/TypeScript-5-strict?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss" alt="Tailwind v4" />
  <img src="https://img.shields.io/badge/license-MIT-yellow" alt="License" />
</div>

<br />

<div align="center">
  <h1>📦 OmniStock — Inventory Management System</h1>
  <p align="center">
    <strong>A full‑stack inventory management platform with POS, purchasing, reporting, and real‑time stock tracking.</strong>
    <br />
    Built with React 19, Express 5, Prisma 7, SQLite, and a dark glassmorphic Kinetic Enterprise UI.
  </p>
</div>

<br />

<p align="center">
  <img src="screenshots/Screenshot (25).png" alt="Login Page" width="800" style="border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);" />
</p>

---

## ✨ Features

<table>
  <tr>
    <td width="50%">
      <h3>📊 Dashboard</h3>
      <ul>
        <li>Key metrics — total products, stock levels, out‑of‑stock, low stock</li>
        <li>Revenue trend chart (6‑month area chart)</li>
        <li>Recent sales with relative timestamps</li>
        <li>Low‑stock alerts with progress bars</li>
        <li>Top‑selling products ranked by units sold</li>
        <li>Quick‑action grid for common tasks</li>
      </ul>
    </td>
    <td width="50%">
      <img src="screenshots/Screenshot (17).png" alt="Dashboard" width="100%" />
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🛍️ Products</h3>
      <ul>
        <li>Full CRUD with search, category &amp; stock‑status filters</li>
        <li>Inline stock bar and status badges</li>
        <li>Detail page with tabbed Info / Purchases / Stock Movements</li>
        <li>Duplicate SKU validation</li>
      </ul>
    </td>
    <td width="50%">
      <img src="screenshots/Screenshot (19).png" alt="Products Page" width="100%" />
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>💳 Sales / POS</h3>
      <ul>
        <li>Cart with add / remove / quantity controls</li>
        <li>Payment method selection (cash, card, UPI, credit)</li>
        <li>Discount input &amp; 18% auto‑calculated tax</li>
        <li>Invoice modal with itemized breakdown</li>
        <li>Auto‑generated invoice numbers (INV‑YYYY‑NNNN)</li>
      </ul>
    </td>
    <td width="50%">
      <img src="screenshots/Screenshot (21).png" alt="Sales Page" width="100%" />
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🏭 Suppliers</h3>
      <ul>
        <li>Supplier management with search &amp; status filtering</li>
        <li>Contact info, city, and purchase‑count tracking</li>
        <li>Role‑gated actions (admin delete, manager create)</li>
      </ul>
    </td>
    <td width="50%">
      <img src="screenshots/Screenshot (22).png" alt="Suppliers Page" width="100%" />
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📥 Purchases</h3>
      <ul>
        <li>Purchase order creation with dynamic line items</li>
        <li>Auto‑generated PO numbers (PO‑YYYY‑NNNN)</li>
        <li>Status workflow: pending → received → stock update</li>
        <li>Cancellation restores stock</li>
      </ul>
    </td>
    <td width="50%">
      <img src="screenshots/Screenshot (23).png" alt="Reports Page" width="100%" />
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📈 Reports &amp; Analytics</h3>
      <ul>
        <li>Sales, stock, purchase, and profit reports</li>
        <li>Date range selector (7D / 30D / 90D / custom)</li>
        <li>Interactive charts — area, bar, line (Recharts)</li>
        <li>Category‑wise stock breakdown</li>
        <li>Revenue vs. cost comparison</li>
      </ul>
    </td>
    <td width="50%">
      <img src="screenshots/Screenshot (24).png" alt="Settings Page" width="100%" />
    </td>
  </tr>
</table>

---

## 🖥️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript (strict), Tailwind CSS v4, Recharts, React Router v7 |
| **Backend** | Express 5, Prisma 7 ORM, Zod validation, JWT auth (bcryptjs + jsonwebtoken) |
| **Database** | SQLite via `better-sqlite3` (zero‑config, file‑based) |
| **Build** | Vite 8 (frontend), tsx (backend runner) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) ≥ 18
- npm ≥ 9

### 1. Clone & Install

```bash
git clone https://github.com/vijaykumarGK-Developer/OmniStock-Inventory-Management.git
cd omnistock-inventory

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

```bash
cd ../backend
npx prisma migrate dev --name init
npm run seed
```

### 3. Run the application

Open **two terminals**:

```bash
# Terminal 1 — Backend (port 3001)
cd backend
npm run dev
```

```bash
# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

### 4. Login

Open `http://localhost:5173` and sign in with:

| Role    | Email              | Password      |
|---------|--------------------|---------------|
| Admin   | admin@omni.com     | password123   |
| Manager | manager@omni.com   | password123   |
| Staff   | staff@omni.com     | password123   |

---

## 🔐 Access Control

| Role    | Permissions |
|---------|------------|
| **Admin**  | Full access — create, edit, delete all entities; manage users |
| **Manager** | Create & edit (no delete); purchase order workflow |
| **Staff**   | View‑only; can create sales |

Authentication via JWT (7‑day expiry). Secrets are randomly generated at startup via `crypto.randomBytes(32)`.

---

## 📁 Project Structure

```
omnistock-inventory/
├── backend/
│   ├── prisma/          # Schema & migrations
│   ├── src/
│   │   ├── lib/         # Prisma client
│   │   ├── middleware/   # Auth, error handler, validation
│   │   ├── routes/      # API endpoints
│   │   ├── utils/       # JWT, password hashing
│   │   └── validators/  # Zod schemas
│   └── seed.ts          # Demo data seeder
├── frontend/
│   ├── src/
│   │   ├── components/  # UI primitives, layout, feature components
│   │   ├── context/     # Auth & notification providers
│   │   ├── hooks/       # Custom data‑fetching hooks
│   │   ├── pages/       # Route pages (12 total)
│   │   ├── services/    # Axios API clients
│   │   ├── styles/      # Tailwind globals & theme tokens
│   │   └── utils/       # Formatting utilities
│   └── vite.config.ts
├── shared/              # Shared TypeScript types
└── screenshots/         # Application screenshots
```

---

## 🧩 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/login` | User authentication |
| `POST` | `/api/auth/signup` | User registration |
| `GET` | `/api/auth/me` | Current user profile |
| `GET` | `/api/products` | List products (search, filter, paginate) |
| `POST` | `/api/products` | Create product |
| `GET` | `/api/products/:id` | Product detail |
| `PUT` | `/api/products/:id` | Update product |
| `DELETE` | `/api/products/:id` | Delete product |
| `POST` | `/api/sales` | Create sale (atomic stock decrement) |
| `GET` | `/api/sales` | List sales |
| `GET` | `/api/sales/:id` | Sale detail with items |
| `GET` | `/api/suppliers` | List suppliers |
| `POST` | `/api/suppliers` | Create supplier |
| `PUT` | `/api/suppliers/:id` | Update supplier |
| `DELETE` | `/api/suppliers/:id` | Delete supplier |
| `POST` | `/api/purchases` | Create purchase order |
| `GET` | `/api/purchases` | List purchase orders |
| `PUT` | `/api/purchases/:id/status` | Update PO status (atomic stock update) |
| `GET` | `/api/dashboard/stats` | Dashboard statistics |
| `GET` | `/api/dashboard/recent-sales` | Last 5 sales |
| `GET` | `/api/dashboard/low-stock` | Low stock products |
| `GET` | `/api/reports/sales` | Sales report |
| `GET` | `/api/reports/stock` | Stock report |
| `GET` | `/api/reports/purchases` | Purchase report |
| `GET` | `/api/reports/profit` | Profit & loss report |

---

## 🎨 Design System

Kinetic Enterprise dark theme with glassmorphism aesthetics:

- **40+ CSS custom properties** for consistent theming
- **Dark / Light / System** mode support (persisted to localStorage)
- **Material Symbols** icon set
- **Inter** typeface for UI, **JetBrains Mono** for data
- **Recharts** interactive charts with custom dark tooltips
- **Responsive** layout — sidebar collapses on mobile

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <p>
    Built with ❤️ by <a href="https://github.com/vijaykumarGK-Developer">Vijay Kumar G K</a>
  </p>
  <p>
    <a href="https://github.com/vijaykumarGK-Developer/OmniStock-Inventory-Management/issues">Report Bug</a>
    ·
    <a href="https://github.com/vijaykumarGK-Developer/OmniStock-Inventory-Management/issues">Request Feature</a>
  </p>
</div>
