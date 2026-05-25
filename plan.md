# OmniStock — Implementation Plan

## Tool & Model Analysis

### OpenCode Desktop (IDE Agent)
**Capabilities:**
- Full file system read/write/create
- Bash command execution (npm, node, git, etc.)
- File search (glob, grep)
- Web search and fetch
- Multi-file editing in parallel
- Task spawning for parallel work
- Git integration

**Limitations:**
- No browser preview — cannot visually verify UI
- No hot-reload feedback loop — must manually check output
- No direct Figma/design tool integration
- No package manager auto-install (must run npm install manually)

### DeepSeek V4 Flash Free (LLM)
**Capabilities:**
- Strong at React, Node.js, TypeScript, SQL, Tailwind CSS
- Good at generating complete component files
- Understands complex multi-file architecture
- Can generate migration scripts, API routes, schema definitions
- Handles CRUD logic, form validation, state management well

**Limitations:**
- **No vision** — cannot see screenshots, images, or UI previews
- **Limited context window** — cannot hold the entire codebase in context at once
- **Rate limited** — free tier has usage caps; batch work efficiently
- **No streaming architecture awareness** — must explicitly describe data flow
- **Struggles with very large files** — keep files under 400 lines when possible
- **Cannot debug runtime errors** — you must provide error logs

### Mitigation Strategies

| Limitation | Mitigation |
|---|---|
| No vision | Design.md has exact Tailwind classes — pixel-perfect reference |
| Limited context | Modular file structure — each file is self-contained |
| Rate limits | Batch edits in single messages, parallel tool calls |
| No runtime debug | `console.log` + error-first development, test each step |
| Large files | Split components: `ProductsPage.jsx` + `ProductTable.jsx` + `ProductFilters.jsx` |

---

## Recommended Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend Framework** | React 18 + Vite | Fastest setup, best LLM training data |
| **Language** | TypeScript (strict) | Catch errors at build time, self-documenting |
| **Styling** | Tailwind CSS 3 | Exact classes from design.md, no context switching |
| **Routing** | React Router v6 | De facto standard, simple API |
| **State** | React Context + useReducer | No extra deps, sufficient for this scale |
| **HTTP Client** | Axios | Interceptors for auth, consistent error handling |
| **Backend** | Node.js + Express | Most widely supported by LLMs, simple REST |
| **Database** | SQLite (better-sqlite3) | Zero config, file-based, perfect for development |
| **ORM** | Prisma | Type-safe, auto-generated client, easy migrations |
| **Auth** | JWT (jsonwebtoken + bcryptjs) | Stateless, simple, well-documented |
| **Validation** | Zod | Shared schemas between frontend and backend |
| **Charts** | Recharts | React-native, composable, dark-mode aware |
| **Icons** | Material Symbols | As specified in design.md |
| **PDF** | jsPDF + jspdf-autotable | Invoice generation |

---

## Project Structure

```
inventory/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # Button, Card, Table, Modal, Input, Badge, Toast, etc.
│   │   │   ├── layout/       # AppShell, Sidebar, Topbar, Breadcrumb
│   │   │   ├── dashboard/    # StatCard, RevenueChart, RecentSales, etc.
│   │   │   ├── products/     # ProductTable, ProductCard, ProductForm, ProductFilters
│   │   │   ├── sales/        # ProductSelector, CartPanel, InvoiceModal, PaymentMethods
│   │   │   ├── suppliers/    # SupplierTable, SupplierForm
│   │   │   ├── purchases/    # PurchaseTable, PurchaseForm
│   │   │   ├── reports/      # ReportTabs, SalesReport, StockReport, ProfitReport
│   │   │   └── settings/     # SettingsSidebar, GeneralSettings, UserManagement, etc.
│   │   ├── pages/            # One file per route
│   │   ├── context/          # AuthContext, ThemeContext, NotificationContext
│   │   ├── hooks/            # useProducts, useSales, useDebounce, usePagination
│   │   ├── services/         # api.js, authService, productService, etc.
│   │   ├── utils/            # formatCurrency, formatDate, validators, constants
│   │   ├── styles/           # globals.css, animations.css
│   │   ├── types/            # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/           # auth, products, sales, suppliers, purchases, reports, users
│   │   ├── middleware/        # auth middleware, error handler, validation
│   │   ├── services/         # Business logic layer
│   │   ├── utils/            # JWT helpers, password hashing
│   │   ├── validators/       # Zod schemas (shared types with frontend)
│   │   ├── index.ts          # Express app entry
│   │   └── seed.ts           # Seed data
│   ├── prisma/
│   │   └── schema.prisma
│   ├── tsconfig.json
│   └── package.json
└── shared/
    └── types.ts              # Shared TypeScript interfaces
```

