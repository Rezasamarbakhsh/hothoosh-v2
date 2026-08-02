# Database Design

## HotHoosh — Complete Schema Specification

---

## 1. Database Engine

**PostgreSQL 16+** with the following extensions:

| Extension | Version | Purpose |
|-----------|---------|--------|
| `uuid-ossp` | 1.1 | UUID v7 generation (via custom function) |
| `vector` (pgvector) | 0.7+ | Vector embeddings storage and HNSW indexing |
| `pg_trgm` | 1.6 | Trigram similarity for fuzzy text search |
| `btree_gin` | 1.3 | GIN indexes on JSONB columns |

### 1.1 UUID v7 Strategy

HotHoosh uses **UUID v7** (time-sortable) as the default primary key for all entities. UUID v7 combines a Unix timestamp (millisecond precision) with random bytes, producing IDs that are:

- **Globally unique** (no coordination needed)
- **Time-sortable** (recent entities have higher IDs, benefiting B-tree indexes)
- **K-sortable** within the same millisecond

For **high-throughput append-only tables** (audit_logs, usage_logs, chat_messages, system_logs), **BIGINT** auto-increment is used instead to avoid UUID storage overhead and maintain maximum insert throughput.

### 1.2 Migration Strategy

Migrations are managed via a dedicated migration tool integrated with NestJS. Each migration file is timestamped and contains `UP` and `DOWN` functions. Migrations are:

- **Sequential**: Each migration builds on the previous one.
- **Irreversible by default**: `DOWN` functions must be explicitly written for rollback support.
- **Tested**: Every migration is tested against a copy of production data before deployment.
- **Reviewed**: Schema changes require PR review with at least 2 approvals.

---

## 2. Schema Overview

The HotHoosh data model is organized into the following domains:

