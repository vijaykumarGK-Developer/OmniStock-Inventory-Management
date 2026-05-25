# Contributing to OmniStock

Thank you for considering contributing! This document outlines the setup and workflow.

## Development Setup

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### 1. Clone and Install

```bash
git clone https://github.com/vijaykumarGK-Developer/OmniStock-Inventory-Management.git
cd omnistock-inventory

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Database

```bash
cd backend
npx prisma migrate dev --name init
npm run seed
```

### 3. Run

```bash
# Terminal 1
cd backend && npm run dev     # → localhost:3001

# Terminal 2
cd frontend && npm run dev    # → localhost:5173
```

## Code Style

- **TypeScript strict mode** — no `any`, no `@ts-ignore`
- **React** — functional components with hooks
- **Express** — route handlers with `next(error)` pattern
- **Prisma** — all queries via generated client

## Branch Workflow

1. Create a feature branch from `main`: `git checkout -b feat/my-feature`
2. Make your changes
3. Run `npx tsc --noEmit` to check types
4. Commit with a descriptive message
5. Open a pull request

## Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Include screenshots for UI changes
- Update API docs in `docs/api.md` if endpoints change
- Verify the build: `cd frontend && npx vite build`

## Project Structure

```
backend/src/
  lib/          Prisma client
  middleware/   Auth, error handler, validation
  routes/       API endpoints
  utils/        JWT, password hashing
  validators/   Zod schemas

frontend/src/
  components/   UI primitives, layout, feature components
  context/      Auth & notification providers
  hooks/        Custom data hooks
  pages/        Route pages
  services/     Axios API clients
  styles/       Tailwind globals & theme
  utils/        Formatting utilities
```

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
