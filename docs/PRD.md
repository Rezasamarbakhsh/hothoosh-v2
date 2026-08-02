# Product Requirements Document

## HotHoosh — Enterprise AI Workspace

---

## 1. Overview

### 1.1 Vision

HotHoosh is a Persian-first, RTL-native enterprise AI workspace that unifies conversational AI, knowledge management, and organizational collaboration into a single platform. It is designed for Iranian enterprises that need powerful AI capabilities — multi-provider model access, Retrieval-Augmented Generation, persistent memory, and multi-tenant isolation — without sacrificing the linguistic, cultural, and regulatory requirements of the Persian-speaking market.

HotHoosh occupies the intersection of four product categories:

- **Notion AI** → Structured workspace with AI-enhanced content
- **ChatGPT Team** → Multi-user AI conversations with shared context
- **Glean** → Enterprise knowledge retrieval and RAG
- **Claude Enterprise** → Multi-model AI with organizational governance

### 1.2 Problem Statement

Iranian enterprises face a fragmented AI tooling landscape:

1. **No Persian-native AI platform**: Existing tools (ChatGPT, Claude, Notion AI) are English-first. Persian text handling, RTL interfaces, and Solar Hijri calendar support are afterthoughts or non-existent.
2. **Knowledge silos**: Enterprise knowledge is scattered across Google Drive, internal wikis, and individual notes. No unified RAG system exists that understands Persian content.
3. **AI vendor lock-in**: Enterprises are tied to single AI providers. When a provider has an outage, the entire AI workflow stops.
4. **No multi-tenant isolation**: Existing solutions lack the hierarchical organizational model (Organization → Company → Brand → Workspace) that Iranian enterprise structures require.
5. **Compliance and sovereignty**: Data residency, audit logging, and role-based access control tailored to Iranian enterprise governance are unavailable in foreign SaaS products.

### 1.3 Core Value Proposition

HotHoosh provides a **single, unified AI workspace** where:
- Every conversation is **context-aware** (knowledge bases, memory packs, organizational context)
- Every AI interaction is **provider-agnostic** (route to the best model automatically)
- Every piece of knowledge is **retrievable** (Persian-optimized RAG with hybrid search)
- Every organization is **isolated** (multi-tenant with cascading permissions)
- Every interface is **Persian-native** (RTL, Solar Hijri, Vazirmatn typography)

---

## 2. Target Users

### 2.1 Primary Personas

**Persona 1: Enterprise Administrator (مدیر سازمان)**

- **Role**: IT manager or operations lead at a mid-to-large Iranian enterprise
- **Needs**: Centralized user management, usage monitoring, cost control, compliance reporting, multi-tenant setup
- **Pain Points**: Managing AI tool sprawl across departments, no visibility into AI usage costs, difficulty enforcing data governance policies
- **HotHoosh Features Used**: Admin Panel (all sections), Billing, Audit Logs, Settings

**Persona 2: Team Lead (سرپرست تیم)**

- **Role**: Department or project team lead within an organization
- **Needs**: Create and configure AI agents for the team, manage team knowledge bases, assign memory packs, monitor team usage
- **Pain Points**: No way to customize AI behavior for specific team workflows, knowledge is not accessible to AI assistants
- **HotHoosh Features Used**: Agent management, Knowledge Base management, Memory Pack management, Team analytics

**Persona 3: Knowledge Worker (کارمند دانشی)**

- **Role**: Individual contributor who uses AI daily for research, writing, analysis, and problem-solving
- **Needs**: Fast, reliable AI conversations, access to organizational knowledge, persistent conversation history, chat branching for exploration
- **Pain Points**: AI doesn't know the organization's internal knowledge, conversations lose context, can't switch between AI providers
- **HotHoosh Features Used**: Chat, Agent selection, Knowledge-aware conversations, Conversation branching, Memory

### 2.2 Secondary Personas

**Persona 4: AI/ML Engineer (مهندس هوش مصنوعی)**

- **Role**: Technical user who configures AI providers, models, and routing rules
- **Needs**: Fine-grained control over model selection, routing logic, token budgets, and RAG parameters
- **HotHoosh Features Used**: API Provider management, Model configuration, Routing rules, System Logs

**Persona 5: Executive (مدیر ارشد)**

- **Role**: C-level executive who needs high-level visibility into AI adoption and ROI
- **Needs**: Dashboard with key metrics, usage trends, cost analysis, without technical complexity
- **HotHoosh Features Used**: Admin Dashboard (KPIs, charts), Billing overview