```
┌─────────────────────────────────────────────────────────┐
│                    TENANT HIERARCHY                      │
│  organizations → companies → brands → workspaces       │
│       ↓            ↓          ↓          ↓              │
│  org_settings  company_settings  brand_settings  workspace_settings │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                      IDENTITY                             │
│  users → user_roles → roles → permissions                │
│  workspace_users (junction: users × workspaces)          │
│  refresh_tokens                                           │
│  user_invitations                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                        AI                                 │
│  api_providers → models → model_routing_rules            │
│  agents → agent_tools → agent_knowledge → agent_memory   │
│  tools → tool_parameters                                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                     CONVERSATION                          │
│  chat_sessions → chat_messages (immutable)               │
│  chat_branches                                            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                     KNOWLEDGE                             │
│  knowledge_bases → knowledge_documents → knowledge_chunks│
│  knowledge_embeddings (vector)                            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                      MEMORY                               │
│  memory_packs → memory_pack_versions                     │
│  memory_pack_bindings (agents × memory_packs)            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    OPERATIONS                             │
│  audit_logs (BIGINT PK)                                  │
│  usage_logs (BIGINT PK, partitioned)                     │
│  system_logs (BIGINT PK)                                  │
│  background_jobs (BullMQ)                                 │
│  invoices → invoice_line_items → transactions            │
│  plans → subscriptions                                    │
│  settings (key-value)                                     │
│  webhooks                                                 │
│  email_templates                                          │
│  notifications                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Tenant Hierarchy

### 3.1 organizations

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Organization identifier |
| name | VARCHAR(100) | NOT NULL, CHECK(length > 2) | Organization display name (Persian) |
| slug | VARCHAR(50) | NOT NULL, UNIQUE, CHECK(slug ~ '^[a-z0-9-]+$') | URL-safe identifier |
| logo_url | VARCHAR(500) | NULL | S3 URL for organization logo |
| description | TEXT | NULL | Organization description |
| owner_id | UUID | NOT NULL, FK(users.id) | Organization owner |
| plan_id | UUID | NOT NULL, FK(plans.id) | Current subscription plan |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'active', CHECK(status IN ('active','inactive','suspended')) | Organization status |
| max_companies | INTEGER | NOT NULL, DEFAULT 5 | Plan-defined limit |
| max_users | INTEGER | NOT NULL, DEFAULT 50 | Plan-defined limit |
| token_budget_monthly | BIGINT | NOT NULL, DEFAULT 5000000 | Monthly token budget (5M default) |
| storage_limit_mb | BIGINT | NOT NULL, DEFAULT 51200 | Storage limit in MB (50GB default) |
| settings | JSONB | NOT NULL, DEFAULT '{}' | Organization-level settings (JSON) |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |
| deleted_at | TIMESTAMPTZ | NULL | Soft delete timestamp |

**Indexes:**
- `uniq_orgs_slug` UNIQUE (slug) WHERE deleted_at IS NULL
- `idx_orgs_owner_id` B-tree (owner_id)
- `idx_orgs_plan_id` B-tree (plan_id)
- `idx_orgs_status` B-tree (status) WHERE deleted_at IS NULL
- `idx_orgs_created_at` B-tree (created_at DESC)

**RLS Policy:**
- Super admins: full access
- Org admins: access to own org + no access to others
- Others: no direct access (access via company/brand/workspace membership)

---

### 3.2 companies

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Company identifier |
| organization_id | UUID | NOT NULL, FK(organizations.id, ON DELETE CASCADE) | Parent organization |
| name | VARCHAR(100) | NOT NULL | Company display name |
| slug | VARCHAR(50) | NOT NULL, CHECK(slug ~ '^[a-z0-9-]+$') | URL-safe identifier |
| logo_url | VARCHAR(500) | NULL | S3 URL for company logo |
| description | TEXT | NULL | Company description |
| owner_id | UUID | NOT NULL, FK(users.id) | Company owner |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'active' | active, inactive, suspended |
| settings | JSONB | NOT NULL, DEFAULT '{}' | Company-level settings |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |
| deleted_at | TIMESTAMPTZ | NULL | Soft delete |

**Indexes:**
- `uniq_companies_org_slug` UNIQUE (organization_id, slug) WHERE deleted_at IS NULL
- `idx_companies_organization_id` B-tree (organization_id)
- `idx_companies_owner_id` B-tree (owner_id)
- `idx_companies_status` B-tree (status)

**RLS Policy:** Accessible by users with roles in the parent organization or the company itself.

---

### 3.3 brands

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Brand identifier |
| company_id | UUID | NOT NULL, FK(companies.id, ON DELETE CASCADE) | Parent company |
| name | VARCHAR(100) | NOT NULL | Brand display name |
| slug | VARCHAR(50) | NOT NULL, CHECK(slug ~ '^[a-z0-9-]+$') | URL-safe identifier |
| logo_url | VARCHAR(500) | NULL | Brand logo |
| favicon_url | VARCHAR(500) | NULL | Brand favicon |
| description | TEXT | NULL | Brand description |
| owner_id | UUID | NOT NULL, FK(users.id) | Brand owner |
| primary_color | VARCHAR(7) | NOT NULL, DEFAULT '#6366F1' | Brand primary color (hex) |
| secondary_color | VARCHAR(7) | NULL | Brand secondary color (hex) |
| accent_color | VARCHAR(7) | NULL | Brand accent color (hex) |
| heading_font | VARCHAR(100) | NOT NULL, DEFAULT 'Vazirmatn' | Heading font family |
| body_font | VARCHAR(100) | NOT NULL, DEFAULT 'Vazirmatn' | Body font family |
| custom_css | TEXT | NULL | Custom CSS injection (sanitized, max 5KB) |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'active' | active, inactive, suspended |
| settings | JSONB | NOT NULL, DEFAULT '{}' | Brand-level settings |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |
| deleted_at | TIMESTAMPTZ | NULL | Soft delete |

**Indexes:**
- `uniq_brands_company_slug` UNIQUE (company_id, slug) WHERE deleted_at IS NULL
- `idx_brands_company_id` B-tree (company_id)
- `idx_brands_owner_id` B-tree (owner_id)

---

### 3.4 workspaces

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Workspace identifier |
| brand_id | UUID | NOT NULL, FK(brands.id, ON DELETE CASCADE) | Parent brand |
| name | VARCHAR(100) | NOT NULL | Workspace display name |
| slug | VARCHAR(50) | NOT NULL, CHECK(slug ~ '^[a-z0-9-]+$') | URL-safe identifier |
| description | TEXT | NULL | Workspace description |
| owner_id | UUID | NOT NULL, FK(users.id) | Workspace owner |
| max_agents | INTEGER | NOT NULL, DEFAULT 10 | Max agents allowed |
| max_knowledge_bases | INTEGER | NOT NULL, DEFAULT 5 | Max knowledge bases |
| max_memory_packs | INTEGER | NOT NULL, DEFAULT 10 | Max memory packs |
| token_budget_monthly | BIGINT | NOT NULL, DEFAULT 1000000 | Monthly token budget (1M default) |
| allowed_model_ids | UUID[] | NULL | Restrict to specific models (NULL = all) |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'active' | active, inactive, suspended |
| settings | JSONB | NOT NULL, DEFAULT '{}' | Workspace-level settings |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |
| deleted_at | TIMESTAMPTZ | NULL | Soft delete |

**Indexes:**
- `uniq_workspaces_brand_slug` UNIQUE (brand_id, slug) WHERE deleted_at IS NULL
- `idx_workspaces_brand_id` B-tree (brand_id)
- `idx_workspaces_owner_id` B-tree (owner_id)

---

## 4. Identity

### 4.1 users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | User identifier (branded: UserId) |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Email address |
| email_verified_at | TIMESTAMPTZ | NULL | Email verification timestamp |
| phone_number | VARCHAR(20) | NULL, UNIQUE | Iranian mobile (09xxxxxxxxx) |
| phone_verified_at | TIMESTAMPTZ | NULL | Phone verification timestamp |
| display_name | VARCHAR(100) | NOT NULL | Display name (Persian) |
| password_hash | VARCHAR(255) | NOT NULL | Argon2id hash |
| avatar_url | VARCHAR(500) | NULL | S3 URL for user avatar |
| preferred_language | VARCHAR(5) | NOT NULL, DEFAULT 'fa' | 'fa' or 'en' |
| preferred_theme | VARCHAR(10) | NOT NULL, DEFAULT 'system' | 'dark', 'light', 'system' |
| preferred_calendar | VARCHAR(10) | NOT NULL, DEFAULT 'jalali' | 'jalali' or 'gregorian' |
| preferred_numerals | VARCHAR(10) | NOT NULL, DEFAULT 'persian' | 'persian' or 'western' |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'active' | active, inactive, suspended, pending |
| last_login_at | TIMESTAMPTZ | NULL | Last successful login |
| last_login_ip | INET | NULL | IP of last login |
| last_login_user_agent | TEXT | NULL | User agent of last login |
| totp_secret | VARCHAR(255) | NULL | TOTP secret (encrypted) |
| totp_enabled | BOOLEAN | NOT NULL, DEFAULT FALSE | 2FA enabled |
| failed_login_attempts | INTEGER | NOT NULL, DEFAULT 0 | Failed login counter |
| locked_until | TIMESTAMPTZ | NULL | Account lockout expiry |
| settings | JSONB | NOT NULL, DEFAULT '{}' | User preferences (JSON) |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |
| deleted_at | TIMESTAMPTZ | NULL | Soft delete |

**Indexes:**
- `uniq_users_email` UNIQUE (email) WHERE deleted_at IS NULL
- `uniq_users_phone` UNIQUE (phone_number) WHERE phone_number IS NOT NULL AND deleted_at IS NULL
- `idx_users_display_name` B-tree (display_name) — for admin search
- `idx_users_status` B-tree (status)
- `idx_users_created_at` B-tree (created_at DESC)
- `idx_users_settings` GIN (settings) — for querying user preferences

---

### 4.2 roles

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Role identifier |
| name | VARCHAR(50) | NOT NULL | Role name (e.g., 'super_admin', 'org_admin') |
| display_name | VARCHAR(100) | NOT NULL | Display name (Persian) |
| description | TEXT | NULL | Role description |
| level | VARCHAR(20) | NOT NULL | org, company, brand, workspace, system |
| parent_role_id | UUID | NULL, FK(roles.id) | Parent role for inheritance |
| is_system | BOOLEAN | NOT NULL, DEFAULT FALSE | System roles cannot be deleted |
| organization_id | UUID | NULL, FK(organizations.id) | NULL for system roles, set for custom roles |
| permissions | JSONB | NOT NULL, DEFAULT '[]' | Array of permission strings |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `uniq_roles_name_level_org` UNIQUE (name, level, organization_id) WHERE organization_id IS NOT NULL
- `uniq_roles_name_system` UNIQUE (name) WHERE is_system = TRUE AND organization_id IS NULL
- `idx_roles_parent_role_id` B-tree (parent_role_id)
- `idx_roles_level` B-tree (level)

---

### 4.3 workspace_users

Junction table: users × workspaces with role assignment.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Record identifier |
| workspace_id | UUID | NOT NULL, FK(workspaces.id, ON DELETE CASCADE) | Workspace |
| user_id | UUID | NOT NULL, FK(users.id, ON DELETE CASCADE) | User |
| role_id | UUID | NOT NULL, FK(roles.id) | Assigned role |
| joined_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Join timestamp |
| invited_by | UUID | NULL, FK(users.id) | Inviter user |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'active' | active, suspended, removed |

**Indexes:**
- `uniq_workspace_users` UNIQUE (workspace_id, user_id)
- `idx_workspace_users_user_id` B-tree (user_id)
- `idx_workspace_users_role_id` B-tree (role_id)

**RLS Policy:** Users can only see their own workspace memberships. Org+ admins can see all memberships in their scope.

---

### 4.4 refresh_tokens

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Token identifier |
| user_id | UUID | NOT NULL, FK(users.id, ON DELETE CASCADE) | Token owner |
| token_hash | VARCHAR(255) | NOT NULL | SHA-256 hash of the refresh token |
| family_id | UUID | NOT NULL | Token family for rotation detection |
| device_fingerprint | VARCHAR(255) | NULL | Device/browser fingerprint |
| ip_address | INET | NULL | IP at token issuance |
| user_agent | TEXT | NULL | User agent at issuance |
| expires_at | TIMESTAMPTZ | NOT NULL | Expiry timestamp |
| revoked_at | TIMESTAMPTZ | NULL | Revocation timestamp |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Indexes:**
- `idx_refresh_tokens_user_id` B-tree (user_id)
- `idx_refresh_tokens_family_id` B-tree (family_id)
- `idx_refresh_tokens_token_hash` B-tree (token_hash)
- `idx_refresh_tokens_expires_at` B-tree (expires_at) WHERE revoked_at IS NULL

**Cleanup Job:** Expired and revoked tokens are purged daily.

---

### 4.5 user_invitations

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Invitation identifier |
| organization_id | UUID | NOT NULL, FK(organizations.id) | Target organization |
| company_id | UUID | NULL, FK(companies.id) | Target company (optional) |
| brand_id | UUID | NULL, FK(brands.id) | Target brand (optional) |
| workspace_id | UUID | NULL, FK(workspaces.id) | Target workspace (optional) |
| email | VARCHAR(255) | NOT NULL | Invitee email |
| role_id | UUID | NOT NULL, FK(roles.id) | Role to assign on acceptance |
| invited_by | UUID | NOT NULL, FK(users.id) | Inviter |
| token_hash | VARCHAR(255) | NOT NULL | SHA-256 of invitation token |
| message | TEXT | NULL | Personal message from inviter |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'pending' | pending, accepted, expired, revoked |
| expires_at | TIMESTAMPTZ | NOT NULL | Invitation expiry |
| accepted_at | TIMESTAMPTZ | NULL | Acceptance timestamp |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Indexes:**
- `idx_invitations_email` B-tree (email)
- `idx_invitations_org_id` B-tree (organization_id)
- `idx_invitations_status` B-tree (status)
- `idx_invitations_token_hash` B-tree (token_hash)

---

## 5. AI System

### 5.1 api_providers

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Provider identifier |
| name | VARCHAR(100) | NOT NULL | Provider display name |
| type | VARCHAR(30) | NOT NULL | openai_compatible, anthropic, google, local, custom |
| base_url | VARCHAR(500) | NOT NULL | API base URL |
| api_key_encrypted | TEXT | NOT NULL | AES-256 encrypted API key |
| api_key_iv | VARCHAR(32) | NOT NULL | Encryption IV |
| api_key_algorithm | VARCHAR(20) | NOT NULL, DEFAULT 'aes-256-gcm' | Encryption algorithm |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Provider enabled/disabled |
| rate_limit_rpm | INTEGER | NULL | Requests per minute limit |
| rate_limit_tpm | BIGINT | NULL | Tokens per minute limit |
| max_concurrent_requests | INTEGER | NULL | Concurrent request limit |
| connect_timeout_ms | INTEGER | NOT NULL, DEFAULT 10000 | Connection timeout (ms) |
| read_timeout_ms | INTEGER | NOT NULL, DEFAULT 30000 | Read timeout (ms) |
| total_timeout_ms | INTEGER | NOT NULL, DEFAULT 60000 | Total timeout (ms) |
| max_retries | INTEGER | NOT NULL, DEFAULT 3 | Retry count |
| backoff_multiplier | NUMERIC(3,2) | NOT NULL, DEFAULT 2.0 | Retry backoff multiplier |
| retryable_status_codes | INTEGER[] | NOT NULL, DEFAULT '{429,500,502,503}' | HTTP codes that trigger retry |
| health_status | VARCHAR(20) | NOT NULL, DEFAULT 'unknown' | healthy, degraded, down, unknown |
| last_health_check_at | TIMESTAMPTZ | NULL | Last health check timestamp |
| custom_headers | JSONB | NOT NULL, DEFAULT '{}' | Additional HTTP headers |
| settings | JSONB | NOT NULL, DEFAULT '{}' | Provider-specific settings |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_providers_type` B-tree (type)
- `idx_providers_is_active` B-tree (is_active)
- `idx_providers_health_status` B-tree (health_status)

