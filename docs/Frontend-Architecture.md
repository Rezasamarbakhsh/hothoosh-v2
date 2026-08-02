# Frontend Architecture

## HotHoosh — Enterprise AI Workspace

---

## Table of Contents

1. [Overview](#1-overview)
2. [Technology Stack](#2-technology-stack)
3. [Monorepo Integration](#3-monorepo-integration)
4. [App Router Architecture](#4-app-router-architecture)
5. [Component Architecture](#5-component-architecture)
6. [State Management](#6-state-management)
7. [RTL Integration](#7-rtl-integration)
8. [Theme System](#8-theme-system)
9. [Data Fetching Patterns](#9-data-fetching-patterns)
10. [Error Handling](#10-error-handling)
11. [Performance Strategy](#11-performance-strategy)
12. [Accessibility Strategy](#12-accessibility-strategy)
13. [Internationalization](#13-internationalization)

---

## 1. Overview

HotHoosh's frontend is a Persian-first, RTL-native enterprise workspace built on Next.js 15 with the App Router. It is delivered as two distinct Next.js applications within a Turborepo + pnpm monorepo: **apps/web** serves the user-facing AI workspace (chat, agents, knowledge, memory), and **apps/admin** serves the management console (dashboard, tenant management, billing, audit logs). Both applications share a common component library (`packages/ui`) and a shared types-and-validators package (`packages/shared`), ensuring visual consistency and validation parity between client and server.

The architectural philosophy rests on four pillars:

| Pillar | Description |
|--------|-------------|
| **React Server Components by default** | Every component is a Server Component until it explicitly requires interactivity. The `'use client'` directive is placed at the feature component level, not on every interactive leaf. This minimizes client-side JavaScript and improves Core Web Vitals. |
| **Strict state boundary separation** | Four non-overlapping state management tools each own exactly one category of state: TanStack Query for server data, Zustand for client UI state, React Hook Form for form state, and URL search params for navigation state. Crossing boundaries is a violation of Engineering Rules §10.4.1. |
| **Feature-based organization** | Code is grouped by domain concept (`features/chat/`, `features/agents/`), not by technical type. Each feature is self-contained and deletable without side effects on other features. |
| **RTL-first design system** | The entire interface is built with CSS logical properties so that switching between RTL (Persian) and LTR (English) requires only changing the `dir` attribute on the root `<html>` element. No physical direction properties are used anywhere. |

This document specifies the complete frontend architecture: technology choices, monorepo structure, routing design, component hierarchy, state management, RTL strategy, theming, data fetching, error handling, performance optimization, accessibility compliance, and internationalization.

---

## 2. Technology Stack

Every library in the HotHoosh frontend was selected for a specific architectural reason. The table below lists every dependency, its version constraint, its role in the system, and the rationale for its selection.

### 2.1 Core Framework

| Library | Version | Purpose | Rationale |
|---------|---------|---------|-----------|
| **Next.js** (App Router) | 15+ | Application framework: SSR, routing, code splitting, image optimization, font loading | App Router provides React Server Components, reducing client-side JavaScript. Route-based code splitting is automatic. `next/image` and `next/font` provide optimization out of the box. |
| **React** | 19.x | UI rendering library with Server Components and Client Components support | React 19 introduces improved Server Component serialization, `use` hook for promises, and better concurrent rendering. |
| **TypeScript** | 5.x | Static type checking with strict mode | Strict mode with `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and `noImplicitOverride` catches entire categories of bugs at compile time. Branded types prevent ID misuse. |

### 2.2 Styling and Design System

| Library | Version | Purpose | Rationale |
|---------|---------|---------|-----------|
| **Tailwind CSS** | 4.x | Utility-first CSS framework with RTL logical property support | Tailwind 4 uses CSS-first configuration. Logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `inline-*`, `block-*`) make RTL/LTR switching automatic. |
| **shadcn/ui** | latest | Accessible, composable component primitives built on Radix UI | shadcn/ui components are copied into the project (not installed as a dependency), giving full control over code. Built on Radix UI primitives which provide robust ARIA support and keyboard navigation. |
| **@phosphor-icons/react** | latest | Icon library with RTL mirror support | Phosphor Icons provides a consistent, lightweight icon set with automatic RTL mirroring for directional icons. Used throughout both workspace and admin interfaces. |
| **Vazirmatn** (self-hosted) | latest | Persian/Arabic typeface optimized for screen readability | Loaded via `next/font/local` from `public/fonts/`. `font-display: swap` prevents layout shift. The same font serves both Persian and Latin characters, maintaining visual consistency. |
| **clsx** + **tailwind-merge** | latest | Conditional class name composition via the `cn()` utility | `clsx` handles conditional class concatenation. `tailwind-merge` resolves Tailwind class conflicts (e.g., `p-2 p-4` → `p-4`). Combined into a single `cn()` function used across all components. |

### 2.3 State Management

| Library | Version | Purpose | Rationale |
|---------|---------|---------|-----------|
| **Zustand** | 5.x | Lightweight client-side state management for UI-only state | ~1 KB bundle, zero boilerplate, hooks-based API. Manages only UI state (theme, sidebar, selection). All server state lives in TanStack Query. Actions are synchronous; async work is delegated to TanStack Query mutations. |
| **TanStack Query** (React Query) | 5.x | Server state management: caching, background refetching, optimistic updates, infinite queries | Provides structured caching with `staleTime` and `gcTime`, automatic background refetching, deduplication of identical requests, and optimistic update patterns. Query key factories ensure structured, predictable cache keys. |
| **React Hook Form** | 7.x | Performant form state management with minimal re-renders | Uncontrolled form inputs mean the component only re-renders on submit, not on every keystroke. Integrated with Zod via `zodResolver` for shared validation schemas. |
| **Zod** | 3.x | Schema-based validation shared between frontend and backend | Schemas defined in `packages/shared` run on both client and server, guaranteeing identical validation rules. Provides TypeScript inference via `z.infer<typeof schema>`. Supports `.pick()`, `.omit()`, `.partial()`, `.merge()` for schema composition. |

### 2.4 Data Visualization

| Library | Version | Purpose | Rationale |
|---------|---------|---------|-----------|
| **ECharts** | 5.x | Charts and data visualizations (area charts, donut charts, bar charts) | Used in the admin dashboard for token consumption trends, model distribution donut charts, and usage analytics. Lazy-loaded via `next/dynamic` to keep it out of the critical path. Supports RTL axis layout for Persian labels. |

### 2.5 Date, Calendar, and Formatting

| Library | Version | Purpose | Rationale |
|---------|---------|---------|-----------|
| **dayjs** | latest | Date manipulation and formatting | Lightweight (2 KB) date library with a chainable API identical to Moment.js. Plugin architecture extends functionality without bloat. |
| **jalaali-js** | latest | Solar Hijri (Jalali/Persian) calendar conversion | Integrates with dayjs as a plugin (`dayjs.extend(jalaali)`). Provides `dayjs().calendar('jalaali')` for conversion, `.format('jYYYY/jMM/jDD')` for formatting. This is the default calendar system for all Persian users. |

### 2.6 HTTP and Real-Time Communication

| Library | Version | Purpose | Rationale |
|---------|---------|---------|-----------|
| **Fetch API** (native) | — | HTTP requests for TanStack Query | Native `fetch` is used as the HTTP client within TanStack Query's `queryFn`. Avoids adding Axios to the bundle. Auth interceptors are handled via a thin wrapper function. |
| **EventSource** (native) | — | Server-Sent Events for AI response streaming | The browser-native `EventSource` API receives SSE streams (`text/event-stream`) for real-time AI token delivery. Simpler than WebSocket for unidirectional server-to-client streaming. Auto-reconnects on disconnection. |

### 2.7 Developer Experience

| Library | Version | Purpose | Rationale |
|---------|---------|---------|-----------|
| **Turborepo** | 2.x | Monorepo task orchestration with remote caching | Caches build, lint, type-check, and test results by file hash. `topo` dependency order ensures `packages/shared` builds before `apps/web`. Parallel execution across independent packages. |
| **pnpm** | 9.x | Strict, content-addressable package manager | Prevents phantom dependencies by restricting imports to declared dependencies. Workspace protocol (`workspace:*`) references local packages. |
| **ESLint** | latest | Linting with shared configuration | `packages/eslint-config` provides consistent rules across all apps and packages. Includes React, TypeScript, Next.js, and Tailwind plugin configurations. |
| **Prettier** | latest | Code formatting | Enforced via ESLint integration and pre-commit hooks. Zero formatting debates. |
| **Vitest** | latest | Unit and component testing | Fast, ESM-native test runner compatible with Vite and the React Testing Library ecosystem. |
| **React Testing Library** | latest | Component testing with accessibility-first queries | Encourages testing user behavior rather than implementation details. Queries like `getByRole('button')` enforce semantic HTML and accessibility. |
| **Playwright** | latest | End-to-end testing | Cross-browser E2E tests for critical user flows (login, chat, agent creation). |

---

## 3. Monorepo Integration

HotHoosh is a Turborepo + pnpm monorepo. The frontend consists of two Next.js 15 applications (`apps/web` and `apps/admin`) that consume two shared packages (`packages/ui` and `packages/shared`). This structure enables code reuse without coupling the two applications to each other.

### 3.1 Package Dependency Graph

```
apps/web  ──→  packages/ui  ──→  (no internal deps)
   │               │
   │               └──→  packages/shared  ──→  zod, dayjs, jalaali-js
   └──→  packages/shared

apps/admin  ──→  packages/ui
   │               │
   │               └──→  packages/shared
   └──→  packages/shared

packages/eslint-config  (standalone, no internal deps)
``

Turborepo's `topo` dependency order guarantees that `packages/shared` is built and type-checked before `packages/ui`, which is built before `apps/web` and `apps/admin`. Changes to `packages/shared` trigger rebuilds of all downstream consumers.

### 3.2 What is Shared via `packages/shared`

`packages/shared` contains code that must be **identical** between frontend and backend. It has zero dependencies on React, Next.js, or NestJS.

| Category | Contents | Consumed By |
|----------|----------|-------------|
| **Branded types** | `UserId`, `AgentId`, `ChatSessionId`, `KnowledgeBaseId`, `MemoryPackId` — branded string types that prevent accidental ID misuse at compile time | apps/web, apps/admin, apps/api |
| **Domain types** | `User`, `Agent`, `ChatSession`, `ChatMessage`, `KnowledgeBase`, `MemoryPack`, `Organization`, `Invoice` — full entity type definitions | apps/web, apps/admin, apps/api |
| **API types** | Request/response envelope types (`ApiResponse<T>`, `PaginatedResponse<T>`, `ApiError`), HATEOAS link types | apps/web, apps/admin |
| **Domain event types** | `UserCreatedEvent`, `AgentDeployedEvent`, `KnowledgeUploadedEvent` — event payload type definitions | apps/api (primarily) |
| **Zod validators** | `loginSchema`, `createAgentSchema`, `sendMessageSchema`, `uploadDocumentSchema`, `paginationSchema` — shared validation schemas that run on both client and server | apps/web (forms), apps/admin (forms), apps/api (validation pipe) |
| **Constants** | `AgentStatus`, `DocumentProcessingStatus`, `MAX_FILE_SIZE`, `TOKEN_BUDGET_PERCENTAGES`, API route path strings | All packages and apps |
| **Pure utilities** | `formatPersianDate()`, `toJalaali()`, `truncate()`, `slugify()`, `normalizePersian()`, `formatPersianNumeral()`, `formatCurrency()` | apps/web, apps/admin |

### 3.3 What is Shared via `packages/ui`

`packages/ui` is a React component library built on shadcn/ui primitives. It provides reusable, accessible components used by both applications.

| Category | Contents | Examples |
|----------|----------|----------|
| **Form primitives** | Button, Input, Textarea, Select, Checkbox, Radio Group, Switch, Label | Used in all forms across web and admin |
| **Overlay primitives** | Dialog, Dropdown Menu, Popover, Tooltip, Sheet (slide-over), Command (for command palette) | Used for modals, menus, and contextual actions |
| **Data display** | Data Table (sorting, filtering, pagination), Badge, Skeleton, Card, Avatar, Separator | Data Table is the primary admin list component |
| **Feedback** | Toast (sonner integration), Alert, Progress, Spinner | Toast for notifications, Progress for upload tracking |
| **Navigation** | Breadcrumb, Tabs, Pagination | Breadcrumb auto-generated from route tree in admin |
| **Shared hooks** | `useMediaQuery`, `useDebounce`, `useCopyToClipboard` | General-purpose UI behavior |
| **Utility functions** | `cn()` (clsx + tailwind-merge) | Used in every component for class composition |

### 3.4 What is NOT Shared

| Not Shared | Reason |
|------------|--------|
| **Zustand stores** | Each app has its own client state concerns. Web manages sidebar/chat state; admin manages tenant scope/selection state. |
| **API client code** | Each app has its own fetch wrapper with different base URLs, auth header injection, and error handling preferences. |
| **Feature modules** | Features are app-specific. `features/chat/` exists only in `apps/web`; `features/admin-users/` exists only in `apps/admin`. |
| **App-level layouts** | The workspace shell and admin shell have fundamentally different structures and navigation models. |
| **Route definitions** | Each app owns its own `app/` directory with its own route tree. |
| **State management** | TanStack Query instances are configured independently per app with different `QueryClient` defaults. |

---

## 4. App Router Architecture

Both `apps/web` and `apps/admin` use the Next.js App Router exclusively (`app/` directory). The Pages Router (`pages/` directory) does not exist. This is a non-negotiable constraint per Engineering Rules §10.4.1.

### 4.1 Route Groups and Layouts

Route groups (parenthesized directories) allow applying different layouts to different sections of the app without affecting the URL structure.

| Route Group | Purpose | Layout | Auth Requirement |
|-------------|---------|--------|-----------------|
| `(auth)` | Login, register, forgot-password | Centered, minimal layout — no sidebar, no top bar | Unauthenticated — redirects to `/chat` if already logged in |
| `(workspace)` | Chat, agents, knowledge, memory, settings | Full workspace shell — sidebar, top bar, workspace switcher | Authenticated — redirects to `/login` if not logged in |
| Root `/` | Landing redirect | Root layout (providers, fonts, `dir="rtl"`) | Redirects to `/chat` or `/login` based on auth status |

The root `layout.tsx` renders the HTML shell with the Vazirmatn font loaded via `next/font/local`, the `dir="rtl"` attribute on `<html>`, and global providers (TanStack Query `QueryClientProvider`, theme provider, toast provider). It contains no sidebar or navigation — those belong to the `(workspace)` layout.

### 4.2 Workspace Route Tree

The complete route tree for `apps/web` (the user-facing workspace):

```
apps/web/src/app/
├── layout.tsx                          # Root: providers, Vazirmatn font, dir="rtl"
├── page.tsx                            # Redirect → /chat
├── globals.css                         # Design tokens + Tailwind base
├── not-found.tsx                       # Custom 404 page
├── error.tsx                           # Global error boundary
├── loading.tsx                         # Global loading skeleton
│
├── (auth)/                             # Unauthenticated route group
│   ├── layout.tsx                      # Centered, minimal layout (no sidebar)
│   ├── login/
│   │   └── page.tsx                    # Email + password login with optional 2FA
│   ├── register/
│   │   └── page.tsx                    # Invitation-based account creation
│   └── forgot-password/
│       └── page.tsx                    # Email-based password reset
│
└── (workspace)/                        # Authenticated route group
    ├── layout.tsx                      # Workspace shell: sidebar, top bar, workspace switcher
    ├── loading.tsx                     # Workspace shell skeleton
    ├── error.tsx                       # Workspace error boundary
    │
    ├── chat/
    │   ├── layout.tsx                  # Chat sub-layout: conversation list panel + main area
    │   ├── page.tsx                    # Chat session list (history + new chat action)
    │   ├── loading.tsx                 # Chat list skeleton
    │   ├── error.tsx                   # Chat error boundary
    │   └── [chatId]/
    │       ├── page.tsx                  # Active chat session (messages, input, context panel)
    │       ├── loading.tsx             # Chat session skeleton (message bubble placeholders)
    │       └── error.tsx               # Chat session error boundary
    │
    ├── agents/
    │   ├── layout.tsx                  # Agents sub-layout (optional: detail panel)
    │   ├── page.tsx                    # Agent gallery (grid/list of workspace agents)
    │   ├── loading.tsx                 # Agent gallery skeleton (card placeholders)
    │   ├── error.tsx                   # Agents error boundary
    │   └── [agentId]/
    │       ├── page.tsx                  # Agent detail: config, knowledge/memory bindings, test console
    │       ├── loading.tsx             # Agent detail skeleton
    │       └── error.tsx               # Agent detail error boundary
    │
    ├── knowledge/
    │   ├── layout.tsx                  # Knowledge sub-layout
    │   ├── page.tsx                    # Knowledge base list (status, doc count, upload action)
    │   ├── loading.tsx                 # Knowledge list skeleton
    │   ├── error.tsx                   # Knowledge error boundary
    │   └── [kbId]/
    │       ├── page.tsx                  # KB detail: documents, chunks, search test, settings
    │       ├── loading.tsx             # KB detail skeleton
    │       └── error.tsx               # KB detail error boundary
    │
    ├── memory/
    │   ├── page.tsx                    # Memory pack list (type badge, version count, CRUD)
    │   ├── loading.tsx                 # Memory list skeleton
    │   └── error.tsx                   # Memory error boundary
    │
    └── settings/
        ├── page.tsx                    # User settings (profile, theme, 2FA, language, calendar)
        ├── loading.tsx                 # Settings skeleton
        └── error.tsx                   # Settings error boundary
```

### 4.3 Loading States

Per Engineering Rules §10.4.1, every route segment that fetches async data must have a `loading.tsx` that renders a skeleton matching the page layout. This provides instant visual feedback and prevents layout shift (CLS) when data arrives.

| Route | Loading Strategy |
|-------|-----------------|
| `/chat` | Skeleton cards in the conversation list panel matching the height and width of real conversation items |
| `/chat/[chatId]` | Skeleton message bubbles (3–5 placeholder rows) matching the chat layout, with a skeleton input bar at the bottom |
| `/agents` | Skeleton agent cards in a grid layout matching the gallery's 3-column desktop layout |
| `/knowledge` | Skeleton list items with status badge placeholders and document count placeholders |
| `/memory` | Skeleton list items with type badge and version count placeholders |
| `/settings` | Skeleton form fields matching the settings page layout |

### 4.4 Error Boundaries

Per Engineering Rules §10.4.1, every route segment has an `error.tsx` boundary. Error boundaries catch both Server Component errors and Client Component render errors. Each boundary provides a Persian-language error message, a retry button, and a link back to the parent route.

| Boundary | Catches | User Sees |
|----------|---------|----------|
| Root `error.tsx` | Unhandled errors outside any route group | Full-page error with Persian message, retry button, link to `/chat` |
| `(workspace)/error.tsx` | Errors in any workspace page | Error panel within the workspace shell (sidebar remains visible) |
| `chat/error.tsx` | Errors loading the chat list | Error within the chat layout (conversation list panel shows error) |
| `chat/[chatId]/error.tsx` | Errors loading a specific chat session | Error within the chat session layout (conversation list remains accessible) |
| Feature-level | Errors in async operations within a feature | React error boundary wrapper with localized message and retry |

---

## 5. Component Architecture

HotHoosh follows the Atomic Design methodology, organizing components into five hierarchical levels. Components are further organized by feature domain, ensuring that all code related to a business concept lives in one self-contained directory.

### 5.1 Atomic Design Hierarchy

| Level | Definition | Location | Examples |
|-------|-----------|----------|----------|
| **Atoms** | Smallest indivisible UI elements. Cannot be decomposed further. No business logic. | `packages/ui/src/components/` | Button, Input, Badge, Avatar, Skeleton, Spinner, Separator, Toggle |
| **Molecules** | Combinations of 2–4 atoms that form a distinct UI unit. May contain simple props-based logic. | `packages/ui/src/components/` or `apps/web/src/features/*/components/` | Search Input (Input + Icon), Form Field (Label + Input + Error), Stat Card (Icon + Value + Label + Trend) |
| **Organisms** | Complex, self-contained UI sections composed of molecules and atoms. May contain hooks and local state. | `apps/web/src/features/*/components/` | Chat Input (textarea + send button + attachment button + agent selector), Message Bubble (avatar + content + actions + timestamp), Data Table (header + rows + pagination + sort indicators), Agent Card (avatar + name + description + status badge + actions) |
| **Templates** | Page-level layouts that define the structure and spatial relationship of organisms. No real data. | `apps/web/src/components/layouts/` | Workspace Shell (sidebar + top bar + main content area), Chat Layout (conversation list + message area + input bar), Agent Detail Layout (header + tab bar + content area) |
| **Pages** | Route-level components that wire templates to real data. May be Server Components that fetch data via `async/await`. | `apps/web/src/app/**/page.tsx` | `/chat` page, `/chat/[chatId]` page, `/agents` page |

### 5.2 Feature-Based Organization

Each feature directory is a self-contained module. A feature must be deletable without affecting any other feature. The internal structure follows a consistent pattern:

```
src/features/{feature-name}/
├── components/                    # Feature-specific components (organisms and molecules)
│   ├── {component-name}/
│   │   ├── index.tsx             # Component implementation
│   │   ├── {component-name}.module.css  # BEM-named CSS module (only if Tailwind is insufficient)
│   │   └── {component-name}.test.tsx    # Component tests
│   └── ...
├── hooks/                         # Feature-specific custom hooks
│   ├── use{hook-name}.ts
│   └── ...
├── stores/                        # Feature-specific Zustand stores (if any)
│   └── {feature}.store.ts
├── services/                      # API call wrappers (fetch/axios)
│   └── {feature}.service.ts
├── types/                         # Feature-specific TypeScript types (if not in shared)
│   └── {feature}.types.ts
└── index.ts                       # Public API exports only
```

### 5.3 Component Composition Patterns

| Pattern | Description | Example |
|---------|-------------|---------|
| **Server Component wrapper + Client Component child** | A Server Component page fetches data via `async/await` and passes it as props to a Client Component that handles interactivity. | Agent gallery page (Server) fetches agents, passes to `AgentGallery` (Client) for filtering/sorting. |
| **Slot pattern (Radix AsChild)** | shadcn/ui components support the `asChild` prop, which merges props onto a child element instead of rendering a wrapper DOM node. This avoids unnecessary DOM nesting. | `<Button asChild><Link href="/agents">View Agents</Link></Button>` renders a single `<a>` element styled as a button. |
| **Compound components** | Related components share implicit state via React Context, allowing flexible composition. | `<DataTable>` exposes `<DataTable.Header>`, `<DataTable.Body>`, `<DataTable.Row>`, `<DataTable.Cell>` with shared sort/filter/pagination state. |
| **Render props for complex state** | When a component needs to expose complex internal state for customization, it uses a render prop function. | `<ChatInput renderActions={(isStreaming) => <StopButton visible={isStreaming} />}>` |
| **Provider pattern for cross-cutting concerns** | Global or feature-wide state is provided via React Context at the layout level. | `QueryClientProvider`, `ThemeProvider`, `ToastProvider` at root layout. |

---

## 6. State Management

HotHoosh enforces a strict separation of state management concerns. Each of the four state categories is owned by exactly one tool. Overlapping these boundaries is a violation of Engineering Rules §10.4.1 and §10.4.4.

### 6.1 The Four State Boundaries

| State Type | Tool | Scope | Examples | Key Constraint |
|-----------|------|-------|----------|----------------|
| **Server state** | TanStack Query | All data fetched from the API: users, agents, knowledge bases, chat sessions, usage stats, audit logs | `useQuery` for reads, `useMutation` for writes, `useInfiniteQuery` for large lists | Zustand stores never hold server data. If it came from the API, it belongs in TanStack Query. |
| **Client state** | Zustand | UI-only state that lives entirely in the browser: theme, sidebar open/closed, command palette visibility, selection state, workspace ID | `useThemeStore`, `useSidebarStore`, `useCommandPaletteStore`, `useSelectionStore` | Store actions are synchronous. Async work (API calls) lives in TanStack Query mutations, which call Zustand actions on success. |
| **Form state** | React Hook Form + Zod | Form input values, validation errors, submission status: login form, create agent form, upload document form, edit settings form | `useForm` with `zodResolver(createAgentSchema)` | Form state never leaks into Zustand or TanStack Query. On submit, form values are passed to a TanStack Query mutation. |
| **URL state** | Next.js `useSearchParams` + `useRouter` | Navigation state: filters, pagination, active tab, search query, sort order | `?page=2&status=active&sort=created_at&order=desc`, `?tab=documents` | URL is the source of truth for filterable/sortable list views. Components read from and write to URL params. TanStack Query keys include URL params for cache coherence. |

### 6.2 Zustand Store Inventory (Workspace)

Each store manages one domain of client state. No god stores.

| Store | State Fields | Actions | Persistence |
|-------|-------------|---------|------------|
| `useThemeStore` | `theme: 'light' | 'dark' | 'system'` | `setTheme(theme)`, `toggleTheme()` | Yes — `localStorage` via `zustand/middleware/persist` |
| `useSidebarStore` | `isOpen: boolean`, `isCollapsed: boolean` | `toggleSidebar()`, `setCollapsed(collapsed)` | Yes — `localStorage` |
| `useCommandPaletteStore` | `isOpen: boolean` | `open()`, `close()`, `toggle()` | No — resets on page navigation |
| `useWorkspaceStore` | `activeWorkspaceId: WorkspaceId` | `setWorkspace(id)` | Yes — `localStorage` (remembers last workspace) |
| `useChatUIStore` | `isStreaming: boolean`, `inputHeight: number` | `setStreaming(v)`, `setInputHeight(h)` | No — resets per chat session |
| `useSelectionStore` | `selectedIds: Set<string>` | `select(id)`, `deselect(id)`, `clearSelection()`, `selectAll(ids)` | No — resets per page |

All stores are consumed via selectors to prevent unnecessary re-renders: `useThemeStore(s => s.theme)`, not `useThemeStore()`. Stores are defined in `src/stores/` for app-level stores and `src/features/*/stores/` for feature-specific stores.

### 6.3 TanStack Query Key Factory (Workspace)

Query keys follow a structured factory pattern. Every key is a tuple that encodes the entity type, operation, and identifiers.

```typescript
// src/lib/query-keys.ts

export const chatKeys = {
  all:        ['chat'] as const,
  lists:      () => [...chatKeys.all, 'list'] as const,
  list:       (filters: ChatFilters) => [...chatKeys.lists(), filters] as const,
  details:    () => [...chatKeys.all, 'detail'] as const,
  detail:     (id: ChatSessionId) => [...chatKeys.details(), id] as const,
  messages:   (id: ChatSessionId) => [...chatKeys.detail(id), 'messages'] as const,
};

export const agentKeys = {
  all:        ['agent'] as const,
  lists:      () => [...agentKeys.all, 'list'] as const,
  list:       (filters?: AgentFilters) => [...agentKeys.lists(), filters] as const,
  details:    () => [...agentKeys.all, 'detail'] as const,
  detail:     (id: AgentId) => [...agentKeys.details(), id] as const,
};

export const knowledgeKeys = {
  all:        ['knowledge'] as const,
  lists:      () => [...knowledgeKeys.all, 'list'] as const,
  list:       (filters?: KBFilters) => [...knowledgeKeys.lists(), filters] as const,
  details:    () => [...knowledgeKeys.all, 'detail'] as const,
  detail:     (id: KnowledgeBaseId) => [...knowledgeKeys.details(), id] as const,
  documents:  (id: KnowledgeBaseId) => [...knowledgeKeys.detail(id), 'documents'] as const,
};

export const memoryKeys = {
  all:        ['memory'] as const,
  lists:      () => [...memoryKeys.all, 'list'] as const,
  list:       (filters?: MemoryFilters) => [...memoryKeys.lists(), filters] as const,
  details:    () => [...memoryKeys.all, 'detail'] as const,
  detail:     (id: MemoryPackId) => [...memoryKeys.details(), id] as const,
  versions:   (id: MemoryPackId) => [...memoryKeys.detail(id), 'versions'] as const,
};

export const userKeys = {
  all:        ['user'] as const,
  me:         () => [...userKeys.all, 'me'] as const,
  preferences:() => [...userKeys.all, 'preferences'] as const,
  workspaces: () => [...userKeys.all, 'workspaces'] as const,
};
```

### 6.4 Cache Invalidation Strategy

Cache invalidation follows a strict hierarchical pattern. Mutations invalidate the narrowest possible key prefix to avoid over-refetching.

| Mutation | Invalidation Scope | Rationale |
|----------|-------------------|-----------|
| Send message | `chatKeys.messages(chatId)` | Only the current conversation's messages change. |
| Create chat session | `chatKeys.lists()` | New session appears in the list. |
| Delete chat session | `chatKeys.lists()` + `chatKeys.detail(id)` | Removed from list and detail cache cleared. |
| Update agent | `agentKeys.detail(id)` + `agentKeys.lists()` | Detail updated, list may show changed status/name. |
| Create agent | `agentKeys.lists()` | New agent appears in list. |
| Upload document | `knowledgeKeys.documents(kbId)` + `knowledgeKeys.detail(kbId)` | Document count and processing status change. |
| Update memory pack | `memoryKeys.detail(id)` + `memoryKeys.lists()` | Detail updated, list may show changed version count. |
| Update user preferences | `userKeys.preferences()` | Only preferences cache needs refresh. |

Optimistic updates are applied for create, update, and delete mutations. On success, the optimistic update becomes permanent. On error, the cache is rolled back to the previous state and a toast notification displays the Persian error message.

---

## 7. RTL Integration

HotHoosh is Persian-first and RTL-native. Right-to-left support is not an afterthought or a conditional layer — it is the default. The entire styling system is built on CSS logical properties that automatically adapt to the document's `dir` attribute, making bidirectional support structural rather than conditional.

### 7.1 CSS Logical Properties

Per Engineering Rules §10.1.4 and Design Decision DD-12, all spacing, positioning, and sizing use CSS logical properties exclusively. Physical properties (`left`, `right`, `ml-*`, `mr-*`, `pl-*`, `pr-*`) are forbidden.

| Physical Property (FORBIDDEN) | Logical Property (REQUIRED) | Tailwind Class | Behavior in RTL | Behavior in LTR |
|-------------------------------|---------------------------|----------------|-----------------|-----------------|
| `margin-left` | `margin-inline-start` | `ms-*` | `margin-right` | `margin-left` |
| `margin-right` | `margin-inline-end` | `me-*` | `margin-left` | `margin-right` |
| `padding-left` | `padding-inline-start` | `ps-*` | `padding-right` | `padding-left` |
| `padding-right` | `padding-inline-end` | `pe-*` | `padding-left` | `padding-right` |
| `text-align: left` | `text-align: start` | `text-start` | `text-align: right` | `text-align: left` |
| `text-align: right` | `text-align: end` | `text-end` | `text-align: left` | `text-align: right` |
| `left: 0` | `inset-inline-start: 0` | `start-0` | `right: 0` | `left: 0` |
| `right: 0` | `inset-inline-end: 0` | `end-0` | `left: 0` | `right: 0` |
| `width` | `inline-size` | `is-*` | Same (block axis unaffected) | Same |
| `height` | `block-size` | `bs-*` | Same (inline axis unaffected) | Same |
| `border-left` | `border-inline-start` | `border-s-*` | `border-right` | `border-left` |
| `border-right` | `border-inline-end` | `border-e-*` | `border-left` | `border-right` |

An ESLint rule (`no-physical-properties`) enforces this at the lint level. Any use of `left`, `right`, `margin-left`, `margin-right`, `padding-left`, `padding-right` (in CSS or Tailwind classes `ml-*`, `mr-*`, `pl-*`, `pr-*`) is a build error.

### 7.2 Tailwind RTL Configuration

Tailwind CSS 4 provides native support for logical properties. The configuration maps logical utility classes to their CSS counterparts:

- `ms-*` → `margin-inline-start`
- `me-*` → `margin-inline-end`
- `ps-*` → `padding-inline-start`
- `pe-*` → `padding-inline-end`
- `start-*` → `inset-inline-start`
- `end-*` → `inset-inline-end`
- `rounded-s-*` → `border-start-start-radius` and `border-end-start-radius`
- `rounded-e-*` → `border-start-end-radius` and `border-end-end-radius`

Flexbox and grid automatically respect the document direction. `flex-row` renders items left-to-right in LTR and right-to-left in RTL. `justify-start` aligns to the inline start (left in LTR, right in RTL).

### 7.3 Vazirmatn Font Loading

The Vazirmatn typeface is self-hosted in `public/fonts/` and loaded via Next.js `next/font/local`:

```typescript
// src/app/layout.tsx
import localFont from 'next/font/local';

const vazirmatn = localFont({
  src: [
    { path: '../../public/fonts/vazirmatn-var.woff2', style: 'normal' },
  ],
  variable: '--font-vazirmatn',
  display: 'swap',
  preload: true,
});
```

The `font-display: swap` prevents invisible text during font loading (FOIT). The `preload: true` hint ensures the critical font file begins downloading immediately. The CSS variable `--font-vazirmatn` is applied to the `:root` selector, making it available to all Tailwind utilities and CSS custom properties.

### 7.4 Direction Switching

The root `<html>` element's `dir` attribute controls the entire page direction. By default, it is set to `"rtl"` for Persian users. When the user switches to English, the `dir` attribute changes to `"ltr"`.

```typescript
// The theme store also manages direction
<html
  dir={locale === 'fa' ? 'rtl' : 'ltr'}
  lang={locale}
  className={vazirmatn.variable}
  data-theme={theme}
>
```

Because all styling uses logical properties, changing `dir` automatically flips all margins, padding, borders, text alignment, and positioning. No conditional CSS classes are needed. No JavaScript direction logic exists in components.

### 7.5 Solar Hijri Calendar Component

The Solar Hijri calendar is the default date display for Persian users. It is implemented as a custom component that wraps dayjs with the jalaali-js plugin:

```typescript
// src/lib/dayjs.ts
import dayjs from 'dayjs';
import jalaali from 'jalaali-js';

// Custom dayjs plugin for Jalali calendar
dayjs.extend(jalaaliPlugin);
```

The calendar component (a date picker built on shadcn/ui's Calendar primitive) renders months in Solar Hijri format. Month names are in Persian (فروردین, اردیبهشت, خرداد, ...). The component supports:

| Feature | Implementation |
|---------|---------------|
| Month/year display | `dayjs().format('jMMMM jYYYY')` → "خرداد ۱۴۰۴" |
| Date selection | Click on a day cell to select. Selected date uses `dayjs().calendar('jalaali').format()` |
| Navigation | Previous/next month buttons navigate Solar Hijri months (not Gregorian) |
| Gregorian fallback | When user's calendar preference is set to Gregorian, the same component renders Gregorian dates |

### 7.6 Persian Numeral Formatting

The `formatPersianNumeral()` utility (in `packages/shared/src/utils/number.ts`) converts Western Arabic digits to Persian digits:

| Input | Output | Use Case |
|-------|--------|----------|
| `1404` | `۱۴۰۴` | Year display in Solar Hijri dates |
| `1234567` | `۱٬۲۳۴٬۵۶۷` | Large numbers in stat cards and tables |
| `1,250` | `۱٬۲۵۰` | Token counts, file sizes |
| `99.5%` | `۹۹٫۵٪` | Percentage displays |

This formatting is applied at the display layer (components), not at the data layer. All API responses use Western Arabic numerals; conversion happens in the UI.

---

## 8. Theme System

HotHoosh supports dark mode and light mode as first-class citizens per PRD Principle #13. Theme preference is per-user, persists across sessions, and respects the system preference by default. The implementation uses CSS custom properties exclusively — Tailwind's `dark:` variant is never used.

### 8.1 Design Token to CSS Variable Mapping

All colors, shadows, and effects are defined as CSS custom properties in `globals.css`. The root `:root` selector defines light mode values; the `[data-theme="dark"]` selector overrides them for dark mode.

| Token Category | Token Name | Light Value | Dark Value | Usage |
|---------------|------------|-------------|------------|-------|
| **Background** | `--color-background` | `#FFFFFF` | `#0A0A0F` | Page background, `glass-panel-solid` base |
| | `--color-background-secondary` | `#F5F5F7` | `#12121A` | Sidebar, card backgrounds |
| | `--color-background-tertiary` | `#EAEAED` | `#1A1A25` | Hover states, inset areas |
| **Foreground** | `--color-foreground` | `#1A1A2E` | `#EAEAED` | Primary text |
| | `--color-foreground-secondary` | `#4A4A5A` | `#9A9AAA` | Secondary text, captions |
| | `--color-foreground-muted` | `#8A8A9A` | `#6A6A7A` | Disabled text, placeholders |
| **Accent** | `--color-accent` | `#4F46E5` | `#818CF8` | Primary action color, links, active states |
| | `--color-accent-hover` | `#4338CA` | `#6366F1` | Hover state for accent elements |
| | `--color-accent-subtle` | `#EEF2FF` | `#1E1B4B` | Subtle accent backgrounds, badges |
| **Glass surfaces** | `--glass-panel` | `rgba(255,255,255,0.6)` | `rgba(18,18,26,0.6)` | Standard glass panel |
| | `--glass-panel-solid` | `rgba(255,255,255,0.95)` | `rgba(10,10,15,0.95)` | Top bar, sidebar |
| | `--glass-panel-elevated` | `rgba(255,255,255,0.8)` | `rgba(26,26,37,0.8)` | Admin elevated surfaces |
| | `--glass-panel-data` | `rgba(255,255,255,0.7)` | `rgba(20,20,30,0.7)` | Admin data tables, stat cards |
| **Borders** | `--color-border` | `#E5E5EA` | `#2A2A3A` | Default borders |
| | `--color-border-focus` | `--color-accent` | `--color-accent` | Focus ring color |
| **Shadows** | `--shadow-glass` | `0 4px 30px rgba(0,0,0,0.08)` | `0 4px 30px rgba(0,0,0,0.3)` | Glass panel shadow |
| **Semantic** | `--color-success` | `#059669` | `#34D399` | Success states, positive trends |
| | `--color-warning` | `#D97706` | `#FBBF24` | Warning states |
| | `--color-error` | `#DC2626` | `#F87171` | Error states, destructive actions |

### 8.2 Theme Toggle Mechanism

The theme state is managed by `useThemeStore` (Zustand with `persist` middleware). The store supports three values: `'light'`, `'dark'`, and `'system'`.

| Step | Action |
|------|--------|
| 1 | On app load, `useThemeStore` reads from `localStorage`. If no value, defaults to `'system'`. |
| 2 | If value is `'system'`, the store subscribes to `window.matchMedia('(prefers-color-scheme: dark)')` and updates reactively when the OS theme changes. |
| 3 | The resolved theme (`'light'` or `'dark'`) is applied to the root `<html>` element via `data-theme` attribute. |
| 4 | When the user explicitly toggles the theme (via the user menu or settings page), the store updates `localStorage` and sets the `data-theme` attribute. |
| 5 | All CSS variables resolve based on the `data-theme` attribute. Components never read theme state directly — they consume CSS variables via `var(--color-accent)`. |

Components reference design tokens exclusively through CSS variables, never through hardcoded values. Tailwind utility classes for layout and spacing (`p-4`, `flex`, `gap-2`) are fine. But any color, shadow, or effect must use `var(--token-name)`: `bg-[var(--color-background)]`, `text-[var(--color-foreground)]`, `shadow-[var(--shadow-glass)]`.

### 8.3 No Tailwind `dark:` Variant

Per Engineering Rules §10.1.4, the Tailwind `dark:` variant is never used. All theme-dependent styling uses CSS custom properties. This means:

- `bg-white dark:bg-gray-900` → **WRONG**
- `bg-[var(--color-background)]` → **CORRECT**

This eliminates an entire class of theme bugs where a developer forgets to add the `dark:` variant to a new class. With CSS variables, theme changes are automatic and complete.

---

## 9. Data Fetching Patterns

HotHoosh uses a dual data fetching strategy: Server Components for page-level data and TanStack Query for client-side data. This hybrid approach minimizes client-side JavaScript while providing interactive, cache-managed data access for dynamic features.

### 9.1 Server Components for Page-Level Data

Page components that display static or semi-static data use React Server Components with `async/await` to fetch data at the server. This data is serialized into the initial HTML, providing fast First Contentful Paint (FCP) and Largest Contentful Paint (LCP) without client-side JavaScript.

| Page | Data Fetched Server-Side | Client Component Handoff |
|------|------------------------|-------------------------|
| `/agents` | Agent list via `fetch()` to API | `AgentGallery` (Client) receives agents as props, adds client-side filtering/sorting |
| `/agents/[agentId]` | Agent detail + configuration | `AgentDetail` (Client) receives agent data, adds test console interactivity |
| `/knowledge` | Knowledge base list | `KnowledgeList` (Client) receives KBs as props, adds search/filter |
| `/settings` | User profile + preferences | `SettingsForm` (Client) receives data, handles form submission via RHF + Zod |

### 9.2 TanStack Query for Client-Side Data

Data that requires interactivity (real-time updates, polling, infinite scrolling, optimistic updates) uses TanStack Query hooks in Client Components.

| Hook | Use Case | Configuration |
|------|----------|-------------|
| `useQuery` | Single entity fetches (chat messages, agent detail, KB documents) | `staleTime: 5 * 60 * 1000` (5 min) for infrequently changing data; `staleTime: 0` for real-time data |
| `useInfiniteQuery` | Large lists (audit logs, system logs, chat history) | Cursor-based pagination with `getNextPageParam`. Each page fetches 20 items. |
| `useMutation` | All write operations (send message, create agent, upload document, update settings) | `onSuccess` invalidates relevant query keys. `onError` shows toast with Persian error message. |
| `useQueries` | Parallel fetches of independent data (dashboard KPIs) | Used in the admin dashboard to fetch all 6 KPI metrics simultaneously |

### 9.3 Infinite Queries for Lists

Lists that can grow unboundedly (chat messages, audit logs, system logs) use `useInfiniteQuery` with cursor-based pagination:

```typescript
// Example: Chat messages with infinite scroll
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
    queryKey: chatKeys.messages(chatId),
    queryFn: ({ pageParam }) => chatService.getMessages(chatId, { cursor: pageParam, limit: 50 }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor ?? undefined,
    staleTime: 0,
  });
```

Messages are rendered in reverse chronological order (newest at bottom). Virtualization via `@tanstack/react-virtual` handles lists exceeding 100 items to maintain scroll performance.

### 9.4 Prefetching on Hover

Per Engineering Rules §10.4.4, navigation links prefetch their target page's data on hover using `queryClient.prefetchQuery()`. This is implemented via a custom `usePrefetchOnHover` hook applied to navigation links:

```typescript
// Applied to <Link> components in navigation and lists
<Link
  href={`/agents/${agent.id}`}
  onMouseEnter={() =>
    queryClient.prefetchQuery({
      queryKey: agentKeys.detail(agent.id),
      queryFn: () => agentService.getById(agent.id),
      staleTime: 5 * 60 * 1000,
    })
  }
>
```

When the user hovers over an agent card, the agent detail data begins fetching. If the user clicks, the data is already in cache and the detail page renders instantly.

### 9.5 Optimistic Updates

Create, update, and delete mutations apply optimistic updates to the TanStack Query cache. The UI reflects the change immediately; the cache is rolled back if the mutation fails.

| Mutation | Optimistic Update | Rollback |
|----------|------------------|---------|
| Send message | Append message to `chatKeys.messages(chatId)` cache | Remove appended message |
| Rename chat session | Update session name in `chatKeys.detail(id)` and `chatKeys.lists()` caches | Restore original name |
| Delete chat session | Remove session from `chatKeys.lists()` cache | Re-insert session |
| Toggle agent status | Update `status` field in `agentKeys.detail(id)` and `agentKeys.lists()` caches | Restore original status |

### 9.6 SSE Streaming for AI Responses

AI response streaming uses the native `EventSource` API for Server-Sent Events. The streaming hook manages the SSE connection lifecycle:

| Phase | Action |
|-------|--------|
| Connection | User sends message via `POST`. Response includes a `Location` header pointing to the SSE stream. `EventSource` connects to that URL. |
| Streaming | Server sends `event: token` messages with `data: { content: "...", done: false }`. Hook appends tokens to the last message in the TanStack Query cache. |
| Completion | Server sends `event: done` with `data: { usage: { inputTokens, outputTokens } }`. Hook finalizes the message and updates the cache. |
| Error | Server sends `event: error` or connection drops. Hook shows a toast with the Persian error message and offers a retry button. `EventSource` auto-reconnects on disconnection. |

---

## 10. Error Handling

Error handling in HotHoosh operates at four levels: route-level error boundaries, TanStack Query error policies, toast notifications, and API error response handling. Each level has a distinct responsibility and user-facing behavior.

### 10.1 Route-Level Error Boundaries

Every route segment has an `error.tsx` file that serves as a React error boundary. These boundaries catch rendering errors (both Server and Client Components) that occur within their route segment.

| Boundary | Behavior |
|----------|----------|
| Root `error.tsx` | Catches unhandled errors. Shows a full-page error with Persian message, retry button, and link to `/chat`. |
| `(workspace)/error.tsx` | Catches errors within any workspace page. Shows error within the workspace shell (sidebar remains visible and functional). |
| Feature-level `error.tsx` | Catches errors within a specific feature route (e.g., `chat/error.tsx`). Shows error within the feature's layout (e.g., conversation list remains visible while the main area shows error). |

Error boundaries are reset when the user navigates to a different route segment or clicks the retry button. They do not catch errors in sibling routes — only in descendant routes.

### 10.2 TanStack Query Error Handling

Per Engineering Rules §10.4.4, query errors are caught by React error boundaries, not by `try/catch` in components. The `QueryClient` is configured with:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      throwOnError: true, // Errors propagate to error boundaries
    },
    mutations: {
      retry: 0,
      onError: (error) => {
        toast.error(t(error.message)); // Persian error message from API
      },
    },
  },
});
```

| Scenario | Behavior |
|----------|----------|
| Query fails on mount | Error propagates to nearest error boundary. User sees the route-level error UI. |
| Query fails on refetch | Error propagates to nearest error boundary. Stale data remains visible (TanStack Query keeps the last successful data). |
| Mutation fails | `onError` callback shows a toast notification with the Persian error message. No error boundary triggered. |
| Mutation fails with optimistic update | Optimistic update is rolled back. Toast shows the error message. |

### 10.3 API Error Response Format

All API errors follow a standardized JSON structure defined in Engineering Rules §10.1.3:

```json
{
  "error": {
    "code": "AGENT_NOT_FOUND",
    "message": "عامل هوشمند مورد نظر یافت نشد.",
    "details": {
      "agentId": "agent_abc123"
    }
  }
}
```

The `message` field is in the user's language (Persian by default, English when the user's locale is English). The `code` field is a machine-readable string used for programmatic error handling. The `details` field provides additional context for debugging.

### 10.4 Toast Notifications

Toast notifications are rendered by the toast provider (sonner integration via shadcn/ui) and appear at the bottom-start corner of the viewport (bottom-right in LTR mode, thanks to logical properties). Toasts are used for:

| Trigger | Toast Type | Persian Example |
|---------|-----------|-----------------|
| Mutation success | Success (green) | "عامل هوشمند با موفقیت ایجاد شد." (Agent created successfully) |
| Mutation failure | Error (red) | "خطا در ذخیره تغییرات. لطفاً دوباره تلاش کنید." (Error saving changes. Please try again.) |
| Background operation complete | Info (blue) | "پردازش سند کامل شد." (Document processing complete) |
| Copy to clipboard | Success (green) | "در کلیپ‌بورد کپی شد." (Copied to clipboard) |

Toasts auto-dismiss after 5 seconds. Error toasts persist until manually dismissed. All toast text is in the user's current language.

---

## 11. Performance Strategy

HotHoosh targets Core Web Vitals compliance (LCP < 2.5s, FID < 100ms, CLS < 0.1, INP < 200ms) as specified in the PRD §5.1. The performance strategy operates across five dimensions: bundle size, rendering, network, runtime, and visual stability.

### 11.1 Code Splitting and Bundle Budgets

| Strategy | Implementation | Target |
|----------|---------------|--------|
| Route-based splitting | Every route is a separate chunk via Next.js App Router automatic code splitting | < 100KB gzipped per route chunk |
| Dynamic imports for heavy components | `next/dynamic` for ECharts, rich text editors, PDF viewers, and the command palette | Excluded from initial bundle entirely |
| Shared chunk deduplication | Turborepo and Next.js automatically deduplicate shared dependencies into a single chunk | No duplicate React, Zod, or TanStack Query code |
| Tree shaking | TypeScript strict mode + ESM ensures dead code elimination. `sideEffects: false` in package.json | Unused code removed at build time |

| Budget | Limit | Enforced By |
|--------|-------|-------------|
| Initial JS bundle (first load) | < 200KB gzipped | CI pipeline (bundle analyzer) |
| Per-route chunk | < 100KB gzipped | CI pipeline (bundle analyzer) |
| Total JS per page (including lazy) | < 500KB gzipped | CI pipeline (bundle analyzer) |
| CSS (including design tokens) | < 50KB gzipped | CI pipeline |

### 11.2 Image Optimization

All images use `next/image` with explicit `width` and `height` props to prevent layout shift. Images are served in WebP/AVIF format with automatic format negotiation via the `Accept` header. Below-the-fold images are lazy-loaded (`loading="lazy"`, which is the default for `next/image`). Above-the-fold images (hero, logo) use `priority` for preloading.

### 11.3 Font Loading

Vazirmatn is self-hosted (not loaded from a CDN) to eliminate an external network request. The font file is preloaded via `next/font/local` with `preload: true` and `display: 'swap'`. The `swap` strategy prevents Flash of Invisible Text (FOIT) while ensuring the font loads without blocking rendering. A `font-display: optional` strategy is not used because it would result in Flash of Unstyled Text (FOUT) for Persian content, which is unacceptable for an RTL-native product.

### 11.4 Virtualization

Per Engineering Rules §10.8.1, lists with more than 100 items use virtualization via `@tanstack/react-virtual`. This applies to:

| List | Virtualization Strategy |
|------|----------------------|
| Chat messages | Reverse-infinite virtualized list. Only visible messages + overscan buffer (5 items) are rendered. Scroll position is preserved across re-renders. |
| Audit logs | Forward-infinite virtualized list with cursor-based pagination. |
| System logs | Forward-infinite virtualized list with SSE-based real-time updates. New items are prepended to the top. |
| Data tables (admin) | Virtualized rows when total items exceed 100. Pagination is still available as an alternative view. |

### 11.5 Memoization Strategy

Memoization is applied judiciously, only after profiling identifies actual re-render performance issues. The following table defines when each memoization primitive is appropriate:

| Primitive | When to Use | When NOT to Use |
|-----------|-------------|----------------|
| `React.memo` | Components that receive complex props (objects, arrays) and re-render infrequently (e.g., `MessageBubble` when siblings stream tokens) | Components that re-render on every parent update anyway (e.g., layout containers) |
| `useMemo` | Expensive computations (filtering large lists, formatting complex data) | Simple computations (string concatenation, boolean checks) |
| `useCallback` | Functions passed as props to `React.memo` children | Functions passed to non-memoized children |

### 11.6 Prefetching Strategy

| Trigger | Action |
|--------|--------|
| Link hover | `queryClient.prefetchQuery()` for the target page's data (agents, KBs, etc.) |
| Link in viewport | Next.js built-in viewport-based prefetching for route chunks |
| Command palette open | Prefetch frequently accessed entities (recent chats, active agents) |
| Dashboard mount | `useQueries` to fetch all KPI metrics in parallel |

---

## 12. Accessibility Strategy

HotHoosh targets WCAG 2.2 Level AA compliance as a non-negotiable requirement per PRD §5.5. Accessibility is not a retrofit — it is embedded in every component, every interaction pattern, and every design decision from the outset.

### 12.1 Keyboard Navigation

Every interactive element is reachable and operable via keyboard alone. The tab order follows the visual order of the page, which respects the RTL layout (tab progresses from right to left in RTL mode, as per the browser's natural behavior with `dir="rtl"`).

| Pattern | Implementation |
|---------|---------------|
| **Focus indicators** | Custom focus rings with minimum 2px offset and 3:1 contrast ratio against the background. The default browser focus outline is never suppressed (`outline: none` is forbidden) without providing a visible replacement. Focus indicators use the `--color-accent` design token. |
| **Skip navigation** | A visually hidden skip link at the top of every page allows keyboard users to jump to the main content area, bypassing the sidebar and top bar. The link becomes visible on focus. |
| **Modal focus trapping** | When a dialog opens (via shadcn/ui's Dialog component, built on Radix UI), focus moves to the first focusable element inside the dialog. Tabbing cycles within the dialog. When the dialog closes, focus returns to the trigger element. |
| **Command palette** | `Cmd+K` / `Ctrl+K` opens the command palette. Arrow keys navigate results. `Enter` selects. `Escape` closes. The command palette is a modal with full focus trapping. |
| **Chat input** | `Enter` sends the message. `Shift+Enter` inserts a newline. The input is an auto-resizing `<textarea>` with proper `aria-label`. |
| **Data tables** | `Tab` moves between interactive elements (sort buttons, action menus, checkboxes). `Arrow` keys navigate within the table when in grid navigation mode. |

### 12.2 Screen Reader Support

All content is accessible via screen reader (NVDA on Windows, VoiceOver on macOS/iOS, TalkBack on Android). ARIA attributes supplement semantic HTML — they never replace it.

| Pattern | Implementation |
|---------|---------------|
| **Semantic HTML** | `<button>` for actions, `<a>` for navigation, `<nav>` for navigation landmarks, `<main>` for main content, `<aside>` for complementary content. Never `<div onClick>` for interactive elements. |
| **Image alt text** | All `<img>` elements have descriptive `alt` text in Persian. Decorative images use `alt=""`. |
| **Icon-only buttons** | Every icon-only button has an `aria-label` in the user's language (e.g., `aria-label="ارسال پیام"` for the send button). |
| **Live regions** | Chat messages streaming in use `aria-live="polite"`. Toast notifications use `aria-live="polite"`. Critical errors use `aria-live="assertive"`. |
| **Status announcements** | Loading states that take more than 3 seconds announce their status via `aria-live`: "در حال بارگذاری..." (Loading...). |
| **Dialog roles** | Modals use `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` pointing to the dialog title. |
| **Tab interfaces** | Tab bars use `role="tablist"`, `role="tab"` with `aria-selected`, and `role="tabpanel"` with `aria-labelledby` pointing to the controlling tab. |
| **Data tables** | Tables use `<table>` with proper `<thead>`, `<th scope="col">`, and `<caption>`. Interactive tables use appropriate ARIA grid roles. |

### 12.3 ARIA Patterns for Complex Components

| Component | ARIA Pattern | Key Behaviors |
|-----------|-------------|---------------|
| **Chat message list** | `role="log"` with `aria-live="polite"` | New messages are announced. Screen readers can navigate the message history. |
| **Branch selector** | `role="listbox"` with `role="option"` and `aria-selected` | Each branch is an option. Selected branch is announced. |
| **Agent selector** | `role="combobox"` with `aria-expanded`, `aria-controls` pointing to the dropdown list | Type-ahead filtering supported. Selected agent announced on change. |
| **Tenant scope selector (admin)** | `role="combobox"` with hierarchical grouping | Group labels announced. Selection change reloads data with a loading announcement. |
| **File upload progress** | `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` | Progress percentage announced at 25% intervals. Completion announced via live region. |

### 12.4 Visual Accessibility

| Requirement | Implementation |
|------------|---------------|
| **Color contrast** | Minimum 4.5:1 for normal text, 3:1 for large text (18px+ or 14px+ bold), 3:1 for non-text UI components against adjacent colors. Verified via automated CI checks. |
| **No color-only information** | Status indicators always include text or icons in addition to color. A green dot alone is forbidden — it must be paired with a label like "فعال" (Active). |
| **Text resizing** | All text scales to 200% without loss of content or functionality. No fixed-width containers that clip text. No fixed-height containers that hide overflow. |
| **Reduced motion** | `prefers-reduced-motion: reduce` media query disables all animations and transitions. State changes become instant. Loading spinners remain as they are functional indicators, not decorative animations. |
| **Dark mode contrast** | All color pairings in dark mode meet the same contrast requirements as light mode. Dark mode is not a dimmed version of light mode — it is a fully designed, independently validated theme. |
| **Touch targets** | All interactive elements have minimum 44×44px touch targets on mobile. Dense data tables use spacing or padding to expand hit areas. |

---

## 13. Internationalization

HotHoosh is Persian-first with English as a secondary language. Internationalization is not a plugin or an overlay — it is a foundational architectural decision that affects every layer of the frontend: the document direction, the calendar system, the numeral formatting, and the user interface text.

### 13.1 Language and Direction Defaults

| Aspect | Default (Persian) | Secondary (English) |
|--------|-------------------|---------------------|
| Language | Persian (فارسی) | English |
| Text direction | RTL (`dir="rtl"`) | LTR (`dir="ltr"`) |
| Calendar | Solar Hijri (شمسی) | Gregorian |
| Numerals | Persian (۱۲۳) | Western Arabic (123) |
| Font | Vazirmatn (self-hosted) | Vazirmatn (same font — it includes Latin characters) |
| Error messages | Persian | English |
| UI labels | Persian | English |

The user's locale preference is stored in their profile and applied on login. The `useThemeStore` (or a dedicated `useLocaleStore`) manages the current locale and triggers the following changes:

1. The `<html>` element's `dir` attribute changes (`"rtl"` ↔ `"ltr"`).
2. The `<html>` element's `lang` attribute changes (`"fa"` ↔ `"en"`).
3. All CSS logical properties automatically adapt to the new direction.
4. Date displays switch between Solar Hijri and Gregorian formatting.
5. Numbers switch between Persian and Western Arabic numerals.
6. All UI text renders in the selected language.

### 13.2 RTL/LTR Switching Mechanism

The switch between RTL and LTR is architectural, not conditional. Components do not contain `if (isRtl)` branches. The mechanism works as follows:

| Layer | Responsibility |
|-------|---------------|
| **HTML** | `<html dir="rtl" lang="fa">` or `<html dir="ltr" lang="en">`. The `dir` attribute drives all directional behavior. |
| **CSS** | All properties use logical values (`margin-inline-start`, `inset-inline-end`). No physical properties exist. Direction change is automatic. |
| **Tailwind** | All utility classes use logical variants (`ms-4`, `pe-2`, `start-0`, `text-start`). No physical variants (`ml-4`, `pr-2`, `left-0`, `text-left`) exist in the codebase. |
| **Components** | Components are direction-agnostic. They use `start`/`end` semantics. A sidebar is "at the inline start" — it renders on the right in RTL and on the left in LTR without any component code changes. |
| **Icons** | Phosphor Icons with RTL mirror support. Directional icons (arrows, chevrons, exit icons) automatically flip when the document direction changes. |

### 13.3 Calendar System

The default calendar for Persian users is Solar Hijri (شمسی), implemented via dayjs with the jalaali-js plugin. The calendar preference is stored in the user's profile and can be toggled in Settings.

| Calendar | Plugin | Format Example | Use Case |
|----------|--------|---------------|----------|
| Solar Hijri | `jalaali-js` | `۱۴۰۴/۰۳/۱۵` (jYYYY/jMM/jDD) | Default for Persian users. Used in all date displays, date pickers, and date range filters. |
| Gregorian | dayjs built-in | `2025-06-06` | Secondary calendar for English users or Persian users who prefer Gregorian. |

The `formatPersianDate()` utility (in `packages/shared/src/utils/date.ts`) provides a consistent formatting API:

- `formatPersianDate(date, 'full')` → "۱۵ خرداد ۱۴۰۴"
- `formatPersianDate(date, 'short')` → "۱۴۰۴/۰۳/۱۵"
- `formatPersianDate(date, 'relative')` → "۲ ساعت پیش" (2 hours ago)

Relative time formatting uses Persian units: "ثانیه" (second), "دقیقه" (minute), "ساعت" (hour), "روز" (day), "هفته" (week), "ماه" (month), "سال" (year).

### 13.4 Number Formatting

Number formatting is locale-aware and applied at the display layer:

| Format | Persian Example | English Example | Use Case |
|--------|----------------|-----------------|----------|
| Standard | `۱٬۲۳۴٬۵۶۷` | `1,234,567` | User counts, token counts |
| Currency | `۱۲٬۵۰۰٬۰۰۰ ریال` | `125,000,000 Rial` | Billing amounts, invoices |
| Percentage | `۹۹٫۵٪` | `99.5%` | Usage ratios, progress bars |
| Compact | `۱.۲M` | `1.2M` | Dashboard KPIs for large numbers |
| Calendar year | `۱۴۰۴` | `2025` | Date displays |

The `formatPersianNumeral()` and `formatCurrency()` utilities in `packages/shared` handle conversion. Components call these utilities when rendering numbers; the underlying data always uses Western Arabic numerals.

---

## Appendix A: Document Cross-References

| Document | Relevance |
|----------|-----------|
| [PRD.md](./PRD.md) | Product principles (#1 Persian-First, #2 RTL-Native, #13 Dark/Light Mode, #14 Glass Morphism), functional and non-functional requirements |
| [Architecture.md](./Architecture.md) | §3 Frontend Architecture, §5 Shared Layer, §8 Key Design Decisions (DD-09 through DD-14) |
| [Engineering-Rules.md](./Engineering-Rules.md) | §10.1.2 React/Next.js rules, §10.1.4 CSS/Tailwind rules, §10.2.2 apps/web folder structure, §10.4.1 frontend architecture rules, §10.4.4 state management rules, §10.7 accessibility, §10.8 performance |
| [Admin-Panel.md](./Admin-Panel.md) | §9.1–9.2 Admin panel layout, navigation, and design principles |
| [Information-Architecture.md](./Information-Architecture.md) | Site map, URL structure, navigation model, page types |
| [Database.md](./Database.md) | Entity schemas that define the data shapes fetched by frontend queries |