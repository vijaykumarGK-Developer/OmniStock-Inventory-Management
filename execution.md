# OmniStock — Complete Execution Plan v2

## Tool/Model Capability Reference

### OpenCode Desktop
| Capability | Notes |
|---|---|
| Read/write/edit files | Can create/modify any file |
| Bash execution | npm, npx, node, npx prisma, curl |
| File search | Glob (by name), Grep (by content) |
| Parallel reads | Can read multiple files in one message |
| Task spawning | Subagents for parallel work |
| Web fetch/search | Can get external docs |
| **Cannot** preview UI, **Cannot** hot-reload, **Cannot** runtime debug |

### DeepSeek V4 Flash Free
| Strength | Limit |
|---|---|
| React/TS/Tailwind — excellent | No vision — cannot see UI |
| Express/Prisma — excellent | Limited context window |
| Consistent patterns when given references | No persistent memory |
| 3-5 files per prompt (200–300 lines each) | Rate limited (free tier) |

### Per-Step Safe Capacity
| Type | Max Files | Max Total Lines |
|---|---|---|
| New UI primitives (no deps) | 5 | 800 |
| New page + sub-components | 4 | 600 |
| Backend routes only | 4 | 500 |
| Schema + seed data | 3 | 400 |
| Complex page + wiring | 5 | 700 |

## Critical Rules
1. **Each step:** ≤5 new files, ≤600 total lines, verifiable with `tsc --noEmit` or `curl`
2. **No file exceeds 300 lines** — split immediately if it does
3. **Wire as you build** — backend route → same step or next step → frontend wiring
4. **No `any`, no `@ts-ignore`** — TypeScript strict mode enforced
5. **Must use skills** — load inventory-ui for frontend work, inventory-backend for backend work
6. **Must use agents** — call agent-frontend-builder, agent-backend-builder, agent-feature-verify at appropriate steps
7. **After EVERY step:** run verification before proceeding
8. **Reference design.md** for exact Tailwind classes (section numbers given per step)

## Verification Checklist (run after every step)
```bash
# Frontend TypeScript
cd E:\inventory\frontend && npx tsc --noEmit
if ($?) { echo "OK: Frontend types" } else { echo "FAIL" }

# Frontend build
cd E:\inventory\frontend && npm run build
if ($?) { echo "OK: Frontend build" } else { echo "FAIL" }

# Backend TypeScript (if backend files changed)
cd E:\inventory\backend && npx tsc --noEmit
if ($?) { echo "OK: Backend types" } else { echo "FAIL" }

# Prisma (if schema changed)
cd E:\inventory\backend && npx prisma generate
if ($?) { echo "OK: Prisma client" } else { echo "FAIL" }
```

## Phase 0: Environment Setup (manual bash, no LLM code)

### Step 0.0 — Scaffold Frontend
**Action (run in bash):**
```bash
cd E:\inventory
npm create vite@latest frontend -- --template react-ts
```
**Verify:** `frontend/` directory exists with `package.json`, `tsconfig.json`, `vite.config.ts`, `src/`, `index.html`, `public/`

### Step 0.1 — Install Frontend Dependencies
**Action (run in bash):**
```bash
cd E:\inventory\frontend
npm install
npm install react-router-dom axios recharts jspdf jspdf-autotable
npm install -D tailwindcss @tailwindcss/vite @types/react-router-dom
```
**Verify:** `npm ls react-router-dom axios recharts tailwindcss` shows all installed, no peer dep errors

### Step 0.2 — Initialize Backend Project
**Action (run in bash):**
```bash
New-Item -ItemType Directory -Path "E:\inventory\backend" -Force
cd E:\inventory\backend
npm init -y
npm install express cors helmet jsonwebtoken bcryptjs zod prisma @prisma/client better-sqlite3
npm install -D typescript @types/express @types/cors @types/jsonwebtoken @types/bcryptjs tsx ts-node-dev
npx tsc --init --strict --outDir dist --rootDir src
npx prisma init --datasource-provider sqlite
```
**Verify:** `backend/` has `package.json`, `tsconfig.json`, `prisma/schema.prisma`, `prisma/dev.db` (empty), `src/` directory created

### Step 0.3 — Create Backend src/ Directory Structure
**Action (run in bash):**
```bash
New-Item -ItemType Directory -Path "E:\inventory\backend\src\routes" -Force
New-Item -ItemType Directory -Path "E:\inventory\backend\src\middleware" -Force
New-Item -ItemType Directory -Path "E:\inventory\backend\src\utils" -Force
New-Item -ItemType Directory -Path "E:\inventory\backend\src\validators" -Force
New-Item -ItemType Directory -Path "E:\inventory\frontend\src\styles" -Force
New-Item -ItemType Directory -Path "E:\inventory\frontend\src\components\ui" -Force
New-Item -ItemType Directory -Path "E:\inventory\frontend\src\components\layout" -Force
New-Item -ItemType Directory -Path "E:\inventory\frontend\src\components\dashboard" -Force
New-Item -ItemType Directory -Path "E:\inventory\frontend\src\components\products" -Force
New-Item -ItemType Directory -Path "E:\inventory\frontend\src\components\sales" -Force
New-Item -ItemType Directory -Path "E:\inventory\frontend\src\components\suppliers" -Force
New-Item -ItemType Directory -Path "E:\inventory\frontend\src\components\purchases" -Force
New-Item -ItemType Directory -Path "E:\inventory\frontend\src\components\reports" -Force
New-Item -ItemType Directory -Path "E:\inventory\frontend\src\components\settings" -Force
New-Item -ItemType Directory -Path "E:\inventory\frontend\src\pages" -Force
New-Item -ItemType Directory -Path "E:\inventory\frontend\src\context" -Force
New-Item -ItemType Directory -Path "E:\inventory\frontend\src\hooks" -Force
New-Item -ItemType Directory -Path "E:\inventory\frontend\src\services" -Force
New-Item -ItemType Directory -Path "E:\inventory\frontend\src\utils" -Force
```
**Verify:** All directories exist

## Phase 1: Core Configuration & Shared Types (3 LLM steps)

### Step 1.0 — Tailwind Config + Vite Config + HTML Head
**Skill:** inventory-ui (design tokens)
**Agent:** opencode (use skills)
**Goal:** Configure Tailwind with Kinetic Enterprise palette from design.md §1.1, set up Vite with Tailwind plugin, update index.html

**Files to create/modify:**
1. `E:\inventory\frontend\vite.config.ts` — add `@tailwindcss/vite` plugin
2. `E:\inventory\frontend\src\styles\globals.css` — Tailwind directives + glassmorphism classes (design.md §1.6) + custom scrollbar + shimmer animation + Google Fonts imports (Inter, JetBrains Mono, Material Symbols)
3. `E:\inventory\frontend\index.html` — title "OmniStock — Inventory Management", meta viewport, font preloads

**Detailed spec:**
- **vite.config.ts:** import tailwindcss from '@tailwindcss/vite', add to plugins array, keep React plugin
- **globals.css:** `@import "tailwindcss";` will read Tailwind config. Add custom CSS:
  - `.glass-panel`: `background: rgba(11,19,38,0.8); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;`
  - `.glass-input`: `background: rgba(23,31,51,0.6); border: 1px solid rgba(45,52,73,0.8); border-radius: 12px; color: #dae2fd;`
  - `.shimmer` keyframe: `background: linear-gradient(90deg, #171f33 25%, #222a3d 50%, #171f33 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite;`
  - Custom scrollbar: `::-webkit-scrollbar` styling (design.md scrollbar section)
  - Print styles (design.md §23)
  - Font imports via `@import url()` for Inter (400,500,600,700), JetBrains Mono (400,500), Material Symbols
- **index.html:** Set `<title>OmniStock — Inventory Management</title>`, `<meta name="viewport" content="width=device-width, initial-scale=1.0">`

**Create dir:** `E:\inventory\frontend\src\styles\`

**Verify:** `npx tsc --noEmit` passes (no TS errors for config changes), `npm run build` produces dist/

### Step 1.1 — Tailwind Theme Configuration
**Skill:** inventory-ui (§1.1-1.5 color tokens, typography, spacing)
**Goal:** Extend Tailwind theme with Kinetic Enterprise design tokens as CSS variables

**File to modify:**
1. `E:\inventory\frontend\src\styles\globals.css` — add `@theme` block with all Kinetic tokens

**Detailed spec:**
Add `@theme { }` block in globals.css containing:
- Colors: all ~40 tokens from design.md §1.1 (surface, surface-dim, surface-bright, surface-container-lowest, ..., primary, on-primary, primary-container, etc.)
- Font: `--font-sans: 'Inter', system-ui, sans-serif; --font-mono: 'JetBrains Mono', monospace;`
- Font sizes for all tokens from §1.3 (display-lg, headline-lg, etc.)
- Spacing tokens from §1.4 (xs:4px, base:8px, sm:12px, md:24px, lg:40px, xl:64px, gutter:24px)
- Border radius tokens from §1.5
- Shadow tokens from §1.8
- Breakpoints from §1.10

Use Tailwind v4 `@theme` directive syntax to define CSS custom properties.

**Verify:** `npm run build` succeeds, no CSS parsing errors

### Step 1.2 — Shared TypeScript Interfaces
**Goal:** Create all shared types in a single file used by both frontend and backend

**File to create:**
1. `E:\inventory\shared\types.ts` — ALL TypeScript interfaces from plan.md §"TypeScript Interfaces" (lines 440-584)

**Interfaces (copy from plan.md):**
- `User` — id, name, email, role('admin'|'manager'|'staff'), status('active'|'inactive'), createdAt
- `LoginDto` — email, password
- `AuthResponse` — user(User), token(string)
- `Product` — id, name, sku, description|null, categoryId, categoryName, brand|null, price, costPrice|null, stock, minStock, unit, imageUrl|null, createdAt
- `ProductFilters` — search?, categoryId?, stockStatus?('in'|'low'|'out'), sortBy?, sortOrder?('asc'|'desc'), page?, limit?
- `Sale` — id, invoiceNo, customerName, customerPhone|null, subtotal, tax, discount, total, paymentMethod('cash'|'card'|'upi'|'credit'), userId, userName, items(SaleItem[]), createdAt
- `SaleItem` — id, productId, productName, quantity, unitPrice, total
- `Supplier` — id, name, contactPerson|null, phone, email|null, address|null, city|null, state|null, status('active'|'inactive'), productsSupplied|null, createdAt
- `Purchase` — id, poNumber, supplierId, supplierName, orderDate, expectedDate|null, total, status('pending'|'ordered'|'received'|'cancelled'), notes|null, userId, userName, items(PurchaseItem[]), createdAt
- `PurchaseItem` — productId, productName, quantity, unitPrice, total
- `StockMovement` — id, productId, productName, type('IN'|'OUT'), quantity, reference, referenceId, notes|null, userName, createdAt
- `DashboardStats` — totalProducts, totalStock, outOfStock, lowStock, totalRevenue, revenueChange, monthlyRevenue({month,revenue}[]), recentSales(Sale[]), lowStockProducts(Product[]), topProducts({productName,unitsSold,revenue}[])
- `ApiResponse<T>` — data(T), total?, page?, limit?
- `ApiError` — error(string), details?(Record<string,string[]>)

Also add:
```typescript
export interface CreateProductDto {
  name: string; sku: string; description?: string; categoryId: number;
  brand?: string; price: number; costPrice?: number; stock: number;
  minStock: number; unit: string; imageUrl?: string;
}
export interface UpdateProductDto extends Partial<CreateProductDto> {}
export interface CreateSaleDto {
  customerName?: string; customerPhone?: string;
  paymentMethod: 'cash'|'card'|'upi'|'credit'; discount?: number;
  items: { productId: number; quantity: number }[];
}
export interface CreateSupplierDto {
  name: string; contactPerson?: string; phone: string;
  email?: string; address?: string; city?: string;
  state?: string; status?: 'active'|'inactive';
}
export interface CreatePurchaseDto {
  supplierId: number; orderDate?: string; expectedDate?: string;
  notes?: string; status?: string;
  items: { productId: number; quantity: number; unitPrice: number }[];
}
export interface UpdateStatusDto { status: string; }
```

**Verify:** Read back the file, verify all interfaces compile in TypeScript

## Phase 2: Backend Foundation (5 LLM steps)

### Step 2.0 — Prisma Schema
**Skill:** inventory-backend (§Prisma Schema)
**Agent:** backend-builder → db-schema-builder
**Goal:** Create complete Prisma schema with all 9 models

**File to create:**
1. `E:\inventory\backend\prisma\schema.prisma`

**Detailed spec:**
```prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "sqlite" url = "file:./dev.db" }

