# Changelog

## [1.0.0] — 2026-05-25

### Added
- Full inventory management system with React 19 + Express 5 + SQLite
- Dashboard with revenue chart, recent sales, low-stock alerts, top products
- Product CRUD with search, filters, sorting, and pagination
- Sales / POS system with cart, invoice generation, and stock decrement
- Supplier management with contact info and purchase tracking
- Purchase orders with status workflow (pending → received → cancelled)
- Reports & analytics (sales, stock, purchase, profit)
- JWT authentication with 3 roles (admin, manager, staff)
- Dark/light/system theme support with Kinetic Enterprise design system
- Reusable UI component library (Table, Modal, Toast, Card, Button, etc.)
- Responsive glassmorphic layout with sidebar navigation
- Settings page with persistence (localStorage)
- Toast notification system
- Role-based access control (UI + API)
- Seed script with demo data (3 users, 20 products, 5 suppliers, 2 sales, 1 PO)

### Technical
- TypeScript strict mode throughout
- Prisma 7 ORM with SQLite
- Zod validation on all API routes
- Tailwind CSS v4 with custom design tokens
- Recharts for interactive charts
- Axios API layer with JWT interceptors
- Vite 8 for frontend build