---

## 3. Core Principles

The following 16 principles are non-negotiable. Every feature, every design decision, and every line of code must align with these principles.

| # | Principle | Description |
|---|-----------|-------------|
| 1 | **Persian-First** | The default language is Persian (فارسی). All UI text, error messages, notifications, and AI prompts default to Persian. English is available as a secondary language but never the default. |
| 2 | **RTL-Native** | The entire interface is built RTL-first using CSS logical properties. LTR is supported as a secondary direction. No physical direction properties (`left`, `right`) are used. |
| 3 | **Enterprise-Grade** | The platform supports multi-tenant isolation, RBAC, audit logging, SSO/SAML, and compliance features required by enterprise customers. |
| 4 | **Multi-Organization** | The hierarchy is Organization → Company → Brand → Workspace. Each level has its own users, settings, and resource allocation. |
| 5 | **AI Agent System** | Users interact with configurable AI agents, not raw models. Agents have personalities, knowledge bindings, memory, and tool access. |
| 6 | **Memory Packs** | Reusable bundles of context that persist across sessions. Types: Context, Preference, Knowledge, System. |
| 7 | **Knowledge Base** | Document repositories with Persian-optimized RAG: chunking, embedding, vector search, hybrid retrieval. |
| 8 | **RAG (Retrieval-Augmented Generation)** | Every agent can be enhanced with knowledge retrieval. RAG pipeline is transparent, configurable, and Persian-optimized. |
| 9 | **Multi-AI Provider** | Support for OpenAI, Anthropic, Google, and local models. Provider-agnostic routing with automatic fallback. |
| 10 | **API Management** | Full lifecycle management of AI API providers: configuration, health monitoring, key rotation, cost tracking. |
| 11 | **User Invitation** | Users are invited to organizations via email. No self-registration without invitation (enterprise security). |
| 12 | **Admin Panel** | Dedicated, first-class admin panel for platform management. Separate layout, navigation, and permission boundary from the workspace. |
| 13 | **Dark/Light Mode** | Both themes are first-class citizens. Theme preference is per-user and persists across sessions. System preference is respected. |
| 14 | **Glass Morphism Design** | Minimal Glass Enterprise aesthetic with backdrop-filter, translucent surfaces, and depth hierarchy. |
| 15 | **Modular Monolith** | Backend is a modular monolith (NestJS) with hexagonal boundaries, not microservices. Modules communicate via domain events. |
| 16 | **Immutable Messages** | Chat messages are immutable. Edits create new messages. Branching uses `parent_message_id` + `branch_index`. |

---

## 4. Functional Requirements

### 4.1 Authentication & Authorization

**FR-AUTH-001**: Users register via organization invitation only. No public self-registration.

- **As an** Enterprise Administrator
- **I want to** invite users to my organization via email
- **So that** only authorized personnel can access the platform

**FR-AUTH-002**: Dual-token JWT authentication with RS256 access tokens (15-minute expiry, in-memory) and HS256 refresh tokens (7-day expiry, HttpOnly cookie).

- **As a** user
- **I want to** authenticate securely with automatic token refresh
- **So that** my session persists without manual re-login

**FR-AUTH-003**: Three-layer RBAC: Organization role → Workspace role → Resource-level permission.

- **As an** Enterprise Administrator
- **I want to** define granular permissions at the organization, workspace, and resource level
- **So that** users have exactly the access they need and nothing more

**FR-AUTH-004**: Optional two-factor authentication (TOTP/SMS) configurable per organization.

**FR-AUTH-005**: Password policy enforcement: minimum 8 characters, uppercase, lowercase, number, special character. Argon2id hashing.

**FR-AUTH-006**: Account lockout after 10 failed login attempts within 1 hour. 30-minute lockout duration.

**FR-AUTH-007**: Super admin impersonation capability with full audit trail.

### 4.2 Multi-Tenant Hierarchy

**FR-TENANT-001**: Four-level organizational hierarchy: Organization → Company → Brand → Workspace.

- **As an** Enterprise Administrator
- **I want to** create a hierarchical structure of organizations, companies, brands, and workspaces
- **So that** each level can have its own users, settings, and resources

**FR-TENANT-002**: Resources cascade downward. A user in an organization has potential access to all companies, brands, and workspaces within it, subject to explicit role assignments.