model User { id Int @id @default(autoincrement); name String; email String @unique;
  password String; role String @default("staff"); status String @default("active");
  createdAt DateTime @default(now()); sales Sale[]; purchases Purchase[];
  stockMovements StockMovement[] }

model Category { id Int @id @default(autoincrement); name String @unique;
  products Product[] }

model Product { id Int @id @default(autoincrement); name String; sku String @unique;
  description String?; categoryId Int; category Category @relation(fields:[categoryId],references:[id]);
  brand String?; price Float; costPrice Float?; stock Int @default(0); minStock Int @default(5);
  unit String @default("pcs"); imageUrl String?; createdAt DateTime @default(now());
  saleItems SaleItem[]; purchaseItems PurchaseItem[]; stockMovements StockMovement[]
  @@index([name,sku]) }

model Supplier { id Int @id @default(autoincrement); name String;
  contactPerson String?; phone String; email String?; address String?; city String?;
  state String?; status String @default("active"); createdAt DateTime @default(now());
  purchases Purchase[] }

model Sale { id Int @id @default(autoincrement); invoiceNo String @unique;
  customerName String @default("Walk-in Customer"); customerPhone String?;
  subtotal Float; tax Float @default(0); discount Float @default(0); total Float;
  paymentMethod String; userId Int; user User @relation(fields:[userId],references:[id]);
  items SaleItem[]; createdAt DateTime @default(now()) }

model SaleItem { id Int @id @default(autoincrement); saleId Int;
  sale Sale @relation(fields:[saleId],references:[id],onDelete:Cascade);
  productId Int; productName String; quantity Int; unitPrice Float; total Float }

model Purchase { id Int @id @default(autoincrement); poNumber String @unique;
  supplierId Int; supplier Supplier @relation(fields:[supplierId],references:[id]);
  orderDate DateTime @default(now()); expectedDate DateTime?; total Float @default(0);
  status String @default("pending"); notes String?; userId Int;
  user User @relation(fields:[userId],references:[id]);
  items PurchaseItem[]; createdAt DateTime @default(now()) }

model PurchaseItem { id Int @id @default(autoincrement); purchaseId Int;
  purchase Purchase @relation(fields:[purchaseId],references:[id],onDelete:Cascade);
  productId Int; quantity Int; unitPrice Float; total Float }

model StockMovement { id Int @id @default(autoincrement); productId Int;
  product Product @relation(fields:[productId],references:[id]);
  type String; quantity Int; reference String; referenceId String?;
  notes String?; userId Int; user User @relation(fields:[userId],references:[id]);
  createdAt DateTime @default(now()); @@index([productId, createdAt]) }
```

**Verify:** `cd E:\inventory\backend && npx prisma generate` produces no errors

### Step 2.1 — Express App Entry + Error Handler + Validate Middleware
**Skill:** inventory-backend
**Goal:** Create Express app with CORS, Helmet, JSON parser, error handler, validate middleware

**Files to create:**
1. `E:\inventory\backend\src\index.ts`
2. `E:\inventory\backend\src\middleware\errorHandler.ts`
3. `E:\inventory\backend\src\middleware\validate.ts`

**Detailed spec:**
- **index.ts:** Import express, cors, helmet. Create app. Configure CORS for origin `http://localhost:5173` with credentials. Use `express.json()`. Use `helmet()`. Mount auth routes at `/api/auth` (placeholder import). Mount error handler LAST. Listen on port 3001, log "Server running on port 3001". Export app.
- **errorHandler.ts:** Express error middleware `(err, req, res, next)`. Log error. Handle Prisma errors: P2002 → 409 `{ error: "Resource already exists", details }`, P2025 → 404 `{ error: "Not found" }`, Zod validation errors → 400 `{ error: "Validation failed", details }`. Default: 500 `{ error: "Internal server error" }`.
- **validate.ts:** Factory function `validate(schema: ZodSchema, source: 'body'|'query'|'params' = 'body')` returns Express middleware that parses `req[source]` with schema, sets `req[source] = parsed.data` on success, passes ZodError to next() on failure.

**Verify:** `npx tsc --noEmit` passes (backend)

### Step 2.2 — JWT Utils + Password Utils + Auth Middleware
**Skill:** inventory-backend
**Goal:** Create authentication utilities and middleware

**Files to create:**
1. `E:\inventory\backend\src\utils\jwt.ts`
2. `E:\inventory\backend\src\utils\password.ts`
3. `E:\inventory\backend\src\middleware\auth.ts`

**Detailed spec:**
- **jwt.ts:** Export `JWT_SECRET = process.env.JWT_SECRET || <random-generated-at-startup>`. `generateToken(user: {id:number, email:string, role:string}): string` — sign `{id, email, role}` with JWT_SECRET, expiresIn '7d'. `verifyToken(token: string): JwtPayload` — return jwt.verify result, throw on invalid.
- **password.ts:** `hashPassword(plain: string): Promise<string>` — bcryptjs.hash(plain, 12). `comparePassword(plain: string, hash: string): Promise<boolean>` — bcryptjs.compare.
- **auth.ts:** Extend Express Request type to add `user?: {id:number, email:string, role:string}`. Export `authenticate`: extract Bearer token from Authorization header, verify, set req.user, call next(). On failure → 401 `{ error: "Authentication required" }`. Export `authorize(...roles: string[])`: returns middleware that checks `req.user.role` is in roles, else 403 `{ error: "Insufficient permissions" }`.

**Verify:** `npx tsc --noEmit` passes

### Step 2.3 — Auth Routes
**Skill:** inventory-backend
**Goal:** Create login, signup, and me endpoints

**Files to create:**
1. `E:\inventory\backend\src\routes\auth.ts`
2. `E:\inventory\backend\src\validators\auth.ts` (Zod schemas)

**Detailed spec:**
- **validators/auth.ts:** `loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) })`. `signupSchema = z.object({ name: z.string().min(2).max(100), email: z.string().email(), password: z.string().min(6).max(100) })`.
- **routes/auth.ts:** Router with three endpoints:
  - `POST /login`: validate body with loginSchema. Find user by email (Prisma). If not found → 401 "Invalid email or password". Compare password. If wrong → 401. Return `{ data: { user: {id,name,email,role,status,createdAt}, token: generateToken(user) } }`.
  - `POST /signup`: validate body. Check email uniqueness, hash password, create user. Return 201 with user + token.
  - `GET /me`: authenticate middleware. Find user by id from req.user, return `{ data: {id,name,email,role,status,createdAt} }`.

**Update:** `E:\inventory\backend\src\index.ts` — import auth routes, mount at `/api/auth`.

**Verify:** `npx tsc --noEmit` passes

### Step 2.4 — Seed Script
**Skill:** inventory-backend
**Goal:** Create comprehensive seed data for development

**File to create:**
1. `E:\inventory\backend\src\seed.ts`

**Detailed spec:**
Script that:
1. Imports PrismaClient, bcryptjs
2. Hashes all passwords with bcryptjs.hashSync("password123", 12)
3. Creates 3 users: {name:"Admin User",email:"admin@omni.com",role:"admin",status:"active"}, {name:"Manager User",email:"manager@omni.com",role:"manager"}, {name:"Staff User",email:"staff@omni.com",role:"staff"}
4. Creates 6 categories: Electronics, Accessories, Clothing, Food & Beverages, Stationery, Medical
5. Creates 20 products with varied data (mix of stock levels: some 0, some low=1-5, some well-stocked=50-200). Include realistic product names (Wireless Mouse, HDMI Cable, USB-C Hub, Notebook A5, etc.) with realistic prices.
6. Creates 5 suppliers with Indian city names (Mumbai, Delhi, Bangalore, Chennai, Pune)
7. Creates 10 sales with items (use existing product IDs)
8. Creates 5 purchases with varied statuses (2 received, 2 pending, 1 ordered)
9. Uses `prisma.$transaction` for bulk creates where appropriate
10. Logs progress: "Seeding complete: 3 users, 6 categories, 20 products, 5 suppliers, 10 sales, 5 purchases"

Also add to `E:\inventory\backend\package.json` scripts: `"seed": "npx tsx src/seed.ts"`.

**Verify:** `npx prisma migrate dev --name init` creates database tables. `npx tsx src/seed.ts` populates data without errors. `npx prisma studio` shows data in all tables.

## Phase 3: Frontend Foundation (8 LLM steps)

### Step 3.0 — UI Kit Part 1: Button, Input, Badge
**Skill:** inventory-ui (§2.8-2.10 buttons, §2.10 inputs, §2.6 badges)
**Agent:** frontend-builder → ui-kit-builder
**Goal:** Create 3 core UI primitives

**Files to create:**
1. `E:\inventory\frontend\src\components\ui\Button.tsx`
2. `E:\inventory\frontend\src\components\ui\Input.tsx`
3. `E:\inventory\frontend\src\components\ui\Badge.tsx`

**Detailed spec:**
- **Button.tsx:** Props: `children: ReactNode, variant: 'primary'|'secondary'|'outline-primary'|'outline-danger'|'ghost'|'ghost-danger', size: 'sm'|'md'|'lg', loading?: boolean, disabled?: boolean, onClick?: () => void, type?: 'button'|'submit', className?: string`. Styles from design.md §2.8-2.9:
  - primary: `bg-primary-container text-primary-fixed px-6 py-3 rounded-xl font-title-sm flex items-center gap-2 hover:bg-inverse-primary transition-colors shadow-sm`
  - secondary: `bg-secondary-container text-white px-6 py-3 rounded-xl font-title-sm hover:opacity-90 transition-colors`
  - outline-primary: `border-2 border-primary-container text-primary-container px-6 py-3 rounded-xl font-title-sm hover:bg-primary-container hover:text-primary-fixed transition-colors`
  - ghost: `px-4 py-2 rounded-xl border border-surface-variant font-body-sm text-body-sm text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-2 shadow-sm`
  - ghost-danger: same as ghost but `text-error hover:bg-error-container/10`
  - size sm: `px-3 py-1.5 text-sm`, md: default, lg: `px-8 py-4 text-lg`
  - loading: show `<span class="material-symbols-outlined animate-spin text-sm">progress_activity</span>` before children, button disabled
  - disabled: `opacity-50 cursor-not-allowed`
- **Input.tsx:** Props: `label?: string, error?: string, icon?: string, type?: string, placeholder?: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onBlur?: () => void, name?: string, disabled?: boolean, className?: string`. Render as: label above (font-label-uppercase), input wrapper with icon if provided (Material Symbols span positioned left), input styled as `w-full bg-surface-container border border-surface-container-highest rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary-fixed focus:ring-2 focus:ring-primary-fixed/20 outline-none transition-colors`. If type='password', add visibility toggle (eye/visibility_off icon button positioned right). If error, show `border-error` on input and `<p class="text-error font-body-sm mt-1">{error}</p>`. Icon gets `text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2`. Input gets `pl-10` when icon present, `pr-10` when password.
  - On mount, read design.md §2.10 for exact spacing and styling
- **Badge.tsx:** Props: `children: ReactNode, variant: 'success'|'error'|'warning'|'info'|'neutral', removable?: boolean, onRemove?: () => void`. Styles: `inline-flex items-center px-3 py-1 rounded-full font-label-sm text-label-sm tracking-wide`. Colors: success=`bg-[#D1FAE5] text-[#065F46]`, error=`bg-[#FEE2E2] text-[#991B1B]`, warning=`bg-[#FEF3C7] text-[#92400E]`, info=`bg-[#DBEAFE] text-[#1E40AF]`, neutral=`bg-[#F1F5F9] text-[#475569]`. If removable, show `<span class="material-symbols-outlined text-sm ml-1 cursor-pointer hover:opacity-80" onClick={onRemove}>close</span>`.

**Verify:** `npx tsc --noEmit` passes

### Step 3.1 — UI Kit Part 2: Select, Textarea, Card
**Skill:** inventory-ui (§2.10 inputs, §2.4 stat cards, §2.7 content cards)
**Agent:** frontend-builder → ui-kit-builder
**Goal:** Create 3 more UI primitives

**Files to create:**
1. `E:\inventory\frontend\src\components\ui\Select.tsx`
2. `E:\inventory\frontend\src\components\ui\Textarea.tsx`
3. `E:\inventory\frontend\src\components\ui\Card.tsx`

