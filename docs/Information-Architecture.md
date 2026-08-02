# Information Architecture

## HotHoosh — Enterprise AI Workspace

---

## Table of Contents

1. [Overview](#1-overview)
2. [Site Map](#2-site-map)
3. [Navigation Model](#3-navigation-model)
4. [Content Hierarchy](#4-content-hierarchy)
5. [URL Structure](#5-url-structure)
6. [Page Types](#6-page-types)
7. [User Flows](#7-user-flows)
8. [Search Architecture](#8-search-architecture)

---

## 1. Overview

### 1.1 Purpose of This Document

This document defines the information architecture (IA) of HotHoosh — what content exists, how it is organized, how users navigate it, and how the IA supports the platform's multi-tenant enterprise model. It serves as the structural blueprint that connects the PRD's functional requirements to the UX design and frontend routing architecture.

### 1.2 IA Principles

| Principle | Application in HotHoosh |
|-----------|------------------------|
| **Persian-First** | All labels, navigation items, and content structures default to Persian. English is a secondary overlay, not a parallel structure. |
| **Tenant-Aware Scoping** | Every piece of content is scoped to a level in the tenant hierarchy. Users never see content from a tenant scope they lack access to. |
| **Progressive Disclosure** | High-level summaries surface first (dashboards, lists). Detail is available on demand (detail pages, inline expanders, drill-downs). |
| **Consistent Mental Model** | The same entity types (agents, knowledge bases, memory packs, users) appear with consistent structure in both workspace and admin contexts. |
| **Task-Oriented Grouping** | Navigation groups items by what the user is trying to accomplish, not by technical domain. |
| **Minimal Depth** | No page requires more than three clicks from the root navigation to reach. |

### 1.3 How IA Supports the Multi-Tenant Hierarchy

HotHoosh's four-level tenant hierarchy (Organization → Company → Brand → Workspace) is the backbone of the IA. Every entity in the system — users, agents, knowledge bases, memory packs, chat sessions, billing records — is owned by exactly one tenant node. The IA enforces this in three ways:

1. **Scope filtering**: Navigation and content automatically adjust to the user's effective tenant scope. A Company Admin sees only their company and its descendants.
2. **Breadcrumbs**: Every page includes a breadcrumb trail that communicates the user's position within the tenant hierarchy.
3. **Scope selector**: Admin users can shift their operational scope via a tenant scope dropdown, which reloads all content for the selected scope.

The hierarchy cascades downward: a resource created at the Organization level is visible (read-only) at all child levels unless explicitly restricted. Permissions are cumulative — a user's effective access is the union of all permissions from all roles across the hierarchy.

---

## 2. Site Map

### 2.A Main Workspace (User-Facing)

The workspace is the primary interface for Knowledge Workers, Team Leads, and AI/ML Engineers. It is organized around four core activities: chatting with AI, managing agents, curating knowledge, and configuring memory.

```
HotHoosh Workspace (/)
├── /login                          — Authentication page for existing users
├── /register                       — Invitation-based account creation
├── /forgot-password                — Password reset request
├── /                               — Root redirect → /chat
│
├── /chat                           — Chat session list (history sidebar + new chat)
│   └── /chat/[chatId]              — Active chat session with streaming messages
│
├── /agents                         — Agent gallery (browse all agents in current workspace)
│   └── /agents/[agentId]           — Agent detail, configuration, and test console
│
├── /knowledge                      — Knowledge base list (create, browse, status overview)
│   └── /knowledge/[kbId]           — Knowledge base detail (documents, chunks, search test)
│
├── /memory                         — Memory pack management (create, edit, version history)
│
└── /settings                       — User settings (profile, theme, 2FA, language, calendar)
```

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login | Email + password authentication with optional 2FA prompt |
| `/register` | Registration | Invitation-verified account creation (name, password, password confirmation) |
| `/forgot-password` | Forgot Password | Email-based password reset request flow |
| `/chat` | Chat List | Sidebar showing conversation history sorted by last activity; "New Chat" action at top |
| `/chat/[chatId]` | Chat Session | Full chat interface: message thread with branching, agent selector, input bar with attachment support, context panel |
| `/agents` | Agent Gallery | Grid/list of available agents in the current workspace with status, type badge, and quick-start action |
| `/agents/[agentId]` | Agent Detail | Agent configuration, knowledge/memory bindings, tool assignments, test console, deployment controls |
| `/knowledge` | Knowledge Base List | List of knowledge bases with document count, status, last-updated timestamp, and upload action |
| `/knowledge/[kbId]` | Knowledge Base Detail | Document management, upload progress, chunk preview, retrieval parameter tuning, search test console |
| `/memory` | Memory Pack Management | List of memory packs with type badge, version count, and associated agents; create/edit/delete actions |
| `/settings` | User Settings | Profile editing, theme toggle (dark/light), language selector, calendar preference, 2FA configuration, session management |

### 2.B Admin Panel

The admin panel is a dedicated, permission-gated interface for Enterprise Administrators, AI/ML Engineers, and Executives. It has its own layout, navigation sidebar, and route namespace. The sidebar structure is defined in Admin-Panel.md §9.2.3.

```
HotHoosh Admin (/admin)
├── /admin/login                         — Admin authentication (or redirect to /login)
├── /admin                               — Root redirect → /admin/dashboard
│
├── /admin/dashboard                     — KPIs, charts, recent activity, system health
│
├── /admin/users                         — User list with filters, search, bulk operations
│   └── /admin/users/[userId]            — User profile, activity timeline, memberships, usage
│
├── /admin/roles                         — RBAC role and permission management
│
├── /admin/organizations                 — Organization CRUD management
│   └── /admin/organizations/[orgId]     — Organization detail (settings, hierarchy, limits)
│
├── /admin/companies                     — Company CRUD management (scoped to selected org)
│   └── /admin/companies/[companyId]     — Company detail (settings, brands, users)
│
├── /admin/brands                        — Brand CRUD management (scoped to selected company)
│   └── /admin/brands/[brandId]          — Brand detail (settings, workspaces, agents)
│
├── /admin/agents                        — Cross-workspace agent management
│   └── /admin/agents/[agentId]          — Agent detail with deployment controls and usage stats
│
├── /admin/memory-packs                  — Memory pack management across workspaces
│
├── /admin/knowledge                     — Knowledge base management across workspaces
│   └── /admin/knowledge/[kbId]          — Knowledge base detail with document and chunk stats
│
├── /admin/api-providers                 — AI provider configuration and health monitoring
│   └── /admin/api-providers/[providerId] — Provider detail (keys, models, health history)
│
├── /admin/models                        — Model configuration and routing rules
│   └── /admin/models/[modelId]          — Model detail (parameters, routing rules, cost config)
│
├── /admin/usage                         — Usage analytics (tokens, cost, per-model breakdown)
│
├── /admin/billing                       — Subscription plans, invoices, payment methods
│
├── /admin/audit-logs                    — Audit log viewer with filters and export
│
├── /admin/logs                          — System logs with real-time SSE streaming
│
└── /admin/settings                      — Global platform settings
    ├── /admin/settings/general          — General configuration (defaults, branding, features)
    └── /admin/settings/security         — Security configuration (password policy, 2FA, lockout)
```

**Admin Sidebar Navigation Groups** (from Admin-Panel.md §9.2.3):

| Group | Item | Route | Description |
|-------|------|-------|-------------|
| *(top-level)* | داشبورد (Dashboard) | `/admin/dashboard` | KPIs, charts, recent activity, system health |
| مدیریت کاربران (User Management) | کاربران (Users) | `/admin/users` | User list with filters, search, bulk operations |
| | نقش‌ها و دسترسی‌ها (Roles & Permissions) | `/admin/roles` | RBAC role and permission management |
| ساختار سازمانی (Org Structure) | سازمان‌ها (Organizations) | `/admin/organizations` | Organization CRUD management |
| | شرکت‌ها (Companies) | `/admin/companies` | Company CRUD management |
| | برندها (Brands) | `/admin/brands` | Brand CRUD management |
| هوش مصنوعی (AI) | عوامل هوشمند (Agents) | `/admin/agents` | Cross-workspace agent management |
| | بسته‌های حافظه (Memory Packs) | `/admin/memory-packs` | Memory pack management across workspaces |
| | دانش (Knowledge) | `/admin/knowledge` | Knowledge base management across workspaces |
| | تأمین‌کنندگان API (API Providers) | `/admin/api-providers` | AI provider configuration and health monitoring |
| | مدل‌ها (Models) | `/admin/models` | Model configuration and routing rules |
| عملیات (Operations) | مصرف منابع (Usage) | `/admin/usage` | Usage analytics (tokens, cost, per-model breakdown) |
| | صورتحساب (Billing) | `/admin/billing` | Subscription plans, invoices, payment methods |
| | لاگ‌های ممیزی (Audit Logs) | `/admin/audit-logs` | Audit log viewer with filters and export |
| | لاگ‌های سیستم (System Logs) | `/admin/logs` | System logs with real-time SSE streaming |
| تنظیمات (Settings) | تنظیمات عمومی (General Settings) | `/admin/settings` (general tab) | General platform configuration |
| | تنظیمات امنیتی (Security Settings) | `/admin/settings` (security tab) | Security policy configuration |

---

## 3. Navigation Model

HotHoosh employs two distinct navigation paradigms that serve different user contexts and permission boundaries. They share a design system and component library but have independent layouts, route namespaces, and state.

### 3.1 Workspace Navigation

The workspace navigation is built for daily AI interaction — chatting, browsing agents, managing knowledge. It prioritizes speed of access to the chat interface and contextual content.

```
┌─────────────────────────────────────────────────────────────┐
│  Top Bar (h-14, glass-panel-solid)                           │
│  [☰] [Logo]  [Workspace Switcher ▾]  [Search ⌘K]  [User ▾] │
├──────┬──────────────────────────────────────────────────────┤
│ Side │  Main Content Area                                    │
│ bar  │  (scrollable)                                         │
│      │                                                       │
│ [💬] │  (chat list, agent gallery, KB detail, etc.)           │
│ Chat │                                                       │
│      │                                                       │
│ [🤖] │                                                       │
│Agent │                                                       │
│      │                                                       │
│ [📚] │                                                       │
│Know. │                                                       │
│      │                                                       │
│ [🧠] │                                                       │
│Memory│                                                       │
│      │                                                       │
│ [⚙]  │                                                       │
│Settg.│                                                       │
├──────┴──────────────────────────────────────────────────────┤
```

**Components of the workspace navigation:**

| Component | Behavior |
|-----------|----------|
| **Sidebar toggle (☰)** | Collapses/expands the sidebar. Collapsed state shows icons only (48px width). Expanded state shows icons + labels (240px width). Preference persisted per user in Zustand store. |
| **Logo** | HotHoosh wordmark. Clicking navigates to `/chat`. |
| **Workspace Switcher** | Dropdown/combobox showing all workspaces the user belongs to, grouped by brand/company/org. Changing workspace reloads all workspace-scoped data (agents, knowledge bases, memory packs, chat sessions). |
| **Command Palette (⌘K)** | Opens the global command palette for search and quick actions. See §8 for full details. |
| **User Menu (▾)** | Avatar + display name. Dropdown: Profile (→ /settings), Keyboard Shortcuts, Enter Admin (→ /admin/dashboard, permission-gated), Theme Toggle, Logout. |
| **Main Nav Items** | Five primary navigation items: Chat, Agents, Knowledge, Memory, Settings. Each is an icon + label. Active state indicated by accent color + inline-start border. |

**Secondary navigation within pages:**

- **Chat**: Within `/chat`, a sub-sidebar (or panel) shows the conversation history list. Within `/chat/[chatId]`, a branch selector allows navigating between conversation branches.
- **Agents**: Within `/agents/[agentId]`, a tab bar provides navigation between Configuration, Knowledge, Memory, Tools, Test Console, and Deployment sub-views.
- **Knowledge**: Within `/knowledge/[kbId]`, a tab bar provides navigation between Documents, Chunks, Search Test, and Settings sub-views.
- **Memory**: The memory pack list page includes inline expanders for version history rather than a separate page.

### 3.2 Admin Navigation

The admin navigation is built for management, monitoring, and configuration. It prioritizes data density, batch operations, and cross-tenant visibility. Full specification is in Admin-Panel.md §9.2.

```
┌─────────────────────────────────────────────────────────────┐
│  Top Bar (h-14, glass-panel-solid)                           │
│  [Logo] [Tenant Scope Selector ▾] [Search ⌘K] [🔔] [User ▾]│
├──────┬──────────────────────────────────────────────────────┤
│ Side │  Breadcrumb Trail                                      │
│ bar  ├──────────────────────────────────────────────────────┤
│      │  Page Header + Actions                                 │
│[Dash]├──────────────────────────────────────────────────────┤
│      │                                                        │
│ USERS│  Page Content                                          │
│ Roles│  (data tables, forms, dashboards, log streams)         │
│      │                                                        │
│ ORGS │                                                        │
│Comps │                                                        │
│Brnds │                                                        │
│      │                                                        │
│ AGNTS│                                                        │
│Memory│                                                        │
│Know. │                                                        │
│API PV│                                                        │
│Models│                                                        │
│      │                                                        │
│ USAGE│                                                        │
│BILL. │                                                        │
│Audit │                                                        │
│Logs  │                                                        │
│      │                                                        │
│SETT. │                                                        │
├──────┴──────────────────────────────────────────────────────┤
```

**Key differences from workspace navigation:**

| Aspect | Workspace | Admin |
|--------|-----------|-------|
| Scope control | Workspace Switcher (single workspace) | Tenant Scope Selector (any org/company/brand in hierarchy) |
| Navigation density | 5 items, spacious | 16 items in 5 groups, compact |
| Primary content | Conversational, content-focused | Tabular, data-dense |
| Breadcrumbs | Not used (flat structure) | Always present, auto-generated from route |
| Notifications | In-app toast only | Bell icon with dropdown in top bar |
| Search scope | Workspace entities only | All admin entities across tenant scope |

### 3.3 Navigating Between Workspace and Admin

The two navigation paradigms are separated at the application level — `apps/web` (workspace) and `apps/admin` (admin panel) are distinct Next.js applications with separate route trees. Transition between them uses a full navigation (not a client-side transition).

| Direction | Mechanism |
|-----------|-----------|
| **Workspace → Admin** | User Menu → "ورود به پنل مدیریت" (Enter Admin) link. Permission-gated: only visible to users with any `admin:*` permission. Navigates to `/admin/dashboard`. |
| **Admin → Workspace** | User Menu → "ورود به فضای کار" (Enter Workspace) link. Always visible. Navigates to `/chat`. |
| **Deep link** | Both apps share the same auth domain. A user with a bookmark to `/admin/users` is authenticated via the same JWT. If they lack `admin:users:read`, the route-level middleware redirects to `/admin/dashboard`. |

Both apps share the same dual-token JWT authentication. The refresh token is stored as an HttpOnly cookie scoped to the root domain, so it is automatically sent with requests to either app. No re-authentication is required when switching between workspace and admin.

---

## 4. Content Hierarchy

### 4.1 Tenant Hierarchy

All content in HotHoosh is scoped within a four-level tenant hierarchy. The hierarchy determines ownership, access control, and content visibility.

```
Organization (سازمان)
├── Company A (شرکت الف)
│   ├── Brand A1 (برند الف۱)
│   │   ├── Workspace A1a (فضای کار الف۱الف)
│   │   │   ├── Agents
│   │   │   ├── Knowledge Bases
│   │   │   ├── Memory Packs
│   │   │   └── Chat Sessions
│   │   └── Workspace A1b (فضای کار الف۱ب)
│   └── Brand A2 (برند الف۲)
├── Company B (شرکت ب)
└── Shared Resources (Organization-level)
    ├── Default Agents
    ├── Organization Memory
    └── Organization Knowledge Bases
```

| Tenant Level | Owns | Inherits From |
|-------------|------|---------------|
| **Organization** | Default agents, org-level knowledge bases, org memory packs, billing, subscription plan, security policies | — (root) |
| **Company** | Company-specific agents, knowledge bases, memory packs, company-level settings | Organization defaults |
| **Brand** | Brand-specific agents, knowledge bases, memory packs, brand identity settings | Company + Organization defaults |
| **Workspace** | Workspace-scoped agents, knowledge bases, memory packs, all chat sessions | Brand + Company + Organization defaults |

**Content access rules:**

- A user assigned to a Workspace sees: workspace resources + brand resources + company resources + organization resources (cumulative, read-only above their level).
- A user assigned to an Organization sees all resources within the entire hierarchy.
- Admin panel data is filtered by the Tenant Scope Selector. Super Admins see all organizations.

### 4.2 Content Within a Workspace

Each workspace is a self-contained unit with its own set of AI resources. The content within a workspace is organized into four primary entity types:

```
Workspace
├── Agents (عوامل هوشمند)
│   ├── Agent: General Assistant
│   │   ├── Type: Chat
│   │   ├── System Prompt
│   │   ├── Model Binding (with fallback chain)
│   │   ├── Knowledge Base Bindings
│   │   ├── Memory Pack Bindings
│   │   ├── Tool Bindings
│   │   ├── Rate Limits
│   │   └── Status: Draft → Active → Deprecated
│   ├── Agent: RAG Researcher
│   └── Agent: Code Executor
│
├── Knowledge Bases (پایگاه‌های دانش)
│   ├── Knowledge Base: Product Docs
│   │   ├── Documents (PDF, DOCX, TXT, MD, etc.)
│   │   ├── Chunks (auto-generated, with metadata)
│   │   ├── Embeddings (vector indices)
│   │   ├── Retrieval Config (top-K, threshold, hybrid weight)
│   │   └── Processing Status (per document)
│   └── Knowledge Base: Internal Policies
│
├── Memory Packs (بسته‌های حافظه)
│   ├── Memory Pack: Team Context (Type: Context)
│   ├── Memory Pack: User Preferences (Type: Preference)
│   ├── Memory Pack: Domain Knowledge (Type: Knowledge)
│   └── Memory Pack: System Instructions (Type: System)
│
└── Chat Sessions (مکالمات)
    ├── Session 1
    │   ├── Messages (immutable, with branching)
│   │   ├── Agent used
    │   │   ├── Knowledge context (injected)
    │   ├── Memory context (injected)
    │   └── Usage log (tokens per message)
    └── Session 2
```

**Entity relationships:**

| Relationship | Description |
|-------------|-------------|
| Agent → Knowledge Base | Many-to-many. An agent can query multiple knowledge bases. A knowledge base can be bound to multiple agents. |
| Agent → Memory Pack | Many-to-many. Memory packs inject persistent context into agent conversations. |
| Agent → Tools | Many-to-many. Tools are capabilities (search, code execution, API calls) bound to agents. |
| Chat Session → Agent | Many-to-one. Each session is associated with the agent used at creation (switchable mid-session). |
| Chat Session → Knowledge Base | Transitive via agent. The session's agent's knowledge bindings determine retrieval scope. |
| Chat Message → Branch | A message can have multiple branches (replies from the same parent). Navigated via `parent_message_id` + `branch_index`. |

### 4.3 Content Within Admin

The admin panel organizes content into five functional domains, each corresponding to a sidebar navigation group:

```
Admin Content
├── User Management
│   ├── Users (accounts, profiles, sessions, activity)
│   └── Roles & Permissions (role definitions, permission assignments, policy templates)
│
├── Organizational Structure
│   ├── Organizations (top-level entities, billing owners)
│   ├── Companies (sub-organizations with own settings)
│   └── Brands (sub-companies with brand-specific identity)
│
├── AI Infrastructure
│   ├── Agents (cross-workspace agent oversight, deployment lifecycle)
│   ├── Memory Packs (cross-workpack memory oversight)
│   ├── Knowledge Bases (cross-workspace knowledge oversight, storage stats)
│   ├── API Providers (credentials, health monitoring, key rotation)
│   └── Models (configuration, routing rules, cost parameters, comparison)
│
├── Operations
│   ├── Usage (token analytics, cost tracking, per-model/per-workspace breakdowns)
│   ├── Billing (subscription plans, invoices, payment methods, Iranian gateway integration)
│   ├── Audit Logs (immutable record of all mutations: who, what, when, where)
│   └── System Logs (real-time SSE streaming of application logs for DevOps)
│
└── Settings
    ├── General (platform defaults, feature flags, branding)
    └── Security (password policy, 2FA enforcement, lockout rules, session limits)
```

---

## 5. URL Structure

### 5.1 Workspace URLs

Workspace URLs live under the `apps/web` Next.js application. The root domain serves the workspace app by default.

```
Pattern                                    Purpose
─────────────────────────────────────────────────────────────
/login                                     Authentication
/register                                  Invitation-based registration
/forgot-password                           Password reset
/chat                                      Chat session list
/chat/{chatId}                             Active chat session
/agents                                    Agent gallery
/agents/{agentId}                          Agent detail / test console
/knowledge                                 Knowledge base list
/knowledge/{kbId}                          Knowledge base detail
/memory                                    Memory pack list
/settings                                  User settings
```

**URL conventions:**

- All workspace routes are top-level (no `/workspace/` prefix). The workspace is the default context.
- Entity identifiers use UUID v7 (e.g., `/chat/01956b2a-3f1c-7000-8000-000000000001`).
- Query parameters are used for filtering and state within pages (e.g., `/agents?status=active&type=rag`).
- The root `/` redirects to `/chat`.

### 5.2 Admin URLs

Admin URLs live under the `apps/admin` Next.js application, all prefixed with `/admin/`. In production, the admin app is served from a subdomain or path (e.g., `admin.hothoosh.ir` or `hothoosh.ir/admin`).

```
Pattern                                         Purpose
─────────────────────────────────────────────────────────────
/admin                                           Redirect → /admin/dashboard
/admin/dashboard                                 KPI dashboard
/admin/users                                     User list
/admin/users/{userId}                            User detail
/admin/roles                                     Roles & permissions
/admin/organizations                             Organization list
/admin/organizations/{orgId}                     Organization detail
/admin/companies                                 Company list
/admin/companies/{companyId}                     Company detail
/admin/brands                                    Brand list
/admin/brands/{brandId}                          Brand detail
/admin/agents                                    Agent management
/admin/agents/{agentId}                          Agent detail
/admin/memory-packs                              Memory pack management
/admin/knowledge                                 Knowledge base management
/admin/knowledge/{kbId}                          Knowledge base detail
/admin/api-providers                             API provider management
/admin/api-providers/{providerId}                Provider detail
/admin/models                                    Model configuration
/admin/models/{modelId}                          Model detail
/admin/usage                                     Usage analytics
/admin/billing                                   Billing & invoices
/admin/audit-logs                                Audit log viewer
/admin/logs                                      System log stream
/admin/settings                                  General settings
/admin/settings/security                         Security settings
```

**URL conventions:**

- All admin routes are prefixed with `/admin/`.
- Entity identifiers use UUID v7.
- List pages support standard query parameters for state:
  - `?page=2` — Pagination
  - `?sort=created_at&order=desc` — Sorting
  - `?status=active` — Filtering
  - `?search=query` — Text search
  - `?scope=org:{orgId}` — Tenant scope override

### 5.3 URL Design Rules

| Rule | Rationale |
|------|-----------|
| Kebab-case for route segments (`memory-packs`, `api-providers`) | Readability, SEO, no encoding issues with Persian content |
| Singular nouns for entity routes (`/admin/users`, not `/admin/user`) | RESTful convention, consistent with API endpoints |
| No nested routes beyond two levels for workspace | Keeps workspace navigation flat and fast |
| Max three route segments for admin detail pages | `/admin/{entity}/{id}` — prevents deep nesting |
| Query parameters for filtering, not route segments | `/admin/users?status=active` not `/admin/users/status/active` — enables URL sharing with filters preserved |
| Tenant scope via query parameter, not route | Scope is a cross-cutting concern, not a page hierarchy |

---

## 6. Page Types

HotHoosh uses eight distinct page types across both the workspace and admin applications. Each type has a consistent layout pattern, interaction model, and component composition.

| Page Type | Description | Workspace Examples | Admin Examples |
|-----------|-------------|-------------------|----------------|
| **List** | Displays a collection of entities in a scannable, filterable, sortable format. Primary action (create) is always prominent. Supports pagination, bulk selection, and inline status indicators. | `/chat` (session list), `/agents` (gallery), `/knowledge` (KB list), `/memory` (pack list) | `/admin/users`, `/admin/organizations`, `/admin/companies`, `/admin/brands`, `/admin/agents`, `/admin/knowledge`, `/admin/memory-packs`, `/admin/api-providers`, `/admin/models` |
| **Detail** | Shows a single entity's full information. Typically a two-column layout: main content area + sidebar with related entities and metadata. Includes contextual actions (edit, delete, deploy). | `/agents/[agentId]` (agent config + test console), `/knowledge/[kbId]` (documents + settings) | `/admin/users/[userId]` (profile + activity), `/admin/organizations/[orgId]`, `/admin/companies/[companyId]`, `/admin/brands/[brandId]`, `/admin/agents/[agentId]` |
| **Form / Wizard** | Multi-step or single-step form for creating or editing an entity. Uses React Hook Form + Zod validation. May include live preview or test panels. | Agent creation wizard, knowledge base creation, memory pack editor | User creation dialog, organization creation, API provider configuration, model routing rule editor |
| **Dashboard** | KPI-focused page with stat cards, charts, and activity feeds. Data is pulled via TanStack Query with configurable refresh intervals. No primary content creation action. | *(not used in workspace v1)* | `/admin/dashboard` (platform KPIs), `/admin/usage` (analytics dashboard), `/admin/billing` (financial overview) |
| **Settings** | Form-like page for configuring preferences and policies. Organized into sections/tabs. Changes auto-save or require explicit save. | `/settings` (user preferences, profile, 2FA, theme, language) | `/admin/settings` (general platform config), `/admin/settings/security` (security policies) |
| **Editor** | Rich content editing interface with toolbar, preview, and version controls. Optimized for text-heavy content. | Memory pack content editor, agent system prompt editor | *(not used in admin v1)* |
| **Viewer** | Read-only display of a specific content item or stream. May include copy, download, or share actions but no edit capabilities. | Chat session viewer (messages are immutable), document preview in knowledge base | `/admin/audit-logs` (immutable audit entries), `/admin/usage` (read-only analytics) |
| **Log Stream** | Real-time display of sequential events using SSE (Server-Sent Events). Auto-scrolls, supports pause/resume, and includes filtering by level/source. | *(not used in workspace v1)* | `/admin/logs` (system log streaming) |

**Page type composition rules:**

- A detail page may embed a form (edit mode) or a viewer (read mode) as a sub-component.
- A list page may include inline creation via a slide-over panel (e.g., user creation in admin) rather than navigating to a separate form page.
- The chat session page (`/chat/[chatId]`) is a unique hybrid: it is a real-time streaming viewer with an input component. It does not fit neatly into a single page type and is treated as a bespoke "Chat" page type in component architecture.

---

## 7. User Flows

### 7.1 New User Accepts Invitation → Onboarding → First Chat

1. User receives email invitation with a link containing a signed token.
2. User clicks the link and is directed to `/register`.
3. The registration page validates the invitation token (checks expiration, organization, and email match).
4. User fills in display name, password (with policy enforcement: min 8 chars, uppercase, lowercase, number, special char), and password confirmation.
5. Account is created with the role specified in the invitation (default: Member). User is assigned to the invitation's workspace.
6. User is automatically authenticated (dual-token JWT issued) and redirected to `/chat`.
7. On first visit, a brief onboarding overlay highlights: workspace sidebar, agent selector, command palette (⌘K), and settings.
8. User dismisses onboarding. The default agent (General Assistant) is pre-selected in the chat input area.
9. User types their first message and receives a streaming AI response.
10. Chat session is created with a system-generated title. It appears in the chat history sidebar.

### 7.2 Admin Creates Agent → Configures → Tests → Deploys

1. Admin navigates to `/admin/agents` via the sidebar.
2. Admin clicks "ایجاد عامل" (Create Agent) button.
3. Agent creation wizard opens (slide-over panel or full page):
   - **Step 1 — Identity**: Name, description, avatar, agent type (Chat / RAG / Tool-use / Autonomous).
   - **Step 2 — Model**: Select primary model and fallback chain from configured models.
   - **Step 3 — Prompt**: Write system prompt in the editor with variable placeholders.
   - **Step 4 — Knowledge**: Bind one or more knowledge bases (for RAG agents). Configure retrieval parameters.
   - **Step 5 — Memory**: Bind memory packs for persistent context injection.
   - **Step 6 — Tools**: Assign tools (search, code execution, API calls) with permission levels.
   - **Step 7 — Limits**: Configure rate limits per user and per workspace.
4. Admin clicks "ذخیره پیش‌نویس" (Save Draft). Agent is created with `status: draft`.
5. Admin opens the agent detail page (`/admin/agents/[agentId]`) and navigates to the Test Console tab.
6. Admin types test messages and observes responses, checking knowledge retrieval quality and tool execution.
7. Admin iterates on the system prompt, knowledge bindings, or tool configuration as needed.
8. Satisfied with the test results, admin clicks "انتشار" (Deploy). Agent status changes to `active`.
9. The agent now appears in the workspace agent gallery (`/agents`) for all users in the scoped workspaces.
10. An audit log entry is generated recording the deployment action.

### 7.3 User Uploads Documents to Knowledge Base → Processing → Test Search

1. User navigates to `/knowledge` (workspace sidebar → Knowledge).
2. User opens an existing knowledge base or clicks "ایجاد پایگاه دانش" (Create Knowledge Base) to create a new one.
3. On the knowledge base detail page (`/knowledge/[kbId]`), user is on the Documents tab.
4. User clicks the upload area or drags files (PDF, DOCX, TXT, MD, HTML, CSV, JSON are supported).
5. A progress bar appears for each file. Status events are streamed via SSE: `uploaded → extracting → chunking → embedding → indexed → ready`.
6. User can see processing status in real time. Failed documents show an error icon with retry option.
7. Once all documents reach `ready` status, user navigates to the Search Test tab.
8. User types a natural language query (e.g., "سیاست مرجوعی کالا چیست؟").
9. The system performs hybrid search (vector similarity + BM25) and returns ranked chunks with relevance scores and source document attribution.
10. User evaluates retrieval quality. If unsatisfied, user adjusts retrieval parameters (top-K, similarity threshold, hybrid weight) and re-tests.
11. User binds the knowledge base to one or more agents for RAG-enhanced conversations.

### 7.4 Admin Manages Billing → Views Invoices → Updates Plan

1. Admin navigates to `/admin/billing` via the sidebar (Operations → Billing).
2. The billing page displays:
   - **Current Plan card**: Plan name (Free / Pro / Enterprise), renewal date, usage vs. limits.
   - **Usage Summary**: Token consumption this cycle, storage used, active users vs. limit.
   - **Invoice History**: Table of past invoices with date, amount, status (paid / pending / overdue), and download action.
3. Admin clicks on a specific invoice to view details: line items (token usage by model, storage overages), discounts, tax, total.
4. Admin downloads the invoice PDF.
5. To change plan, admin clicks "تغییر پلن" (Change Plan) button.
6. A plan comparison modal shows Free, Pro, and Enterprise tiers with feature matrix:
   - Users limit, workspaces limit, agents limit, token budget, storage, priority support.
7. Admin selects the desired plan and confirms.
8. If upgrading: immediate effect, prorated charge applied to next invoice.
9. If downgrading: scheduled for end of current billing cycle. A confirmation dialog warns about resource limits that will be exceeded.
10. An audit log entry is generated. A confirmation notification is sent to the org admin's email.

---

## 8. Search Architecture

Search in HotHoosh operates at three distinct levels, each serving a different user intent and covering a different scope of content.

### 8.1 Command Palette (Global Search)

The command palette is the primary search and quick-action interface, accessible via **⌘K** (macOS) or **Ctrl+K** (Windows/Linux) from any page in either the workspace or the admin panel.

**Trigger**: Keyboard shortcut only. No visible search bar in the default UI (the top bar search icon also triggers it).

**Behavior**:

```
┌──────────────────────────────────────────────────┐
│  ⌘K  جستجو یا اقدام سریع...                      │
├──────────────────────────────────────────────────┤
│  اخیر                                                 │
│  ├─ عامل پشتیبانی مشتری                 Agent  │
│  └─ پایگاه دانش محصولات                  KB     │
├──────────────────────────────────────────────────┤
│  نتایج                                               │
│  ├─ مکالمات (Conversations)                          │
│  │   └─ «نحوه تنظیم عامل هوشمند...»           │
│  ├─ عوامل (Agents)                                  │
│  │   └─ دستیار عمومی (General Assistant)              │
│  ├─ پایگاه‌های دانش (Knowledge Bases)               │
│  │   └─ مستندات محصول (Product Docs)                 │
│  ├─ بسته‌های حافظه (Memory Packs)                   │
│  │   └─ زمینه تیم (Team Context)                      │
│  └─ اقدامات (Actions)                               │
│      ├─ ایجاد مکالمه جدید                            │
│      ├─ ایجاد عامل هوشمند                            │
│      └─ رفتن به تنظیمات                              │
├──────────────────────────────────────────────────┤
│  Navigate with ↑↓  •  Select with Enter            │
└──────────────────────────────────────────────────┘
```

**Search scope in workspace context**:

| Entity | Search Fields | Result Action |
|--------|--------------|---------------|
| Chat Sessions | Title, recent message content (first N tokens) | Navigate to `/chat/{chatId}` |
| Agents | Name, description | Navigate to `/agents/{agentId}` |
| Knowledge Bases | Name, description | Navigate to `/knowledge/{kbId}` |
| Memory Packs | Name, description, content excerpt | Navigate to `/memory` (with pack expanded) |
| Quick Actions | Action name (Persian + English keywords) | Execute action (create, navigate) |

**Search scope in admin context**:

| Entity | Search Fields | Result Action |
|--------|--------------|---------------|
| Users | Display name, email | Navigate to `/admin/users/{userId}` |
| Organizations | Name | Navigate to `/admin/organizations/{orgId}` |
| Companies | Name | Navigate to `/admin/companies/{companyId}` |
| Brands | Name | Navigate to `/admin/brands/{brandId}` |
| Agents | Name | Navigate to `/admin/agents/{agentId}` |
| Knowledge Bases | Name | Navigate to `/admin/knowledge/{kbId}` |
| API Providers | Name | Navigate to `/admin/api-providers/{providerId}` |
| Models | Name, provider name | Navigate to `/admin/models/{modelId}` |
| Admin Pages | Page title (Persian + English) | Navigate to page route |

**Implementation notes**:

- Search is client-side index-based for small datasets (< 10K entities) using Fuse.js with Persian-aware tokenization.
- For larger datasets, search delegates to a server-side endpoint that queries the database with `ILIKE` and `tsvector` (Persian text search configuration).
- Results are grouped by entity type. Each group is collapsible.
- Recent searches are stored per-user in `localStorage` (max 10 entries).
- The command palette supports fuzzy matching and transliteration (e.g., typing "agent" matches "عامل").
- Keyboard navigation: ↑↓ to move, Enter to select, Escape to close, Tab to switch between result groups.

### 8.2 Knowledge Base Search (RAG)

Knowledge base search is the retrieval layer that powers RAG-enhanced agent responses. It is not a user-facing search UI in the same sense as the command palette, but it is exposed through the Search Test tab on knowledge base detail pages.

**Architecture** (high-level — detailed specification is in the Agent System Architecture document):

```
User Query
    │
    ▼
Query Preprocessing (Persian normalization, stemming)
    │
    ├──► Vector Search (pgvector HNSW, cosine similarity)
    │       └── Top-K candidate chunks
    │
    ├──► BM25 Full-Text Search (PostgreSQL tsvector)
    │       └── Top-K candidate chunks
    │
    ▼
Reciprocal Rank Fusion (RRF)
    │
    ▼
Re-ranking (optional, by relevance score)
    │
    ▼
Context Injection (into agent's prompt window)
```

**Configurable parameters** (per knowledge base or per agent binding):

| Parameter | Default | Description |
|-----------|---------|-------------|
| `topK` | 5 | Number of chunks to retrieve from each search method |
| `similarityThreshold` | 0.7 | Minimum cosine similarity score to include a vector result |
| `hybridWeight` | 0.5 | Balance between vector (1.0) and BM25 (0.0) results in RRF fusion |
| `chunkOverlap` | 20% | Overlap between adjacent chunks during document processing |
| `chunkSize` | 512 tokens | Target chunk size during document processing |

### 8.3 Admin List Filtering

Every admin list page supports structured filtering via a filter bar (documented in Admin-Panel.md §9.4.2 for Users, and applied consistently across all admin list pages). This is not a free-text search but a structured, field-specific filtering system.

**Filter characteristics**:

| Aspect | Implementation |
|--------|---------------|
| **Filter persistence** | URL search parameters. Filters survive page reload and are shareable via URL. |
| **Debounced text search** | 300ms debounce on text input fields. Searches across configured fields per entity. |
| **Multi-select filters** | Combobox components for status, role, type, and other categorical fields. |
| **Date range filters** | Solar Hijri date pickers. Uses Day.js + jalaali-js. |
| **Tenant scope interaction** | Filters operate within the current tenant scope. Changing the Tenant Scope Selector resets filters. |
| **Clear all** | A single "پاک کردن فیلترها" (Clear Filters) button resets all filters to defaults. |
| **Shallow navigation** | Filter changes use `useRouter().replace()` with `shallow: true` — no full-page reload, no scroll reset. |

---

## Appendix: Document Cross-References

| This Document | References | Referenced By |
|--------------|------------|---------------|
| §2 Site Map | PRD §4 (Functional Requirements), Architecture §3.3 (Routing) | UX Design (wireframes), Engineering Rules (route guards) |
| §3 Navigation Model | Admin-Panel §9.2 (Admin Layout), Architecture §3.2 (State Management) | Frontend implementation, Design System (nav components) |
| §4 Content Hierarchy | PRD §4.2 (Multi-Tenant), PRD §4.3–4.6 (Entities) | Database Design (ERD), Backend Architecture (domain modules) |
| §5 URL Structure | Architecture §3.3 (Routing Architecture) | Backend API Design (route mapping), Frontend (Next.js app router) |
| §6 Page Types | Admin-Panel §9.3–9.17 (Page Specs), PRD §4.10 (UX) | Design System (page templates), Frontend (page components) |
| §7 User Flows | PRD §4 (All FRs), Architecture §6 (Data Flows) | UX Design (flow diagrams), QA (test scenarios) |
| §8 Search Architecture | PRD §4.5 (RAG), PRD §4.7 (Multi-Provider), Admin-Panel §9.4.2 (Filters) | Agent System Architecture (RAG pipeline), Frontend (command palette) |