---

### 5.2 models

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Model identifier |
| provider_id | UUID | NOT NULL, FK(api_providers.id, ON DELETE CASCADE) | Parent provider |
| model_id | VARCHAR(100) | NOT NULL | Provider-specific model identifier (e.g., 'gpt-4o', 'claude-3-5-sonnet') |
| display_name | VARCHAR(100) | NOT NULL | Human-readable model name |
| model_type | VARCHAR(20) | NOT NULL | chat, embedding, image, audio, multimodal |
| context_window | INTEGER | NOT NULL | Maximum context window in tokens |
| max_output_tokens | INTEGER | NOT NULL | Maximum output tokens |
| supports_streaming | BOOLEAN | NOT NULL, DEFAULT TRUE | SSE streaming support |
| supports_function_calling | BOOLEAN | NOT NULL, DEFAULT FALSE | Tool/function calling support |
| supports_vision | BOOLEAN | NOT NULL, DEFAULT FALSE | Image input support |
| supports_persian | BOOLEAN | NOT NULL, DEFAULT FALSE | Manually tagged Persian optimization |
| input_cost_per_1m | NUMERIC(10,4) | NOT NULL, DEFAULT 0 | Cost per 1M input tokens (USD) |
| output_cost_per_1m | NUMERIC(10,4) | NOT NULL, DEFAULT 0 | Cost per 1M output tokens (USD) |
| is_enabled | BOOLEAN | NOT NULL, DEFAULT TRUE | Model enabled/disabled |
| capabilities | JSONB | NOT NULL, DEFAULT '{}' | Additional capability flags |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `uniq_models_provider_model_id` UNIQUE (provider_id, model_id)
- `idx_models_model_type` B-tree (model_type)
- `idx_models_is_enabled` B-tree (is_enabled)
- `idx_models_supports_persian` B-tree (supports_persian) WHERE model_type = 'chat'