**Detailed spec:**
- **Select.tsx:** Props: `label?: string, error?: string, options: {value: string, label: string}[], value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, placeholder?: string, disabled?: boolean`. Styled same as Input (same bg/border/radius/focus). Use native `<select>` with custom styling. Right chevron: absolutely positioned Material Symbols "expand_more". Error state same as Input (red border + message).
- **Textarea.tsx:** Props: `label?: string, error?: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, placeholder?: string, rows?: number, maxLength?: number, disabled?: boolean`. Same styling as Input. Character counter when maxLength provided: `<span class="text-on-surface-variant/50 text-sm">{value.length}/{maxLength}</span>`. Resize vertical only: `resize-y`.
- **Card.tsx:** Props: `title?: string, subtitle?: string, children: ReactNode, variant?: 'default'|'stat', icon?: string, accentColor?: 'primary'|'secondary'|'tertiary'|'none', className?: string, action?: ReactNode`. Two variants:
  - **default:** `bg-gradient-to-br from-surface-container to-surface-container-low border border-surface-variant rounded-2xl p-6 shadow-sm`. Optional header with `border-b border-surface-variant/50 pb-4 mb-4` containing title + subtitle + action.
  - **stat:** Same as default but with `border-t-2 border-t-primary-container` (or secondary/tertiary based on accentColor) + decorative blur orb in top-right corner: `<div class="absolute top-0 right-0 w-32 h-32 bg-primary-container/10 rounded-full blur-3xl -z-0" />`. If icon provided, show it in a `w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary-container` container.

**Create:** `E:\inventory\frontend\src\components\ui\index.ts` — re-export all 5 components created so far.

**Verify:** `npx tsc --noEmit` passes

### Step 3.2 — UI Kit Part 3: Table, Pagination, Modal
**Skill:** inventory-ui (§2.5 tables, §5.5 pagination, §15.2 modals)
**Agent:** frontend-builder → ui-kit-builder
**Goal:** Create 3 complex UI primitives

**Files to create:**
1. `E:\inventory\frontend\src\components\ui\Table.tsx`
2. `E:\inventory\frontend\src\components\ui\Pagination.tsx`
3. `E:\inventory\frontend\src\components\ui\Modal.tsx`

**Detailed spec:**
- **Table.tsx:** Generic `<T extends Record<string, any>>` component. Props: `columns: {key: string, label: string, sortable?: boolean, align?: 'left'|'right'|'center', render?: (item: T) => ReactNode}[], data: T[], onSort?: (key: string, direction: 'asc'|'desc') => void, sortKey?: string, sortDirection?: 'asc'|'desc', onRowClick?: (item: T) => void, loading?: boolean, emptyMessage?: string, emptyIcon?: string`. Styles: `bg-surface-container-low border border-surface-variant rounded-2xl shadow-sm overflow-hidden`. thead: `bg-surface-dim font-label-uppercase text-label-uppercase text-on-surface-variant`. th: `px-4 py-3 text-left`. th sortable: `cursor-pointer hover:text-on-surface`. Sort indicator: `<span class="ml-1">{direction==='asc'?'▲':'▼'}</span>`. td: `px-4 py-3 font-body-sm text-body-sm text-on-surface border-b border-surface-variant/30`. tr: `h-[56px] hover:bg-surface-container/50 cursor-pointer`. Loading: render 5 skeleton rows (use `<div class="h-4 shimmer rounded" />` cells). Empty: render EmptyState component (import from future step, or inline) with icon + message.
- **Pagination.tsx:** Props: `page: number, totalPages: number, onPageChange: (page: number) => void`. Styles from design.md §5.5: `flex items-center justify-between gap-3`. Left: `<span class="font-body-sm text-body-sm text-on-surface-variant">Page {page} of {totalPages}</span>`. Right: flex row of buttons. Page buttons: `w-10 h-10 rounded-xl font-body-sm text-body-sm`. Active: `bg-primary-container text-primary-fixed`. Inactive: `bg-surface-container text-on-surface-variant hover:bg-surface-container-high`. Prev/Next buttons: same size, use Material Symbols "chevron_left"/"chevron_right", disabled `opacity-30 cursor-not-allowed` at boundaries. Logic: show first, last, current ± 2, with ellipsis when gaps > 1.
- **Modal.tsx:** Props: `isOpen: boolean, onClose: () => void, title: string, size?: 'sm'|'md'|'lg'|'xl'|'full', children: ReactNode, footer?: ReactNode`. Backdrop: `fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4` (click backdrop → onClose). Card: `bg-gradient-to-br from-surface-container to-surface-container-low border border-surface-variant shadow-soft rounded-2xl w-full`. Size widths: sm=`max-w-sm`, md=`max-w-md`, lg=`max-w-2xl`, xl=`max-w-4xl`, full=`max-w-full`. Header: `flex items-center justify-between p-6 border-b border-surface-variant/50`. Title: `font-title-md text-title-md text-on-surface`. Close button: `w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors` with Material Symbols "close". Body: `p-6 max-h-[70vh] overflow-y-auto`. Footer: `p-6 border-t border-surface-variant/50 flex justify-end gap-3`. ESC key → onClose (useEffect with keydown listener). Focus trap: auto-focus close button on mount.

**Update:** `E:\inventory\frontend\src\components\ui\index.ts` — add new exports.

**Verify:** `npx tsc --noEmit` passes

### Step 3.3 — UI Kit Part 4: Toast, Toggle, ConfirmDialog, Skeleton, EmptyState, SearchInput
**Skill:** inventory-ui (§13.2 toasts, §15.7 toggles, §15.10 confirm, §14.2 skeleton, §14.1 empty)
**Agent:** frontend-builder → ui-kit-builder
**Goal:** Create remaining 6 UI primitives

**Files to create:**
1. `E:\inventory\frontend\src\components\ui\Toast.tsx`
2. `E:\inventory\frontend\src\components\ui\Toggle.tsx`
3. `E:\inventory\frontend\src\components\ui\ConfirmDialog.tsx`
4. `E:\inventory\frontend\src\components\ui\Skeleton.tsx`
5. `E:\inventory\frontend\src\components\ui\EmptyState.tsx`
6. `E:\inventory\frontend\src\components\ui\SearchInput.tsx`
7. Update `index.ts`

**Detailed spec:**
- **Toast.tsx:** Props: `type: 'success'|'error'|'warning'|'info', message: string, description?: string, onDismiss: () => void, duration?: number`. Fixed position: `fixed top-4 right-4 z-[100] w-80`. Card: `bg-surface border border-surface-variant shadow-soft rounded-xl p-4 animate-slide-right`. Icon+color: success=`check_circle`+`text-secondary`, error=`error`+`text-error`, warning=`warning`+`text-tertiary`, info=`info`+`text-primary`. Layout: flex row, icon + message+description + close button. Progress bar at bottom: `h-1 rounded-full` that shrinks from 100% to 0% over duration (use useEffect with setTimeout). Auto-dismiss after duration ms. Animate entry with CSS `@keyframes slideRight { from { transform: translateX(100%) } to { transform: translateX(0) } }`.
- **Toggle.tsx:** Props: `checked: boolean, onChange: (checked: boolean) => void, label?: string, disabled?: boolean`. Switch: `relative w-12 h-6 rounded-full transition-colors duration-300`. Checked: `bg-primary-container`. Unchecked: `bg-surface-variant`. Thumb: `absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300`. Checked thumb: `translate-x-6`. Label on right: `font-body-sm text-body-sm text-on-surface ml-3`. When disabled: `opacity-50 cursor-not-allowed`.
- **ConfirmDialog.tsx:** Uses Modal internally. Props: `isOpen: boolean, onClose: () => void, onConfirm: () => void, title: string, message: string, confirmLabel?: string, cancelLabel?: string, variant?: 'danger'|'warning'|'info'`. Styles from design.md §15.10: Modal with icon (danger=error/red, warning=warning/orange, info=info/blue), title, message. Footer: Cancel (Button outline-primary) + Confirm (Button primary, or danger if variant='danger'). On Confirm: call onConfirm, then onClose. On Cancel: call onClose.
- **Skeleton.tsx:** Props: `variant: 'text'|'card'|'table-row'|'chart', width?: string, height?: string, className?: string`. Uses shimmer CSS class: `bg-gradient-to-r from-surface-container via-surface-container-high to-surface-container bg-[length:200%_100%] animate-shimmer rounded-lg`. Variant sizes: text=`h-4 w-full`, card=`h-28 w-full rounded-2xl`, table-row=`h-14 w-full`, chart=`h-64 w-full rounded-2xl`. Apply className override if provided.
- **EmptyState.tsx:** Props: `icon?: string, title: string, description?: string, action?: {label: string, onClick: () => void}`. Centered flex column: `flex flex-col items-center justify-center py-16`. Icon: `<span class="material-symbols-outlined text-6xl text-on-surface-variant/30">{icon||'inventory_2'}</span>`. Title: `font-headline-md text-headline-md text-on-surface mt-4`. Description: `font-body-md text-body-md text-on-surface-variant max-w-sm text-center mt-2`. Action: primary Button component at bottom.
- **SearchInput.tsx:** Props: `value: string, onChange: (value: string) => void, placeholder?: string, onClear?: () => void, className?: string`. Wrapper: `relative flex items-center`. Left icon: `<span class="material-symbols-outlined absolute left-3 text-on-surface-variant">search</span>`. Input: same as Input component but with `rounded-full pl-10 pr-10`. Clear button (x icon): appears when value is non-empty, positioned right: `absolute right-3 w-6 h-6 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high`.

**Update:** `E:\inventory\frontend\src\components\ui\index.ts` — export all 15 components.

**Verify:** `npx tsc --noEmit` passes

### Step 3.4 — Layout: Sidebar + Topbar
**Skill:** inventory-ui (§2.1-2.3 sidebar, topbar)
**Agent:** frontend-builder → layout-builder
**Goal:** Create app navigation components

**Files to create:**
1. `E:\inventory\frontend\src\components\layout\Sidebar.tsx`
2. `E:\inventory\frontend\src\components\layout\Topbar.tsx`

**Detailed spec:**
- **Sidebar.tsx:** Fixed left nav: `fixed left-0 top-0 w-[260px] h-screen bg-surface-container-lowest border-r border-outline-variant z-50 flex flex-col`. 
  - Logo area (top): h-16 flex items-center px-4 gap-3. Icon box: `w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center` with Material Symbols "inventory_2" text-primary-container. Text: "StockPro" (font-display-lg text-display-lg) + "Enterprise v2.0" (font-label-sm text-label-sm text-on-surface-variant).
  - CTA Button: `mx-4 my-4 bg-primary-container text-primary-fixed rounded-xl py-3 px-4 font-title-sm flex items-center gap-2 justify-center hover:bg-inverse-primary transition-colors` with Material Symbols "add" + "New Entry".
  - Nav items (use NavLink from react-router-dom): Dashboard (dashboard), Products (inventory_2), Sales/POS (point_of_sale), Suppliers (local_shipping), Analytics (analytics). Each: `flex items-center gap-3 px-3 py-2.5 rounded-xl font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors my-0.5 mx-3`. Active NavLink: `bg-primary-container text-primary-fixed`. Icons: `material-symbols-outlined text-lg`.
  - Spacer: `flex-1`.
  - Bottom section: border-t border-outline-variant pt-2 pb-4. Help Center (help) + Logout (logout). Logout: `text-error/80 hover:text-error`.
- **Topbar.tsx:** `h-16 sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant flex items-center px-gutter gap-4`.
  - Left: SearchInput (w-full max-w-md, placeholder "Search across system...").
  - Right: flex items-center gap-2. Notification bell button: `p-2 rounded-full hover:bg-surface-container-high transition-colors relative`. Bell icon with red dot: `absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full shadow-[0_0_8px_rgba(107,216,203,0.8)]`. Settings gear button: `p-2 rounded-full hover:bg-surface-container-high transition-colors`. User avatar: `w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-label-sm text-label-sm text-on-surface`. Dropdown on avatar click (optional, can skip for now).

**Create:** `E:\inventory\frontend\src\components\layout\index.ts` — export both.

**Verify:** `npx tsc --noEmit` passes

### Step 3.5 — Layout: Breadcrumb + AppShell + Page Stubs
**Skill:** inventory-ui (§2.1 app shell)
**Agent:** frontend-builder → layout-builder
**Goal:** Create app shell layout that combines sidebar/topbar/content + page stubs