---

## Build Phases

### Phase 1: Project Scaffolding
**Goal:** Both projects run with hot-reload, Tailwind works, routing works

| Step | Task | What to build |
|---|---|---|
| 1.1 | Init frontend | `npm create vite@latest frontend -- --template react-ts`, install tailwind + router + axios |
| 1.2 | Init backend | `npm init`, install express + prisma + sqlite + typescript + ts-node-dev |
| 1.3 | Tailwind config | Copy exact colors, fonts, spacing from design.md §1.1-1.5 into tailwind.config.ts |
| 1.4 | CSS globals | `globals.css` with glassmorphism classes, scrollbar, animations, Inter + JetBrains Mono fonts |
| 1.5 | App shell | `AppShell.tsx` + `Sidebar.tsx` + `Topbar.tsx` with React Router |
| 1.6 | Verify | Frontend shows sidebar + topbar + empty page at `/` |

**Verification at end of Phase 1:** `npm run dev` shows dark-themed layout with sidebar nav items and topbar. Clicking nav links changes URL.

---

### Phase 2: Reusable UI Component Library
**Goal:** All atomic components built and consistent

| Step | Task | Files | Wire to |
|---|---|---|---|
| 2.1 | Button | `components/ui/Button.tsx` | 5 variants × 3 sizes, loading state |
| 2.2 | Input / Select / Textarea | `components/ui/Input.tsx` | With label, error, icon support |
| 2.3 | Card | `components/ui/Card.tsx` | Header + body pattern, stat variant |
| 2.4 | Table | `components/ui/Table.tsx` | Sortable columns, pagination slot |
| 2.5 | Modal | `components/ui/Modal.tsx` | Backdrop, header, body, footer, sizes |
| 2.6 | Badge | `components/ui/Badge.tsx` | Status colors, pill shape |
| 2.7 | Pagination | `components/ui/Pagination.tsx` | Page numbers, prev/next, ellipsis |
| 2.8 | Toast | `components/ui/Toast.tsx` | Success/error/warning/info, auto-dismiss |
| 2.9 | Toggle | `components/ui/Toggle.tsx` | On/off switch with label |
| 2.10 | ConfirmDialog | `components/ui/ConfirmDialog.tsx` | Delete confirmation pattern |
| 2.11 | Skeleton | `components/ui/Skeleton.tsx` | Shimmer animation, card/table variants |
| 2.12 | EmptyState | `components/ui/EmptyState.tsx` | Icon + title + description + CTA |

**Verification:** Import each into a test page and confirm rendering matches design.md specs.

---

### Phase 3: Layout & Navigation
**Goal:** Full app shell with all 10 routes working

| Step | Task | Wire to |
|---|---|---|
| 3.1 | `AppShell.tsx` | Combines Sidebar + Topbar + `<Outlet/>` |
| 3.2 | `Sidebar.tsx` | Nav items with active state from router, "New Entry" CTA, bottom links. Wire logout to auth context |
| 3.3 | `Topbar.tsx` | Search input, notification bell (with dropdown), settings gear, user avatar dropdown |
| 3.4 | `Breadcrumb.tsx` | Reads route path, generates breadcrumb trail |
| 3.5 | Router setup in `App.tsx` | 10 routes with lazy-loaded pages |
| 3.6 | `ProtectedRoute.tsx` | Redirects to /login if not authenticated |
| 3.7 | All page stubs | Each page shows page header + placeholder content |