---

### 5.3 model_routing_rules

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Rule identifier |
| name | VARCHAR(100) | NOT NULL | Rule display name |
| priority | INTEGER | NOT NULL, DEFAULT 0 | Lower = higher priority |
| condition_type | VARCHAR(30) | NOT NULL | user_tier, workspace_type, agent_type, model_capability, custom |
| condition_value | JSONB | NOT NULL | Condition parameters |
| primary_model_id | UUID | NOT NULL, FK(models.id) | Primary model to route to |
| fallback_model_id | UUID | NULL, FK(models.id) | Fallback model |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Rule enabled/disabled |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_routing_rules_priority` B-tree (priority ASC)
- `idx_routing_rules_is_active` B-tree (is_active)
- `idx_routing_rules_condition_type` B-tree (condition_type)

---

### 5.4 agents

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Agent identifier |
| workspace_id | UUID | NOT NULL, FK(workspaces.id, ON DELETE CASCADE) | Parent workspace |
| name | VARCHAR(100) | NOT NULL | Agent display name |
| description | TEXT | NULL | Agent description |
| agent_type | VARCHAR(20) | NOT NULL | chat, rag, tool_use, autonomous, workflow |
| model_id | UUID | NOT NULL, FK(models.id) | Default model for this agent |
| system_prompt | TEXT | NOT NULL | System prompt (configurable, not hardcoded) |
| temperature | NUMERIC(3,2) | NOT NULL, DEFAULT 0.7 | Sampling temperature |
| top_p | NUMERIC(3,2) | NOT NULL, DEFAULT 0.9 | Nucleus sampling |
| frequency_penalty | NUMERIC(3,2) | NOT NULL, DEFAULT 0 | Frequency penalty |
| presence_penalty | NUMERIC(3,2) | NOT NULL, DEFAULT 0 | Presence penalty |
| max_tokens | INTEGER | NOT NULL, DEFAULT 4096 | Max output tokens |
| avatar_url | VARCHAR(500) | NULL | Agent avatar |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'draft' | draft, active, deprecated |
| rate_limit_per_user | INTEGER | NULL | Max requests per user per hour |
| rate_limit_per_workspace | INTEGER | NULL | Max requests per workspace per hour |
| config | JSONB | NOT NULL, DEFAULT '{}' | Extended configuration (tool settings, RAG parameters, etc.) |
| created_by | UUID | NOT NULL, FK(users.id) | Creator |
| updated_by | UUID | NULL, FK(users.id) | Last updater |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |
| deleted_at | TIMESTAMPTZ | NULL | Soft delete |

**Indexes:**
- `idx_agents_workspace_id` B-tree (workspace_id)
- `idx_agents_model_id` B-tree (model_id)
- `idx_agents_agent_type` B-tree (agent_type)
- `idx_agents_status` B-tree (status)
- `idx_agents_created_by` B-tree (created_by)

---

### 5.5 tools

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Tool identifier |
| name | VARCHAR(100) | NOT NULL | Tool name (machine-readable) |
| display_name | VARCHAR(100) | NOT NULL | Display name (Persian) |
| description | TEXT | NOT NULL | Tool description (for AI) |
| category | VARCHAR(30) | NOT NULL | search, code, data, communication, custom |
| input_schema | JSONB | NOT NULL | JSON Schema for tool input parameters |
| handler | VARCHAR(200) | NOT NULL | Tool handler reference (module:method) |
| is_enabled | BOOLEAN | NOT NULL, DEFAULT TRUE | Tool enabled/disabled |
| settings | JSONB | NOT NULL, DEFAULT '{}' | Tool-specific settings |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `uniq_tools_name` UNIQUE (name)
- `idx_tools_category` B-tree (category)

---

### 5.6 agent_tools

Junction table: agents × tools.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Record identifier |
| agent_id | UUID | NOT NULL, FK(agents.id, ON DELETE CASCADE) | Agent |
| tool_id | UUID | NOT NULL, FK(tools.id, ON DELETE CASCADE) | Tool |
| is_enabled | BOOLEAN | NOT NULL, DEFAULT TRUE | Tool enabled for this agent |
| config | JSONB | NOT NULL, DEFAULT '{}' | Per-agent tool configuration |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Indexes:**
- `uniq_agent_tools` UNIQUE (agent_id, tool_id)

---

### 5.7 agent_knowledge

Junction table: agents × knowledge bases.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Record identifier |
| agent_id | UUID | NOT NULL, FK(agents.id, ON DELETE CASCADE) | Agent |
| knowledge_base_id | UUID | NOT NULL, FK(knowledge_bases.id, ON DELETE CASCADE) | Knowledge base |
| relevance_threshold | NUMERIC(3,2) | NOT NULL, DEFAULT 0.7 | Minimum similarity score |
| priority | INTEGER | NOT NULL, DEFAULT 0 | Retrieval priority (lower = higher) |
| max_chunks | INTEGER | NOT NULL, DEFAULT 10 | Max chunks to retrieve |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Indexes:**
- `uniq_agent_knowledge` UNIQUE (agent_id, knowledge_base_id)
- `idx_agent_knowledge_agent_id` B-tree (agent_id)

---

### 5.8 agent_memory

Junction table: agents × memory packs.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Record identifier |
| agent_id | UUID | NOT NULL, FK(agents.id, ON DELETE CASCADE) | Agent |
| memory_pack_id | UUID | NOT NULL, FK(memory_packs.id, ON DELETE CASCADE) | Memory pack |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Indexes:**
- `uniq_agent_memory` UNIQUE (agent_id, memory_pack_id)

---

## 6. Conversation

### 6.1 chat_sessions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Session identifier |
| workspace_id | UUID | NOT NULL, FK(workspaces.id, ON DELETE CASCADE) | Workspace |
| user_id | UUID | NOT NULL, FK(users.id) | Session creator |
| agent_id | UUID | NOT NULL, FK(agents.id) | Agent used |
| title | VARCHAR(255) | NULL | Auto-generated or user-set title |
| message_count | INTEGER | NOT NULL, DEFAULT 0 | Total message count |
| total_input_tokens | BIGINT | NOT NULL, DEFAULT 0 | Cumulative input tokens |
| total_output_tokens | BIGINT | NOT NULL, DEFAULT 0 | Cumulative output tokens |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'active' | active, archived, deleted |
| last_message_at | TIMESTAMPTZ | NULL | Timestamp of last message |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_chat_sessions_workspace_id` B-tree (workspace_id)
- `idx_chat_sessions_user_id` B-tree (user_id)
- `idx_chat_sessions_agent_id` B-tree (agent_id)
- `idx_chat_sessions_last_message_at` B-tree (last_message_at DESC)
- `idx_chat_sessions_created_at` B-tree (created_at DESC)
- `idx_chat_sessions_status` B-tree (status)