**Files to create:**
1. `E:\inventory\frontend\src\components\layout\Breadcrumb.tsx`
2. `E:\inventory\frontend\src\components\layout\AppShell.tsx`
3. `E:\inventory\frontend\src\pages\LoginPage.tsx` (stub)
4. `E:\inventory\frontend\src\pages\DashboardPage.tsx` (stub)
5. `E:\inventory\frontend\src\pages\ProductsPage.tsx` (stub)
6. `E:\inventory\frontend\src\pages\SuppliersPage.tsx` (stub)
7. `E:\inventory\frontend\src\pages\SalesPage.tsx` (stub)
8. `E:\inventory\frontend\src\pages\PurchasesPage.tsx` (stub)
9. `E:\inventory\frontend\src\pages\ReportsPage.tsx` (stub)
10. `E:\inventory\frontend\src\pages\SettingsPage.tsx` (stub)
11. `E:\inventory\frontend\src\pages\AddProductPage.tsx` (stub)
12. `E:\inventory\frontend\src\pages\EditProductPage.tsx` (stub)
13. `E:\inventory\frontend\src\pages\ProductDetailPage.tsx` (stub)
14. `E:\inventory\frontend\src\pages\AddSupplierPage.tsx` (stub)
15. `E:\inventory\frontend\src\pages\AddPurchasePage.tsx` (stub)
16. `E:\inventory\frontend\src\pages\NotFoundPage.tsx` (stub)

**Detailed spec:**
- **Breadcrumb.tsx:** Uses `useLocation()` from react-router-dom. Splits pathname by "/", filters empty. Generates segments: capitalize first letter, replace "-" with " ". Renders as flex row items-center gap-1. Each segment: text-on-surface-variant font-body-sm. Active (last): text-on-surface font-medium. Separator: `<span class="material-symbols-outlined text-on-surface-variant/50 text-sm">chevron_right</span>`. Styles: `px-gutter pt-4 pb-2`.
- **AppShell.tsx:** Renders: `<div class="flex h-screen bg-background">` → Sidebar + `<main class="ml-[260px] flex-1 flex flex-col">` → Topbar + `<div class="flex-1 overflow-y-auto">` → Breadcrumb + `<div class="p-gutter">` → `<Outlet />`. Also handle mobile sidebar toggle (can be basic: always show sidebar on desktop, hide on mobile with hamburger). Use `useMediaQuery` or simple CSS `hidden lg:flex` on sidebar.
- **Page stubs:** Each page component exports `default function PageName()`. Returns:
  ```tsx
  <div class="flex flex-col gap-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="font-headline-lg text-headline-lg text-on-background">{PageTitle}</h1>
        <p class="font-body-md text-body-md text-on-surface-variant">{Description}</p>
      </div>
    </div>
    <p class="text-on-surface-variant">Page content coming soon.</p>
  </div>
  ```
  - LoginPage: returns full `<div>Login Page</div>` (no shell wrapper — rendered standalone).

**Verify:** `npx tsc --noEmit` passes

### Step 3.6 — App.tsx Router + API Service Layer
**Skill:** inventory-ui (routing), inventory-backend (API patterns)
**Agent:** opencode (direct), integrator → service-builder
**Goal:** Set up React Router with all routes and create Axios API service

**Files to create/modify:**
1. `E:\inventory\frontend\src\App.tsx` (overwrite Vite default)
2. `E:\inventory\frontend\src\main.tsx` (overwrite Vite default)
3. `E:\inventory\frontend\src\services\api.ts`
4. `E:\inventory\frontend\src\services\authService.ts`

**Detailed spec:**
- **main.tsx:** `import { BrowserRouter } from 'react-router-dom'; import App from './App';`. Render: `<React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>`. Import globals.css.
- **App.tsx:** Import `Routes, Route, Navigate` from react-router-dom. Wrap routes in `<Routes>`. Public route: `<Route path="/login" element={<LoginPage />} />`. Protected routes (placeholder — no AuthContext yet, just render): `<Route element={<AppShell />}>` with child routes:
  - `<Route path="/" element={<Navigate to="/dashboard" replace />} />`
  - `<Route path="/dashboard" element={<DashboardPage />} />`
  - `<Route path="/products" element={<ProductsPage />} />`
  - `<Route path="/products/add" element={<AddProductPage />} />`
  - `<Route path="/products/:id" element={<ProductDetailPage />} />`
  - `<Route path="/products/:id/edit" element={<EditProductPage />} />`
  - `<Route path="/sales" element={<SalesPage />} />`
  - `<Route path="/suppliers" element={<SuppliersPage />} />`
  - `<Route path="/suppliers/add" element={<AddSupplierPage />} />`
  - `<Route path="/purchases" element={<PurchasesPage />} />`
  - `<Route path="/purchases/add" element={<AddPurchasePage />} />`
  - `<Route path="/reports" element={<ReportsPage />} />`
  - `<Route path="/settings" element={<SettingsPage />} />`
  - `<Route path="*" element={<NotFoundPage />} />`
- **api.ts:** Create Axios instance: `baseURL: 'http://localhost:3001/api'`. Request interceptor: read token from localStorage('token'), if exists set `config.headers.Authorization = 'Bearer ' + token`. Response interceptor: on 401 error, clear localStorage, redirect to '/login'. Export the instance as default.
- **authService.ts:** Import api instance. Export: `login(email: string, password: string): Promise<AuthResponse>` — POST /auth/login. `signup(name: string, email: string, password: string): Promise<AuthResponse>` — POST /auth/signup. `getMe(): Promise<User>` — GET /auth/me.

**Verify:** `npx tsc --noEmit` passes. `npm run build` produces working build.

### Step 3.7 — AuthContext + Login Page
**Skill:** inventory-ui (§3 login page)
**Agent:** frontend-builder → context-builder + page-builder
**Goal:** Create authentication state management and login page

**Files to create/modify:**
1. `E:\inventory\frontend\src\context\AuthContext.tsx`
2. `E:\inventory\frontend\src\pages\LoginPage.tsx` (overwrite stub)
3. `E:\inventory\frontend\src\App.tsx` (wrap with AuthProvider)
4. `E:\inventory\frontend\src\components\layout\Sidebar.tsx` (add logout)
5. `E:\inventory\frontend\src\components\layout\AppShell.tsx` (add ProtectedRoute logic)

**Detailed spec:**
- **AuthContext.tsx:** React context with:
  - State: `user: User | null`, `token: string | null`, `isAuthenticated: boolean`, `isLoading: boolean`, `error: string | null`
  - On mount: check localStorage for 'token', if exists call `authService.getMe()` to validate, set user. If fails, clear token.
  - `login(email, password)`: call authService.login, store token in localStorage, set user + token state.
  - `logout()`: clear localStorage, set user=null, token=null, navigate to /login.
  - `clearError()`: set error=null.
  - Export `useAuth()` hook.
- **LoginPage.tsx:** (overwrite stub) Complete login page from design.md §3:
  - Full screen: `min-h-screen bg-gradient-to-br from-indigo-700 via-violet-600 to-teal-500 flex items-center justify-center p-4 relative overflow-hidden`.
  - 3 glowing orbs: absolute positioned divs with `w-[40vw] h-[40vw] rounded-full blur-[100px] mix-blend-screen opacity-30`. Colors: one indigo-500, one violet-500, one teal-400. Positioned at different corners.
  - Glass panel: `max-w-[420px] w-full glass-panel p-8 relative z-10` (glass-panel class from globals.css).
  - Brand header: flex items-center gap-4 mb-8. Icon box: `w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center`, Material Symbols "inventory_2" text-3xl text-white. Text: "StockPro" (`text-4xl font-bold text-white`), "Enterprise Logistics" (`text-teal-300 font-label-uppercase text-label-uppercase tracking-wider`).
  - Form: email Input with "mail" icon, password Input with "lock" icon + visibility toggle.
  - Role select: glass-input styled select with Admin/Manager/Staff.
  - "Remember this device" Toggle with label.
  - "Forgot password?" link: `text-teal-300 hover:text-white text-sm`.
  - Sign In button: `w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl py-3.5 font-title-sm shadow-lg hover:opacity-90 transition-all`. Show spinner when loading.
  - Divider: `<div class="flex items-center gap-4 my-6"><hr class="flex-1 border-white/10"><span class="text-white/50 text-sm">OR</span><hr class="flex-1 border-white/10"></div>`.
  - Google SSO button: glass-input styled with Google G icon.
  - "Don't have an account? Sign up" link at bottom.
  - On submit: call `auth.login()`, on success navigate to `/dashboard`, on error show error message in red.
- **Sidebar.tsx update:** Add `onClick` to Logout item that calls `auth.logout()`.
- **AppShell.tsx:** Read `isAuthenticated` from useAuth(). If not authenticated, return `<Navigate to="/login" />`. Add ProtectedRoute wrapper.
- **App.tsx:** Wrap all routes with `<AuthProvider>`.

**Verify:** `npx tsc --noEmit` passes. `npm run build` succeeds.

### Step 3.8 — Frontend Utils + Constants
**Skill:** inventory-ui
**Goal:** Create utility functions used across the app

**Files to create:**
1. `E:\inventory\frontend\src\utils\formatCurrency.ts`
2. `E:\inventory\frontend\src\utils\formatDate.ts`
3. `E:\inventory\frontend\src\utils\cn.ts`
4. `E:\inventory\frontend\src\utils\constants.ts`

**Detailed spec:**
- **formatCurrency.ts:** `export function formatCurrency(amount: number): string` — returns `₹${amount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`.
- **formatDate.ts:** `export function formatDate(date: string | Date, style: 'short'|'long'|'relative' = 'short'): string` — short: '12 Mar 2024', long: '12 March 2024, 10:30 AM', relative: '2 hours ago' (simple relative time logic).
- **cn.ts:** `export function cn(...classes: (string | undefined | false | null)[]): string` — filters falsy values, joins with space.
- **constants.ts:** Export `STOCK_STATUS = { IN_STOCK: 'in', LOW_STOCK: 'low', OUT_OF_STOCK: 'out' } as const`. `ORDER_STATUS = { PENDING: 'pending', ORDERED: 'ordered', RECEIVED: 'received', CANCELLED: 'cancelled' }`. `PAYMENT_METHODS = ['cash', 'card', 'upi', 'credit']`. `ROLES = ['admin', 'manager', 'staff']`.

**Verify:** `npx tsc --noEmit` passes

## Phase 4: Products Feature (7 LLM steps)

### Step 4.0 — Backend: Product Validators
**Skill:** inventory-backend (§validation)
**Agent:** backend-builder → validation-builder
**Goal:** Create Zod validation schemas for products

**File to create:**
1. `E:\inventory\backend\src\validators\product.ts`

**Detailed spec:**
- `createProductSchema`: z.object with:
  - name: z.string().min(2).max(100)
  - sku: z.string().regex(/^[A-Z0-9-]+$/, "SKU must be uppercase alphanumeric with hyphens")
  - categoryId: z.number().int().positive()
  - brand: z.string().max(100).optional().nullable()
  - description: z.string().max(1000).optional().nullable()
  - price: z.number().positive()
  - costPrice: z.number().positive().optional().nullable()
  - stock: z.number().int().min(0)
  - minStock: z.number().int().min(0)
  - unit: z.string().min(1).max(20)
  - imageUrl: z.string().url().optional().nullable()
- `updateProductSchema`: same as create but all fields optional (except sku cannot be changed — omit it from schema). Use `.partial()`.
- `productQuerySchema`: z.object with:
  - search: z.string().optional()
  - categoryId: z.coerce.number().int().optional()
  - stockStatus: z.enum(['in','low','out']).optional()
  - sortBy: z.string().optional()
  - sortOrder: z.enum(['asc','desc']).optional()
  - page: z.coerce.number().int().min(1).default(1)
  - limit: z.coerce.number().int().min(1).max(100).default(12)

**Verify:** `npx tsc --noEmit` passes (backend)

### Step 4.1 — Backend: Product Routes
**Skill:** inventory-backend (§routes, §Convention)
**Agent:** backend-builder → crud-builder
**Goal:** Create full CRUD REST API for products

**File to create:**
1. `E:\inventory\backend\src\routes\products.ts`
2. Update `E:\inventory\backend\src\index.ts` to mount products routes