**Routes to wire:**
| Path | Page Component |
|---|---|
| `/login` | `LoginPage.tsx` |
| `/` | `DashboardPage.tsx` |
| `/products` | `ProductsPage.tsx` |
| `/products/add` | `AddProductPage.tsx` |
| `/products/:id` | `ProductDetailPage.tsx` |
| `/products/:id/edit` | `EditProductPage.tsx` |
| `/sales` | `SalesPage.tsx` |
| `/suppliers` | `SuppliersPage.tsx` |
| `/suppliers/add` | `AddSupplierPage.tsx` |
| `/purchases` | `PurchasesPage.tsx` |
| `/purchases/add` | `AddPurchasePage.tsx` |
| `/reports` | `ReportsPage.tsx` |
| `/settings` | `SettingsPage.tsx` |

---

### Phase 4: Context & State Layer
**Goal:** Global state ready before wiring pages

| Step | Context | What it holds | Wire to |
|---|---|---|---|
| 4.1 | `AuthContext.tsx` | user, token, login(), logout(), isAuthenticated | Sidebar (show/hide), Topbar (avatar), ProtectedRoute |
| 4.2 | `ThemeContext.tsx` | theme ('dark' | 'light'), toggleTheme() | HTML class, Tailwind dark mode |
| 4.3 | `NotificationContext.tsx` | notifications[], addNotification(), dismissNotification(), markAllRead() | Topbar bell dropdown, toast overlay |
| 4.4 | `SidebarContext.tsx` | isOpen (mobile), toggle() | Sidebar, hamburger button in Topbar |

---

### Phase 5: Frontend Pages — Static UI
**Goal:** Every page renders pixel-perfect UI per design.md, with mock data

| Step | Page | Key Components Used | Wire to |
|---|---|---|---|
| 5.1 | **LoginPage** | Card, Input, Button, glass-panel | AuthContext.login() |
| 5.2 | **DashboardPage** | StatCard (4×), RevenueChart, RecentSales, LowStockTable, TopProducts, QuickActions | — |
| 5.3 | **ProductsPage** | SearchInput, FilterBar, ProductTable, ProductCard (grid), Pagination | — |
| 5.4 | **AddProductPage** | ProductForm (Input, Select, Textarea, ImageDropzone) | — |
| 5.5 | **ProductDetailPage** | ProductDetail (image, info table, stock history table, sales history table) | — |
| 5.6 | **EditProductPage** | ProductForm (pre-filled, SKU disabled) | — |
| 5.7 | **SalesPage** | ProductSelector, CategoryPills, ProductGrid, CartPanel, PaymentMethods | Cart state |
| 5.8 | **SuppliersPage** | StatCard (3×), SupplierTable, SearchInput, Pagination | — |
| 5.9 | **AddSupplierPage** | SupplierForm (Input fields) | — |
| 5.10 | **PurchasesPage** | StatCard (4×), PurchaseTable, Pagination | — |
| 5.11 | **AddPurchasePage** | PurchaseForm (supplier select, date pickers, items table, notes, totals) | — |
| 5.12 | **ReportsPage** | ReportTabs, SalesReport, StockReport, PurchaseReport, ProfitReport | — |
| 5.13 | **SettingsPage** | SettingsSidebar, GeneralSettings, NotificationSettings, UserManagement, BillingSettings, AppearanceSettings | ThemeContext |

**Wiring rule for this phase:** Each page uses hardcoded mock data arrays. The data structures must match the TypeScript interfaces that the API will later return. This makes backend wiring trivial in Phase 7.

---

### Phase 6: Cart Logic & Client-Side State
**Goal:** Sales page works end-to-end with local state

| Step | What to build | Wire to |
|---|---|---|
| 6.1 | Cart state (useReducer): items[], addItem, removeItem, updateQty, clearCart | CartPanel, ProductSelector |
| 6.2 | Calculations: subtotal, tax (18%), total, discount | CartPanel totals section |
| 6.3 | Payment method selection | PaymentMethods component |
| 6.4 | Customer info fields (name, phone) | CartPanel customer section |
| 6.5 | Place Order → generates invoice data → opens InvoiceModal | InvoiceModal |
| 6.6 | InvoiceModal: sale summary, [Download PDF] [Print] [New Sale] | jsPDF integration |

**No backend yet — cart state lives in React context and resets on page refresh.**

---

### Phase 7: Backend Foundation
**Goal:** Express server with Prisma + SQLite running, seed data loaded