---

### 6.2 chat_messages

Messages are **immutable**. Edits create new messages. The branching model uses `parent_message_id` + `branch_index`.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, GENERATED ALWAYS AS IDENTITY | Auto-increment (high throughput) |
| session_id | UUID | NOT NULL, FK(chat_sessions.id, ON DELETE CASCADE) | Chat session |
| parent_message_id | BIGINT | NULL, FK(chat_messages.id) | Parent message for branching |
| branch_index | INTEGER | NOT NULL, DEFAULT 0 | Branch number (0 = main branch) |
| role | VARCHAR(20) | NOT NULL | user, assistant, system, tool |
| content | TEXT | NOT NULL | Message content |
| token_count | INTEGER | NULL | Token count of this message |
| model_id | UUID | NULL, FK(models.id) | Model used (for assistant messages) |
| input_tokens | INTEGER | NULL | Input tokens consumed |
| output_tokens | INTEGER | NULL | Output tokens generated |
| latency_ms | INTEGER | NULL | Response latency in milliseconds |
| tool_calls | JSONB | NULL | Tool call details (name, arguments, result) |
| metadata | JSONB | NOT NULL, DEFAULT '{}' | Additional metadata (sources, scores, etc.) |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Indexes:**
- `idx_chat_messages_session_id` B-tree (session_id)
- `idx_chat_messages_parent_id` B-tree (parent_message_id) WHERE parent_message_id IS NOT NULL
- `idx_chat_messages_session_branch` B-tree (session_id, branch_index, created_at)
- `idx_chat_messages_created_at` B-tree (created_at DESC)

**Partitioning**: This table is **partitioned by month** on `created_at` using range partitioning. Each monthly partition is created in advance. Partitions older than the retention period are detached and archived.

---

## 7. Knowledge

### 7.1 knowledge_bases

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Knowledge base identifier |
| workspace_id | UUID | NOT NULL, FK(workspaces.id, ON DELETE CASCADE) | Parent workspace |
| name | VARCHAR(100) | NOT NULL | Knowledge base name |
| description | TEXT | NULL | Description |
| kb_type | VARCHAR(20) | NOT NULL | document, web, api, database, hybrid |
| chunking_strategy | VARCHAR(30) | NOT NULL, DEFAULT 'fixed_size' | fixed_size, semantic, paragraph, heading_based |
| chunk_size | INTEGER | NOT NULL, DEFAULT 512 | Chunk size in tokens |
| chunk_overlap | INTEGER | NOT NULL, DEFAULT 100 | Chunk overlap in tokens |
| embedding_model_id | UUID | NOT NULL, FK(models.id) | Model used for embeddings |
| persian_nlp_enabled | BOOLEAN | NOT NULL, DEFAULT TRUE | Persian NLP optimization |
| document_count | INTEGER | NOT NULL, DEFAULT 0 | Cached document count |
| chunk_count | INTEGER | NOT NULL, DEFAULT 0 | Cached chunk count |
| total_size_bytes | BIGINT | NOT NULL, DEFAULT 0 | Total storage size |
| last_processed_at | TIMESTAMPTZ | NULL | Last successful processing |
| processing_status | VARCHAR(20) | NOT NULL, DEFAULT 'empty' | empty, processing, ready, failed |
| created_by | UUID | NOT NULL, FK(users.id) | Creator |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |
| deleted_at | TIMESTAMPTZ | NULL | Soft delete |

**Indexes:**
- `idx_knowledge_bases_workspace_id` B-tree (workspace_id)
- `idx_knowledge_bases_kb_type` B-tree (kb_type)
- `idx_knowledge_bases_processing_status` B-tree (processing_status)

---