**Detailed spec:**
- **routes/products.ts:** Express Router. All routes use `authenticate` middleware.
  - `GET /`: Public (any authenticated). Parse query with productQuerySchema. Build Prisma where clause:
    - search: `{ OR: [{ name: { contains: search } }, { sku: { contains: search } }] }`
    - categoryId: `{ categoryId: categoryId }`
    - stockStatus: `in` → `{ stock: { gt: prisma.product.fields.minStock } }`, `low` → `{ AND: [{ stock: { gt: 0 } }, { stock: { lte: prisma.product.fields.minStock } }] }`, `out` → `{ stock: 0 }`. For SQLite, use raw comparison: `low` → `{ AND: [{ stock: { gt: 0 } }, { stock: { lte: referenceMinStock } }] }` — since SQLite can't reference other columns in where, compute manually: fetch all first with minStock condition, then filter in JS? Actually for SQLite, handle stockStatus in application code after fetch or use Prisma raw query. SIMPLER: for `low`, query `stock > 0 AND stock <= minStock` by first getting minStock from each product separately... Actually, simplest approach for SQLite: fetch products, then filter by stockStatus in JS. Only filter by category/search in Prisma, do stockStatus post-filter.
    - Sort: default `{ createdAt: 'desc' }`. If sortBy provided, use `{ [sortBy]: sortOrder }`.
    - Pagination: skip = (page-1) * limit, take = limit.
  - After Prisma query, apply stockStatus filter in JS for `low` and `in` cases. Return `{ data, total, page, limit }`.
  - `GET /:id`: Find by id with category relation. Include category name. Return `{ data: product }`. 404 if not found.
  - `POST /`: authenticate + authorize('admin','manager'). Validate body with createProductSchema. Create product with category relation. Return 201 `{ data: product }`. Handle P2002 → 409 "SKU already exists".
  - `PUT /:id`: authenticate + authorize('admin','manager'). Validate body with updateProductSchema. Update product. Return `{ data: product }`.
  - `DELETE /:id`: authenticate + authorize('admin'). Delete product. Return `{ data: { id } }`. Handle P2025 → 404.
- **index.ts update:** Add `import productRoutes from './routes/products'; app.use('/api/products', productRoutes);`

**Verify:** `npx tsc --noEmit` passes

### Step 4.2 — Frontend: Product Service + useProducts Hook
**Skill:** inventory-ui
**Agent:** integrator → service-builder + hook-builder
**Goal:** Create frontend service and hook for products

**Files to create:**
1. `E:\inventory\frontend\src\services\productService.ts`
2. `E:\inventory\frontend\src\hooks\useProducts.ts`
3. `E:\inventory\frontend\src\hooks\useDebounce.ts`

**Detailed spec:**
- **productService.ts:** Import api from './api'. Export:
  - `getAll(filters: ProductFilters): Promise<ApiResponse<Product[]>>` — GET /products with query params from filters (skip null/undefined).
  - `getById(id: number): Promise<Product>` — GET /products/:id, return `response.data.data`.
  - `create(data: CreateProductDto): Promise<Product>` — POST /products, return `response.data.data`.
  - `update(id: number, data: UpdateProductDto): Promise<Product>` — PUT /products/:id.
  - `delete(id: number): Promise<void>` — DELETE /products/:id.
- **useDebounce.ts:** `export function useDebounce<T>(value: T, delay: number): T`. Uses useState + useEffect with setTimeout/clearTimeout to debounce value changes.
- **useProducts.ts:** Custom hook that:
  - Takes filters object as parameter.
  - State: `data: Product[]`, `total: number`, `loading: boolean`, `error: string | null`.
  - useEffect: calls productService.getAll(filters) on mount and when filters change.
  - Returns `{ data, total, loading, error, refetch }`.

**Verify:** `npx tsc --noEmit` passes

### Step 4.3 — Frontend: ProductFilters + ProductTable
**Skill:** inventory-ui (§5.2-5.3 product filters, product table)
**Agent:** frontend-builder → page-builder
**Goal:** Create product list sub-components

**Files to create:**
1. `E:\inventory\frontend\src\components\products\ProductFilters.tsx`
2. `E:\inventory\frontend\src\components\products\ProductTable.tsx`

**Detailed spec:**
- **ProductFilters.tsx:** Props: `filters: ProductFilters, onFilterChange: (filters: Partial<ProductFilters>) => void`. Renders a flex row (wrap on mobile) with gap-3 items-center:
  - SearchInput (placeholder "Search products...", value=filters.search, onChange updates search with debounce)
  - Select for category (options from API or hardcoded: "All Categories", "Electronics", "Accessories", etc.)
  - Select for stock status options: "All Stock", "In Stock", "Low Stock", "Out of Stock"
  - Select for sort: "Newest", "Name A-Z", "Name Z-A", "Price Low-High", "Price High-Low"
  - Each change calls onFilterChange with the specific field.
  - Styles: all inputs `h-10` (smaller than default), `bg-surface-container rounded-lg`.
- **ProductTable.tsx:** Props: `products: Product[], onEdit: (product: Product) => void, onDelete: (product: Product) => void, loading: boolean`. Uses Table component with columns:
  - Product (custom render: flex row with image placeholder `w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant` + name/sku stacked)
  - Category (categoryName string)
  - Price (formatted with formatCurrency)
  - Stock (number + mini progress bar: `<div class="w-20 h-2 rounded-full bg-surface-container-highest overflow-hidden"><div class="h-full rounded-full" style="width:${Math.min(100, (product.stock/(product.stock+product.minStock||1))*100)}%" style background: product.stock===0?'#991B1B':product.stock<=product.minStock?'#F97316':'#29a195' /></div>`)
  - Min Stock (number)
  - Status (Badge: success if stock>minStock, warning if stock>0 && stock<=minStock, error if stock===0)
  - Actions (Edit + Delete icon buttons: Material Symbols "edit" hover:text-primary, "delete" hover:text-error)

**Verify:** `npx tsc --noEmit` passes

### Step 4.4 — Frontend: ProductForm
**Skill:** inventory-ui (§9.1-9.2 add/edit product form)
**Agent:** frontend-builder → page-builder
**Goal:** Create product create/edit form component

**File to create:**
1. `E:\inventory\frontend\src\components\products\ProductForm.tsx`

**Detailed spec:**
Props: `initialData?: Product, onSubmit: (data: CreateProductDto) => Promise<void>, onCancel: () => void, loading?: boolean`.

Form layout: 2-column grid on desktop (`grid grid-cols-1 lg:grid-cols-2 gap-6`), single column on mobile.
Fields:
- Left column:
  1. Product Name (Input, required)
  2. SKU (Input, required, uppercase-only, disabled when editing)
  3. Category (Select, options from API or hardcoded, required)
  4. Brand (Input, optional)
  5. Description (Textarea, rows=4, maxLength=1000, optional)
- Right column:
  6. Price (Input type=number step=0.01, required)
  7. Cost Price (Input type=number step=0.01, optional)
  8. Stock (Input type=number min=0, required)
  9. Min Stock (Input type=number min=0, required)
  10. Unit (Select, options: pcs, kg, box, meter, liter, pair, set)
  11. Image URL (Input, optional, with preview)

Image Dropzone (design.md §6.2): `border-2 border-dashed border-surface-container-highest rounded-xl p-8 text-center hover:border-primary-container transition-colors cursor-pointer`. On click, file input opens. Show preview if imageUrl or file selected.

Validation: All fields validated on submit. Show inline error messages below each field. Rules: name min 2, SKU uppercase regex, price > 0, stock >= 0.

Bottom: Cancel button (ghost) + Submit button (primary, loading state). Full-width actions: `flex justify-end gap-3 mt-6`.

Pre-fill: if initialData provided, all fields pre-filled. SKU field disabled.

**Verify:** `npx tsc --noEmit` passes

### Step 4.5 — Frontend: ProductsPage
**Skill:** inventory-ui (§4 products catalog page)
**Agent:** frontend-builder → page-builder
**Goal:** Create products list page with filters, table, pagination

**File to create:**
1. `E:\inventory\frontend\src\pages\ProductsPage.tsx` (overwrite stub)

**Detailed spec:**
- Page header (design.md §2.11): "Product Management" title + "[+] Add Product" primary button (navigates to /products/add)
- ProductFilters component (filters state synced with URL search params via useSearchParams)
- ProductTable component
- Pagination component (total from API response)
- States:
  - Loading: Skeleton table (5 rows)
  - Error: EmptyState "Error loading products" with subtitle + action button label="Retry" onClick=refetch
  - Empty: EmptyState icon="inventory_2" title="No products yet" description="Add your first product to start tracking inventory" action={label="Add Product", onClick=redirect to /products/add}
- Search: debounce 300ms, updates URL params, triggers refetch
- Category/stock/sort filter: immediate update URL params, triggers refetch
- Pagination: page from URL params, on change update URL params
- Delete flow: onClick row delete icon → ConfirmDialog "Delete Product" "Are you sure you want to delete {product.name}?" variant=danger → onConfirm → productService.delete → refetch → toast (skip toast for now, add in Phase 10)
- Click row edit icon → navigate to /products/:id/edit

**Verify:** `npx tsc --noEmit` passes

### Step 4.6 — Frontend: AddProductPage + EditProductPage + ProductDetailPage
**Skill:** inventory-ui (§9 add/edit, §4 catalog)
**Agent:** frontend-builder → page-builder
**Goal:** Create product add, edit, and detail pages

**Files to create (overwrite stubs):**
1. `E:\inventory\frontend\src\pages\AddProductPage.tsx`
2. `E:\inventory\frontend\src\pages\EditProductPage.tsx`
3. `E:\inventory\frontend\src\pages\ProductDetailPage.tsx`

**Detailed spec:**
- **AddProductPage.tsx:** Renders ProductForm with no initialData. On submit: `await productService.create(data)` → navigate to /products. On cancel: navigate to /products.
- **EditProductPage.tsx:** Get product ID from `useParams()`. Fetch product with `productService.getById(id)`. Pass as initialData to ProductForm. On submit: `await productService.update(id, data)` → navigate to /products. Loading: Skeleton form while fetching. On cancel: navigate to /products.
- **ProductDetailPage.tsx:** Get product ID from useParams. Fetch product. Layout (design.md detail view):
  - Left: image placeholder (300px, bg-surface-container-low rounded-2xl, flex items-center justify-center, large icon)
  - Right: info card with all fields (name, sku, category, brand, description, price, cost, stock, min, unit, status badge)
  - Two tables below: Stock Movement History, Sales History (placeholder data for now — wire to real API in Phase 8/9)
  - Back button: ghost with chevron_left icon
  - Edit button: primary, navigates to /products/:id/edit

**Verify:** `npx tsc --noEmit` passes

## Phase 5: Sales/POS Feature (6 LLM steps)

### Step 5.0 — Backend: Sales Validators + Routes
**Skill:** inventory-backend (§routes, §Key Business Logic)
**Agent:** backend-builder → validation-builder + transaction-builder
**Goal:** Create sales API with atomic transaction logic

**Files to create:**
1. `E:\inventory\backend\src\validators\sale.ts`
2. `E:\inventory\backend\src\routes\sales.ts`
3. Update `E:\inventory\backend\src\index.ts`

**Detailed spec:**
- **validators/sale.ts:** `createSaleSchema = z.object({ customerName: z.string().optional().default('Walk-in Customer'), customerPhone: z.string().optional().nullable(), paymentMethod: z.enum(['cash','card','upi','credit']), discount: z.number().min(0).optional().default(0), items: z.array(z.object({ productId: z.number().int().positive(), quantity: z.number().int().min(1) })).min(1, "At least one item required") })`.
- **routes/sales.ts:** Express Router:
  - `POST /`: authenticate. Validate body. ATOMIC transaction with `prisma.$transaction(async (tx) => { ... })`:
    1. For each item in items: fetch product with `tx.product.findUnique({ where: { id: productId } })`. If not found → throw 404. If stock < quantity → throw 400 "Insufficient stock for {product.name}".
    2. Calculate subtotal = sum of (product.price * quantity) for each item.
    3. Calculate tax = subtotal * 0.18.
    4. Calculate total = subtotal + tax - discount.
    5. Generate invoice number: find last sale's invoiceNo, increment: `INV-{year}-{sequential}`. If no sales, start at 1.
    6. Create Sale with items (SaleItem records) — for each item, use product.name as productName, product.price as unitPrice.
    7. Decrement each product's stock by quantity: `tx.product.update({ where: { id }, data: { stock: { decrement: quantity } } })`.
    8. Create StockMovement for each item: type='OUT', reference='Sale', referenceId=invoiceNo, quantity, notes='Sold via POS'.
    9. Return complete sale with items.
  - `GET /`: authenticate. Parse query with pagination/search schema. Search by invoiceNo or customerName (contains, case-insensitive). Paginate. Return `{ data: Sale[], total, page, limit }`.
  - `GET /:id`: authenticate. Find by id with items. Include user name. Return `{ data }`. 404 if not found.
