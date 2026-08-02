# System Architecture

## HotHoosh — Enterprise AI Workspace

---

## Table of Contents

1. [High-Level Architecture](#1-high-level-architecture)
2. [Component Diagram](#2-component-diagram)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Backend Architecture](#4-backend-architecture)
5. [Shared Layer](#5-shared-layer)
6. [Data Flow](#6-data-flow)
7. [Infrastructure](#7-infrastructure)
8. [Key Design Decisions](#8-key-design-decisions)

---

## 1. High-Level Architecture

### 1.1 Monorepo Structure

HotHoosh is a **Turborepo + pnpm** monorepo containing three applications and two packages. Turborepo provides task orchestration with remote caching and parallel execution; pnpm provides strict, content-addressable dependency management that prevents phantom dependencies.

```
hotHoosh/
├── apps/
│   ├── web/                    # Next.js 15 — User workspace (chat, agents, knowledge)
│   ├── admin/                  # Next.js 15 — Admin panel (management, analytics, settings)
│   └── api/                    # NestJS   — Single API server (modular monolith)
├── packages/
│   ├── shared/                 # Branded types, Zod validators, constants, pure utilities
│   ├── ui/                     # Shared React component library (shadcn/ui + custom)
│   └── eslint-config/          # Shared ESLint configuration
├── docs/                       # PRD, Database, Backend Architecture, Agent System, etc.
├── scripts/                    # Build, deploy, and utility scripts
├── turbo.json                  # Turborepo pipeline configuration
├── pnpm-workspace.yaml         # Workspace package references
├── tsconfig.base.json          # Shared TypeScript strict config
├── .eslintrc.cjs               # Root ESLint config
├── .prettierrc                 # Prettier configuration
└── package.json                # Root workspace scripts
```

**Turborepo pipeline:** Build, lint, type-check, and test tasks are orchestrated with `turbo.json`. Tasks are cacheable by file hash, enabling instant re-runs on unchanged code. The `topo` dependency order ensures `packages/shared` builds before `apps/web`.

### 1.2 High-Level Component Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                         │
│                                                                              │
│  ┌─────────────────────────┐        ┌─────────────────────────────────┐    │
│  │     apps/web            │        │         apps/admin              │    │
│  │  (Next.js 15 App Router)│        │  (Next.js 15 App Router)       │    │
│  │                         │        │                                 │    │
│  │  • User workspace       │        │  • Dashboard & analytics       │    │
│  │  • Chat interface       │        │  • User/tenant management      │    │
│  │  • Agent selection      │        │  • Billing & audit logs        │    │
│  │  • Knowledge explorer   │        │  • AI provider management      │    │
│  │                         │        │                                 │    │
│  │  Zustand  TanStack Query│        │  Zustand  TanStack Query       │    │
│  │  RHF+Zod  SSE client    │        │  RHF+Zod  DataTable            │    │
│  └──────────┬──────────────┘        └──────────────┬──────────────────┘    │
│             │                                      │                       │
│             │          packages/shared             │                       │
│             │     (types, validators, constants)   │                       │
│             │                                      │                       │
│             │          packages/ui                 │                       │
│             │     (shadcn/ui + custom components)  │                       │
│             │                                      │                       │
└─────────────┼──────────────────────────────────────┼───────────────────────┘
              │  HTTPS / SSE (text/event-stream)     │
              └──────────────────┬───────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                           API GATEWAY (NestJS)                               │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────┐      │
│  │                    Common Cross-Cutting Concerns                  │      │
│  │                                                                   │      │
│  │  JwtAuthGuard → TenantScopeGuard → RolesGuard → ImpersonationGuard│      │
│  │  ZodValidationPipe │ DomainExceptionFilter │ LoggingInterceptor  │      │
│  └───────────────────────────────────────────────────────────────────┘      │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        12 DOMAIN MODULES                           │    │
│  │                                                                     │    │
│  │  auth  users  orgs  companies  brands  workspaces                  │    │
│  │  agents  chat  knowledge  memory  billing  audit                   │    │
│  └──────────────────────────────┬──────────────────────────────────────┘    │
│                                 │                                          │
│  ┌──────────────────────────────┴──────────────────────────────────────┐    │
│  │                         6 ENGINE MODULES                            │    │
│  │                                                                     │    │
│  │  llm-router  context-engine  rag-engine  memory-engine             │    │
│  │  tool-engine  streaming-engine                                     │    │
│  └──────────────────────────────┬──────────────────────────────────────┘    │
│                                 │                                          │
└─────────────────────────────────┼────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         INFRASTRUCTURE LAYER                                │
│                                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────────────────┐  │
│  │ PostgreSQL │  │   Redis    │  │  S3-compat │  │      BullMQ          │  │
│  │  16+       │  │   7+       │  │  (MinIO)   │  │   (11 queues)        │  │
│  │            │  │            │  │            │  │                      │  │
│  │ • pgvector │  │ • Sessions │  │ • Documents│  │ • document-processing│  │
│  │ • RLS      │  │ • Cache    │  │ • Avatars  │  │ • embedding-gen      │  │
│  │ • JSONB    │  │ • Rate lim │  │ • Logos    │  │ • health-check       │  │
│  │ • FTS      │  │ • Queues   │  │ • Exports  │  │ • email-sending      │  │
│  │ • Partitns │  │ • SSE conn │  │            │  │ • usage-aggregation  │  │
│  └────────────┘  └────────────┘  └────────────┘  └──────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  SMTP (Nodemailer) — Transactional emails                            │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Diagram

### 2.1 Detailed Layer Diagram

The following diagram shows every major component and its data-flow connections. Arrows indicate the direction of synchronous calls or data flow; dashed lines indicate asynchronous event-driven communication.

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                            CLIENT LAYER                                     ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  ┌─────────────────────────────┐   ┌──────────────────────────────────┐   ║
║  │       apps/web (Next.js)    │   │      apps/admin (Next.js)        │   ║
║  │                              │   │                                  │   ║
║  │  Route Groups:               │   │  Route Groups:                   │   ║
║  │   (auth)  → login, register  │   │   (auth) → login                 │   ║
║  │   (workspace) → chat,        │   │   (admin) → dashboard, users,   │   ║
║  │      agents, knowledge,      │   │      orgs, companies, brands,    │   ║
║  │      memory, settings        │   │      agents, knowledge, api-     │   ║
║  │                              │   │      providers, models, usage,   │   ║
║  │  Features:                   │   │      billing, audit, logs,       │   ║
║  │   auth, chat, agents,        │   │      roles, settings              │   ║
║  │   knowledge, memory,         │   │                                  │   ║
║  │   workspace, settings        │   │  Shared Admin Components:        │   ║
║  │                              │   │   data-table, filter-bar,         │   ║
║  │  State Management:           │   │   stat-card, command-palette,     │   ║
║  │   Zustand (client),          │   │   confirmation-dialog, etc.      │   ║
║  │   TanStack Query (server),   │   │                                  │   ║
║  │   React Hook Form (form)     │   │  State: same pattern as web      │   ║
║  │                              │   │                                  │   ║
║  │  SSE Consumer:               │   │  SSE Consumer: system-log        │   ║
║  │   EventSource API for        │   │   streaming via EventSource      │   ║
║  │   AI response streaming      │   │                                  │   ║
║  └──────────────┬───────────────┘   └──────────────┬─────────────────────┘   ║
║                 │                                   │                         ║
║  packages/shared│←─ types, validators, constants ──→│packages/shared          ║
║  packages/ui    │←─ Button, Input, Dialog, ... ────→│packages/ui             ║
╚═════════════════╪═════════════════════════════════╪═════════════════════════╝
                  │          HTTPS + SSE             │
                  └───────────────┬─────────────────┘
                                  │
╔═════════════════════════════════╪══════════════════════════════════════════╗
║                           │  API GATEWAY (NestJS)                        ║
║  ┌───────────────────────▼───────────────────────────────────────────┐    ║
║  │                    Guards & Pipeline                              │    ║
║  │                                                                    │    ║
║  │  Request → CORS → RateLimit → JwtAuthGuard → TenantScopeGuard     │    ║
║  │         → RolesGuard → ImpersonationGuard → ZodValidationPipe     │    ║
║  │         → Controller → Service → Response (or DomainException)    │    ║
║  └───────────────────────────────────────────────────────────────────┘    ║
║                                                                            ║
║  ┌───────────────────────────────────────────────────────────────────┐   ║
║  │                    12 DOMAIN MODULES                               │   ║
║  │                                                                    │   ║
║  │  ┌─────────┐ ┌─────────┐ ┌────────────┐ ┌──────────┐             │   ║
║  │  │  auth   │ │  users  │ │organizations│ │companies │             │   ║
║  │  │         │ │         │ │            │ │          │             │   ║
║  │  │ login,  │ │ CRUD,   │ │ lifecycle, │ │ CRUD in  │             │   ║
║  │  │ regis-  │ │ profile,│ │ settings,  │ │ org scope │             │   ║
║  │  │ ter,    │ │ search, │ │ plan mgmt  │ │          │             │   ║
║  │  │ 2FA,    │ │ prefs  │ │            │ │          │             │   ║
║  │  │ refresh,│ │         │ │            │ │          │             │   ║
║  │  │imperson.│ │         │ │            │ │          │             │   ║
║  │  └────┬────┘ └────┬────┘ └─────┬──────┘ └────┬─────┘             │   ║
║  │       │           │            │               │                   │   ║
║  │  ┌────┴────┐ ┌────┴────┐ ┌────┴──────┐ ┌────┴──────┐            │   ║
║  │  │ brands  │ │workspc. │ │  agents   │ │   chat    │            │   ║
║  │  │         │ │         │ │           │ │           │            │   ║
║  │  │ visual  │ │ members,│ │ lifecycle,│ │ sessions, │            │   ║
║  │  │ identity│ │settings,│ │ tool/know/│ │ messages, │            │   ║
║  │  │         │ │ model   │ │ memory    │ │ branching │            │   ║
║  │  │         │ │ restrict│ │ bindings  │ │           │            │   ║
║  │  └────┬────┘ └────┬────┘ └─────┬─────┘ └─────┬─────┘            │   ║
║  │       │           │            │              │                   │   ║
║  │  ┌────┴────┐ ┌────┴────┐ ┌────┴──────┐ ┌────┴──────┐            │   ║
║  │  │knowledge│ │ memory  │ │  billing  │ │   audit   │            │   ║
║  │  │         │ │         │ │           │ │           │            │   ║
║  │  │ KB CRUD,│ │ pack    │ │ plans,    │ │ audit &   │            │   ║
║  │  │ upload, │ │ versions,│ │ invoices, │ │ system    │            │   ║
║  │  │ process │ │ diff,   │ │ usage,    │ │ logs      │            │   ║
║  │  │ pipeline│ │ rollback│ │ payments  │ │           │            │   ║
║  │  └─────────┘ └─────────┘ └───────────┘ └───────────┘            │   ║
║  │                                                                    │   ║
║  │  Inter-module communication: Domain Events (in-memory bus + Redis)│   ║
║  └───────────────────────────────────────────────────────────────────┘   ║
║                                                                            ║
║  ┌───────────────────────────────────────────────────────────────────┐   ║
║  │                     6 ENGINE MODULES                               │   ║
║  │                                                                    │   ║
║  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐             │   ║
║  │  │ llm-router  │  │context-engine│  │  rag-engine  │             │   ║
║  │  │             │  │              │  │              │             │   ║
║  │  │ 5-step      │  │ Token budget │  │ Document     │             │   ║
║  │  │ routing     │  │ allocation   │  │ processing   │             │   ║
║  │  │ pipeline,   │  │ Priority     │  │ pipeline,    │             │   ║
║  │  │ health mon, │  │ reduction    │  │ hybrid search│             │   ║
║  │  │ failover,   │  │ Context      │  │ Persian NLP  │             │   ║
║  │  │ circuit brk │  │ assembly     │  │ embedding    │             │   ║
║  │  └──────┬──────┘  └──────┬───────┘  └──────┬───────┘             │   ║
║  │         │                │                  │                      │   ║
║  │  ┌──────┴──────┐  ┌──────┴───────┐  ┌──────┴───────┐             │   ║
║  │  │memory-engine│  │ tool-engine  │  │streaming     │             │   ║
║  │  │             │  │              │  │-engine       │             │   ║
║  │  │ Hierarchical│  │ Tool         │  │              │             │   ║
║  │  │ memory      │  │ registry,    │  │ SSE conn.    │             │   ║
║  │  │ assembly,   │  │ validation,  │  │ mgmt, event  │             │   ║
║  │  │ resolution, │  │ sandbox exec,│  │ emission,    │             │   ║
║  │  │ injection   │  │ result format│  │ backpressure │             │   ║
║  │  └─────────────┘  └──────────────┘  └──────────────┘             │   ║
║  └───────────────────────────────────────────────────────────────────┘   ║
║                                                                            ║
║  ┌───────────────────────────────────────────────────────────────────┐   ║
║  │                   INFRASTRUCTURE MODULES                           │   ║
║  │                                                                    │   ║
║  │  database/  │  redis/  │  queue/  │  storage/  │  search/          │   ║
║  │  (TypeORM) │ (ioredis)│ (BullMQ)│  (S3 SDK)  │  (pg FTS)         │   ║
║  └───────────────────────────────────────────────────────────────────┘   ║
╚═══════════════════════════════════════════════════════════════════════════════╝
         │              │              │              │             │
         ▼              ▼              ▼              ▼             ▼
  ┌─────────────┐ ┌───────────┐ ┌──────────┐ ┌────────────┐ ┌──────────┐
  │ PostgreSQL  │ │   Redis   │ │  BullMQ  │ │  S3-compat │ │  SMTP    │
  │  16+        │ │   7+      │ │ (on Redis)│ │  (MinIO)   │ │          │
  └─────────────┘ └───────────┘ └──────────┘ └────────────┘ └──────────┘
```

### 2.2 Module Dependency Graph

```
                    ┌──────────┐
                    │  audit   │  (leaf — no outgoing dependencies)
                    └──────────┘
                         ↑
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│  users   │──→│   auth   │   │ billing  │   │ knowledge│   │  memory  │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
      ↑                             ↑              ↑                ↑
┌──────────┐   ┌──────────┐   ┌──────────┐                          │
│  orgs    │──→│companies │──→│  brands  │──────────→ workspaces ←───┘
└──────────┘   └──────────┘   └──────────┘             │
                                                      │
                                              ┌───────┴───────┐
                                              │    agents     │
                                              └───────┬───────┘
                                                      │
                                              ┌───────┴───────┐
                                              │     chat      │
                                              └───┬───┬───┬───┘
                                                  │   │   │
                                ┌─────────────────┘   │   └──────────┐
                                │                     │              │
                         ┌──────┴──────┐        ┌────┴────┐   ┌─────┴─────┐
                         │ llm-router  │        │context  │   │streaming  │
                         └──────┬──────┘        │ engine  │   │  engine   │
                                │               └────┬────┘   └───────────┘
                         ┌──────┴──────┐             │
                         │  rag-engine │←────────────┘
                         └──────┬──────┘
                                │
                         ┌──────┴──────┐
                         │tool-engine  │
                         └─────────────┘
                         ┌─────────────┐
                         │memory-engine│
                         └─────────────┘
```

---

## 3. Frontend Architecture

### 3.1 Framework and Tooling

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|--------|
| Framework | Next.js (App Router) | 15+ | SSR, routing, code splitting, API integration |
| Language | TypeScript | 5.x | Strict mode with `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` |
| Styling | Tailwind CSS | 4.x | Utility-first CSS with RTL logical properties |
| Components | shadcn/ui | latest | Accessible, composable component primitives |
| Client State | Zustand | 5.x | Lightweight, minimal-boilerplate state management |
| Server State | TanStack Query (React Query) | 5.x | Caching, refetching, optimistic updates |
| Form State | React Hook Form | 7.x | Performant form handling with minimal re-renders |
| Validation | Zod | 3.x | Shared schemas — same schema runs on client and server |
| Calendar | Day.js + jalaali-js | — | Solar Hijri calendar support |
| HTTP | Fetch API / Axios | — | API client with auth interceptors |
| Icons | Lucide React | latest | Consistent icon set |
| Charts | Recharts | — | Dashboard analytics (lazy-loaded) |

### 3.2 State Management Boundaries

HotHoosh enforces a strict separation of state management concerns. Overlapping these boundaries is a violation of Engineering Rules §10.4.1.

| State Type | Tool | Scope | Examples |
|-----------|------|-------|----------|
| **Server state** | TanStack Query | API data: users, agents, knowledge bases, usage stats | `useQuery`, `useMutation`, `useInfiniteQuery` |
| **Client state** | Zustand | UI-only: theme, sidebar open/closed, command palette, selection | `useThemeStore`, `useSidebarStore` |
| **Form state** | React Hook Form + Zod | Form inputs: login form, create agent, upload document | `useForm` with `zodResolver` |
| **URL state** | Next.js `useSearchParams` | Filters, pagination, active tab | `?page=2&status=active&sort=created_at` |

**Key rules:**
- Zustand stores never hold server data. If it came from the API, it belongs in TanStack Query.
- Zustand store actions are synchronous. Async work (API calls) lives in TanStack Query mutations, which call Zustand actions on success.
- Components read Zustand via selectors (`useThemeStore(s => s.theme)`) to prevent unnecessary re-renders.
- TanStack Query keys use a factory pattern: `chatKeys.messages(sessionId)`, `adminKeys.agents.list(filters)`.

### 3.3 Routing Architecture

Both `apps/web` and `apps/admin` use the **Next.js App Router** exclusively (`app/` directory). The Pages Router (`pages/`) does not exist.

```
apps/web/src/app/
├── (auth)/                          # Unauthenticated route group
│   ├── login/page.tsx
│   ├── register/page.tsx            # Invitation-based registration
│   ├── forgot-password/page.tsx
│   └── layout.tsx                   # Centered, minimal layout
│
├── (workspace)/                     # Authenticated route group
│   ├── chat/
│   │   ├── page.tsx                 # Chat list
│   │   ├── [chatId]/page.tsx        # Active chat session
│   │   └── layout.tsx               # Chat sidebar + main area
│   ├── agents/
│   │   ├── page.tsx                 # Agent gallery
│   │   └── [agentId]/page.tsx       # Agent detail / test console
│   ├── knowledge/
│   │   ├── page.tsx                 # Knowledge base list
│   │   └── [kbId]/page.tsx          # Knowledge base detail + documents
│   ├── memory/page.tsx              # Memory pack management
│   ├── settings/page.tsx            # User settings (theme, 2FA, prefs)
│   └── layout.tsx                   # Workspace shell (sidebar, top bar)
│
├── layout.tsx                       # Root layout: providers, fonts, dir="rtl"
├── page.tsx                         # Redirect to /chat
├── globals.css                      # Design tokens + Tailwind base
├── not-found.tsx                    # Custom 404
└── error.tsx                        # Global error boundary
```

```
apps/admin/src/app/
├── (auth)/                          # Shared auth (or redirects to web app)
├── (admin)/                         # Admin route group
│   ├── dashboard/page.tsx           # KPIs, charts, quick stats
│   ├── users/page.tsx               # User list with filters
│   ├── organizations/page.tsx       # Org management
│   ├── companies/page.tsx           # Company management
│   ├── brands/page.tsx              # Brand management
│   ├── agents/page.tsx              # Agent management
│   ├── memory-packs/page.tsx        # Memory pack management
│   ├── knowledge/page.tsx           # Knowledge base management
│   ├── api-providers/page.tsx       # AI provider management
│   ├── models/page.tsx              # Model configuration
│   ├── usage/page.tsx               # Usage analytics
│   ├── billing/page.tsx             # Billing, invoices, plans
│   ├── audit-logs/page.tsx          # Audit log viewer
│   ├── logs/page.tsx                # System logs (SSE streaming)
│   ├── roles/page.tsx               # RBAC management
│   ├── settings/page.tsx            # Global settings
│   └── layout.tsx                   # Admin shell (sidebar, top bar, breadcrumbs)
├── layout.tsx
└── globals.css
```

### 3.4 Feature-Based Folder Structure

Frontend code is organized by **feature**, not by type. Each feature directory is self-contained: it includes its own components, hooks, stores, services, types, and tests. A feature must be deletable without affecting other features.

```
src/features/chat/
├── components/
│   ├── chat-input/
│   │   ├── index.tsx
│   │   ├── chat-input.module.css
│   │   └── chat-input.test.tsx
│   ├── message-list/
│   │   ├── index.tsx
│   │   └── message-list.test.tsx
│   ├── message-bubble/
│   ├── branch-selector/
│   └── streaming-indicator/
├── hooks/
│   ├── use-chat-messages.ts
│   ├── use-chat-streaming.ts
│   └── use-chat-branching.ts
├── stores/
│   └── chat.store.ts
├── services/
│   └── chat.service.ts             # API calls (axios/fetch wrappers)
├── types/
│   └── chat.types.ts
└── index.ts                          # Public API only
```

### 3.5 Server Components and Client Boundaries

Per Engineering Rules §10.4.1, all components are **React Server Components** by default. The `'use client'` directive is added only when a component uses hooks, event handlers, or browser APIs. The client boundary is placed at the feature component level — child components of a client component are automatically client components.

| Boundary | `'use client'`? | Rationale |
|----------|-----------------|-----------|
| Root layout | No | Pure HTML shell, fonts, providers |
| Workspace shell | No | Layout structure, navigation |
| Page components | Usually No | Data fetching via `async/await` in Server Components |
| Chat input | **Yes** | Uses `useState`, `onSubmit`, keyboard events |
| Message list | **Yes** | Uses `useChatStreaming` (EventSource), scroll management |
| Agent gallery card | No | Static rendering, link via `next/link` |
| Data table (admin) | **Yes** | Sorting, filtering, pagination interactions |
| Dashboard stat card | No | Receives data as props from Server Component parent |
| Chart component | **Yes** | Canvas/SVG rendering, interactivity |

### 3.6 RTL-First Design

Per PRD Principles #1 and #2, the entire interface is built **RTL-first** using CSS logical properties. LTR is supported as a secondary direction. The root `<html>` element has `dir="rtl"` by default for Persian users.

**CSS rules enforced by the engineering rules:**
- Use `ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `inline-*`, `block-*` exclusively.
- Never use physical properties: `left`, `right`, `ml-*`, `mr-*`, `pl-*`, `pr-*`.
- Tailwind utility classes follow logical property mapping: `ms-4` (margin-inline-start), `me-4` (margin-inline-end).
- Dark mode is implemented by switching CSS variable values on `:root` and `[data-theme="dark"]`. Tailwind's `dark:` variant is not used.

### 3.7 Internationalization

| Aspect | Default | Secondary |
|--------|---------|-----------|
| Language | Persian (فارسی) | English |
| Text direction | RTL (`dir="rtl"`) | LTR (`dir="ltr"`) |
| Calendar | Solar Hijri (شمسی) | Gregorian |
| Numerals | Persian (۱۲۳) | Western Arabic (123) |
| Font | Vazirmatn (self-hosted) | Vazirmatn (same) |
| Error messages | Persian | English |

---

## 4. Backend Architecture

### 4.1 Architectural Philosophy

HotHoosh's backend is a **NestJS modular monolith** with hexagonal module boundaries (PRD Principle #15, Engineering Rules §10.4.2). The entire backend runs as a single deployable unit, but internal module boundaries are strictly enforced as if each module were a separate microservice. Modules communicate exclusively through well-defined public APIs (injected services and domain events), never through shared mutable state or direct internal imports across module boundaries.

The modular monolith preserves the ability to extract modules into separate services in the future (v2.0+) because hexagonal boundaries ensure low coupling and high cohesion within each domain module.

### 4.2 Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|----------|
| Runtime | Node.js 20+ LTS | Non-blocking I/O for SSE streaming and concurrent AI requests |
| Framework | NestJS 10+ | DI container, module system, guard/filter/interceptor pipeline |
| ORM | TypeORM | PostgreSQL-native, custom repository support, migration tooling |
| Database | PostgreSQL 16+ | pgvector, RLS, JSONB, partitioned tables, full-text search |
| Cache/Queue | Redis 7+ | BullMQ job queues, session store, rate limiting, caching |
| Validation | Zod | Shared schemas between frontend and backend (§10.1.3) |
| File Storage | S3-compatible (MinIO) | Document storage for knowledge bases |
| Email | Nodemailer (SMTP) | Transactional emails for invitations, password resets |
| Streaming | Server-Sent Events (SSE) | One-directional real-time AI response streaming |

### 4.3 12 Domain Modules

Each domain module follows hexagonal architecture: controllers define the HTTP API boundary, services encapsulate business logic, and repositories (TypeORM custom repositories) handle data access. Modules expose only their public service interface; internal implementations are private.

| Module | Responsibility | Key Tables | Emits Events |
|--------|---------------|------------|-------------|
| **auth** | Authentication, token mgmt, invitation, 2FA, impersonation | `users`, `refresh_tokens`, `user_invitations` | `UserLoggedIn`, `UserRegistered`, `UserInvited`, `UserImpersonation` |
| **users** | User CRUD, profile, preferences, search | `users`, `workspace_users`, `roles` | `UserCreated`, `UserUpdated`, `UserDeleted` |
| **organizations** | Org lifecycle, settings, plan management | `organizations`, `subscriptions` | `OrganizationCreated`, `OrganizationSuspended` |
| **companies** | Company CRUD within organization scope | `companies` | `CompanyCreated`, `CompanyUpdated`, `CompanyDeleted` |
| **brands** | Brand CRUD with visual identity (colors, fonts, CSS) | `brands` | `BrandCreated`, `BrandUpdated` |
| **workspaces** | Workspace CRUD, members, model restrictions | `workspaces`, `workspace_users` | `WorkspaceCreated`, `WorkspaceMemberAdded` |
| **agents** | Agent lifecycle (draft → active → deprecated), bindings | `agents`, `agent_tools`, `agent_knowledge`, `agent_memory`, `tools`, `tool_parameters` | `AgentCreated`, `AgentDeployed`, `AgentDeprecated` |
| **chat** | Sessions, messages, branching, history | `chat_sessions`, `chat_messages` | `ChatSessionCreated`, `MessageSent`, `MessageReceived` |
| **knowledge** | Knowledge base CRUD, document upload, processing | `knowledge_bases`, `knowledge_documents`, `knowledge_chunks`, `knowledge_embeddings` | `KnowledgeBaseCreated`, `DocumentUploaded`, `DocumentProcessingComplete` |
| **memory** | Memory pack CRUD, versioning, diff/rollback | `memory_packs`, `memory_pack_versions` | `MemoryPackCreated`, `MemoryPackUpdated` |
| **billing** | Subscriptions, invoices, usage tracking, payments | `plans`, `subscriptions`, `invoices`, `invoice_line_items`, `transactions`, `usage_logs` | `SubscriptionCreated`, `InvoiceGenerated`, `UsageQuotaWarning`, `PaymentReceived` |
| **audit** | Audit log recording, querying, retention | `audit_logs`, `system_logs` | None (audit is a sink, not a source) |

### 4.4 6 Engine Modules

Engine modules provide AI/ML infrastructure consumed by domain modules. They are stateless computational units (no owned database tables, except for caching/state).

| Engine | Responsibility | Consumed By | Key Design |
|--------|---------------|-------------|------------|
| **llm-router** | Route AI requests to optimal provider/model, health monitoring, failover | `ChatModule`, `RAGEngine` | 5-step routing pipeline, circuit breakers, Redis health cache |
| **context-engine** | Token budget allocation, context window management, priority reduction | `ChatModule` | Priority: Knowledge (40%) → History (30%) → Memory (20%) → Tools (10%) |
| **rag-engine** | Document processing pipeline, hybrid retrieval, Persian NLP | `ChatModule`, `KnowledgeModule` | HNSW + BM25 with RRF, 4 chunking strategies, Persian normalizer |
| **memory-engine** | Memory pack resolution, hierarchical assembly, injection | `ChatModule`, `ContextEngine` | Workspace → Brand → Company → Org (accumulates upward) |
| **tool-engine** | Tool registry, validation, sandboxed execution, result formatting | `ChatModule` | JSON Schema input validation, timeout enforcement, audit logging |
| **streaming-engine** | SSE connection management, event emission, backpressure | `ChatModule`, `KnowledgeModule` | 8 event types, Redis connection tracking, 50ms batch window |

### 4.5 Domain Event System

Modules never import each other's services directly for cross-domain operations. Instead, they emit **domain events** through an in-memory event bus backed by Redis for reliability. A **transactional outbox** pattern ensures no events are lost: events are written to the database within the same transaction as the state change, then dispatched asynchronously by a BullMQ worker.

```
Service performs write operation
  → Opens DB transaction
  → Writes domain state change
  → Inserts outbox_events record (same transaction)
  → Commits atomically
  → BullMQ worker polls outbox
  → Dispatches to event bus
  → Handlers react asynchronously
```

### 4.6 Authentication: Dual-Token JWT

| Token | Algorithm | Expiry | Storage | Purpose |
|-------|-----------|-------|---------|---------|
| **Access** | RS256 (asymmetric) | 15 minutes | In-memory only | API authentication. Validated via public key — no DB lookup. |
| **Refresh** | HS256 (symmetric) | 7 days | `HttpOnly`, `Secure`, `SameSite=Strict` cookie | Session persistence. Validated via DB lookup (revocation check). |

**Token rotation on refresh:** Every refresh invalidates the old token and issues a new one with the same `family_id`. If a previously-revoked token is presented (theft detection), all tokens in that family are revoked.

**Password hashing:** Argon2id (memory=64MB, time=3, parallelism=4). Account lockout after 10 failed attempts within 1 hour (30-minute lockout).

### 4.7 Authorization: Three-Layer RBAC + RLS

| Layer | Source | Scope | Example Roles |
|-------|--------|-------|--------------|
| **Organization Role** | `roles` table (`level = 'org'`) | Organization-wide | `super_admin`, `org_admin`, `org_member` |
| **Workspace Role** | `workspace_users.role_id` | Workspace-specific | `workspace_admin`, `workspace_member`, `workspace_viewer` |
| **Resource Permissions** | `roles.permissions` JSONB | Individual resource | `agents:create`, `knowledge:delete`, `billing:read` |

Effective permissions are the **union** of all permissions from all roles the user holds. Authorization is enforced via NestJS guards (`JwtAuthGuard → TenantScopeGuard → RolesGuard → ImpersonationGuard`).

**PostgreSQL RLS** provides database-level tenant isolation — even if application code has a bug, RLS prevents cross-tenant data access. Session variables (`app.current_user_id`, `app.current_org_id`) are set at connection checkout.

### 4.8 API Design

All endpoints follow REST conventions with URL-based versioning (`/v1/`), consistent response envelopes, and pagination on all list endpoints.

**Response envelope (success):**
```json
{ "data": { ... }, "meta": { "page": 1, "limit": 20, "total": 142, "hasMore": true } }
```

**Response envelope (error):**
```json
{ "error": { "code": "AGENT_NOT_FOUND", "message": "عامل هوش مصنوعی یافت نشد", "details": {} } }
```

**SSE streaming** is used for all AI responses. The endpoint `GET /v1/chats/:sessionId/stream` emits 8 event types: `token`, `message_start`, `message_delta`, `message_complete`, `tool_call`, `tool_result`, `error`, `heartbeat`.

### 4.9 Error Handling

Each domain module defines typed exceptions extending `DomainException`. A global `DomainExceptionFilter` catches all unhandled exceptions and returns the standardized error envelope. Raw stack traces never reach the client. Circuit breakers protect against external service failures (AI providers, S3, SMTP, embedding APIs).

---

## 5. Shared Layer

### 5.1 packages/shared

The shared package contains code that must be identical between frontend and backend to guarantee consistency. It has **zero dependencies** on React, Next.js, or NestJS.

```
packages/shared/src/
├── types/                  # TypeScript types
│   ├── branded.ts         # Branded type definitions (UserId, AgentId, etc.)
│   ├── domain.ts          # Domain entity types (User, Agent, ChatSession, etc.)
│   ├── api.ts             # API request/response types, envelope types
│   └── events.ts          # Domain event type definitions
├── validators/             # Shared Zod schemas
│   ├── auth.schema.ts     # login, register, refresh, 2fa
│   ├── user.schema.ts     # create, update, preferences
│   ├── agent.schema.ts    # create, update, deploy
│   ├── chat.schema.ts     # create-session, send-message
│   ├── knowledge.schema.ts # create-kb, upload-document
│   └── pagination.schema.ts # page, limit, sort, cursor
├── constants/              # Shared constants
│   ├── limits.const.ts    # MAX_FILE_SIZE, MAX_RETRY, TOKEN_BUDGET_PERCENTAGES
│   ├── status.const.ts    # AgentStatus, DocumentProcessingStatus, etc.
│   └── routes.const.ts    # API route path constants
├── utils/                  # Pure utility functions
│   ├── date.ts            # formatPersianDate, toJalaali, etc.
│   ├── string.ts          # truncate, slugify, normalizePersian
│   └── number.ts          # formatPersianNumeral, formatCurrency
└── index.ts                # Public exports
```

**What goes in `packages/shared`:**
- Branded types that prevent accidental ID misuse (`type UserId = string & { readonly __brand: 'UserId' }`)
- Zod validation schemas used on both client and server
- Domain type definitions shared across apps
- Constants (status values, limits, route paths)
- Pure utility functions (date formatting, string manipulation, number formatting)

**What does NOT go in `packages/shared`:**
- React components (those go in `packages/ui`)
- API client code (each app has its own)
- State management (Zustand stores are app-specific)
- Backend services or NestJS modules
- Anything with external dependencies beyond `zod`, `dayjs`

### 5.2 packages/ui

The UI package is a React component library built on shadcn/ui primitives. It provides reusable, accessible components used by both `apps/web` and `apps/admin`.

```
packages/ui/src/
├── components/              # One directory per component
│   ├── button/
│   │   ├── button.tsx
│   │   ├── button.test.tsx
│   │   └── index.ts
│   ├── input/
│   ├── dialog/
│   ├── dropdown-menu/
│   ├── data-table/         # Admin-grade data table with sorting, filtering, pagination
│   ├── toast/
│   ├── skeleton/
│   ├── badge/
│   └── ... (40+ components)
├── hooks/                   # Shared UI hooks
│   ├── use-media-query.ts
│   ├── use-debounce.ts
│   └── use-copy-to-clipboard.ts
├── primitives/              # Low-level primitives from Radix UI
│   └── slot.tsx
├── lib/                     # Component utility functions
│   └── utils.ts             # cn() helper, etc.
└── index.ts                 # Public exports only
```

**Design system rules:**
- Components use Tailwind utility classes for layout and spacing.
- Colors, shadows, and effects use CSS custom properties (design tokens) via `var(--color-accent)`.
- Dark mode is handled by CSS variable switching, not Tailwind's `dark:` variant.
- All components are RTL-compatible via logical properties by default.
- All components meet WCAG 2.2 AA accessibility standards.

---

## 6. Data Flow

### 6.1 Flow A: User Sends Chat Message → AI Responds

```
  Browser                Next.js SSR / Client          NestJS API              Engines              External
    │                         │                          │                      │                    │
    │  1. Type message +       │                          │                      │                    │
    │     click Send           │                          │                      │                    │
    │────────────────────────>│                          │                      │                    │
    │                         │  2. POST /v1/chats/      │                      │                    │
    │                         │     :sessionId/messages  │                      │                    │
    │                         │  { content,              │                      │                    │
    │                         │    parentMessageId? }   │                      │                    │
    │                         │─────────────────────────>│                      │                    │
    │                         │                          │                      │                    │
    │                         │                          │  3. Guards validate    │                    │
    │                         │                          │     JWT + workspace    │                    │
    │                         │                          │     access + perms     │                    │
    │                         │                          │                      │                    │
    │                         │                          │  4. Persist user msg   │                    │
    │                         │                          │     (chat_messages)    │                    │
    │                         │                          │                      │                    │
    │                         │                          │  5. Context Engine:    │                    │
    │                         │                          │     resolve memory      │                    │
    │                         │                          │     retrieve knowledge  │                    │
    │                         │                          │     load history        │                    │
    │                         │                          │     load tool defs      │                    │
    │                         │                          │     allocate budget     │                    │
    │                         │                          │──────────────────────>│                    │
    │                         │                          │                      │                    │
    │                         │                          │  6. LLM Router:        │                    │
    │                         │                          │     5-step routing     │                    │
    │                         │                          │──────────────────────>│                    │
    │                         │                          │                      │  7. Route to AI     │
    │                         │                          │                      │     provider          │
    │                         │                          │                      │───────────────────>│
    │                         │                          │                      │                    │
    │  8. Open SSE conn      │                          │                      │  9. Stream tokens   │
    │  GET /chats/:id/stream│                          │                      │<───────────────────│
    │<──────────────────────────────────────────────────│                      │                    │
    │                         │                          │  10. Streaming Engine  │                    │
    │                         │                          │      batches tokens    │                    │
    │                         │                          │      (50ms window)     │                    │
    │                         │                          │                      │                    │
    │  11. SSE: message_start│                          │                      │                    │
    │<──────────────────────────────────────────────────│                      │                    │
    │  12. SSE: token/message_delta (repeated)          │                      │                    │
    │<──────────────────────────────────────────────────│                      │                    │
    │                         │                          │                      │                    │
    │                         │                          │  [Optional: tool call │                    │
    │                         │                          │   loop — up to 5x]    │                    │
    │                         │                          │                      │                    │
    │  13. SSE: message_complete                         │                      │                    │
    │      { inputTokens,    │                          │                      │                    │
    │        outputTokens,   │                          │                      │                    │
    │        latencyMs }     │                          │                      │                    │
    │<──────────────────────────────────────────────────│                      │                    │
    │                         │                          │                      │                    │
    │                         │                          │  14. Update assistant  │                    │
    │                         │                          │      msg in DB         │                    │
    │                         │                          │  15. Emit events:      │                    │
    │                         │                          │      MessageSent       │                    │
    │                         │                          │      MessageReceived   │                    │
    │                         │                          │      → billing tracks  │                    │
    │                         │                          │        usage           │                    │
```

### 6.2 Flow B: Admin Creates Organization

```
  Admin Browser          NestJS API                   PostgreSQL
      │                       │                            │
      │  1. Fill org form      │                            │
      │     (name, slug, plan) │                            │
      │  2. Click Create       │                            │
      │                       │                            │
      │  3. POST /v1/          │                            │
      │     organizations      │                            │
      │     { name, slug,      │                            │
      │       planId }          │                            │
      │──────────────────────>│                            │
      │                       │                            │
      │                       │  4. Zod validates DTO     │
      │                       │  5. Guards check          │
      │                       │     super_admin role      │
      │                       │                            │
      │                       │  6. Check plan limits     │
      │                       │     (max orgs for sys)     │
      │                       │───────────────────────────>│
      │                       │  7. INSERT organization    │
      │                       │     (UUID v7 PK)           │
      │                       │<───────────────────────────│
      │                       │                            │
      │                       │  8. INSERT subscription    │
      │                       │     (link org → plan)      │
      │                       │───────────────────────────>│
      │                       │<───────────────────────────│
      │                       │                            │
      │                       │  9. Emit Organization-    │
      │                       │     CreatedEvent          │
      │                       │     → AuditModule logs    │
      │                       │     → BillingModule sets  │
      │                       │       up subscription     │
      │                       │                            │
      │  10. 201 { data: {     │                            │
      │       id, name, slug, │                            │
      │       status, ... } } │                            │
      │<──────────────────────│                            │
```

### 6.3 Flow C: User Uploads Document to Knowledge Base

```
  Browser              NestJS API               BullMQ              S3 / PostgreSQL
     │                      │                       │                      │
     │  1. Select file,      │                       │                      │
     │     choose KB         │                       │                      │
     │  2. Upload            │                       │                      │
     │                      │                       │                      │
     │  3. POST /v1/         │                       │                      │
     │     knowledge-bases/  │                       │                      │
     │     :kbId/documents   │                       │                      │
     │     (multipart/form) │                       │                      │
     │─────────────────────>│                       │                      │
     │                      │                       │                      │
     │                      │  4. Validate file      │                      │
     │                      │     (magic bytes,       │                      │
     │                      │      size ≤ 50MB)      │                      │
     │                      │                       │                      │
     │                      │  5. Compute SHA-256    │                       │
     │                      │     content_hash        │                       │
     │                      │  6. Check dedup         │                       │
     │                      │──────────────────────────────────────────────>│
     │                      │                       │                      │
     │                      │  7. Upload to S3:      │                      │
     │                      │     knowledge/{wsId}/   │                      │
     │                      │     {kbId}/{uuid}/file  │                      │
     │                      │──────────────────────────────────────────────>│
     │                      │                       │         S3 stored  │
     │                      │<──────────────────────────────────────────────│
     │                      │                       │                      │
     │                      │  8. INSERT knowledge_  │                      │
     │                      │     documents           │                      │
     │                      │     (status='uploaded') │                      │
     │                      │──────────────────────────────────────────────>│
     │                      │                       │                      │
     │                      │  9. Enqueue job:       │                      │
     │                      │     'document-         │                      │
     │                      │      processing'       │                      │
     │                      │──────────────────────>│                      │
     │                      │                       │                      │
     │  10. 201 { document   │                      │                      │
     │       id, status,     │                      │                      │
     │       processingStatus│                      │                      │
     │       = 'uploaded' }  │                       │                      │
     │<─────────────────────│                       │                      │
     │                      │                       │                      │
     │  11. Open SSE for     │                       │                      │
     │     upload progress  │                       │                      │
     │<─────────────────────│                       │                      │
     │                      │                       │  12. Worker dequeues │
     │                      │                       │─────────────────────>│
     │                      │                       │                      │
     │                      │                       │  13. Extract text    │
     │                      │                       │      (PDF/DOCX/TXT)  │
     │                      │                       │  14. Normalize       │
     │                      │                       │      (Persian NLP)   │
     │                      │                       │  15. Chunk           │
     │                      │                       │      (4 strategies)   │
     │                      │                       │  16. Embed           │
     │                      │                       │      (via LLM Router) │
     │                      │                       │  17. Index           │
     │                      │                       │      (HNSW + FTS)     │
     │                      │                       │─────────────────────>│
     │                      │                       │                      │
     │  18. SSE: progress    │                       │                      │
     │     events            │                       │                      │
     │     (extracting →     │                       │                      │
     │      chunking →       │                       │                      │
     │      embedding →       │                       │                      │
     │      ready)           │                       │                      │
     │<─────────────────────│                       │                      │
```

### 6.4 Flow D: Token Refresh

```
  Browser                NestJS API                   Redis              PostgreSQL
    │                         │                            │                    │
    │  1. API call returns    │                            │                    │
    │     401 TOKEN_EXPIRED    │                            │                    │
    │<────────────────────────│                            │                    │
    │                         │                            │                    │
    │  2. Detect expired      │                            │                    │
    │     access token        │                            │                    │
    │                         │                            │                    │
    │  3. POST /v1/auth/       │                            │                    │
    │     refresh             │                            │                    │
    │  (no body — refresh     │                            │                    │
    │   token in HttpOnly     │                            │                    │
    │   cookie)               │                            │                    │
    │────────────────────────>│                            │                    │
    │                         │                            │                    │
    │                         │  4. Read refresh token    │                    │
    │                         │     from cookie           │                    │
    │                         │  5. Verify HS256          │                    │
    │                         │     signature             │                    │
    │                         │  6. Extract userId,       │                    │
    │                         │     familyId              │                    │
    │                         │                            │                    │
    │                         │  7. Lookup token hash     │                    │
    │                         │     in DB                 │                    │
    │                         │──────────────────────────────────────────────>│
    │                         │                            │                    │
    │                         │  8. Check:                │                    │
    │                         │     expires_at > NOW()?   │                    │
    │                         │     revoked_at IS NULL?   │                    │
    │                         │                            │                    │
    │                         │  9. [THEFT CHECK]         │                    │
    │                         │     Is token already      │                    │
    │                         │     revoked but same       │                    │
    │                         │     family? If yes →      │                    │
    │                         │     revoke ALL family     │                    │
    │                         │     tokens → 401          │                    │
    │                         │                            │                    │
    │                         │  10. Revoke old token     │                    │
    │                         │      (set revoked_at)     │                    │
    │                         │──────────────────────────────────────────────>│
    │                         │                            │                    │
    │                         │  11. Generate new HS256   │                    │
    │                         │      refresh token         │                    │
    │                         │  12. Store new token      │                    │
    │                         │      hash in DB           │                    │
    │                         │──────────────────────────────────────────────>│
    │                         │                            │                    │
    │                         │  13. Generate new RS256    │                    │
    │                         │      access token          │                    │
    │                         │      (15min expiry)        │                    │
    │                         │                            │                    │
    │  14. 200 { accessToken } │                            │                    │
    │  Set-Cookie: new        │                            │                    │
    │    refresh_token         │                            │                    │
    │    (HttpOnly, Secure,    │                            │                    │
    │     SameSite=Strict)     │                            │                    │
    │<────────────────────────│                            │                    │
    │                         │                            │                    │
    │  15. Retry original      │                            │                    │
    │     API call with new    │                            │                    │
    │     access token         │                            │                    │
    │────────────────────────>│                            │                    │
```

---

## 7. Infrastructure

### 7.1 PostgreSQL 16+

PostgreSQL is the sole data store, chosen for its rich feature set that eliminates the need for multiple specialized databases.

| Feature | Implementation | Purpose |
|---------|---------------|---------|
| **pgvector** (0.7+) | HNSW index with cosine similarity | Vector embeddings for RAG — 10M+ vectors |
| **Row-Level Security** | Session variable-based policies | Tenant isolation at DB level |
| **JSONB** | GIN indexes via `btree_gin` | Flexible settings, permissions, tool schemas |
| **Full-Text Search** | `to_tsvector('persian', ...)` with GIN | BM25 retrieval for hybrid RAG search |
| **pg_trgm** | Trigram GIN indexes | Fuzzy text search |
| **Partitioning** | Monthly range on `usage_logs`, `audit_logs`, `chat_messages` | Query performance on high-volume tables |
| **UUID v7** | Custom `uuid_generate_v7()` function | Time-sortable globally unique PKs |
| **BIGINT PKs** | Auto-increment on append-only tables | Maximum insert throughput for logs/messages |

**Connection pooling:** PgBouncer in transaction mode for high-concurrency scenarios. Pool size configurable (default: 20 connections). Connection initialization callback sets RLS session variables.

### 7.2 Redis 7+

Redis serves six distinct roles in the HotHoosh architecture:

| Role | Data Type | TTL | Key Pattern Example |
|------|-----------|-----|-------------------|
| **BullMQ backing store** | Lists, hashes, sets | Job-dependent | `bull:document-processing:*` |
| **SSE connection tracking** | Hash | 30 min | `sse:connections:{sessionId}` |
| **Rate limiting** | String (sliding window) | Window-dependent | `ratelimit:{userId}:{endpoint}` |
| **Session lockout** | String (counter) | 1 hour | `lockout:{userId}:attempts` |
| **Event outbox pointer** | String | Persistent | `outbox:lastProcessedId` |
| **Provider health cache** | Hash | 30 seconds | `health:{providerId}` |
| **Config cache** | Hash | 5 minutes | `cache:config:{scope}:{key}` |
| **Token family tracking** | String (set) | 7 days | `family:{familyId}:tokens` |
| **Password reset tokens** | String | 1 hour | `reset:{email}` |
| **Idempotency keys** | String | 24 hours | `idempotency:{key}` |

Configured with `maxmemory-policy: allkeys-lru`. Connection pooling enabled (max 20 connections).

### 7.3 S3-Compatible Storage

Used for all file storage. MinIO for self-hosted deployments; AWS S3 for cloud deployments. All uploads use server-side encryption (AES-256). Pre-signed URLs for client-side downloads (15-minute expiry).

| Operation | Key Pattern | Max Size | Validation |
|-----------|-------------|----------|------------|
| Document upload | `knowledge/{wsId}/{kbId}/{uuid}/{filename}` | 50 MB | Magic bytes, content scan |
| Avatar upload | `avatars/{userId}/{uuid}.{ext}` | 5 MB | Image magic bytes |
| Logo upload | `logos/{entityType}/{entityId}/{uuid}.{ext}` | 5 MB | Image magic bytes |
| Exports/Backups | `backups/{type}/{date}/{filename}` | Variable | N/A |

### 7.4 BullMQ Queue System

11 queues handle all asynchronous processing. No long-running operations run in request handlers.

| # | Queue | Purpose | Priority | Concurrency |
|---|-------|---------|----------|-------------|
| 1 | `document-processing` | Knowledge document pipeline (extract → chunk → embed → index) | Low | 5 |
| 2 | `embedding-generation` | Batch embedding for chunks | Low | 3 |
| 3 | `vector-indexing` | Bulk vector index updates | Low | 2 |
| 4 | `health-check` | AI provider health monitoring (every 30s) | Critical | 3 |
| 5 | `email-sending` | Transactional emails | Medium | 10 |
| 6 | `usage-aggregation` | Hourly usage metric aggregation | Medium | 2 |
| 7 | `audit-log-purge` | Daily expired audit log cleanup | Low | 1 |
| 8 | `token-cleanup` | Daily expired refresh token purge | Low | 1 |
| 9 | `system-log-purge` | Daily old system log partition drop | Low | 1 |
| 10 | `invoice-generation` | Monthly automated invoice generation | High | 2 |
| 11 | `notification-delivery` | In-app notification creation/delivery | Medium | 5 |

**Retry policy:** 3 attempts with exponential backoff (2s → 4s → 8s). Keeps last 1000 completed and 5000 failed jobs.

### 7.5 SMTP (Email)

Transactional emails sent via Nodemailer with SMTP. Templates stored in the `email_templates` table, rendered with Handlebars. All emails dispatched asynchronously via the `email-sending` queue.

| Email Type | Trigger |
|-----------|--------|
| Invitation | Admin creates invitation |
| Welcome | User completes registration |
| Password Reset | User requests reset |
| Account Lockout | 10 failed login attempts |
| Quota Warning | Usage exceeds 80% of budget |

### 7.6 Container Readiness

HotHoosh is container-ready but not tied to any specific cloud provider. The architecture supports:

- **Docker Compose** for local development (PostgreSQL, Redis, MinIO, SMTP mock)
- **Kubernetes** for production (Deployments, Services, ConfigMaps, Secrets, HPA)
- **Bare metal** for on-premise Iranian enterprise deployments

No cloud-specific services (AWS Lambda, GCP Cloud Run, etc.) are required.

### 7.7 Monitoring and Alerting

| Concern | Approach |
|---------|----------|
| **Application health** | `/health` endpoint (DB + Redis connectivity check) |
| **System logs** | Structured JSON logging via NestJS Logger, streamed to admin via SSE |
| **AI provider health** | Redis-backed health tracking with 30-second resolution, circuit breakers |
| **Error tracking** | Sentry (or equivalent) for unhandled exception aggregation |
| **Performance metrics** | Response time histograms (P50/P95/P99), tracked per endpoint |
| **Core Web Vitals** | LCP, FID, CLS, INP monitored in production, alerted on breach |
| **Database** | Slow query logging (>500ms), weekly review, auto-vacuum tuning |
| **Queue health** | BullMQ dashboard for job counts, failure rates, processing times |
| **Uptime** | 99.9% Enterprise, 99.5% Pro — monitored via external health checks |
| **Alerting channels** | In-app notifications, email, optional webhook integration |

---

## 8. Key Design Decisions

### DD-01: Modular Monolith, Not Microservices

**Decision:** Build the backend as a single NestJS application with strict hexagonal module boundaries, not as a set of independent microservices.

**Rationale:**

| Factor | Modular Monolith | Microservices |
|--------|-----------------|---------------|
| Development velocity | Single codebase, single build, single deploy | Multiple codebases, independent builds |
| Data consistency | Single PostgreSQL transaction spans all modules | Distributed transactions (Saga) or eventual consistency |
| Team size fit | 3–8 developers (current phase) | Requires 10+ for independent service ownership |
| Latency | In-process communication (nanoseconds) | Network communication (milliseconds) |
| Operational cost | Single process to monitor and debug | Service mesh, load balancing, distributed tracing |

Hexagonal boundaries ensure that any module can be extracted into a separate service in v2.0+ with minimal refactoring. The modular monolith gives us microservice-level discipline without microservice-level operational tax.

### DD-02: PostgreSQL, Not MongoDB

**Decision:** Use PostgreSQL 16+ as the sole data store.

**Rationale:** HotHoosh requires ACID transactions (billing, token accounting), relational data (Org → Company → Brand → Workspace hierarchy), full-text search (BM25 for RAG), vector search (pgvector for embeddings), and row-level security (tenant isolation). PostgreSQL provides all of these in a single database, eliminating the operational complexity of maintaining MongoDB + a vector DB + a relational DB. JSONB columns provide schema flexibility where needed (settings, permissions, tool schemas).

### DD-03: pgvector, Not Dedicated Vector DB (Initially)

**Decision:** Use pgvector for vector storage and HNSW indexing. Do not introduce Pinecone, Qdrant, or Weaviate in v1.0.

**Rationale:** pgvector with HNSW indexes achieves < 150ms P95 latency for 10M+ vectors, which meets our requirements. Adding a dedicated vector DB introduces operational complexity, data synchronization challenges, and cost. The PRD explicitly defers dedicated vector DB to v2.0 if scale demands it. PostgreSQL's advantage is that vector queries can join with relational data (e.g., filter by `knowledge_base_id` and `workspace_id` within the same query).

### DD-04: Dual-Token JWT, Not Single Token or Session

**Decision:** Use two separate JWTs: RS256 access token (15min, in-memory) + HS256 refresh token (7d, HttpOnly cookie).

**Rationale:**

| Approach | Security | Performance | Complexity |
|----------|----------|-------------|------------|
| Single long-lived JWT | Low — compromised token valid for days | High — no refresh needed | Low |
| Server-side sessions | High — instant revocation | Low — DB lookup on every request | Medium |
| **Dual-token JWT** | **High** — short-lived access, rotation detects theft | **High** — access token validated without DB | **Medium** |

RS256 for access tokens means validation requires only the public key (no DB lookup). HS256 for refresh tokens means revocation requires the shared secret + DB check. The rotation mechanism provides theft detection: if a previously-revoked token is presented, all sessions are terminated.

### DD-05: UUID v7, Not UUID v4

**Decision:** Use UUID v7 (time-sortable) as the default primary key for all entities.

**Rationale:** UUID v7 combines a Unix timestamp (millisecond precision) with random bytes. This produces IDs that are globally unique (no coordination) and time-sortable (recent entities have higher IDs), which benefits B-tree index performance on append-heavy tables. UUID v4 is random, causing index fragmentation on time-ordered data. For high-throughput append-only tables (audit_logs, chat_messages, usage_logs), BIGINT auto-increment is used instead to avoid UUID storage overhead.

### DD-06: Immutable Chat Messages

**Decision:** Chat messages are never updated in place. Edits create new messages. Branching uses `parent_message_id` + `branch_index`.

**Rationale:** Immutability eliminates an entire class of bugs (concurrent edits, lost updates, audit trail corruption). Branching enables exploring different AI response directions without losing the original thread. The `parent_message_id` + `branch_index` model reconstructs conversation history by walking up the tree. This design also simplifies billing (each message has a definitive token count that never changes) and audit logging (a complete, tamper-proof record of every interaction).

### DD-07: Zod, Not class-validator

**Decision:** Use Zod schemas for all input validation on both frontend and backend.

**Rationale:** Zod schemas can be shared between frontend and backend via `packages/shared`, guaranteeing that the same validation rules apply on both sides. `class-validator` uses decorators and classes, which cannot be shared with a React frontend. Zod also provides superior TypeScript inference (`z.infer<typeof schema>`) and composable schema building (`.pick()`, `.omit()`, `.partial()`, `.merge()`).

### DD-08: NestJS, Not Express or Fastify

**Decision:** Build the backend API with NestJS.

**Rationale:** NestJS provides a built-in DI container, module system, and guard/filter/interceptor pipeline that directly map to our hexagonal architecture requirements. Express requires manual assembly of middleware chains and has no DI or module system. Fastify is performant but lacks NestJS's structured module system. NestJS's decorators (`@Controller`, `@Get`, `@UseGuards`) provide declarative API definitions that align with our engineering rules (thin controllers, guard-based authorization).

### DD-09: App Router, Not Pages Router

**Decision:** Use Next.js App Router (`app/` directory) exclusively.

**Rationale:** The App Router supports React Server Components, which allow page-level data fetching via `async/await` without client-side JavaScript. This reduces the client-side JavaScript bundle and improves Core Web Vitals (especially LCP and FID). Server Components are the default; the `'use client'` directive is added only where needed. The Pages Router does not support Server Components and is considered legacy by Next.js.

### DD-10: Zustand, Not Redux

**Decision:** Use Zustand for client-side state management.

**Rationale:**

| Factor | Zustand | Redux Toolkit |
|--------|---------|---------------|
| Boilerplate | Minimal — no actions, reducers, providers | Significant — slice, asyncThunk, configureStore |
| Bundle size | ~1 KB | ~11 KB |
| Learning curve | Low — hooks-based API | Medium — requires understanding thunks, selectors |
| TypeScript | First-class, simple | Good but verbose |

Zustand's minimal API reduces boilerplate while providing the same capabilities (selectors, middleware for persistence, devtools integration). Since TanStack Query handles all server state, Zustand only manages simple UI state (theme, sidebar, selection), where its simplicity is a perfect fit.

### DD-11: Feature-Based Folders, Not Type-Based

**Decision:** Organize frontend code by feature (`features/chat/`), not by type (`components/`, `hooks/`, `stores/`).

**Rationale:** Feature-based organization ensures that all code related to a domain concept lives in one place. A feature is self-contained and deletable — removing the `features/chat/` directory removes chat without affecting agents or knowledge. Type-based organization scatters related code across multiple directories, making it harder to understand, modify, and delete features. The engineering rules enforce this with the principle: "A feature must be deletable without affecting other features."

### DD-12: CSS Logical Properties, Not Physical Properties

**Decision:** Use `ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*` exclusively. Never use `left`, `right`, `ml-*`, `mr-*`.

**Rationale:** HotHoosh is Persian-first and RTL-native. CSS logical properties automatically adapt to the document's `dir` attribute. When `dir="rtl"`, `margin-inline-start` maps to `margin-right`; when `dir="ltr"`, it maps to `margin-left`. Physical properties (`margin-left`) require manual RTL/LTR conditionals in every component. Logical properties make bidirectional support automatic and eliminates an entire class of RTL bugs.

### DD-13: Solar Hijri Calendar

**Decision:** Use Solar Hijri (شمسی) as the default calendar. Gregorian available as secondary.

**Rationale:** HotHoosh targets Iranian enterprises. The Solar Hijri calendar is the official calendar of Iran, used for business operations, financial reporting, and legal documents. Displaying Gregorian dates as the default would be a localization failure. Day.js with the `jalaali-js` plugin provides Solar Hijri support with the same API as standard date handling.

### DD-14: SSE, Not WebSocket for AI Streaming

**Decision:** Use Server-Sent Events (`text/event-stream`) for all AI response streaming.

**Rationale:**

| Factor | SSE | WebSocket |
|--------|-----|-----------|
| Direction | Server → Client (unidirectional) | Bidirectional |
| Complexity | Simple — built on HTTP | Complex — handshake, framing, ping/pong |
| Proxy compatibility | Works through all proxies, CDNs, load balancers | Requires special proxy configuration (Upgrade header) |
| Reconnection | Browser auto-reconnects | Manual reconnection logic |
| HotHoosh need | Server pushes AI tokens to client | Client only sends messages via POST |

AI response streaming is inherently unidirectional: the server generates tokens and the client displays them. The client sends messages via standard `POST` requests. There is no need for bidirectional communication. SSE is simpler, more robust, and works through all network infrastructure without special configuration.

### DD-15: TypeORM, Not Prisma

**Decision:** Use TypeORM as the ORM for NestJS.

**Rationale:** TypeORM provides native PostgreSQL support including custom repository classes (essential for the repository pattern mandated by Engineering Rules §10.4.2), direct access to migration tooling, and fine-grained query control needed for complex operations (recursive CTEs for branch traversal, JSONB queries, pgvector operations). While Prisma offers a cleaner query API, TypeORM's custom repository support better aligns with our hexagonal architecture where repositories are the data access boundary.

### DD-16: Invitation-Only Registration

**Decision:** Users cannot self-register. All access is via organization invitation.

**Rationale:** HotHoosh is an enterprise product, not a consumer SaaS. Open registration creates security risks (unauthorized access, spam accounts) and administrative burden. Invitation-only registration ensures that every user is explicitly authorized by an organization admin, tied to a specific role and organizational scope. This aligns with enterprise security requirements and Iranian enterprise governance practices.

### DD-17: Hybrid Search (Vector + BM25), Not Vector Only

**Decision:** Combine pgvector HNSW cosine similarity with PostgreSQL BM25 full-text search using Reciprocal Rank Fusion.

**Rationale:** Vector search excels at semantic similarity but misses exact keyword matches. BM25 excels at keyword matching but misses semantic relationships. Hybrid search with RRF (k=60) combines the strengths of both. For Persian text specifically, exact keyword matching is critical because Persian morphology (prefixes, suffixes, zero-width non-joiners) can cause vector embeddings to miss matches that a full-text search catches easily.

### DD-18: Bigint Auto-Increment for High-Throughput Tables

**Decision:** Use BIGINT auto-increment (not UUID v7) for `audit_logs`, `usage_logs`, `chat_messages`, and `system_logs`.

**Rationale:** UUID v7 is 128 bits (16 bytes) vs BIGINT which is 64 bits (8 bytes). On append-only tables that receive millions of inserts per month, halving the primary key size significantly reduces storage and index size. BIGINT auto-increment also provides optimal B-tree insert performance (sequential, no page splits). UUID v7 is used for all other tables where the benefits of global uniqueness and time-sortability outweigh the storage cost.

---

## Appendix A: Technology Version Summary

| Technology | Minimum Version | Notes |
|-----------|----------------|-------|
| Node.js | 20 LTS | Runtime for all apps and API |
| TypeScript | 5.x | Strict mode with additional checks |
| Next.js | 15+ | App Router only |
| NestJS | 10+ | Modular monolith |
| TypeORM | 0.3+ | PostgreSQL driver |
| PostgreSQL | 16+ | With pgvector, pg_trgm, btree_gin |
| Redis | 7+ | BullMQ backing store, caching, sessions |
| Tailwind CSS | 4.x | RTL logical properties |
| React | 19.x | Server Components + Client Components |
| Zustand | 5.x | Client state management |
| TanStack Query | 5.x | Server state management |
| React Hook Form | 7.x | Form state management |
| Zod | 3.x | Shared validation |
| Turborepo | 2.x | Monorepo task orchestration |
| pnpm | 9.x | Package manager |

## Appendix B: Document Cross-References

| Document | Relevance |
|----------|----------|
| [PRD.md](./PRD.md) | Product requirements, principles, functional/non-functional requirements |
| [Database.md](./Database.md) | Complete schema specification, indexes, RLS policies |
| [Backend-Architecture.md](./Backend-Architecture.md) | Detailed backend module specs, LLM Router, RAG Engine, streaming |
| [Agent-System.md](./Agent-System.md) | Agent types, lifecycle, prompt builder, conversation flow |
| [Engineering-Rules.md](./Engineering-Rules.md) | Non-violable coding standards, security rules, testing rules |