### 7.2 knowledge_documents

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Document identifier |
| knowledge_base_id | UUID | NOT NULL, FK(knowledge_bases.id, ON DELETE CASCADE) | Parent knowledge base |
| file_name | VARCHAR(255) | NOT NULL | Original file name |
| file_type | VARCHAR(20) | NOT NULL | pdf, docx, txt, md, html, csv, json |
| file_size | BIGINT | NOT NULL | File size in bytes |
| storage_key | VARCHAR(500) | NOT NULL | S3 object key |
| mime_type | VARCHAR(100) | NOT NULL | MIME type |
| content_hash | VARCHAR(64) | NOT NULL | SHA-256 hash for deduplication |
| chunk_count | INTEGER | NOT NULL, DEFAULT 0 | Number of chunks generated |
| processing_status | VARCHAR(20) | NOT NULL, DEFAULT 'uploaded' | uploaded, extracting, chunking, embedding, indexed, ready, failed |
| error_message | TEXT | NULL | Error details if processing failed |
| uploaded_by | UUID | NOT NULL, FK(users.id) | Uploader |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Upload timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_knowledge_docs_kb_id` B-tree (knowledge_base_id)
- `idx_knowledge_docs_status` B-tree (processing_status)
- `idx_knowledge_docs_content_hash` B-tree (content_hash)

---

### 7.3 knowledge_chunks

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Chunk identifier |
| document_id | UUID | NOT NULL, FK(knowledge_documents.id, ON DELETE CASCADE) | Parent document |
| knowledge_base_id | UUID | NOT NULL, FK(knowledge_bases.id) | Knowledge base (denormalized for query performance) |
| content | TEXT | NOT NULL | Chunk text content |
| token_count | INTEGER | NOT NULL | Token count of chunk content |
| chunk_index | INTEGER | NOT NULL | Order within document |
| metadata | JSONB | NOT NULL, DEFAULT '{}' | Metadata (headings, page numbers, etc.) |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Indexes:**
- `idx_knowledge_chunks_document_id` B-tree (document_id)
- `idx_knowledge_chunks_kb_id` B-tree (knowledge_base_id)
- `idx_knowledge_chunks_content_fts` GIN (to_tsvector('persian', content)) — Persian full-text search
- `idx_knowledge_chunks_content_trgm` GIN (content gin_trgm_ops) — Trigram fuzzy search

---

### 7.4 knowledge_embeddings

Separate table for vector embeddings to allow independent optimization.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| chunk_id | UUID | PK, FK(knowledge_chunks.id, ON DELETE CASCADE) | References chunk (1:1) |
| embedding | vector(1536) | NOT NULL | Embedding vector (dimension depends on model) |
| model_id | UUID | NOT NULL, FK(models.id) | Embedding model used |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Indexes:**
- `idx_knowledge_embeddings_vector` HNSW (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 200) — Vector similarity search

**Note**: The vector dimension (1536) is the default for OpenAI's text-embedding-3-small. When using models with different dimensions, the table schema supports this via the model_id reference. A separate embedding table per dimension may be created if needed for performance.

---

## 8. Memory

### 8.1 memory_packs

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Memory pack identifier |
| workspace_id | UUID | NOT NULL, FK(workspaces.id, ON DELETE CASCADE) | Parent workspace |
| name | VARCHAR(100) | NOT NULL | Memory pack name |
| description | TEXT | NULL | Description |
| memory_type | VARCHAR(20) | NOT NULL | context, preference, knowledge, system |
| content | TEXT | NOT NULL | Memory pack content |
| token_count | INTEGER | NOT NULL | Token count of content |
| tags | TEXT[] | NOT NULL, DEFAULT '{}' | Tags for categorization |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'active' | active, inactive, draft |
| version | INTEGER | NOT NULL, DEFAULT 1 | Current version number |
| created_by | UUID | NOT NULL, FK(users.id) | Creator |
| updated_by | UUID | NULL, FK(users.id) | Last updater |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |
| deleted_at | TIMESTAMPTZ | NULL | Soft delete |

**Indexes:**
- `idx_memory_packs_workspace_id` B-tree (workspace_id)
- `idx_memory_packs_memory_type` B-tree (memory_type)
- `idx_memory_packs_status` B-tree (status)
- `idx_memory_packs_tags` GIN (tags)

---

### 8.2 memory_pack_versions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Version identifier |
| memory_pack_id | UUID | NOT NULL, FK(memory_packs.id, ON DELETE CASCADE) | Parent memory pack |
| version | INTEGER | NOT NULL | Version number |
| content | TEXT | NOT NULL | Content at this version |
| token_count | INTEGER | NOT NULL | Token count at this version |
| change_summary | TEXT | NULL | Description of changes |
| created_by | UUID | NOT NULL, FK(users.id) | Version author |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Indexes:**
- `uniq_memory_pack_versions` UNIQUE (memory_pack_id, version)
- `idx_memory_versions_pack_id` B-tree (memory_pack_id)

---

## 9. Operations

### 9.1 audit_logs

All mutation operations generate an audit log entry.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, GENERATED ALWAYS AS IDENTITY | Auto-increment (high throughput) |
| actor_id | UUID | NOT NULL, FK(users.id) | User who performed the action |
| event_type | VARCHAR(50) | NOT NULL | USER_CREATED, AGENT_UPDATED, etc. |
| severity | VARCHAR(10) | NOT NULL, DEFAULT 'INFO' | INFO, WARNING, CRITICAL |
| target_type | VARCHAR(50) | NOT NULL | Entity type (users, agents, etc.) |
| target_id | UUID | NULL | Entity ID |
| target_name | VARCHAR(255) | NULL | Entity display name (denormalized) |
| description | TEXT | NOT NULL | Human-readable description (Persian) |
| changes_diff | JSONB | NULL | Before/after values diff |
| request_metadata | JSONB | NOT NULL, DEFAULT '{}' | IP, user agent, session ID |
| organization_id | UUID | NULL, FK(organizations.id) | Tenant scope (denormalized) |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Event timestamp |

**Indexes:**
- `idx_audit_logs_actor_id` B-tree (actor_id)
- `idx_audit_logs_event_type` B-tree (event_type)
- `idx_audit_logs_target` B-tree (target_type, target_id)
- `idx_audit_logs_severity` B-tree (severity)
- `idx_audit_logs_org_id` B-tree (organization_id)
- `idx_audit_logs_created_at` B-tree (created_at DESC)

**Partitioning**: Partitioned by month on `created_at`.
**Retention**: 30 days (Free), 90 days (Pro), 365 days (Enterprise).

---

### 9.2 usage_logs

Token consumption tracking per request.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, GENERATED ALWAYS AS IDENTITY | Auto-increment |
| workspace_id | UUID | NOT NULL, FK(workspaces.id) | Workspace |
| user_id | UUID | NOT NULL, FK(users.id) | User |
| agent_id | UUID | NOT NULL, FK(agents.id) | Agent |
| model_id | UUID | NOT NULL, FK(models.id) | Model used |
| session_id | UUID | NULL, FK(chat_sessions.id) | Chat session |
| input_tokens | INTEGER | NOT NULL, DEFAULT 0 | Input tokens |
| output_tokens | INTEGER | NOT NULL, DEFAULT 0 | Output tokens |
| total_tokens | INTEGER | NOT NULL | Computed: input + output |
| estimated_cost | NUMERIC(12,6) | NOT NULL | Estimated USD cost |
| latency_ms | INTEGER | NULL | Response latency |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Timestamp |

**Indexes:**
- `idx_usage_logs_workspace_id` B-tree (workspace_id)
- `idx_usage_logs_user_id` B-tree (user_id)
- `idx_usage_logs_model_id` B-tree (model_id)
- `idx_usage_logs_agent_id` B-tree (agent_id)
- `idx_usage_logs_created_at` B-tree (created_at DESC)

**Partitioning**: Partitioned by month on `created_at`.

---

### 9.3 system_logs

Application-level logs for DevOps monitoring.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, GENERATED ALWAYS AS IDENTITY | Auto-increment |
| level | VARCHAR(10) | NOT NULL | DEBUG, INFO, WARN, ERROR, FATAL |
| service | VARCHAR(50) | NOT NULL | api-gateway, auth-service, llm-router, etc. |
| message | TEXT | NOT NULL | Log message |
| stack_trace | TEXT | NULL | Stack trace (ERROR/FATAL only) |
| request_id | VARCHAR(50) | NULL | Request correlation ID |
| trace_id | VARCHAR(50) | NULL | Distributed trace ID |
| metadata | JSONB | NOT NULL, DEFAULT '{}' | Key-value metadata |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Timestamp |

**Indexes:**
- `idx_system_logs_level` B-tree (level)
- `idx_system_logs_service` B-tree (service)
- `idx_system_logs_created_at` B-tree (created_at DESC)
- `idx_system_logs_request_id` B-tree (request_id) WHERE request_id IS NOT NULL

**Partitioning**: Partitioned by day on `created_at`. Partitions older than 30 days are dropped.

---

### 9.4 plans

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Plan identifier |
| name | VARCHAR(50) | NOT NULL | Plan name (free, pro, enterprise) |
| display_name | VARCHAR(100) | NOT NULL | Display name (Persian) |
| description | TEXT | NULL | Plan description |
| monthly_price_rial | BIGINT | NOT NULL, DEFAULT 0 | Monthly price in IRR (0 for free) |
| annual_price_rial | BIGINT | NULL | Annual price in IRR (with discount) |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Plan available for new subscriptions |
| limits | JSONB | NOT NULL | Plan limits (users, workspaces, agents, tokens, storage, etc.) |
| features | JSONB | NOT NULL, DEFAULT '[]' | Feature flags available in this plan |
| sort_order | INTEGER | NOT NULL, DEFAULT 0 | Display order |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**`limits` JSONB structure:**
```json
{
  "max_users": 50,
  "max_workspaces": 10,
  "max_agents": 25,
  "max_knowledge_bases": 10,
  "token_budget_monthly": 5000000,
  "storage_limit_mb": 51200,
  "max_companies": 5,
  "max_brands_per_company": 10,
  "max_workspaces_per_brand": 10,
  "custom_models": false,
  "priority_support": true,
  "sso_saml": false,
  "audit_retention_days": 90,
  "sla_percentage": 99.5
}
```

---

### 9.5 subscriptions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Subscription identifier |
| organization_id | UUID | NOT NULL, FK(organizations.id) | Subscribing organization |
| plan_id | UUID | NOT NULL, FK(plans.id) | Current plan |
| status | VARCHAR(20) | NOT NULL | active, cancelled, past_due, trialing |
| current_period_start | DATE | NOT NULL | Current billing period start |
| current_period_end | DATE | NOT NULL | Current billing period end |
| trial_start | DATE | NULL | Trial period start |
| trial_end | DATE | NULL | Trial period end |
| cancelled_at | TIMESTAMPTZ | NULL | Cancellation timestamp |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `uniq_subscriptions_org` UNIQUE (organization_id)
- `idx_subscriptions_plan_id` B-tree (plan_id)
- `idx_subscriptions_status` B-tree (status)

---

### 9.6 invoices

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Invoice identifier |
| invoice_number | VARCHAR(30) | NOT NULL, UNIQUE | Invoice number (e.g., INV-1405-0042) |
| organization_id | UUID | NOT NULL, FK(organizations.id) | Billing organization |
| subscription_id | UUID | NOT NULL, FK(subscriptions.id) | Related subscription |
| amount_rial | BIGINT | NOT NULL | Invoice amount in IRR |
| tax_rial | BIGINT | NOT NULL, DEFAULT 0 | Tax amount in IRR |
| total_rial | BIGINT | NOT NULL | Total (amount + tax) |
| status | VARCHAR(20) | NOT NULL | paid, pending, overdue, cancelled |
| issued_at | DATE | NOT NULL | Issue date |
| due_at | DATE | NOT NULL | Due date |
| paid_at | TIMESTAMPTZ | NULL | Payment timestamp |
| notes | TEXT | NULL | Internal notes (admin-only) |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Indexes:**
- `idx_invoices_organization_id` B-tree (organization_id)
- `idx_invoices_status` B-tree (status)
- `idx_invoices_issued_at` B-tree (issued_at DESC)
- `idx_invoices_due_at` B-tree (due_at)

---

### 9.7 invoice_line_items

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Line item identifier |
| invoice_id | UUID | NOT NULL, FK(invoices.id, ON DELETE CASCADE) | Parent invoice |
| description | VARCHAR(255) | NOT NULL | Line item description |
| quantity | INTEGER | NOT NULL, DEFAULT 1 | Quantity |
| unit_price_rial | BIGINT | NOT NULL | Unit price in IRR |
| amount_rial | BIGINT | NOT NULL | Total (quantity × unit_price) |

---

### 9.8 transactions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Transaction identifier |
| invoice_id | UUID | NULL, FK(invoices.id) | Related invoice |
| organization_id | UUID | NOT NULL, FK(organizations.id) | Organization |
| amount_rial | BIGINT | NOT NULL | Transaction amount (positive = credit, negative = debit) |
| method | VARCHAR(30) | NOT NULL | credit_card, bank_transfer, wallet, adjustment |
| status | VARCHAR(20) | NOT NULL | success, failed, refunded, pending |
| reference_id | VARCHAR(255) | NULL | External reference (gateway transaction ID) |
| metadata | JSONB | NOT NULL, DEFAULT '{}' | Additional metadata |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Timestamp |

**Indexes:**
- `idx_transactions_organization_id` B-tree (organization_id)
- `idx_transactions_invoice_id` B-tree (invoice_id)
- `idx_transactions_status` B-tree (status)
- `idx_transactions_created_at` B-tree (created_at DESC)

---

### 9.9 settings

Global and organization-level key-value settings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Setting identifier |
| scope | VARCHAR(20) | NOT NULL | global, organization, company, brand, workspace |
| scope_id | UUID | NULL | Entity ID (NULL for global) |
| category | VARCHAR(50) | NOT NULL | general, security, ai, email, storage |
| key | VARCHAR(100) | NOT NULL | Setting key |
| value | JSONB | NOT NULL | Setting value (typed) |
| is_encrypted | BOOLEAN | NOT NULL, DEFAULT FALSE | Value contains sensitive data |
| updated_by | UUID | NULL, FK(users.id) | Last modifier |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `uniq_settings_scope_key` UNIQUE (scope, COALESCE(scope_id, '00000000-0000-0000-0000-000000000000'), key)
- `idx_settings_category` B-tree (category)

---

### 9.10 webhooks

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Webhook identifier |
| organization_id | UUID | NULL, FK(organizations.id) | Organization (NULL = system) |
| url | VARCHAR(500) | NOT NULL | Endpoint URL |
| secret | VARCHAR(255) | NOT NULL | HMAC signing secret |
| events | TEXT[] | NOT NULL, DEFAULT '{}' | Subscribed event types |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Webhook enabled |
| retry_policy | JSONB | NOT NULL, DEFAULT '{"max_retries":3,"backoff":2}' | Retry configuration |
| last_delivery_at | TIMESTAMPTZ | NULL | Last successful delivery |
| last_delivery_status | VARCHAR(20) | NULL | success, failed |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_webhooks_organization_id` B-tree (organization_id)
- `idx_webhooks_is_active` B-tree (is_active)

