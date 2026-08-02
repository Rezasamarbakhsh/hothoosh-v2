# Development Rules

## HotHoosh — Development Reference

---

> **This document is a reference index.** The authoritative engineering standards are defined in `Engineering-Rules.md` (Phase 10). This file exists to provide a quick-reference summary and to document the tech stack and project structure.

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|--------|
| Monorepo | Turborepo | latest | Build orchestration, remote caching |
| Package Manager | pnpm | 9.x | Fast, disk-efficient package management |
| Frontend Framework | Next.js | 15.x | React framework with App Router |
| UI Rendering | React | 19.x | Component library |
| Language | TypeScript | 5.x | Type-safe development |
| Styling | Tailwind CSS | 4.x | Utility-first CSS |
| Component Library | shadcn/ui | latest | Accessible, composable components |
| State (Server) | TanStack Query | 5.x | Server state management |
| State (Client) | Zustand | 5.x | Client state management |
| Forms | React Hook Form | 7.x | Form state + validation |
| Validation | Zod | 3.x | Schema validation |
| Backend Framework | NestJS | 10.x | Modular Node.js framework |
| ORM | TypeORM | latest | PostgreSQL ORM |
| Database | PostgreSQL | 16.x | Primary database |
| Vector Search | pgvector | 0.7.x | Vector embeddings + HNSW |
| Cache / Queue | Redis | 7.x | Caching, sessions, BullMQ |
| Queue | BullMQ | 5.x | Background job processing |
| Storage | S3-compatible | — | Document and file storage |
| Font | Vazirmatn | latest | Persian typography |
| Calendar | jalaali-js | latest | Solar Hijri (Jalali) calendar |
| Icons | Phosphor Icons | latest | Icon set with RTL support |
| Charts | ECharts | 5.x | Data visualization |
| Testing (Unit) | Vitest | latest | Fast unit testing |
| Testing (Component) | Testing Library | latest | Accessible component testing |
| Testing (E2E) | Playwright | latest | End-to-end testing |
| Linting | ESLint | 9.x | Code quality |
| Formatting | Prettier | 3.x | Code formatting |
| Git Hooks | Husky + lint-staged | latest | Pre-commit quality gates |
| Commit Linting | commitlint | latest | Conventional Commits enforcement |

---

## Project Structure

See `Engineering-Rules.md` §10.2 for the complete monorepo folder structure.

**Quick reference:**

```
hotHoosh/
├── apps/
│   ├── web/              # Next.js workspace (user-facing)
│   ├── admin/            # Next.js admin panel
│   └── api/              # NestJS backend
├── packages/
│   ├── shared/           # Types, constants, validators, utils
│   └── ui/               # Shared React component library
├── docs/                 # Design documents
├── scripts/              # Build and utility scripts
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Coding Standards

**All coding standards are defined in `Engineering-Rules.md` §10.1.**

Key rules summary:

- TypeScript strict mode with 10+ compiler flags
- No `any`, no `as` casts without `// SAFETY:` comment, no non-null assertions
- No default exports, no TypeScript enums
- Functional components only, no class components
- No `useEffect` for data fetching (use TanStack Query)
- NestJS with Zod validation (not class-validator)
- RTL logical properties only (no `left`/`right`)
- No `console.log` (use structured logger)
- No TODO without ticket reference
- Functions max 30 lines, files max 300 lines

---

## Git Workflow

**All git rules are defined in `Engineering-Rules.md` §10.9–10.11.**

Quick reference:

- **Branch naming**: `{type}/{ticket}-{description}` (e.g., `feat/HOT-1234-user-search`)
- **Commit format**: Conventional Commits (`feat(scope): subject`)
- **PR size limit**: 400 lines of changed code
- **Approvals**: 1 required (2 for security/billing)
- **Merge strategy**: Squash merge to `main`
- **Pre-commit hooks**: lint-staged (ESLint + Prettier), tsc, git-secrets, commitlint

---

## Testing

**All testing rules are defined in `Engineering-Rules.md` §10.5.**

Quick reference:

- **Unit tests**: 90%+ branch coverage on services. AAA pattern. Test factories.
- **Integration tests**: Real database, real Zod validation. Only external services mocked.
- **E2E tests**: Critical user journeys only (10-15). Page Object Model. Run in CI only.
- **Component tests**: Testing Library. Query by role, not by class. Test accessible behavior.

---

## Code Review Checklist

See `Engineering-Rules.md` §10.10 for the full PR requirements and review rules.

---

## Related Documents

| Document | Description |
|----------|-------------|
| `Engineering-Rules.md` | **Authoritative** — All non-violable engineering standards |
| `Architecture.md` | System architecture and design decisions |
| `Database.md` | Complete database schema |
| `Backend-Architecture.md` | NestJS module and engine design |
| `Frontend-Architecture.md` | Next.js and component architecture |
| `UI-System.md` | Design tokens and component library |
| `Agent-System.md` | AI system and engine design |
| `Admin-Panel.md` | Admin panel page designs |
| `PRD.md` | Product requirements |
| `Information-Architecture.md` | Site map and navigation |