| Step | Task | Details |
|---|---|---|
| 7.1 | Prisma schema | Define all 7 models: User, Product, Category, Supplier, Sale, SaleItem, Purchase, PurchaseItem, StockMovement |
| 7.2 | Run migrations | `npx prisma migrate dev` → creates SQLite database |
| 7.3 | Seed script | 20 products, 5 suppliers, 3 users (admin/manager/staff), 30 sales, 10 purchases |
| 7.4 | Express app | CORS, JSON body parser, error handler middleware, route mounting |
| 7.5 | Auth middleware | JWT verification, role check (admin/manager/staff) |
| 7.6 | Validation middleware | Zod schema validation on all POST/PUT routes |
| 7.7 | Test with curl | Verify all routes return correct JSON |

**Prisma Schema Models:**
```
User:        id, name, email, password, role, status, createdAt
Product:     id, name, sku, description, categoryId, brand, price, costPrice, stock, minStock, unit, imageUrl, createdAt
Category:    id, name
Supplier:    id, name, contactPerson, phone, email, address, city, state, status, createdAt
Sale:        id, invoiceNo, customerName, customerPhone, subtotal, tax, discount, total, paymentMethod, userId, createdAt
SaleItem:    id, saleId, productId, productName, quantity, unitPrice, total
Purchase:    id, poNumber, supplierId, orderDate, expectedDate, total, status, notes, userId, createdAt
PurchaseItem: id, purchaseId, productId, quantity, unitPrice, total
StockMovement: id, productId, type (IN/OUT), quantity, reference, referenceId, notes, userId, createdAt
```

---

### Phase 8: Backend API Routes
**Goal:** All CRUD endpoints working

| Step | Route Group | Endpoints |
|---|---|---|
| 8.1 | Auth | POST /api/auth/login, POST /api/auth/signup, GET /api/auth/me |
| 8.2 | Products | GET /api/products, GET /api/products/:id, POST /api/products, PUT /api/products/:id, DELETE /api/products/:id |
| 8.3 | Categories | GET /api/categories |
| 8.4 | Sales | GET /api/sales, GET /api/sales/:id, POST /api/sales |
| 8.5 | Suppliers | GET /api/suppliers, GET /api/suppliers/:id, POST /api/suppliers, PUT /api/suppliers/:id, DELETE /api/suppliers/:id |
| 8.6 | Purchases | GET /api/purchases, GET /api/purchases/:id, POST /api/purchases, PUT /api/purchases/:id/status |
| 8.7 | Reports | GET /api/reports/sales, GET /api/reports/stock, GET /api/reports/profit |
| 8.8 | Users | GET /api/users, POST /api/users, PUT /api/users/:id |
| 8.9 | Dashboard | GET /api/dashboard/stats, GET /api/dashboard/recent-sales, GET /api/dashboard/low-stock, GET /api/dashboard/top-products |

**Key business logic in routes:**
- `POST /api/sales` → creates Sale + SaleItems + decrements product stock + creates StockMovement
- `POST /api/purchases` → creates Purchase + PurchaseItems
- `PUT /api/purchases/:id/status` → when status → "Received", increments product stock + creates StockMovement

---

### Phase 9: Frontend-Backend Wiring
**Goal:** Every page uses real API data instead of mock data

| Step | Page | Service to create | Wire to |
|---|---|---|---|
| 9.1 | LoginPage | `authService.ts` (login, signup, getMe) | AuthContext |
| 9.2 | DashboardPage | `GET /api/dashboard/*` → custom hooks | StatCard, RevenueChart, RecentSales, LowStockTable, TopProducts |
| 9.3 | ProductsPage | `productService.ts` (getAll, getById, create, update, delete) | ProductTable + FilterBar + Pagination |
| 9.4 | AddProductPage | productService.create → navigate to /products | ProductForm submit |
| 9.5 | EditProductPage | productService.update → navigate to /products/:id | ProductForm submit |
| 9.6 | ProductDetailPage | productService.getById + stock movement API | Detail + StockMovementTable |
| 9.7 | SalesPage | saleService.create → opens InvoiceModal | CartPanel Place Order |
| 9.8 | SuppliersPage | supplierService.getAll | SupplierTable + Pagination |
| 9.9 | AddSupplierPage | supplierService.create → navigate | SupplierForm submit |
| 9.10 | PurchasesPage | purchaseService.getAll | PurchaseTable + Pagination |
| 9.11 | AddPurchasePage | purchaseService.create → navigate | PurchaseForm submit |
| 9.12 | ReportsPage | reportService.getSales, getStock, getProfit | All chart components |
| 9.13 | SettingsPage | userService.getAll, updateSettings | UserManagement table |
| 9.14 | **Every list page** | Search + filter + sort → query params → API | FilterBar + URL search params |