---

### 9.11 notifications

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Notification identifier |
| user_id | UUID | NOT NULL, FK(users.id) | Recipient |
| type | VARCHAR(50) | NOT NULL | system_alert, quota_warning, invitation, etc. |
| title | VARCHAR(255) | NOT NULL | Notification title (Persian) |
| body | TEXT | NULL | Notification body (Persian) |
| action_url | VARCHAR(500) | NULL | Deep link to relevant page |
| is_read | BOOLEAN | NOT NULL, DEFAULT FALSE | Read status |
| metadata | JSONB | NOT NULL, DEFAULT '{}' | Additional data |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Indexes:**
- `idx_notifications_user_id` B-tree (user_id)
- `idx_notifications_is_read` B-tree (user_id, is_read, created_at DESC)

---

### 9.12 email_templates

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v7() | Template identifier |
| type | VARCHAR(50) | NOT NULL, UNIQUE | welcome, password_reset, invitation, etc. |
| subject | VARCHAR(255) | NOT NULL | Email subject (supports {{variables}}) |
| body_html | TEXT | NOT NULL | HTML body (supports {{variables}}) |
| body_text | TEXT | NULL | Plain text fallback |
| variables | TEXT[] | NOT NULL, DEFAULT '{}' | Available template variables |
| is_system | BOOLEAN | NOT NULL, DEFAULT FALSE | System templates cannot be deleted |
| organization_id | UUID | NULL, FK(organizations.id) | NULL for system templates |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