- **index.ts update:** `app.use('/api/sales', saleRoutes);`

**Also create:** `E:\inventory\backend\src\validators\common.ts` with reusable pagination/query schemas.

**Verify:** `npx tsc --noEmit` passes

### Step 5.1 — Frontend: CartContext (Cart State Management)
**Skill:** inventory-ui
**Agent:** frontend-builder → cart-builder
**Goal:** Create useReducer-based cart state management

**File to create:**
1. `E:\inventory\frontend\src\components\sales\CartContext.tsx`

**Detailed spec:**
React Context with useReducer:
- State shape:
  ```typescript
  interface CartState {
    items: CartItem[];
    customerName: string;
    customerPhone: string;
    paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
    discount: number;
  }
  interface CartItem { productId: number; productName: string; price: number; quantity: number; stock: number; }
  ```
- Actions: ADD_ITEM, REMOVE_ITEM, UPDATE_QTY, SET_CUSTOMER_NAME, SET_CUSTOMER_PHONE, SET_PAYMENT_METHOD, SET_DISCOUNT, CLEAR_CART
- Reducer logic:
  - ADD_ITEM: if item already exists (same productId), increment quantity. Otherwise push new item.
  - REMOVE_ITEM: filter out by productId.
  - UPDATE_QTY: update quantity for productId. If qty <= 0, remove item.
  - CLEAR_CART: reset to initial state (items empty, customer defaults).
- Computed values (via useMemo):
  - `subtotal`: sum of (item.price * item.quantity) for each item
  - `tax`: subtotal * 0.18
  - `total`: subtotal + tax - discount
  - `itemsCount`: sum of all quantities
- Provider wraps children. Export `useCart()` hook.

**Verify:** `npx tsc --noEmit` passes

### Step 5.2 — Frontend: Sale Service + useSales Hook
**Skill:** inventory-ui, inventory-backend
**Agent:** integrator → service-builder + hook-builder
**Goal:** Create sales service and hook

**Files to create:**
1. `E:\inventory\frontend\src\services\saleService.ts`
2. `E:\inventory\frontend\src\hooks\useSales.ts`

**Detailed spec:**
- **saleService.ts:** `getAll(params): Promise<ApiResponse<Sale[]>>` — GET /sales with query params. `getById(id): Promise<Sale>` — GET /sales/:id. `create(data: CreateSaleDto): Promise<Sale>` — POST /sales.
- **useSales.ts:** Same pattern as useProducts. Takes pagination/search params, returns { data, total, loading, error, refetch }.

**Verify:** `npx tsc --noEmit` passes

### Step 5.3 — Frontend: ProductSelector + CartPanel
**Skill:** inventory-ui (§5.1-5.2 POS product selector, cart panel)
**Agent:** frontend-builder → page-builder + cart-builder
**Goal:** Create POS product grid and cart panel components

**Files to create:**
1. `E:\inventory\frontend\src\components\sales\ProductSelector.tsx`
2. `E:\inventory\frontend\src\components\sales\CartPanel.tsx`