**API Service Pattern:**
```typescript
// services/api.ts — Axios instance with baseURL, interceptors for auth token
// services/productService.ts:
const ProductService = {
  getAll: (params?: ProductFilters) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: CreateProductDto) => api.post('/products', data),
  update: (id: string, data: UpdateProductDto) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};
```

**Custom Hook Pattern:**
```typescript
// hooks/useProducts.ts — manages loading, error, data, pagination, filters
function useProducts(filters: ProductFilters) {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    ProductService.getAll(filters)
      .then(res => { setData(res.data.data); setTotal(res.data.total); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters]);

  return { data, loading, error, total };
}
```

---

### Phase 10: Polish & Edge Cases
**Goal:** Production-quality UX

| Step | Feature | Details |
|---|---|---|
| 10.1 | Loading states | Every page shows skeleton while loading |
| 10.2 | Error states | Every API failure shows error UI + retry button |
| 10.3 | Empty states | Every list shows empty state when data.length === 0 |
| 10.4 | Toast notifications | Success/error toast on every create/update/delete |
| 10.5 | Confirm dialogs | Delete actions show ConfirmDialog |
| 10.6 | 404 page | Unknown routes show not-found page |
| 10.7 | 403 page | Role-restricted routes show forbidden page |
| 10.8 | Form validation | All forms validate before submit, show inline errors |
| 10.9 | Auto stock update | Verify sale → decrement, purchase receive → increment work correctly |
| 10.10 | Search debounce | Search inputs use 300ms debounce before API call |

---

### Phase 11: Advanced Features
**Goal:** Portfolio-ready features

| Step | Feature | Implementation |
|---|---|---|
| 11.1 | Export CSV | All tables get "Export CSV" button using the toolbar pattern from suppliers page |
| 11.2 | Invoice PDF | jsPDF generates invoice with logo, items table, totals |
| 11.3 | Print styles | `@media print` in globals.css hides sidebar, topbar |
| 11.4 | Dark/light toggle | ThemeContext toggles `class` on `<html>`, Tailwind `darkMode: "class"` |
| 11.5 | Low stock notifications | Dashboard + topbar bell shows alerts for products below minStock |
| 11.6 | Dashboard auto-refresh | Poll `/api/dashboard/stats` every 30 seconds |

---

## Development Order — What to Build First

Each numbered item is one atomic task. Complete in order.

### Phase 1: Scaffolding (tasks 1-6)
1. `npm create vite@latest frontend -- --template react-ts`
2. Install frontend deps: `tailwindcss`, `react-router-dom`, `axios`, `lucide-react`, `recharts`, `jspdf`, `jspdf-autotemplate`
3. Configure `tailwind.config.ts` with Kinetic Enterprise colors, fonts, spacing
4. Create `globals.css` with @tailwind directives, glassmorphism, scrollbar, animations
5. Create `AppShell.tsx` + `Sidebar.tsx` + `Topbar.tsx` (static HTML only)
6. Set up React Router with all 10 route placeholders

### Phase 2: UI Library (tasks 7-18)
7-18. Build each component from `components/ui/` list in order

### Phase 3: Layout & Pages (tasks 19-31)
19-31. Build each page one at a time, using UI library components

### Phase 4: Context (tasks 32-35)
32-35. Build all 4 contexts

### Phase 5: Cart (tasks 36-40)
36-40. Cart reducer, calculations, invoice modal

### Phase 6: Backend (tasks 41-60)
41. `npm init` backend with Express + TypeScript
42. Set up Prisma + SQLite
43-50. Build each route group
51. Seed script
52-60. Test all endpoints

### Phase 7: Wiring (tasks 61-73)
61-73. Wire each page to its API service

### Phase 8: Polish (tasks 74-82)
74-82. Loading, error, empty states, toasts, confirmations

---

## Key Rules for Working with This LLM