**FR-TENANT-003**: Permissions are cumulative. A user's effective permissions are the union of all permissions from all roles they hold across the hierarchy.

**FR-TENANT-004**: Data isolation is enforced at the database level via PostgreSQL Row-Level Security (RLS). No application-level bypass.

**FR-TENANT-005**: Each workspace can have its own AI agents, knowledge bases, memory packs, and chat sessions.

### 4.3 AI Agent System

**FR-AGENT-001**: Users can create, configure, and deploy AI agents with custom system prompts, model selection, temperature, and tool bindings.

- **As a** Team Lead
- **I want to** create a specialized AI agent for my team's workflow
- **So that** my team gets AI responses tailored to our domain

**FR-AGENT-002**: Agent types: Chat, RAG, Tool-use, Autonomous, Workflow.

**FR-AGENT-003**: Agents can be bound to knowledge bases for RAG-enhanced responses.

**FR-AGENT-004**: Agents can be bound to memory packs for persistent context.

**FR-AGENT-005**: Agents can be assigned tools (search, code execution, data queries, API calls).

**FR-AGENT-006**: Agent deployment lifecycle: Draft → Active → Deprecated.

**FR-AGENT-007**: Agent test console for interactive testing before deployment.

**FR-AGENT-008**: Agents have configurable rate limits per user and per workspace.

### 4.4 Chat System

**FR-CHAT-001**: Real-time AI conversations with SSE streaming.

- **As a** Knowledge Worker
- **I want to** have flowing conversations with AI agents
- **So that** I can get real-time responses without waiting for complete generation

**FR-CHAT-002**: Chat branching via `parent_message_id` + `branch_index`. All messages are immutable.

- **As a** Knowledge Worker
- **I want to** explore different directions in a conversation without losing the original thread
- **So that** I can compare different AI responses to the same prompt

**FR-CHAT-003**: Conversation history is persistent and searchable.

**FR-CHAT-004**: Context window management with priority-based token budget allocation: Knowledge → History → Memory → Tools.

**FR-CHAT-005**: Multi-turn conversations with automatic context window management (sliding window with priority reduction).

### 4.5 Knowledge Base & RAG

**FR-KNOW-001**: Upload documents (PDF, DOCX, TXT, MD, HTML, CSV, JSON) to knowledge bases.

- **As a** Team Lead
- **I want to** upload my team's documents to a knowledge base
- **So that** AI agents can retrieve relevant information when answering questions

**FR-KNOW-002**: Automatic document processing pipeline: extraction → chunking → embedding → indexing.

**FR-KNOW-003**: Multiple chunking strategies: fixed-size, semantic, paragraph, heading-based.

**FR-KNOW-004**: Persian-optimized RAG: character normalization, Persian-aware chunking, Persian-optimized model tagging.

**FR-KNOW-005**: Hybrid search: vector similarity (pgvector HNSW, cosine) + BM25 full-text search.

**FR-KNOW-006**: Configurable retrieval parameters: top-K, similarity threshold, hybrid search weight.

**FR-KNOW-007**: Real-time upload progress tracking with SSE status events.

### 4.6 Memory System

**FR-MEM-001**: Memory packs are reusable bundles of context that persist across chat sessions.

- **As a** Team Lead
- **I want to** create memory packs with persistent context for my team's AI agents
- **So that** agents remember important information across conversations

**FR-MEM-002**: Memory pack types: Context (custom), Preference (user preferences), Knowledge (knowledge summary), System (system instructions).

**FR-MEM-003**: Memory packs support version history with diff comparison and rollback.

**FR-MEM-004**: Memory is injected into the AI context window automatically based on relevance.

**FR-MEM-005**: Hierarchical memory: Workspace Memory → Brand Memory → Company Memory → Organization Memory (accumulates upward).

### 4.7 Multi-AI Provider

**FR-PROVIDER-001**: Support multiple AI providers: OpenAI-compatible, Anthropic, Google, local models, custom endpoints.

- **As an** AI/ML Engineer
- **I want to** configure multiple AI providers with different models
- **So that** the platform is not locked into a single vendor

**FR-PROVIDER-002**: LLM Router with 5-step routing pipeline: model requirement → user tier → workspace config → cost optimization → health-based fallback.

**FR-PROVIDER-003**: Automatic failover: when a provider fails, automatically route to the next available provider.

**FR-PROVIDER-004**: Provider health monitoring: latency tracking, error rate tracking, uptime percentage, incident history.