**Detailed spec:**
- **ProductSelector.tsx:** Props: `onAddToCart: (product: Product) => void`.
  - Large search input: `rounded-2xl pl-12 pr-14 py-4 bg-surface-container border border-surface-variant w-full` with search icon + barcode scanner icon button on right.
  - Category pills: scrollable flex row, overflow-x-auto. Each pill: `rounded-full px-5 py-2 font-body-sm text-body-sm whitespace-nowrap transition-colors`. Active: `bg-primary-container text-primary-fixed`. Inactive: `bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest`.
  - Product grid: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4`.
  - Product card: `bg-surface border border-surface-variant rounded-2xl p-4 hover:shadow-soft hover:border-primary-fixed-dim transition-all cursor-pointer`. Image area: `aspect-square bg-surface-container-low rounded-xl flex items-center justify-center mb-3` with Material Symbols icon. Name: `font-body-sm text-body-sm text-on-surface line-clamp-1`. Price: `font-title-sm text-title-sm text-primary mt-1`. Out of stock: `border-error/30 opacity-75` with "OUT" badge on image. Click → onAddToCart (unless out of stock).
  - Fetch products via useProducts or direct API call. Show Skeleton grid while loading.
- **CartPanel.tsx:** Sticky right panel (lg:col-span-4). Reads from CartContext.
  - Header: "Current Cart" + Material Symbols shopping_cart + Clear Cart (text-error button with Material Symbols "delete_sweep").
  - Cart items list (max-h-[400px] overflow-y-auto):
    - Each item: flex row, left: product name + unit price, right: quantity control + line total + remove button.
    - Quantity control: `flex items-center border border-surface-variant rounded-lg bg-surface-container overflow-hidden`. Minus button (w-9 h-9 flex items-center justify-center hover:bg-surface-container-high), quantity display (w-12 text-center font-body-md), Plus button (same as minus).
    - Remove: Material Symbols "close" text-on-surface-variant hover:text-error.
  - Empty state: centered icon "shopping_cart" text-5xl text-on-surface-variant/30 + "Cart is empty".
  - Totals section (border-t border-surface-variant/50 pt-4): Subtotal (body-md), Discount input (small Input), Tax (calculated, shown as 18%), Total (title-md text-primary).
  - Customer section: name + phone Inputs.
  - Payment methods: 4 toggle buttons in a row. Active: `bg-gradient-to-r from-indigo-500 to-violet-600 text-white`. Inactive: `bg-surface-container text-on-surface-variant`. Each: flex-1 py-2 rounded-lg text-center font-body-sm cursor-pointer.
  - Place Order button: `w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white py-4 rounded-xl font-title-sm shadow-lg hover:opacity-90 transition-all mt-4`. Disabled when cart empty.

**Verify:** `npx tsc --noEmit` passes

### Step 5.4 — Frontend: InvoiceModal + SalesPage
**Skill:** inventory-ui (§11 invoice modal)
**Agent:** frontend-builder → page-builder + cart-builder
**Goal:** Create invoice modal and wire up the complete Sales page

**Files to create:**
1. `E:\inventory\frontend\src\components\sales\InvoiceModal.tsx`
2. `E:\inventory\frontend\src\pages\SalesPage.tsx` (overwrite stub)

**Detailed spec:**
- **InvoiceModal.tsx:** Props: `sale: Sale | null, isOpen: boolean, onClose: () => void, onNewSale: () => void`. Uses Modal size='lg'.
  - Header: "✅ Sale Complete!" with Material Symbols "check_circle" text-secondary text-3xl. Invoice number + date.
  - Body: itemized table (no border, just flex rows). Each item: productName x quantity = total.
  - Totals: subtotal, tax, discount, total (large, text-primary).
  - Payment method + customer name.
  - Footer: [Download PDF] (jsPDF — generate simple invoice), [Print] (window.print), [New Sale], [Go to Dashboard].
  - PDF: use jsPDF to create A4 document with company header, invoice details, item table, totals.
- **SalesPage.tsx:** Layout: `grid grid-cols-1 lg:grid-cols-12 gap-gutter`.
  - lg:col-span-8: ProductSelector(onAddToCart)
  - lg:col-span-4: CartPanel
  - Wrapped in CartProvider.
  - Place Order logic:
    1. Read cart from CartContext.
    2. Create payload: { customerName, customerPhone, paymentMethod, discount, items: cart.items.map(i => ({ productId: i.productId, quantity: i.quantity })) }.
    3. Call saleService.create(payload).
    4. On success: open InvoiceModal with returned Sale.
    5. On error: show error.
  - New Sale: clearCart, close InvoiceModal.

**Verify:** `npx tsc --noEmit` passes. `npm run build` succeeds.

## Phase 6: Suppliers Feature (3 LLM steps)

### Step 6.0 — Backend: Supplier Validators + Routes
**Skill:** inventory-backend
**Agent:** backend-builder → validation-builder + crud-builder
**Goal:** Create suppliers API

**Files to create:**
1. `E:\inventory\backend\src\validators\supplier.ts`
2. `E:\inventory\backend\src\routes\suppliers.ts`
3. Update `E:\inventory\backend\src\index.ts`

**Detailed spec:**
- **validators/supplier.ts:** `createSupplierSchema`: name(required min2 max100), contactPerson(optional max100), phone(required), email(optional email), address(optional), city(optional), state(optional), status(optional default 'active' enum['active','inactive']). `updateSupplierSchema`: partial.
- **routes/suppliers.ts:**
  - `GET /`: search by name/contactPerson/phone (contains), filter by status, sort by name/createdAt, pagination.
  - `GET /:id`: single supplier. Include purchase count (count of related purchases).
  - `POST /`: auth admin/manager. Create.
  - `PUT /:id`: auth admin/manager. Update.
  - `DELETE /:id`: auth admin. Delete (only if no active purchases).
- **index.ts:** Mount at `/api/suppliers`.

**Verify:** `npx tsc --noEmit` passes

### Step 6.1 — Frontend: Supplier Service + useSuppliers
**Skill:** inventory-ui
**Agent:** integrator → service-builder + hook-builder
**Goal:** Create supplier service and hook

**Files to create:**
1. `E:\inventory\frontend\src\services\supplierService.ts`
2. `E:\inventory\frontend\src\hooks\useSuppliers.ts`

**Detailed spec:**
- **supplierService.ts:** `getAll(params)`, `getById(id)`, `create(data)`, `update(id, data)`, `delete(id)` — all matching the API patterns from Phase 4.2.
- **useSuppliers.ts:** Same pattern as useProducts.

**Verify:** `npx tsc --noEmit` passes

### Step 6.2 — Frontend: SuppliersPage + AddSupplierPage
**Skill:** inventory-ui (§6 supplier management)
**Agent:** frontend-builder → page-builder
**Goal:** Create suppliers listing and add/edit pages

**Files to create (overwrite stubs):**
1. `E:\inventory\frontend\src\pages\SuppliersPage.tsx`
2. `E:\inventory\frontend\src\pages\AddSupplierPage.tsx`

**Detailed spec:**
- **SuppliersPage.tsx:**
  - 3 stat cards at top (design.md §9.1): Total Suppliers, Active Partners, Pending Review. Use Card variant='stat'.
  - SearchInput + Filter/Sort buttons toolbar.
  - Table: Supplier Name, Contact Person, Phone/Email (two-line), Status (Badge), Actions (more_vert icon button with dropdown — skip dropdown for now, just show edit/delete icons).
  - Pagination.
  - "[+] Add Supplier" primary button in header.
  - States: loading (Skeleton table), empty (EmptyState "No suppliers yet"), error (ErrorState with retry).
- **AddSupplierPage.tsx:** Form with all fields: Supplier Name, Contact Person, Phone, Email, Address (textarea), City, State, Status (Toggle). Uses standard Input/Select/Textarea components. Submit → supplierService.create → navigate to /suppliers. Cancel → navigate back.

**Verify:** `npx tsc --noEmit` passes

## Phase 7: Purchases Feature (3 LLM steps)

### Step 7.0 — Backend: Purchase Validators + Routes
**Skill:** inventory-backend (§Key Business Logic purchase receive)
**Agent:** backend-builder → validation-builder + transaction-builder
**Goal:** Create purchases API with status transition logic

**Files to create:**
1. `E:\inventory\backend\src\validators\purchase.ts`
2. `E:\inventory\backend\src\routes\purchases.ts`
3. Update `E:\inventory\backend\src\index.ts`

**Detailed spec:**
- **validators/purchase.ts:** `createPurchaseSchema`: supplierId(required int), orderDate(optional string -> Date), expectedDate(optional string -> Date), notes(optional), items(required array min1: { productId(int), quantity(int min1), unitPrice(float positive) }). `updateStatusSchema`: z.object({ status: z.enum(['pending','ordered','received','cancelled']) }).
- **routes/purchases.ts:**
  - `POST /`: authenticate + admin/manager. Generate PO number: `PO-{year}-{sequential}` (find last PO, increment number). Create Purchase + PurchaseItems. Status defaults to 'pending'. Return 201.
  - `GET /`: authenticate. List with search (poNumber, supplier name via include), filter by status, pagination. Include supplier name.
  - `GET /:id`: authenticate. Single purchase with items + supplier name.
  - `PUT /:id/status`: authenticate + admin/manager. Validate status. ATOMIC transaction:
    1. Get current status. If same, skip.
    2. If new status === 'received':
      a. For each PurchaseItem: `prisma.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } })`.
      b. Create StockMovement for each item: type='IN', reference='Purchase', referenceId=poNumber.
    3. Update Purchase status.
    4. Return updated purchase.
  - `DELETE /:id`: authenticate + admin. Only if status='pending'. Delete.
- **index.ts:** Mount at `/api/purchases`.

**Verify:** `npx tsc --noEmit` passes

### Step 7.1 — Frontend: Purchase Service + usePurchases Hook
**Skill:** inventory-ui
**Agent:** integrator → service-builder + hook-builder
**Goal:** Create purchase service and hook

**Files to create:**
1. `E:\inventory\frontend\src\services\purchaseService.ts`
2. `E:\inventory\frontend\src\hooks\usePurchases.ts`

**Detailed spec:**
- **purchaseService.ts:** `getAll(params)`, `getById(id)`, `create(data)`, `updateStatus(id, status)`.
- **usePurchases.ts:** Same pattern as useProducts.

**Verify:** `npx tsc --noEmit` passes

### Step 7.2 — Frontend: PurchasesPage + AddPurchasePage
**Skill:** inventory-ui (§10 purchases management)
**Agent:** frontend-builder → page-builder
**Goal:** Create purchases listing and add pages

**Files to create (overwrite stubs):**
1. `E:\inventory\frontend\src\pages\PurchasesPage.tsx`
2. `E:\inventory\frontend\src\pages\AddPurchasePage.tsx`

**Detailed spec:**
- **PurchasesPage.tsx:**
  - 4 stat cards: Total Orders, Pending, Received, Total Spent (from dashboard stats, or simple count)
  - Table: PO Number (font-mono data-tabular), Supplier, Items Count, Total, Status (Badge with colors: received=secondary/teal, ordered=primary/indigo, pending=tertiary/orange, cancelled=neutral/gray), Date, Actions (view icon)
  - Search + filter by status + pagination
  - "[+] New Purchase Order" button
  - States: loading/error/empty
- **AddPurchasePage.tsx:**
  - Supplier select (searchable via API call to suppliers list)
  - Order Date (Input type=date), Expected Delivery (Input type=date)
  - Dynamic items table: rows with product select (searchable), quantity input, unit price input, line total (calculated), remove button (Material Symbols "close")
  - "[+] Add Item" link/button at bottom of table
  - Notes textarea
  - Total display (right side, calculated from items)
  - Submit → purchaseService.create → navigate to /purchases
  - Cancel → navigate back

**Verify:** `npx tsc --noEmit` passes

## Phase 8: Dashboard Feature (4 LLM steps)

### Step 8.0 — Backend: Dashboard Routes
**Skill:** inventory-backend (§dashboard-builder)
**Agent:** backend-builder → dashboard-builder
**Goal:** Create aggregated dashboard API endpoints

**File to create:**
1. `E:\inventory\backend\src\routes\dashboard.ts`
2. Update `E:\inventory\backend\src\index.ts`

**Detailed spec:**
- **routes/dashboard.ts:** Four endpoints:
  - `GET /stats`: Return aggregated data:
    - `totalProducts`: COUNT of all products
    - `totalStock`: SUM of all product stock
    - `outOfStock`: COUNT where stock = 0
    - `lowStock`: COUNT where stock <= minStock AND stock > 0
    - `totalRevenue`: SUM of Sale.total where createdAt is current month
    - `revenueChange`: percentage change from previous month's totalRevenue
    - `monthlyRevenue`: last 6 months, group by month, sum totals. For SQLite, fetch all sales in date range and aggregate in JS.
  - `GET /recent-sales`: Last 5 sales, include items + user name (for display). Order by createdAt desc.
  - `GET /low-stock`: Products where stock <= minStock, order by stock asc, limit 10.
  - `GET /top-products`: Top 5 products by total quantity sold (from SaleItem) in last 30 days. Sum quantities, group by productName, order desc, limit 5.
- **index.ts:** Mount at `/api/dashboard`.

**Verify:** `npx tsc --noEmit` passes

### Step 8.1 — Frontend: Dashboard Service + useDashboard Hook
**Skill:** inventory-ui
**Agent:** integrator → service-builder + hook-builder
**Goal:** Create dashboard service and hook

**Files to create:**
1. `E:\inventory\frontend\src\services\dashboardService.ts`
2. `E:\inventory\frontend\src\hooks\useDashboard.ts`

**Detailed spec:**
- **dashboardService.ts:** `getStats(): Promise<DashboardStats>` — GET /dashboard/stats. `getRecentSales(): Promise<Sale[]>` — GET /dashboard/recent-sales. `getLowStock(): Promise<Product[]>` — GET /dashboard/low-stock. `getTopProducts(): Promise<{productName, unitsSold, revenue}[]>` — GET /dashboard/top-products.
- **useDashboard.ts:** Fetches all 4 endpoints in parallel with `Promise.all`. Returns `{ stats, recentSales, lowStock, topProducts, loading, error, refetch }`. Stats type: reduced DashboardStats that matches what API returns.

**Verify:** `npx tsc --noEmit` passes

### Step 8.2 — Frontend: Dashboard Sub-Components
**Skill:** inventory-ui (§8.2-8.6 dashboard components)
**Agent:** frontend-builder → page-builder
**Goal:** Create dashboard card, chart, and table components

**Files to create:**
1. `E:\inventory\frontend\src\components\dashboard\StatCard.tsx`
2. `E:\inventory\frontend\src\components\dashboard\RevenueChart.tsx`
3. `E:\inventory\frontend\src\components\dashboard\RecentSales.tsx`
4. `E:\inventory\frontend\src\components\dashboard\LowStockTable.tsx`
5. `E:\inventory\frontend\src\components\dashboard\TopProducts.tsx`

**Detailed spec:**
- **StatCard.tsx:** Props: `title: string, value: string | number, trend?: { value: string, direction: 'up'|'down', isPositive?: boolean }, icon: string, accentColor: 'primary'|'secondary'|'tertiary'`. Uses Card variant='stat' with icon + color. Value: `font-headline-lg text-headline-lg`. Trend: flex row with trend icon (arrow_upward/arrow_downward) colored based on isPositive (teal for positive, red for negative).
- **RevenueChart.tsx:** Props: `data: { month: string, revenue: number }[]`. Uses Recharts `<ResponsiveContainer>` + `<AreaChart>`. Gradient fill: `<linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/><stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/></linearGradient>`. Dark theme: grid stroke="#2d3449", text fill="#c7c4d8". Tooltip: custom with bg-surface-container border border-surface-variant.
- **RecentSales.tsx:** Props: `sales: Sale[]`. List of max 5 sales. Each item: flex row, left: Material Symbols (receipt) + invoiceNo + customerName, right: amount + time ago. "View All →" link at bottom.
- **LowStockTable.tsx:** Props: `products: Product[]`. Uses Table with columns: Product Name, SKU, Stock (with progress bar), Min Stock, Status (Badge: out of stock = error, low = warning). "Restock" action button (outline-primary small).
- **TopProducts.tsx:** Props: `products: { productName: string, unitsSold: number, revenue: number }[]`. Horizontal bar chart using CSS (flex column of bars). Each bar: product name (left) + bar (right, width proportional to max). Bar: `h-6 rounded-full bg-gradient-to-r from-primary-container to-primary` with width as percentage of max.

**Verify:** `npx tsc --noEmit` passes

### Step 8.3 — Frontend: DashboardPage
**Skill:** inventory-ui (§8 dashboard page)
**Agent:** frontend-builder → page-builder
**Goal:** Create the complete dashboard page

**File to create (overwrite stub):**
1. `E:\inventory\frontend\src\pages\DashboardPage.tsx`

**Detailed spec:**
Layout (design.md §8.1):
- 4 StatCards row: Total Products (inventory_2, primary), Total Stock (inventory, secondary), Out of Stock (cancel, error/tertiary), Low Stock (warning, orange/tertiary)
- Row 2: RevenueChart (lg:col-span-8) + RecentSales (lg:col-span-4)
- Row 3: LowStockTable (lg:col-span-8) + TopProducts (lg:col-span-4)
- Quick Actions bar at bottom: 4 cards (Add Product, New Sale, Add Supplier, New Purchase) each with icon, label, subtitle "Create new..." — each navigates to the respective add page
- Grid: `grid grid-cols-1 lg:grid-cols-12 gap-gutter`
- All data from useDashboard hook
- Loading: Skeleton for each section
- Error: ErrorState with retry

**Verify:** `npx tsc --noEmit` passes

## Phase 9: Reports + Settings (4 LLM steps)

### Step 9.0 — Backend: Reports Routes
**Skill:** inventory-backend (§report-builder)
**Agent:** backend-builder → report-builder
**Goal:** Create reports API endpoints

**File to create:**
1. `E:\inventory\backend\src\routes\reports.ts`
2. Update `E:\inventory\backend\src\index.ts`

**Detailed spec:**
- **routes/reports.ts:** Four endpoints (all authenticate + admin/manager):
  - `GET /sales?from&to`: Filter sales by date range. Return totalRevenue, totalOrders, averageOrderValue, dailyRevenue array (group by day), topProducts array (sum quantities).
  - `GET /stock`: Return totalStockValue (SUM of stock * costPrice), stockByCategory (group by category, sum values), lowStockCount, outOfStockCount, full product list with stock info.
  - `GET /purchases?from&to`: Filter purchases by date range (orderDate). Return totalSpent, bySupplier (group by supplier name), monthlyBreakdown array.
  - `GET /profit?from&to`: Calculate totalRevenue (sum of Sale.total), totalCost (sum of costPrice * qty sold for each SaleItem), grossProfit, profitMargin%, monthlyBreakdown array. For cost calculation: for each SaleItem in date range, look up product's costPrice, calculate cost * quantity.
  - All use ISO date strings for from/to query params. Parse with `new Date()`.
- **index.ts:** Mount at `/api/reports`.

**Verify:** `npx tsc --noEmit` passes

### Step 9.1 — Frontend: Report Service + ReportsPage
**Skill:** inventory-ui (§7 analytics page), inventory-backend
**Agent:** integrator → service-builder, frontend-builder → page-builder
**Goal:** Create reports page with charts

**Files to create:**
1. `E:\inventory\frontend\src\services\reportService.ts`
2. `E:\inventory\frontend\src\pages\ReportsPage.tsx` (overwrite stub)

**Detailed spec:**
- **reportService.ts:** `getSales(params): Promise<any>`, `getStock(params): Promise<any>`, `getPurchases(params): Promise<any>`, `getProfit(params): Promise<any>`. All GET requests with query params.
- **ReportsPage.tsx:**
  - Tabs: Sales Report | Stock Report | Purchase Report | Profit & Loss (styled as pill buttons like category pills)
  - Time range filter: pill buttons for 7D, 30D, 90D, Custom (date inputs)
  - Sales tab:
    - Metric cards: Total Revenue, Total Orders, Avg Order Value
    - AreaChart (revenue over time, using Recharts)
    - BarChart (revenue by category)
    - Top Products table (5 items)
  - Stock tab:
    - BarChart (stock value by category)
    - Full product table with stock, minStock, status
  - Purchase tab:
    - BarChart (monthly purchases)
    - Recent POs table
  - Profit tab:
    - LineChart (revenue vs cost, two lines)
    - Summary cards: Total Revenue, Total Cost, Gross Profit, Profit Margin %
  - Loading/error/empty states per tab

**Verify:** `npx tsc --noEmit` passes

### Step 9.2 — Frontend: SettingsPage
**Skill:** inventory-ui (§12 settings page)
**Agent:** frontend-builder → page-builder
**Goal:** Create settings page with tabbed interface

**File to create (overwrite stub):**
1. `E:\inventory\frontend\src\pages\SettingsPage.tsx`

**Detailed spec:**
Layout: flex row gap-6
- Left: Settings sidebar (w-56) with tab navigation:
  - General, Notifications, Users, Billing, Appearance
  - Active tab: `border-l-2 border-primary bg-primary-container/10 pl-4` — else `pl-4 text-on-surface-variant hover:text-on-surface`
  - Each tab item as button with icon + label
- Right (flex-1): Content area
  - General tab: Card with Store Name, Address, Currency (select ₹ $ € £), Tax Rate (%, Input), Low Stock Threshold (Input), Timezone (Select), Date Format (Select). Save button at bottom.
  - Notifications tab: Card with Low Stock Alerts (Toggle), Daily Summary (Toggle), Email Notifications (Toggle + email Input). Save button.
  - Users tab (admin only): Table of users (from userService API — create stub if not done). Columns: Name, Email, Role (Badge), Status, Last Login, Actions (Edit/Deactivate). [+ Add User] button.
  - Billing tab: Plan info (Free tier), invoice history table, [Upgrade] button (disabled, shows "Coming Soon").
  - Appearance tab: Theme (Dark/Light/System radio buttons), Compact Mode (Toggle), Font Size (Select: Small/Normal/Large).

All form fields use standard Input/Select/Toggle components. Each section is a Card. Save buttons at bottom of each section (bg-primary-container text-primary-fixed).

**Verify:** `npx tsc --noEmit` passes

## Phase 10: Polish (4 LLM steps)

### Step 10.0 — NotificationContext + Toast Wiring
**Skill:** inventory-ui (§13 toasts)
**Agent:** frontend-builder → context-builder
**Goal:** Create notification system and wire toasts

**Files to create:**
1. `E:\inventory\frontend\src\context\NotificationContext.tsx`
2. `E:\inventory\frontend\src\components\layout\ToastContainer.tsx`
3. Update `E:\inventory\frontend\src\App.tsx` (wrap with NotificationProvider)

**Detailed spec:**
- **NotificationContext.tsx:** State: `notifications: { id: string, type, message, description, duration }[]`. Actions: `addNotification(type, message, description?)`, `dismissNotification(id)`, `clearAll()`. Auto-generate IDs. Export `useNotification()`.
- **ToastContainer.tsx:** Fixed position top-right z-[100]. Reads notifications from context. Renders Toast component for each (with onDismiss). Animate entry/exit.
- **App.tsx:** Wrap with `<NotificationProvider>` after AuthProvider.
- **Wire toasts into existing pages:**
  - ProductsPage: after delete → addNotification('success', 'Product deleted', 'Product has been deleted successfully.'). After create/update success (passed from Add/Edit pages).
  - SalesPage: after place order → addNotification('success', 'Sale created', `Invoice ${invoiceNo} generated.`). On error → addNotification('error', 'Sale failed', error.message).
  - Suppliers/Purchases pages: similar pattern.
- **Wire API errors:** In api.ts response interceptor, on non-401 errors, add generic error toast.

**Verify:** `npx tsc --noEmit` passes

### Step 10.1 — Role-Based UI + ProtectedRoute
**Skill:** inventory-ui
**Agent:** frontend-builder → page-builder
**Goal:** Implement role-based access control

**Files to modify:**
1. `E:\inventory\frontend\src\components\layout\AppShell.tsx` — add role check for routes
2. `E:\inventory\frontend\src\pages\ProductsPage.tsx` — hide delete for staff
3. `E:\inventory\frontend\src\pages\SettingsPage.tsx` — hide Users tab for non-admin
4. `E:\inventory\frontend\src\components\ui\Button.tsx` — add permission check? No — keep buttons but hide/show parent sections

**Detailed spec:**
- Create `E:\inventory\frontend\src\components\layout\ProtectedRoute.tsx`:
  - Checks `isAuthenticated` from useAuth(). If not → `<Navigate to="/login" state={{ from: location }} replace />`.
  - Optionally checks `allowedRoles`: if user role not in allowedRoles → show 403 Forbidden page.
  - Wraps AppShell routes.
- **AppShell.tsx:** Use ProtectedRoute wrapper.
- **Pages:** Use `useAuth()` to get user. Conditionally render delete/edit buttons based on role:
  - admin: all buttons visible
  - manager: delete buttons hidden, edit/show visible
  - staff: delete hidden, create new hidden, edit visible (if allowed)

**Verify:** `npx tsc --noEmit` passes

### Step 10.2 — States Audit: Loading/Error/Empty for All Pages
**Skill:** inventory-ui (§14 empty states, loading, error)
**Agent:** feature-verify → verify-states
**Goal:** Ensure every page handles all 3 states

**Files to audit/modify:**
- All page components: DashboardPage, ProductsPage, AddProductPage, EditProductPage, ProductDetailPage, SalesPage, SuppliersPage, AddSupplierPage, PurchasesPage, AddPurchasePage, ReportsPage, SettingsPage
- All sub-components that fetch data: ProductTable, ProductSelector, CartPanel, etc.

**Detailed spec:**
Check each page/component for:
1. **Loading state:** Show Skeleton component while `loading === true`. Skeletons should match the page layout (e.g., Skeleton cards for stat cards, Skeleton table for table, Skeleton chart for chart).
2. **Error state:** Show EmptyState (or inline error) when `error !== null`. Include retry button that calls `refetch()`. Show specific error message (design.md §14.3).
3. **Empty state:** Show EmptyState component when `data` is empty array and not loading. Use page-appropriate icon and message. Include CTA button (e.g., "Add your first product").
4. **Edge case:** Verify all empty messages are unique per page, not generic.

Add missing states. Fix any page that lacks one or more states.

**Verify:** Review each page file, verify states exist, `npx tsc --noEmit` passes

### Step 10.3 — Edge Cases + Polish
**Skill:** inventory-ui (§15 edge cases)
**Agent:** feature-verify → verify-edge-cases
**Goal:** Handle all edge cases across the app

**Items to implement:**
1. **Long product names:** Add `line-clamp-1` + `title` attribute for all product name display elements.
2. **Zero stock:** Rows in ProductTable tinted with `bg-error/5`. Product cards show "OUT" badge.
3. **Empty cart:** CartPanel shows EmptyState with cart icon + "Cart is empty" + "Add products to get started".
4. **No search results:** EmptyState with icon="search_off", title="No results found for '{query}'", description="Try adjusting your search criteria".
5. **Duplicate SKU error:** On AddProductPage, if API returns 409 with "SKU already exists", show inline error on SKU field (not generic toast).
6. **Negative stock prevention:** Backend sale creation checks stock before decrementing. Frontend ProductSelector disables out-of-stock products.
7. **404 route:** NotFoundPage with icon, "Page not found", description, "Go to Dashboard" button.
8. **API timeout:** Simulate with 30s timeout — error state shows (no special handling needed since error state already covers this).
9. **Form validation on submit:** Every form validates all fields before submit. Show inline errors per field. Disable submit button until valid (or always allow and show errors).
10. **Cancel vs back:** All add/edit pages have Cancel button that navigates back without saving.

**Verify:** Read each page, add missing edge case handling. `npx tsc --noEmit` passes.

## Phase 11: Final Verification (1 step)

### Step 11.0 — Full Integration Smoke Test
**Agent:** code-quality-review → all subAgents
**Goal:** Run the complete application and verify all features end-to-end

**Actions:**
1. `cd E:\inventory\backend && npx prisma migrate dev --name final && npx tsx src/seed.ts`
2. `cd E:\inventory\backend && npx tsx src/index.ts` (start backend in background)
3. `cd E:\inventory\frontend && npm run build` (verify production build)
4. Test flows (manual verification by running curl/scripts):
   - Login as admin@omni.com / password123 → get JWT token
   - GET /api/products with token → returns products
   - GET /api/dashboard/stats → returns stats
   - POST /api/sales with items → creates sale, stock decremented
5. Fix any TypeScript, build, or runtime errors found.

**Verification commands:**
```bash
# Start backend
cd E:\inventory\backend
npx tsx src/index.ts &
# Login test
curl -s -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@omni.com\",\"password\":\"password123\"}"
# Get products
curl -s http://localhost:3001/api/products -H "Authorization: Bearer <TOKEN>"
# Get dashboard
curl -s http://localhost:3001/api/dashboard/stats -H "Authorization: Bearer <TOKEN>"
# Build frontend
cd E:\inventory\frontend
npm run build
```

**Result:** Application compiles and runs without errors. All API endpoints return correct data. Frontend builds to dist/.

---

## Summary of All Steps

| Step | Phase | What | Files | Verify |
|---|---|---|---|---|
| 0.0 | Env | Scaffold frontend with Vite | — | frontend/ exists |
| 0.1 | Env | Install frontend deps | — | npm ls |
| 0.2 | Env | Init backend + deps + prisma | — | backend/ + prisma/ exists |
| 0.3 | Env | Create directory structure | — | All dirs exist |
| 1.0 | Config | Vite config + globals.css + index.html | 3 | npm run build |
| 1.1 | Config | Tailwind theme tokens in globals.css | 1 | npm run build |
| 1.2 | Config | shared/types.ts | 1 | Read file |
| 2.0 | Backend | Prisma schema (9 models) | 1 | prisma generate |
| 2.1 | Backend | Express entry + error handler + validate | 3 | tsc --noEmit |
| 2.2 | Backend | JWT utils + password + auth middleware | 3 | tsc --noEmit |
| 2.3 | Backend | Auth routes | 2 | tsc --noEmit |
| 2.4 | Backend | Seed script | 1 | seed runs |
| 3.0 | UI Kit | Button + Input + Badge | 3 | tsc --noEmit |
| 3.1 | UI Kit | Select + Textarea + Card + index.ts | 4 | tsc --noEmit |
| 3.2 | UI Kit | Table + Pagination + Modal | 3 | tsc --noEmit |
| 3.3 | UI Kit | Toast + Toggle + ConfirmDialog + Skeleton + EmptyState + SearchInput | 6 | tsc --noEmit |
| 3.4 | Layout | Sidebar + Topbar | 2 | tsc --noEmit |
| 3.5 | Layout | Breadcrumb + AppShell + 14 page stubs | 16 | tsc --noEmit |
| 3.6 | Routing | App.tsx router + api.ts + authService.ts | 3 | tsc --noEmit + build |
| 3.7 | Auth | AuthContext + LoginPage + wiring | 3+updates | tsc --noEmit |
| 3.8 | Utils | formatCurrency + formatDate + cn + constants | 4 | tsc --noEmit |
| 4.0 | Products | Backend product validators | 1 | tsc --noEmit |
| 4.1 | Products | Backend product routes | 1+update | tsc --noEmit |
| 4.2 | Products | Frontend productService + useProducts + useDebounce | 3 | tsc --noEmit |
| 4.3 | Products | ProductFilters + ProductTable | 2 | tsc --noEmit |
| 4.4 | Products | ProductForm | 1 | tsc --noEmit |
| 4.5 | Products | ProductsPage | 1 | tsc --noEmit |
| 4.6 | Products | AddProductPage + EditProductPage + ProductDetailPage | 3 | tsc --noEmit |
| 5.0 | Sales | Backend sale validators + routes | 2+update | tsc --noEmit |
| 5.1 | Sales | CartContext | 1 | tsc --noEmit |
| 5.2 | Sales | saleService + useSales | 2 | tsc --noEmit |
| 5.3 | Sales | ProductSelector + CartPanel | 2 | tsc --noEmit |
| 5.4 | Sales | InvoiceModal + SalesPage | 2 | tsc --noEmit |
| 6.0 | Suppliers | Backend supplier validators + routes | 2+update | tsc --noEmit |
| 6.1 | Suppliers | supplierService + useSuppliers | 2 | tsc --noEmit |
| 6.2 | Suppliers | SuppliersPage + AddSupplierPage | 2 | tsc --noEmit |
| 7.0 | Purchases | Backend purchase validators + routes | 2+update | tsc --noEmit |
| 7.1 | Purchases | purchaseService + usePurchases | 2 | tsc --noEmit |
| 7.2 | Purchases | PurchasesPage + AddPurchasePage | 2 | tsc --noEmit |
| 8.0 | Dashboard | Backend dashboard routes | 1+update | tsc --noEmit |
| 8.1 | Dashboard | dashboardService + useDashboard | 2 | tsc --noEmit |
| 8.2 | Dashboard | StatCard + RevenueChart + RecentSales + LowStockTable + TopProducts | 5 | tsc --noEmit |
| 8.3 | Dashboard | DashboardPage | 1 | tsc --noEmit |
| 9.0 | Reports | Backend reports routes | 1+update | tsc --noEmit |
| 9.1 | Reports | reportService + ReportsPage | 2 | tsc --noEmit |
| 9.2 | Settings | SettingsPage | 1 | tsc --noEmit |
| 10.0 | Polish | NotificationContext + ToastContainer + wiring | 2+updates | tsc --noEmit |
| 10.1 | Polish | Role-based UI + ProtectedRoute | 1+updates | tsc --noEmit |
| 10.2 | Polish | States audit | 0 (audit + fixes) | tsc --noEmit |
| 10.3 | Polish | Edge cases | 0 (audit + fixes) | tsc --noEmit |
| 11.0 | Verify | Full integration smoke test | 0 | build + API test |

**Total: 48 steps (5 bash + 43 LLM) | ~120 files created | Estimated 12-16 hours**