---

## 10. Entity Relationship Summary

```
organizations 1──N companies 1──N brands 1──N workspaces
      │              │             │            │
      │              │             │            ├──N agents ──N agent_tools ──1 tools
      │              │             │            ├──N agents ──N agent_knowledge ──1 knowledge_bases
      │              │             │            ├──N agents ──N agent_memory ──1 memory_packs
      │              │             │            ├──1 knowledge_bases ──N knowledge_documents ──N knowledge_chunks ──1 knowledge_embeddings
      │              │             │            └──1 memory_packs ──N memory_pack_versions
      │
      ├──1 plans
      ├──1 subscriptions
      ├──N invoices ──N invoice_line_items
      └──N transactions

users ──N workspace_users ──N workspaces
users ──N refresh_tokens
users ──N user_invitations
users ──N chat_sessions ──N chat_messages
users ──N audit_logs (actor)
users ──N usage_logs

api_providers ──N models
models ──N model_routing_rules
```

---

## 11. Scalability Notes

### 11.1 Partitioned Tables

| Table | Partition Strategy | Retention |
|-------|------------------|-----------|
| chat_messages | Monthly range on `created_at` | 90 days default, configurable per plan |
| audit_logs | Monthly range on `created_at` | 30/90/365 days per plan |
| usage_logs | Monthly range on `created_at` | 365 days (for billing) |
| system_logs | Daily range on `created_at` | 30 days auto-drop |

### 11.2 Indexing Strategy

- **All foreign keys**: B-tree indexes (mandatory)
- **All status columns**: B-tree indexes with partial index for active status
- **All timestamp columns used in queries**: B-tree DESC for chronological queries
- **Full-text search**: GIN index with `to_tsvector('persian', column)` for Persian content
- **Fuzzy search**: GIN index with `gin_trgm_ops` trigram
- **Vector search**: HNSW index with cosine distance
- **JSONB columns**: GIN indexes for columns queried with `@>`, `?`, `??` operators

### 11.3 Future Extensibility

- **Dedicated vector database**: When pgvector HNSW exceeds ~10M vectors, migrate to Qdrant or Milvus. The `knowledge_embeddings` table abstraction supports this.
- **Read replicas**: All read-heavy queries (dashboard, analytics) are directed to read replicas via query hints.
- **Sharding**: Tenant-level sharding is possible by adding a `shard_key` column to tenant tables. Not needed until single-node capacity is exceeded.
- **Event sourcing**: Audit logs provide a foundation for future event sourcing if needed.
- **Workspace databases (EAV)**: The `settings` JSONB columns on tenant entities support the EAV pattern for workspace-specific dynamic data. If structured workspace databases are needed in the future, a dedicated `workspace_data` table with EAV pattern can be added.