**FR-PROVIDER-005**: Model comparison: side-by-side comparison of models by context window, cost, speed, and capabilities.

**FR-PROVIDER-006**: Per-model routing rules with conditions (user tier, workspace type, agent type) and priority.

### 4.8 Admin Panel

**FR-ADMIN-001**: Dedicated admin panel with 14 pages: Dashboard, Users, Organizations, Companies, Brands, Agents, Memory Packs, Knowledge, API Providers, Models, Usage, Billing, Audit Logs, System Logs, Roles & Permissions, Settings.

**FR-ADMIN-002**: Multi-scope data filtering: Super Admin sees all orgs. Org Admin sees their org and descendants. Scope selector filters all data.

**FR-ADMIN-003**: Batch operations on all list views: multi-select, bulk delete, bulk reassign, bulk export.

**FR-ADMIN-004**: Audit logging: every mutation operation generates an audit log entry with actor, action, target, and diff.

**FR-ADMIN-005**: Comprehensive usage analytics: token consumption, cost tracking, per-model breakdown, per-workspace breakdown.

**FR-ADMIN-006**: System logs with real-time SSE streaming for DevOps monitoring.

FR-ADMIN-007**: Plan management with configurable limits (users, workspaces, agents, token budgets, storage).

### 4.9 Billing

**FR-BILL-001**: Subscription plans: Free, Pro, Enterprise (with custom plans).

**FR-BILL-002**: Automated invoice generation per billing cycle.

**FR-BILL-003**: Usage-based billing: token consumption tracked per organization, per workspace, per model.

**FR-BILL-004**: Payment method management with Iranian payment gateway integration.

### 4.10 User Experience

**FR-UX-001**: Dark mode and light mode, each a first-class citizen. User preference persists. System preference respected.

**FR-UX-002**: Solar Hijri (شمسی) calendar throughout. Gregorian available as secondary.

**FR-UX-003**: Persian numeral display option (۱۲۳ vs 123).

**FR-UX-004**: Responsive design: desktop, tablet, mobile. Desktop-first for admin. Mobile-first considerations for workspace.

**FR-UX-005**: Command palette (Cmd+K / Ctrl+K) for global search and quick actions.

**FR-UX-006**: Real-time notifications for system alerts, quota breaches, and async operation completion.

---

## 5. Non-Functional Requirements

### 5.1 Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| API P50 latency | < 200ms | All non-AI endpoints |
| API P95 latency | < 500ms | All non-AI endpoints |
| AI time-to-first-token | < 2s | SSE stream start |
| LCP (Largest Contentful Paint) | < 2.5s | Core Web Vitals |
| FID (First Input Delay) | < 100ms | Core Web Vitals |
| CLS (Cumulative Layout Shift) | < 0.1 | Core Web Vitals |
| INP (Interaction to Next Paint) | < 200ms | Core Web Vitals |
| Initial JS bundle | < 200KB gzipped | Per route chunk |
| Vector search latency (P95) | < 150ms | pgvector HNSW query |

### 5.2 Security

| Requirement | Standard |
|------------|----------|
| Password hashing | Argon2id (OWASP parameters) |
| Data encryption at rest | AES-256 |
| Data encryption in transit | TLS 1.3 |
| Authentication | Dual-token JWT (RS256 + HS256) |
| Authorization | 3-layer RBAC + PostgreSQL RLS |
| Input validation | Zod schemas on all endpoints |
| Content Security Policy | Enabled with strict directives |
| Rate limiting | Per-IP, per-user, per-tenant |
| Audit logging | All mutation operations |
| PII handling | No PII in logs, masked in responses |
| CORS | Explicit origin allowlist |
| CSRF protection | Custom header + SameSite cookies |
| Secret management | Environment variables, no hardcoded secrets |
| Dependency scanning | npm audit + Dependabot/Renovate |

### 5.3 Scalability

| Dimension | Target |
|-----------|--------|
| Organizations | 100+ |
| Brands | 1,000+ |
| Concurrent users | 10,000+ |
| Chat messages | Millions (partitioned) |
| Knowledge chunks | 10M+ vectors (pgvector or migrate to dedicated vector DB) |
| Memory packs | Thousands |
| AI providers | 10+ simultaneous |
| API requests | 10,000+ RPM |

### 5.4 Availability