1. **One file at a time approach:** Build and verify each component before moving to the next. Do not try to build multiple pages in one prompt.

2. **Explicit data flow:** Every component must specify exactly which props it receives and what data it emits. Write the TypeScript interface first, then the component.

3. **Test after every 3-4 components:** Run `npm run build` to catch TypeScript errors early. Fix before proceeding.

4. **Keep API service calls separate:** Never put Axios calls inside components. Always use `services/` + `hooks/` pattern.

5. **Use the design.md as source of truth:** Every Tailwind class, every color, every spacing value is in design.md. Do not invent new values.

6. **Batch when parallel:** If multiple independent files need creation (e.g., 3 UI components that don't import each other), create them in one message with parallel tool calls.

7. **Limit file size:** If a page component exceeds 300 lines, split it. Example: `ProductsPage.tsx` should only compose sub-components, not contain table/filter logic inline.

8. **Shared types first:** Define `shared/types.ts` before building any service or component. Frontend and backend must agree on shape of Product, Sale, User, etc.

---

## TypeScript Interfaces (shared/types.ts)

```typescript
// === Auth ===
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// === Product ===
export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string | null;
  categoryId: number;
  categoryName: string;
  brand: string | null;
  price: number;
  costPrice: number | null;
  stock: number;
  minStock: number;
  unit: string;
  imageUrl: string | null;
  createdAt: string;
}

export interface ProductFilters {
  search?: string;
  categoryId?: number;
  stockStatus?: 'in' | 'low' | 'out';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// === Sale ===
export interface Sale {
  id: number;
  invoiceNo: string;
  customerName: string;
  customerPhone: string | null;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  userId: number;
  userName: string;
  items: SaleItem[];
  createdAt: string;
}

export interface SaleItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// === Supplier ===
export interface Supplier {
  id: number;
  name: string;
  contactPerson: string | null;
  phone: string;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  status: 'active' | 'inactive';
  productsSupplied: string | null;
  createdAt: string;
}

// === Purchase ===
export interface Purchase {
  id: number;
  poNumber: string;
  supplierId: number;
  supplierName: string;
  orderDate: string;
  expectedDate: string | null;
  total: number;
  status: 'pending' | 'ordered' | 'received' | 'cancelled';
  notes: string | null;
  userId: number;
  userName: string;
  items: PurchaseItem[];
  createdAt: string;
}

export interface PurchaseItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// === Stock Movement ===
export interface StockMovement {
  id: number;
  productId: number;
  productName: string;
  type: 'IN' | 'OUT';
  quantity: number;
  reference: string;
  referenceId: string;
  notes: string | null;
  userName: string;
  createdAt: string;
}

// === Dashboard ===
export interface DashboardStats {
  totalProducts: number;
  totalStock: number;
  outOfStock: number;
  lowStock: number;
  totalRevenue: number;
  revenueChange: number;
  monthlyRevenue: { month: string; revenue: number }[];
  recentSales: Sale[];
  lowStockProducts: Product[];
  topProducts: { productName: string; unitsSold: number; revenue: number }[];
}
```

---

## Summary Execution Plan

```
Phase 1  (tasks 1-6)   : Project setup + Tailwind config + App shell
         → verify: npm run dev shows dark layout with sidebar
Phase 2  (tasks 7-18)  : 12 reusable UI components
         → verify: each renders correctly on a test page
Phase 3  (tasks 19-31) : All 13 pages with static mock data
         → verify: all routes render, match design.md
Phase 4  (tasks 32-35) : Context providers (auth, theme, notifications, sidebar)
         → verify: theme toggle works, sidebar collapses
Phase 5  (tasks 36-40) : Cart logic + invoice modal
         → verify: add items, change qty, see totals, generate invoice
Phase 6  (tasks 41-60) : Backend + database + all API routes
         → verify: curl each endpoint returns correct JSON
Phase 7  (tasks 61-73) : Wire frontend to backend
         → verify: login works, products load from DB, sales persist
Phase 8  (tasks 74-82) : Loading, errors, empty states, toasts, confirmations
         → verify: kill backend → see error states, empty DB → see empty states
```

Each phase depends on the previous. Do not skip ahead. Build in this order and verify before moving forward.

---

**End of Plan**