| Metric | Target |
|--------|--------|
| Uptime (Enterprise plan) | 99.9% |
| Uptime (Pro plan) | 99.5% |
| RTO (Recovery Time Objective) | 4 hours |
| RPO (Recovery Point Objective) | 1 hour |
| Database backups | Daily automated, point-in-time recovery |

### 5.5 Accessibility

| Requirement | Standard |
|------------|----------|
| WCAG compliance | 2.2 Level AA |
| Keyboard navigation | All interactive elements |
| Screen reader | Full compatibility (NVDA, JAWS, VoiceOver) |
| Color contrast | 4.5:1 minimum (normal text), 3:1 (large text) |
| Touch targets | 44x44px minimum |
| Reduced motion | Respect `prefers-reduced-motion` |

### 5.6 Internationalization

| Requirement | Implementation |
|------------|---------------|
| Primary language | Persian (فارسی) |
| Secondary language | English |
| Text direction | RTL default, LTR supported |
| Calendar | Solar Hijri default, Gregorian available |
| Numerals | Persian numerals option (۱۲۳) |
| Font | Vazirmatn (self-hosted) |

---

## 6. Success Metrics

### 6.1 Product Metrics

| Metric | Target (6 months post-launch) |
|--------|---------------------------|
| Monthly Active Users (MAU) | 5,000+ |
| Organizations created | 100+ |
| AI conversations per day | 10,000+ |
| Knowledge bases created | 500+ |
| Agent deployments | 1,000+ |
| Average session duration | 15+ minutes |
| User retention (30-day) | 60%+ |

### 6.2 Technical Metrics

| Metric | Target |
|--------|--------|
| API uptime | 99.9%+ |
| P95 API latency | < 500ms |
| AI response satisfaction rate | 80%+ |
| RAG retrieval relevance | 85%+ (user feedback) |
| Test coverage (services) | 90%+ |
| Test coverage (other) | 80%+ |
| CI pipeline duration | < 15 minutes |
| Deploy frequency | Multiple times per day |

### 6.3 Business Metrics

| Metric | Target |
|--------|--------|
| Free → Pro conversion rate | 10%+ |
| Pro → Enterprise conversion rate | 5%+ |
| Monthly Recurring Revenue (MRR) growth | 15% MoM |
| Customer Acquisition Cost (CAC) payback | < 6 months |
| Net Promoter Score (NPS) | 50+ |

---

## 7. Out of Scope (v1.0)

The following features are explicitly **not** included in v1.0:

| Feature | Reason | Future Phase |
|---------|--------|-------------|
| Workflow Engine | Requires stable agent system first | v2.0 |
| Marketplace | Requires plugin architecture | v2.0 |
| Plugin System | Requires stable module boundaries | v2.0 |
| Mobile native apps | Web PWA is sufficient for v1 | v1.5 |
| Real-time collaboration (multi-user editing) | Significant complexity | v2.0 |
| Voice input/output (TTS/ASR) | Separate AI pipeline | v1.5 |
| Image generation | Different AI pipeline | v1.5 |
| Video understanding | Different AI pipeline | v2.0 |
| White-labeling for external customers | Requires mature multi-tenancy | v2.0 |
| SAML SSO | Available only for Enterprise plan | v1.5 |
| Advanced analytics (ML-based insights) | Requires usage data accumulation | v2.0 |
| Dedicated vector database (Pinecone, Qdrant) | pgvector sufficient for initial scale | v2.0 (if needed) |
| GraphQL API | REST is sufficient for v1 | v2.0 |

---

## 8. Milestones

| Phase | Description | Dependencies |
|-------|-------------|-------------|
| Phase 0 | Project bootstrap (monorepo, CI, linting, DB) | None |
| Phase 1 | Product Definition (this document) | Phase 0 |
| Phase 2 | Information Architecture | Phase 1 |
| Phase 3 | UX Design | Phase 2 |
| Phase 4 | Design System | Phase 3 |
| Phase 5 | Database Design | Phase 4 |
| Phase 6 | Backend Architecture | Phase 5 |
| Phase 7 | Frontend Architecture | Phase 6 |
| Phase 8 | AI Architecture (Agent System) | Phase 6 |
| Phase 9 | Admin Panel Design | Phase 5, 6, 7, 8 |
| Phase 10 | Engineering Rules | Phase 6, 7 |
| Phase 10.5 | Architecture Lock & Readiness Review | Phase 1-10 |
| Phase 11 | Production Implementation | Phase 10.5 (approved) |
