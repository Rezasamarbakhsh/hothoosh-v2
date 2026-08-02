# Phase 9 — Admin Panel

## HotHoosh Enterprise Admin Panel — Complete Design Specification

---

## 9.1 Overview

### 9.1.1 Purpose

The HotHoosh Admin Panel is the centralized management console for platform operators and organization administrators. It provides full visibility and control over every dimension of the platform: users, organizational hierarchies, AI agents, knowledge infrastructure, API integrations, billing, security, and system health. Every entity that exists in the HotHoosh ecosystem is observable, configurable, and auditable from this panel.

The admin panel is not a secondary feature bolted onto the main application. It is a first-class citizen of the architecture, sharing the same design system, component library, and RTL foundation as the user-facing workspace — but with its own layout paradigm, navigation model, and permission boundary. Admin users operate within a dedicated layout that prioritizes data density, batch operations, and cross-tenant visibility over the conversational, content-focused layout of the standard workspace.

### 9.1.2 Design Principles

| Principle | Description |
|-----------|-------------|
| **Persian-First RTL** | Every admin page renders RTL by default. All layouts, tables, forms, and data visualizations use CSS logical properties. No physical direction properties (`left`, `right`, `padding-left`) are used anywhere. |
| **Glass Enterprise** | The admin panel extends the core Glass Morphism design system with elevated data-density variants. Tables, stat cards, and dashboards use `glass-panel-elevated` and `glass-panel-data` surface tokens. |
| **Action-Oriented** | Every list page leads to a clear primary action (create, edit, configure). Every detail page exposes contextual actions inline. No dead-end pages. |
| **Audit-First** | Every mutation operation through the admin panel generates an audit log entry. Admins can see who changed what, when, and from where. |
| **Multi-Tenant Aware** | Super admins see all organizations. Org admins see their org and all children. Workspace admins see only their workspace. The UI adapts its scope controls accordingly. |
| **Progressive Disclosure** | Summary dashboards show high-level KPIs. Drill-down pages reveal granular data. Inline expanders reveal related entities without navigation. |
| **Batch Operations** | List views support multi-select with bulk actions (delete, reassign, export, change status). Selection persists across pagination. |

### 9.1.3 Access Control Matrix

The admin panel is gated by a dedicated permission namespace: `admin:*`. Access is determined by the intersection of the user's role hierarchy and the tenant scope they operate within.

| Role | Scope | Access Level |
|------|-------|-------------|
| **Super Admin** | All organizations | Full CRUD on all entities. System settings. Billing. Audit logs. |
| **Org Admin** | Own organization + descendants | Full CRUD on users, companies, brands, workspaces, agents within org scope. Read-only on billing. No system settings. |
| **Company Admin** | Own company + descendants | CRUD on users, brands, workspaces, agents within company scope. Read-only on org-level settings. |
| **Brand Admin** | Own brand + workspaces | CRUD on users, workspaces, agents within brand scope. |
| **Workspace Admin** | Own workspace | CRUD on workspace users, agents, knowledge, memory packs. |

Permission checks are enforced at two levels: **route-level** (middleware guards prevent navigation to unauthorized pages) and **component-level** (UI elements are conditionally rendered based on granular permissions like `admin:users:create`, `admin:billing:read`).

---

## 9.2 Admin Layout Architecture

### 9.2.1 Shell Structure

The admin panel uses a dedicated root layout (`/admin/layout.tsx`) that is completely separate from the main workspace layout. This ensures no CSS or state leakage between the two paradigms.

```
┌─────────────────────────────────────────────────────────────┐
│  Top Bar (fixed, h-14, glass-panel-solid)                   │
│  [Logo] [Tenant Scope Selector] [Search] [Notifications] [User Menu] │
├──────────┬──────────────────────────────────────────────────┤
│ Sidebar  │  Main Content Area                               │
│ (w-64,   │  (scrollable, p-6)                               │
│  fixed,  │                                                  │
│  glass-  │  ┌──────────────────────────────────────────┐    │
│  panel-  │  │  Breadcrumb Trail                         │    │
│  solid)  │  ├──────────────────────────────────────────┤    │
│          │  │  Page Header + Actions                    │    │
│          │  ├──────────────────────────────────────────┤    │
│  [Nav    │  │                                          │    │
│   Items] │  │  Page Content                             │    │
│          │  │  (tables, forms, dashboards)              │    │
│          │  │                                          │    │
│          │  │                                          │    │
│          │  └──────────────────────────────────────────┘    │
├──────────┴──────────────────────────────────────────────────┤
│  (no footer — content extends to bottom)                    │
└─────────────────────────────────────────────────────────────┘
```

### 9.2.2 Top Bar Components

| Component | Description |
|-----------|-------------|
| **Logo** | HotHoosh logo mark + wordmark. Links to `/admin/dashboard`. Clicking in non-super-admin context shows the current org name as a subtitle. |
| **Tenant Scope Selector** | A dropdown/combobox that filters all admin data to the selected tenant level. Options: `همه سازمان‌ها` (All Orgs), then each org/company/brand the user has admin access to. Changing scope reloads all data tables with the new tenant filter. |
| **Global Search** | Command-K powered search across all admin entities. Results grouped by entity type. Keyboard navigable. Shows recent searches. |
| **Notifications** | Bell icon with unread count badge. Dropdown shows system alerts (failed jobs, quota breaches, new org signups). |
| **User Menu** | Avatar + name. Dropdown: Profile, Preferences (theme toggle), Keyboard Shortcuts, Logout. Super admins see an additional "Enter Workspace" link to switch to the standard app. |

### 9.2.3 Sidebar Navigation

The sidebar uses a grouped navigation model with collapsible sections. Icons use the Phosphor icon set with RTL mirror support. Active state uses the `accent` color token with a `start` border indicator (logical property: `border-inline-start`).

```
● داشبورد (Dashboard)

━━ مدیریت کاربران (User Management) ━━
  ○ کاربران (Users)
  ○ نقش‌ها و دسترسی‌ها (Roles & Permissions)

━━ ساختار سازمانی (Org Structure) ━━
  ○ سازمان‌ها (Organizations)
  ○ شرکت‌ها (Companies)
  ○ برندها (Brands)

━━ هوش مصنوعی (AI) ━━
  ○ عوامل هوشمند (Agents)
  ○ بسته‌های حافظه (Memory Packs)
  ○ دانش (Knowledge)
  ○ تأمین‌کنندگان API (API Providers)
  ○ مدل‌ها (Models)

━━ عملیات (Operations) ━━
  ○ مصرف منابع (Usage)
  ○ صورتحساب (Billing)
  ○ لاگ‌های ممیزی (Audit Logs)
  ○ لاگ‌های سیستم (System Logs)

━━ تنظیمات (Settings) ━━
  ○ تنظیمات عمومی (General Settings)
  ○ تنظیمات امنیتی (Security Settings)
```

Navigation items are permission-gated. If a user lacks `admin:users:read`, the entire "User Management" group is hidden. Group headers collapse when all children are hidden, preventing orphaned section titles.

### 9.2.4 Breadcrumb Trail

Every admin page renders a breadcrumb trail below the top bar. The breadcrumb is constructed from the route segment hierarchy:

```
مدیریت > سازمان‌ها > [نام سازمان] > ویرایش
Admin  > Orgs       > [Org Name]   > Edit
```

The first segment is always "مدیریت" (Admin) and links to `/admin/dashboard`. Each subsequent segment maps to its parent route. The final segment is the current page title and is not a link. Breadcrumbs are generated automatically from the route tree using a `useBreadcrumbs()` hook that reads metadata from `layout.tsx` or `page.tsx` exports.

---

## 9.3 Dashboard Page

**Route**: `/admin/dashboard`
**Permission**: `admin:dashboard:read`
**Layout**: Full-width, no sidebar content panel.

### 9.3.1 Purpose

The admin dashboard is the operational command center. It provides a real-time overview of platform health, resource consumption, growth metrics, and actionable alerts. Every KPI card is a drill-down entry point that navigates to the corresponding detailed page.

### 9.3.2 KPI Summary Row

A horizontal row of 6 stat cards, each using the `glass-panel-data` surface token. Cards are equal-width on desktop, 2-column on tablet, stacked on mobile. Each card contains:

- **Icon** (Phosphor, 24px, accent color)
- **Label** (caption-sm, muted color)
- **Value** (heading-2xl, primary color)
- **Trend indicator** (badge: `↑ ۱۲٪` in green or `↓ ۳٪` in red, compared to previous period)
- **Click target**: Entire card is clickable, navigates to the relevant detail page.

| Card | Metric | Source | Drill-down Target |
|------|--------|--------|-------------------|
| کاربران فعال (Active Users) | Users with at least 1 session in last 30 days | `users` table | `/admin/users?status=active` |
| سازمان‌ها (Organizations) | Total org count | `organizations` table | `/admin/organizations` |
| مکالمات امروز (Conversations Today) | Chat sessions created today | `chat_sessions` table | `/admin/usage?tab=conversations` |
| مصرف توکن (Token Usage) | Total tokens consumed this month | Aggregated from `usage_logs` | `/admin/usage?tab=tokens` |
| عوامل فعال (Active Agents) | Agents with `status = active` | `agents` table | `/admin/agents?status=active` |
| درآمد ماهانه (Monthly Revenue) | Current billing cycle revenue | `invoices` table | `/admin/billing` |

### 9.3.3 Charts Row

Two charts side by side (60/40 split on desktop, stacked on mobile):

**Token Consumption Trend** (60%)
- Type: Area chart (ECharts)
- X-axis: Last 30 days, daily granularity
- Y-axis: Token count (formatted with Persian numerals and "هزار" / "میلیون" suffixes)
- Two series: Input tokens (filled area, accent-light) and Output tokens (filled area, accent-dark)
- Interaction: Hover shows tooltip with exact values. Click on a day navigates to `/admin/usage?date=YYYY-MM-DD`.
- Data source: TanStack Query hook `useTokenTrend({ range: '30d' })`

**Usage by Model Distribution** (40%)
- Type: Donut chart (ECharts)
- Segments: Top 5 models by usage, remainder grouped as "سایر" (Other)
- Center text: Total token count for the period
- Interaction: Click on a segment filters the token trend chart to that model only.
- Data source: TanStack Query hook `useModelDistribution({ range: '30d' })`

### 9.3.4 Recent Activity Feed

A vertical timeline of the 20 most recent significant events across the platform. Each entry shows:

- **Timestamp** (relative: "۲ ساعت پیش", Solar Hijri on hover)
- **Actor** (user avatar + display name, linked to user detail)
- **Action** (verb in Persian: "ایجاد کرد", "ویرایش کرد", "حذف کرد")
- **Target** (entity type icon + name, linked to entity detail)
- **Context badge** (org/company name, muted)

Events included: user created/deleted, org created, agent deployed, knowledge base uploaded, billing event, permission change. Data source: Audit log stream, polled every 30 seconds via TanStack Query with `refetchInterval: 30000`.

### 9.3.5 System Health Bar

A slim horizontal bar at the bottom of the dashboard showing 4 system health indicators as colored dots with labels:

| Indicator | Health Check | Green | Yellow | Red |
|-----------|-------------|-------|--------|-----|
| API Gateway | Response time < 200ms | < 200ms | 200-500ms | > 500ms |
| Database | Connection pool utilization | < 70% | 70-90% | > 90% |
| Queue System | BullMQ backlog count | < 100 | 100-1000 | > 1000 |
| Vector Store | pgvector query latency | < 50ms | 50-150ms | > 150ms |

Each dot is a clickable link that expands to show a 5-minute response time sparkline and current numeric values.

---

## 9.4 Users Page

**Route**: `/admin/users`
**Permission**: `admin:users:read` (list), `admin:users:create` (create), `admin:users:update` (edit), `admin:users:delete` (delete)
**Layout**: List page with filters, search, and bulk actions.

### 9.4.1 Purpose

The users page is the primary interface for managing all user accounts across the platform. It supports searching, filtering, sorting, bulk operations, and individual user management. For super admins, this shows all users across all organizations. For org admins, it shows users within their org scope.

### 9.4.2 Filter Bar

A horizontal filter bar with the following controls, all using shadcn components styled with the Glass Enterprise theme:

| Filter | Type | Options |
|--------|------|---------|
| جستجو (Search) | Search input | Searches across: display_name, email, phone_number. Debounced 300ms. |
| وضعیت (Status) | Multi-select combobox | فعال (Active), غیرفعال (Inactive), معلق (Suspended), در انتظار (Pending) |
| نقش (Role) | Multi-select combobox | Dynamically populated from `roles` table within current scope |
| سازمان (Organization) | Combobox | Populated based on tenant scope. Super admins see all orgs. |
| تاریخ ثبت‌نام (Registration Date) | Date range picker | Solar Hijri calendar. Uses `DatePickerRange` component. |
| آخرین ورود (Last Login) | Date range picker | Solar Hijri calendar. |

Filters are URL-search-param driven. Changing any filter updates the URL without full-page navigation (Next.js `useRouter().replace()` with `shallow: true`). Filters persist across page navigation within the users section. A "پاک کردن فیلترها" (Clear Filters) button resets all filters to defaults.

### 9.4.3 Data Table

A full-featured data table built on TanStack Table with the following columns:

| Column | Width | Content | Sortable | Description |
|--------|-------|---------|----------|-------------|
| ☐ (Checkbox) | 40px | Checkbox for row selection | No | Supports select-all on current page. Header checkbox shows indeterminate state when some rows selected. |
| آواتار + نام (Avatar + Name) | flex | User avatar (32px, rounded-full) + display_name (body-md, primary) + email (caption-sm, muted) | Yes (by name) | Avatar uses initials fallback. Name links to user detail page. |
| سازمان (Organization) | 150px | Organization name badge | Yes | Shows org name. If user belongs to multiple orgs, shows primary org + "+N" badge. |
| نقش (Role) | 120px | Role badge (colored by role level) | Yes | Org Admin = amber, Company Admin = blue, Brand Admin = purple, Workspace Admin = green, Member = gray. |
| وضعیت (Status) | 100px | Status dot + label | Yes | Active = green dot, Inactive = gray, Suspended = red, Pending = yellow. |
| آخرین ورود (Last Login) | 130px | Relative timestamp ("۲ روز پیش") + absolute on hover | Yes | "هرگز" (Never) if no login recorded. |
| تاریخ ثبت‌نام (Created) | 120px | Solar Hijri date | Yes | Formatted: "۱۴۰۵/۰۵/۱۱" |
| عملیات (Actions) | 80px | Icon buttons: View, Edit, More (dropdown) | No | More dropdown: Suspend, Delete, Reset Password, Impersonate (super admin only). |

**Pagination**: Bottom of table. Shows "نمایش ۱-۲۰ از ۱,۲۳۴ کاربر" (Showing 1-20 of 1,234 users). Page size selector: 10, 20, 50, 100. Previous/Next buttons with Persian labels.

**Empty State**: When no users match filters, shows a centered illustration (Phosphor `users` icon, large, muted) with the text "کاربری با این فیلترها یافت نشد" (No users found with these filters) and a "پاک کردن فیلترها" (Clear Filters) button.

### 9.4.4 Bulk Actions Bar

When one or more rows are selected, a fixed bar slides up from the bottom of the table showing:

- Selection count: "۳ کاربر انتخاب شده" (3 users selected)
- Action buttons: تغییر نقش (Change Role), تعلیق (Suspend), حذف (Delete), خروجی CSV (Export CSV)
- Clear selection button (X icon)

Bulk actions open a confirmation dialog before execution. Delete shows a warning dialog with the count. Role change opens a dialog with a role selector dropdown. Export triggers a server-side CSV generation job and shows a toast notification when the file is ready for download.

### 9.4.5 User Detail Page

**Route**: `/admin/users/[userId]`
**Layout**: Two-column layout (60/40 split). Main column shows user profile and activity. Side column shows related entities.

**Main Column — Profile Card**:
- Large avatar (80px) with upload capability (admin can set user avatar)
- Display name (editable inline on double-click)
- Email (with verified badge if confirmed)
- Phone number (with verified badge)
- Role badge + organization badge
- Status badge with toggle switch
- Created date (Solar Hijri, full format with time)
- Last login (IP address + user agent summary)

**Main Column — Activity Timeline**:
- Paginated list of the user's recent actions from audit logs
- Each entry: timestamp, action type icon, action description, target entity link
- Filterable by action type (login, create, update, delete, chat)

**Side Column — Memberships**:
- List of org/company/brand/workspace memberships
- Each entry: entity name, role, joined date, status
- "افزودن به سازمان" (Add to Organization) button opens a dialog

**Side Column — Usage Summary** (collapsible):
- Token usage this month (bar chart, last 30 days)
- Total conversations count
- Active agents used
- Knowledge bases accessed

**Side Column — Sessions** (collapsible):
- Active sessions list with device, IP, last activity
- "پایان تمام نشست‌ها" (Terminate All Sessions) button (requires confirmation)

### 9.4.6 Create/Edit User Dialog

A slide-over panel (400px width, from the start edge in RTL) with form fields:

| Field | Type | Validation |
|-------|------|------------|
| نام نمایشی (Display Name) | Text input | Required, 3-100 characters |
| ایمیل (Email) | Email input | Required, unique, valid email format |
| شماره تلفن (Phone) | Tel input | Optional, Iranian mobile format validation (09xxxxxxxxx) |
| رمز عبور (Password) | Password input (create only) | Required on create, min 8 chars, must include uppercase, lowercase, number, special char. Strength meter shown below. |
| سازمان (Organization) | Combobox | Required. Scoped to admin's accessible orgs. |
| نقش (Role) | Select | Required. Roles available depend on selected organization. |
| وضعیت (Status) | Toggle | Active/Inactive. Default: Active. |

Form submission triggers server-side validation, user creation/update, and audit log entry. On success, the dialog closes, the table refreshes, and a success toast appears.

---

## 9.5 Organizations Page

**Route**: `/admin/organizations`
**Permission**: `admin:orgs:read`, `admin:orgs:create`, `admin:orgs:update`, `admin:orgs:delete`
**Layout**: List page with search, filters, and create action.

### 9.5.1 Purpose

Manage all organizations on the platform. This is the top-level tenant entity. Each organization can contain multiple companies, which in turn contain brands and workspaces. This page is the entry point for the entire organizational hierarchy management.

### 9.5.2 Filter Bar

| Filter | Type | Options |
|--------|------|---------|
| جستجو (Search) | Search input | Searches: org name, slug, owner email |
| وضعیت (Status) | Select | فعال (Active), غیرفعال (Inactive), معلق (Suspended) |
| طرح (Plan) | Multi-select | Free, Pro, Enterprise (dynamically from `plans` table) |
| تاریخ ایجاد (Created) | Date range picker | Solar Hijri |

### 9.5.3 Data Table

| Column | Width | Content | Sortable |
|--------|-------|---------|----------|
| ☐ | 40px | Checkbox | No |
| نام سازمان (Name) | flex | Org logo (40px, rounded-lg) + name (body-md) + slug (caption-sm, muted) | Yes |
| مالک (Owner) | 150px | Owner avatar + name (linked to user detail) | Yes |
| طرح (Plan) | 100px | Plan badge (colored: Free=gray, Pro=blue, Enterprise=purple) | Yes |
| شرکت‌ها (Companies) | 100px | Company count with drill-down link | Yes |
| کاربران (Users) | 100px | User count | Yes |
| مصرف توکن (Token Usage) | 120px | This month's token usage, formatted | Yes |
| وضعیت (Status) | 100px | Status badge | Yes |
| ایجاد (Created) | 120px | Solar Hijri date | Yes |
| عملیات (Actions) | 80px | View, Edit, More (Suspend, Delete, Transfer Ownership) | No |

### 9.5.4 Organization Detail Page

**Route**: `/admin/organizations/[orgId]`
**Layout**: Tab-based detail page.

**Tabs**:

| Tab | Content |
|-----|---------|
| **نمای کلی (Overview)** | Org profile card (name, slug, logo, plan, status, created date). KPI row: total users, companies, brands, workspaces, agents, token usage. Owner info card with transfer ownership button. |
| **شرکت‌ها (Companies)** | Nested list of companies belonging to this org. Same table structure as the Companies page, filtered to this org. Inline create button. |
| **کاربران (Users)** | Nested list of users in this org. Same table as Users page, filtered to this org scope. |
| **تنظیمات (Settings)** | Org-level settings: name, slug, logo upload, default language, default theme (dark/light/system), allowed AI providers, custom domain configuration. |
| **صورتحساب (Billing)** | Org billing summary: current plan, usage vs quota, invoice history, payment methods. (Read-only for non-super-admins.) |
| **لاگ‌ها (Logs)** | Org-scoped audit log. Filters for actor, action type, date range. |

### 9.5.5 Create/Edit Organization Dialog

Slide-over panel with fields:

| Field | Type | Validation |
|-------|------|------------|
| نام سازمان (Name) | Text input | Required, 3-100 chars, unique |
| شناسه (Slug) | Text input (auto-generated from name, editable) | Required, 3-50 chars, alphanumeric + hyphen, unique |
| لوگو (Logo) | File upload | Optional. SVG, PNG, JPG. Max 2MB. Aspect ratio 1:1. Preview shown. |
| مالک (Owner) | User search combobox | Required. Search existing users or create new. |
| طرح (Plan) | Select | Required. Free, Pro, Enterprise. |
| وضعیت (Status) | Select | Active, Inactive. Default: Active. |
| توضیحات (Description) | Textarea | Optional, max 500 chars. |

---

## 9.6 Companies Page

**Route**: `/admin/companies`
**Permission**: `admin:companies:read`, `admin:companies:create`, `admin:companies:update`, `admin:companies:delete`
**Layout**: List page.

### 9.6.1 Purpose

Manage companies, which are the second level in the organizational hierarchy. Each company belongs to exactly one organization and can contain multiple brands.

### 9.6.2 Filter Bar

| Filter | Type | Options |
|--------|------|---------|
| جستجو (Search) | Search input | Company name, slug |
| سازمان (Organization) | Combobox | Populated based on scope |
| وضعیت (Status) | Select | Active, Inactive, Suspended |

### 9.6.3 Data Table

| Column | Width | Content | Sortable |
|--------|-------|---------|----------|
| ☐ | 40px | Checkbox | No |
| نام شرکت (Name) | flex | Company logo + name + slug | Yes |
| سازمان (Organization) | 150px | Org name badge (linked) | Yes |
| برندها (Brands) | 100px | Brand count | Yes |
| کاربران (Users) | 80px | User count | Yes |
| وضعیت (Status) | 100px | Status badge | Yes |
| عملیات (Actions) | 80px | View, Edit, Delete | No |

### 9.6.4 Company Detail Page

**Route**: `/admin/companies/[companyId]`
**Layout**: Tab-based. Tabs: Overview, Brands, Users, Settings, Logs.

**Overview tab** includes: company profile card (name, slug, logo, parent org, status, created date), KPI row (brands, users, workspaces, agents, token usage), and a hierarchical breadcrumb showing Org > Company.

**Settings tab** includes: name, slug, logo upload, default workspace settings (max agents, max knowledge bases, allowed models), notification preferences.

### 9.6.5 Create/Edit Company Dialog

| Field | Type | Validation |
|-------|------|------------|
| نام شرکت (Name) | Text input | Required, 3-100 chars |
| شناسه (Slug) | Text input (auto-generated) | Required, unique within org |
| سازمان (Organization) | Combobox | Required. Pre-filled if navigated from org detail. |
| لوگو (Logo) | File upload | Optional. Same constraints as org logo. |
| وضعیت (Status) | Select | Active, Inactive |
| توضیحات (Description) | Textarea | Optional, max 500 chars. |

---

## 9.7 Brands Page

**Route**: `/admin/brands`
**Permission**: `admin:brands:read`, `admin:brands:create`, `admin:brands:update`, `admin:brands:delete`
**Layout**: List page.

### 9.7.1 Purpose

Manage brands, the third level in the hierarchy. Each brand belongs to one company and represents a distinct product or service identity within the organization. Brands have their own visual identity settings and can contain multiple workspaces.

### 9.7.2 Filter Bar

| Filter | Type | Options |
|--------|------|---------|
| جستجو (Search) | Search input | Brand name, slug |
| شرکت (Company) | Combobox | Scoped to accessible companies |
| وضعیت (Status) | Select | Active, Inactive, Suspended |

### 9.7.3 Data Table

| Column | Width | Content | Sortable |
|--------|-------|---------|----------|
| ☐ | 40px | Checkbox | No |
| نام برند (Name) | flex | Brand logo + name + slug | Yes |
| شرکت (Company) | 150px | Company name badge | Yes |
| سازمان (Organization) | 120px | Org name (muted) | Yes |
| فضاهای کاری (Workspaces) | 100px | Workspace count | Yes |
| وضعیت (Status) | 100px | Status badge | Yes |
| عملیات (Actions) | 80px | View, Edit, Delete | No |

### 9.7.4 Brand Detail Page

**Route**: `/admin/brands/[brandId]`
**Layout**: Tab-based. Tabs: Overview, Workspaces, Users, Visual Identity, Settings, Logs.

**Visual Identity tab** is brand-specific and includes:
- Brand logo (upload, preview, crop to 1:1)
- Brand colors: primary color picker, secondary color picker, accent color picker. Each shows hex value and a preview swatch.
- Brand typography: heading font selector, body font selector (from a curated list of Persian-compatible fonts)
- Brand favicon upload
- Custom CSS injection area (textarea with syntax highlighting, limited to 5KB, sanitized on save)
- Live preview panel: a miniaturized workspace preview showing how the brand theme looks applied to a sample chat interface

### 9.7.5 Create/Edit Brand Dialog

| Field | Type | Validation |
|-------|------|------------|
| نام برند (Name) | Text input | Required, 3-100 chars |
| شناسه (Slug) | Text input (auto-generated) | Required, unique within company |
| شرکت (Company) | Combobox | Required. Pre-filled if navigated from company detail. |
| لوگو (Logo) | File upload | Optional. |
| رنگ اصلی (Primary Color) | Color picker | Required. Default: HotHoosh accent color. |
| وضعیت (Status) | Select | Active, Inactive |
| توضیحات (Description) | Textarea | Optional. |

---

## 9.8 Agents Page

**Route**: `/admin/agents`
**Permission**: `admin:agents:read`, `admin:agents:create`, `admin:agents:update`, `admin:agents:delete`
**Layout**: List page with grid view toggle.

### 9.8.1 Purpose

Manage AI agents across the platform. Agents are the core AI entities that users interact with. This page provides visibility into all agents, their configurations, performance metrics, and deployment status. Supports both list view (table) and grid view (cards) for different use cases.

### 9.8.2 View Toggle

A segmented control in the page header toggles between:
- **لیست (List)**: Standard data table with full columns
- **کارت (Card)**: Grid of agent cards (3-column on desktop, 2 on tablet, 1 on mobile)

### 9.8.3 Filter Bar

| Filter | Type | Options |
|--------|------|---------|
| جستجو (Search) | Search input | Agent name, description |
| نوع (Type) | Multi-select | Chat, RAG, Tool-use, Autonomous, Workflow |
| مدل (Model) | Multi-select | Dynamically from available models |
| وضعیت (Status) | Select | Active, Inactive, Draft, Deprecated |
| فضای کاری (Workspace) | Combobox | Scoped to accessible workspaces |
| برند (Brand) | Combobox | Scoped to accessible brands |

### 9.8.4 Data Table (List View)

| Column | Width | Content | Sortable |
|--------|-------|---------|----------|
| ☐ | 40px | Checkbox | No |
| نام (Name) | flex | Agent avatar (40px, rounded-xl, generated from name initials with gradient) + name + description (truncated, 2 lines) | Yes |
| نوع (Type) | 100px | Type badge (color-coded) | Yes |
| مدل (Model) | 120px | Model name badge | Yes |
| فضای کاری (Workspace) | 130px | Workspace name (linked) | Yes |
| مکالمات (Conversations) | 100px | Total conversation count | Yes |
| رضایت (Satisfaction) | 100px | Average user rating (1-5 stars, shown as filled stars) | Yes |
| وضعیت (Status) | 100px | Status badge with dot | Yes |
| عملیات (Actions) | 80px | View, Edit, Duplicate, More (Deactivate, Delete, Export Config) | No |

### 9.8.5 Agent Card (Grid View)

Each card uses `glass-panel-data` surface with:
- **Header**: Agent avatar (56px) + name (heading-md) + type badge
- **Body**: Description (body-sm, 3-line clamp), model badge, workspace badge
- **Footer**: Stats row — conversations count, satisfaction rating, status indicator. Action buttons: Edit, Duplicate, More.
- **Hover effect**: Subtle scale transform (1.02) + elevated shadow

### 9.8.6 Agent Detail Page

**Route**: `/admin/agents/[agentId]`
**Layout**: Two-column. Main column (65%) for configuration. Side column (35%) for metrics and relations.

**Main Column Tabs**:

| Tab | Content |
|-----|---------|
| **پیکربندی (Configuration)** | Full agent configuration form: name, description, type, model selection (with model comparison sidebar), system prompt (code editor with syntax highlighting, line numbers, max token count), temperature/top_p/max_tokens sliders, tool assignments, knowledge base bindings, memory pack bindings. |
| **ابزارها (Tools)** | List of assigned tools with enable/disable toggles. Add tool dialog. Tool parameter configuration. |
| **دانش (Knowledge)** | List of bound knowledge bases with relevance score thresholds. Drag to reorder priority. Add/remove knowledge bases. |
| **حافظه (Memory)** | Bound memory packs. Memory configuration: max context age, relevance threshold. |
| **مجوزها (Permissions)** | Agent-level permissions: which workspaces it can access, which users can invoke it, rate limits per user/per workspace. |
| **تست (Test)** | Interactive test console: chat input, model response stream, token usage display, latency measurement. Uses SSE for streaming. Includes a "تست سریع" (Quick Test) mode with predefined test prompts. |

**Side Column — Performance Metrics** (always visible):
- **Usage chart**: 7-day token consumption line chart
- **Latency chart**: P50/P95/P99 response latency over 7 days
- **Conversation volume**: Daily new conversations, 7-day bar chart
- **Error rate**: Percentage of failed interactions, 7-day trend

**Side Column — Relations** (collapsible sections):
- **Workspaces**: List of workspaces where this agent is available
- **Knowledge Bases**: Linked knowledge bases with binding date
- **Memory Packs**: Linked memory packs
- **Created by / Modified by**: User info with timestamps

### 9.8.7 Create Agent Wizard

A 4-step wizard dialog (full-screen overlay, not slide-over) for creating new agents:

| Step | Title | Fields |
|------|-------|--------|
| ۱ | **پایه (Basics)** | Name, description, type (with type-specific descriptions), avatar upload/generate |
| ۲ | **مدل و هوش (Model & Intelligence)** | Model selection (with comparison cards showing model specs: context window, cost per 1M tokens, speed benchmark), system prompt editor, temperature/top_p/frequency_penalty/presence_penalty sliders with live preview |
| ۳ | **ابزارها و دانش (Tools & Knowledge)** | Tool selection (categorized: search, code, data, communication), knowledge base binding (multi-select with drag-to-priority-order), memory pack selection |
| ۴ | **مجوزها و انتشار (Permissions & Publish)** | Workspace assignment (multi-select), user/group access, rate limits, publish immediately or save as draft |

Each step has Previous/Next navigation. Step indicators show progress. All data is cached in local state until the final step's "ایجاد عامل" (Create Agent) button is pressed. Navigation away from the wizard shows a confirmation dialog to prevent data loss.

---

## 9.9 Memory Packs Page

**Route**: `/admin/memory-packs`
**Permission**: `admin:memory:read`, `admin:memory:create`, `admin:memory:update`, `admin:memory:delete`
**Layout**: List page.

### 9.9.1 Purpose

Manage memory packs — pre-constructed bundles of contextual information that can be attached to agents or conversations. Memory packs provide persistent, reusable context that persists across sessions. This page allows admins to create, configure, and monitor memory packs across the platform.

### 9.9.2 Filter Bar

| Filter | Type | Options |
|--------|------|---------|
| جستجو (Search) | Search input | Memory pack name, description, tags |
| نوع (Type) | Multi-select | Context (custom context), Preference (user preferences), Knowledge (knowledge summary), System (system instructions) |
| وضعیت (Status) | Select | Active, Inactive, Draft |
| فضای کاری (Workspace) | Combobox | Scoped |

### 9.9.3 Data Table

| Column | Width | Content | Sortable |
|--------|-------|---------|----------|
| ☐ | 40px | Checkbox | No |
| نام (Name) | flex | Memory pack icon (brain icon, colored by type) + name + description (truncated) | Yes |
| نوع (Type) | 100px | Type badge (Context=blue, Preference=green, Knowledge=purple, System=amber) | Yes |
| حجم (Size) | 100px | Token count (formatted: "۱.۲K توکن") | Yes |
| عوامل متصل (Connected Agents) | 120px | Agent count with drill-down link | Yes |
| آخرین به‌روزرسانی (Last Updated) | 130px | Relative timestamp | Yes |
| وضعیت (Status) | 100px | Status badge | Yes |
| عملیات (Actions) | 80px | View, Edit, Duplicate, Delete | No |

### 9.9.4 Memory Pack Detail Page

**Route**: `/admin/memory-packs/[memoryPackId]`
**Layout**: Two-column. Main column for content. Side column for metadata and connections.

**Main Column — Content Editor**:
- Memory pack name (editable inline)
- Description (editable inline)
- Type selector
- **Content editor**: A rich text editor (based on Tiptap) for composing memory pack content. Supports: formatted text, lists, tables, code blocks, embedded variables (`{{user.name}}`, `{{workspace.name}}`), and markdown shortcuts. Max content size: 50K tokens (shown as a progress bar below the editor). Real-time token count display.
- **Variable reference panel**: Collapsible sidebar within the editor showing available template variables organized by category (user, workspace, org, system).

**Main Column — Version History** (tab):
- List of all versions with: version number, editor name, timestamp, change summary (auto-generated diff), rollback button
- Version comparison: side-by-side diff view between any two versions

**Side Column — Metadata**:
- Created by / Modified by
- Created date / Last modified date
- Token count (current vs. max)
- Tags (editable tag list with autocomplete)

**Side Column — Connections**:
- **Connected Agents**: List of agents using this memory pack. Click to navigate to agent detail.
- **Usage Statistics**: Times used in conversations (7-day chart), average contribution to context (token count).
- **Connected Knowledge Bases**: If memory pack was auto-generated from a knowledge base, shows the source.

### 9.9.5 Create/Edit Memory Pack Dialog

| Field | Type | Validation |
|-------|------|------------|
| نام (Name) | Text input | Required, 3-100 chars |
| توضیحات (Description) | Textarea | Optional, max 500 chars |
| نوع (Type) | Select | Context, Preference, Knowledge, System |
| محتوا (Content) | Rich text editor | Required, min 50 chars, max 50K tokens |
| برچسب‌ها (Tags) | Tag input | Optional, max 20 tags, max 30 chars each |
| وضعیت (Status) | Toggle | Active/Inactive. Default: Active. |

---

## 9.10 Knowledge Page

**Route**: `/admin/knowledge`
**Permission**: `admin:knowledge:read`, `admin:knowledge:create`, `admin:knowledge:update`, `admin:knowledge:delete`
**Layout**: List page with view toggle.

### 9.10.1 Purpose

Manage knowledge bases — the structured repositories of documents, files, and data that power RAG (Retrieval-Augmented Generation) for agents. This page handles the full lifecycle of knowledge bases: creation, document upload, processing status monitoring, chunk management, and performance analytics.

### 9.10.2 Filter Bar

| Filter | Type | Options |
|--------|------|---------|
| جستجو (Search) | Search input | Knowledge base name, description |
| نوع (Type) | Multi-select | Document, Web, API, Database, Hybrid |
| وضعیت پردازش (Processing Status) | Select | Ready, Processing, Failed, Empty |
| فضای کاری (Workspace) | Combobox | Scoped |

### 9.10.3 Data Table

| Column | Width | Content | Sortable |
|--------|-------|---------|----------|
| ☐ | 40px | Checkbox | No |
| نام (Name) | flex | Knowledge base icon (book icon, colored by type) + name + description (truncated) | Yes |
| نوع (Type) | 100px | Type badge | Yes |
| اسناد (Documents) | 80px | Document count | Yes |
| قطعات (Chunks) | 100px | Total chunk count (from pgvector) | Yes |
| حجم (Size) | 100px | Total storage size (formatted: "۱۲.۵ مگابایت") | Yes |
| وضعیت (Status) | 100px | Processing status badge (Ready=green, Processing=yellow spinner, Failed=red, Empty=gray) | Yes |
| آخرین پردازش (Last Processed) | 130px | Timestamp of last successful processing | Yes |
| عملیات (Actions) | 80px | View, Edit, More (Reprocess All, Delete, Export) | No |

### 9.10.4 Knowledge Base Detail Page

**Route**: `/admin/knowledge/[knowledgeBaseId]`
**Layout**: Tab-based detail page with a document upload zone.

**Header Section** (always visible):
- Knowledge base name, type badge, status badge
- KPI row: document count, chunk count, total size, last processed date
- Action buttons: Upload Documents, Reprocess All, Settings

**Tabs**:

| Tab | Content |
|-----|---------|
| **اسناد (Documents)** | Document list with: file name, file type icon, size, upload date, processing status (per-document), chunk count, actions (view chunks, reprocess, delete). Bulk upload via drag-and-drop zone (accepts: PDF, DOCX, TXT, MD, HTML, CSV, JSON). Upload progress bar with per-file status. |
| **قطعات (Chunks)** | Searchable, filterable list of all chunks. Each chunk shows: content preview (3-line truncation), source document name, chunk index, token count, embedding model used, metadata tags. Click to expand full chunk content. |
| **تنظیمات (Settings)** | Configuration form: name, description, chunking strategy (fixed-size, semantic, paragraph, heading-based), chunk size (slider, 200-2000 tokens, default 512), chunk overlap (slider, 0-500, default 100), embedding model selection, Persian NLP optimization toggle (normalization, stemming, stop-word removal), metadata extraction rules. |
| **تست جستجو (Search Test)** | Interactive search testing interface: query input, result count, retrieved chunks with relevance scores highlighted. Shows the RAG pipeline in action: query → embedding → vector search → reranking → top-K results. Includes advanced settings: top-K slider, similarity threshold slider, hybrid search weight (vector vs BM25) slider. |
| **عملکرد (Performance)** | Analytics: query latency distribution (P50/P95/P99 chart), most queried terms (word cloud), retrieval quality metrics (if user feedback is available), usage over time (queries per day chart). |
| **اتصالات (Connections)** | List of agents connected to this knowledge base. Agent name, connection date, relevance score threshold. Add/remove agent connections. |

### 9.10.5 Document Upload Flow

1. User clicks "آپلود اسناد" (Upload Documents) or drags files onto the upload zone
2. A dialog opens with a drag-and-drop area and a file list
3. Files are validated client-side: type check, size check (max 50MB per file), duplicate check
4. Files are uploaded to pre-signed S3 URLs (direct upload, not proxied through server)
5. After upload, each file enters a processing queue. Status updates via SSE:
   - `uploaded` → `extracting` → `chunking` → `embedding` → `indexed` → `ready`
   - Or `failed` with error reason
6. The document list updates in real-time as each file progresses through the pipeline
7. Failed documents show an error icon with a retry button and error detail expansion

### 9.10.6 Create Knowledge Base Dialog

| Field | Type | Validation |
|-------|------|------------|
| نام (Name) | Text input | Required, 3-100 chars |
| توضیحات (Description) | Textarea | Optional, max 500 chars |
| نوع (Type) | Select | Document, Web, API, Database, Hybrid |
| فضای کاری (Workspace) | Combobox | Required |
| استراتژی قطعه‌بندی (Chunking Strategy) | Select | Fixed-size, Semantic, Paragraph, Heading-based |
| اندازه قطعه (Chunk Size) | Slider | 200-2000, default 512 |
| همپوشانی (Overlap) | Slider | 0-500, default 100 |
| مدل تعبیه (Embedding Model) | Select | From available embedding models |
| بهینه‌سازی فارسی (Persian NLP) | Toggle | Default: On for Persian content |

---

## 9.11 API Providers Page

**Route**: `/admin/api-providers`
**Permission**: `admin:providers:read`, `admin:providers:create`, `admin:providers:update`, `admin:providers:delete`
**Layout**: List page.

### 9.11.1 Purpose

Manage AI API providers — the external services (OpenAI, Anthropic, Google, local models, etc.) that supply LLM capabilities to the platform. This page handles provider configuration, API key management, health monitoring, and model-to-provider routing rules.

### 9.11.2 Data Table

| Column | Width | Content | Sortable |
|--------|-------|---------|----------|
| ☐ | 40px | Checkbox | No |
| نام (Name) | flex | Provider logo (32px, from predefined set or custom upload) + provider name + base URL (caption-sm, muted) | Yes |
| نوع (Type) | 100px | Type badge: OpenAI-compatible, Anthropic, Google, Local, Custom | Yes |
| مدل‌ها (Models) | 100px | Model count with drill-down link | Yes |
| وضعیت (Status) | 100px | Health status dot (green=healthy, yellow=degraded, red=down, gray=unconfigured) | Yes |
| تأخیر (Latency) | 100px | P50 latency (last 24h) with trend indicator | Yes |
| نرخ خطا (Error Rate) | 100px | Error percentage (last 24h) | Yes |
| عملیات (Actions) | 80px | View, Edit, Test Connection, More (Disable, Delete) | No |

### 9.11.3 Provider Detail Page

**Route**: `/admin/api-providers/[providerId]`
**Layout**: Two-column. Main for config. Side for health and models.

**Main Column — Configuration**:
- Provider name, type, base URL
- Authentication: API key (masked, with reveal toggle and copy button), custom headers (key-value editor)
- Rate limits: requests per minute, tokens per minute, concurrent requests
- Timeout settings: connect timeout, read timeout, total timeout
- Retry policy: max retries, backoff multiplier, retryable status codes
- Fallback configuration: priority order, failover threshold (error count or error rate)

**Main Column — Models Tab**:
- List of models available through this provider
- Each model: name, display name, type (chat, embedding, image, audio), context window, cost per 1M input/output tokens, status (enabled/disabled)
- Add model button (pre-fills provider-specific defaults)
- Edit model: name, display name, capabilities, pricing, context window, custom parameters

**Side Column — Health Dashboard**:
- **Real-time health**: Current status dot + last check timestamp
- **Latency sparkline**: 1-hour latency trend (1-minute intervals)
- **Error rate sparkline**: 1-hour error rate trend
- **Uptime**: 30-day uptime percentage (large number, color-coded: >99.9% green, >99% yellow, <99% red)
- **Incident history**: List of recent incidents with start time, duration, resolution
- **Test Connection button**: Sends a lightweight test request (e.g., list models or a short completion) and shows response time, status, and any errors in a result card

### 9.11.4 Create/Edit Provider Dialog

| Field | Type | Validation |
|-------|------|------------|
| نام (Name) | Text input | Required, 3-100 chars |
| نوع (Type) | Select | OpenAI-compatible, Anthropic, Google, Local, Custom |
| آدرس پایه (Base URL) | URL input | Required, valid URL. Pre-filled for known provider types. |
| کلید API (API Key) | Password input (masked) | Required. Masked display. Show/hide toggle. |
| توضیحات (Description) | Textarea | Optional |
| محدودیت نرخ (Rate Limit - RPM) | Number input | Optional, default: provider default |
| محدودیت توکن (Token Limit - TPM) | Number input | Optional, default: provider default |
| تأخیر (Timeout - seconds) | Number input | Optional, default: 30 |

---

## 9.12 Models Page

**Route**: `/admin/models`
**Permission**: `admin:models:read`, `admin:models:create`, `admin:models:update`, `admin:models:delete`
**Layout**: List page with grid view toggle.

### 9.12.1 Purpose

Manage individual AI models available on the platform. While providers are the service endpoints, models are the specific AI capabilities exposed through those providers. This page provides a centralized view of all models, their configurations, costs, and usage patterns — regardless of which provider serves them.

### 9.12.2 Data Table

| Column | Width | Content | Sortable |
|--------|-------|---------|----------|
| ☐ | 40px | Checkbox | No |
| نام مدل (Model) | flex | Model icon (by type: chat=bubble, embedding=database, image=image, audio=speaker) + model name (monospace, body-md) + display name (caption-sm) | Yes |
| تأمین‌کننده (Provider) | 150px | Provider name badge | Yes |
| نوع (Type) | 100px | Type badge: Chat, Embedding, Image, Audio, Multimodal | Yes |
| پنجره زمینه (Context Window) | 120px | Formatted token count ("۱۲۸K") | Yes |
| هزینه ورودی (Input Cost) | 110px | Per 1M tokens ("$۲.۵۰") | Yes |
| هزینه خروجی (Output Cost) | 110px | Per 1M tokens ("$۱۰.۰۰") | Yes |
| مصرف (Usage) | 100px | Token usage this month (formatted) | Yes |
| وضعیت (Status) | 100px | Enabled/Disabled toggle | N/A (toggle) |
| عملیات (Actions) | 80px | Edit, More (Disable, View Provider) | No |

### 9.12.3 Model Detail Page

**Route**: `/admin/models/[modelId]`
**Layout**: Single column with side panel.

**Main Content — Model Profile**:
- Model name (monospace), display name, provider link, type badge
- Specification card: context window, max output tokens, supports streaming (yes/no), supports function calling (yes/no), supports vision (yes/no), supports Persian (manually tagged, yes/no)
- Pricing card: input cost, output cost, per-token cost calculation, estimated cost for common operations (1K chat, 10K RAG retrieval)

**Main Content — Usage Analytics** (tab):
- **Usage trend**: 30-day line chart (daily token consumption)
- **Usage by workspace**: Horizontal bar chart showing top 10 workspaces by token consumption
- **Usage by agent**: Horizontal bar chart showing top 10 agents
- **Cost breakdown**: Pie chart of input vs output token costs
- **Latency distribution**: Histogram of response latencies

**Main Content — Routing Rules** (tab):
- List of routing rules that affect this model
- Each rule: priority, condition (user tier, workspace type, agent type), fallback model
- Add/edit routing rule dialog
- Rule testing: input a mock request, see which model gets selected and why

**Side Panel — Quick Actions**:
- Enable/Disable toggle
- "Test Model" button → opens a mini chat interface for testing
- Connected agents count with drill-down link
- Connected knowledge bases (for embedding models) count
- Last 24h error rate with sparkline

### 9.12.4 Model Comparison View

Accessible from the Models list page via a "مقایسه مدل‌ها" (Compare Models) button (appears when 2+ models are selected in bulk mode). Opens a full-screen overlay with a side-by-side comparison table:

| Attribute | Model A | Model B | Model C |
|----------|---------|---------|--------|
| Context Window | 128K | 32K | 200K |
| Input Cost/1M | $2.50 | $0.50 | $15.00 |
| Output Cost/1M | $10.00 | $1.50 | $75.00 |
| Avg Latency | 1.2s | 0.4s | 3.1s |
| P95 Latency | 2.1s | 0.8s | 5.2s |
| Error Rate (24h) | 0.1% | 0.3% | 0.05% |
| Persian Support | ✓ | ✓ | ✓ |
| Function Calling | ✓ | ✓ | ✗ |
| Monthly Usage | 12.5M tokens | 45.2M tokens | 3.1M tokens |

---

## 9.13 Usage Page

**Route**: `/admin/usage`
**Permission**: `admin:usage:read`
**Layout**: Dashboard-style with tabs.

### 9.13.1 Purpose

Comprehensive resource consumption analytics. This page is the financial and operational lens into how platform resources are being consumed. It serves both operational teams (monitoring system health) and business teams (tracking costs and revenue).

### 9.13.2 Tabs

| Tab | Content |
|-----|---------|
| **نمای کلی (Overview)** | High-level dashboard with all key metrics |
| **توکن (Tokens)** | Token-level consumption analytics |
| **مکالمات (Conversations)** | Conversation-level analytics |
| **مدل‌ها (By Model)** | Usage broken down by model |
| **فضای کاری (By Workspace)** | Usage broken down by workspace |
| **خروجی (Export)** | Data export tools |

### 9.13.3 Overview Tab

**Date Range Selector** (top of page, persistent across tabs):
- Preset ranges: امروز (Today), ۷ روز (7 days), ۳۰ روز (30 days), ۹۰ روز (90 days), این ماه (This Month - Solar Hijri), ماه گذشته (Last Month), سفارشی (Custom)
- Custom range: Solar Hijri date range picker
- Tenant scope: respects the global tenant scope selector

**KPI Row** (4 cards):

| Metric | Description | Visualization |
|--------|-------------|---------------|
| مجموع توکن (Total Tokens) | Total tokens consumed in period | Large number + trend vs previous period |
| هزینه تخمینی (Estimated Cost) | Total estimated cost based on model pricing | Currency formatted (IRR/USD) + trend |
| مکالمات (Conversations) | Total conversation sessions in period | Count + trend |
| کاربران فعال (Active Users) | Unique users with at least 1 interaction | Count + trend |

**Charts**:

| Chart | Type | Description |
|-------|------|-------------|
| Token Consumption Trend | Area chart | Daily input/output token consumption over selected period |
| Cost Trend | Line chart | Daily estimated cost over selected period |
| Top Models by Usage | Horizontal bar chart | Top 10 models by token consumption |
| Usage by Hour | Heatmap | 24-hour x 7-day heatmap showing usage patterns |

### 9.13.4 Tokens Tab

- **Token consumption table**: Daily breakdown with columns: date (Solar Hijri), input tokens, output tokens, total tokens, estimated cost, conversations count, unique users
- **Token efficiency metrics**: Average tokens per conversation, average tokens per user, average cost per conversation
- **Token budget alerts**: If any workspace or org has a token budget configured, show budget vs actual consumption with progress bars

### 9.13.5 Conversations Tab

- **Conversations table**: Date, conversation ID, user, agent used, message count, total tokens, duration, satisfaction rating (if available)
- **Conversation funnel**: New → Active → Completed → Abandoned (conversion rates between stages)
- **Average conversation length**: Distribution histogram (message count buckets)
- **Top agents by conversations**: Bar chart

### 9.13.6 By Model Tab

- **Model usage table**: Model name, provider, input tokens, output tokens, total tokens, cost, conversation count, error count, avg latency
- **Model cost pie chart**: Proportional cost by model
- **Model usage trend**: Multi-line chart showing daily usage per model (top 5 + "Other")

### 9.13.7 By Workspace Tab

- **Workspace usage table**: Workspace name, org/company/brand hierarchy, users, conversations, tokens, cost
- **Workspace cost bar chart**: Top 20 workspaces by cost
- **Usage density heatmap**: Workspaces (rows) x days (columns), colored by token count

### 9.13.8 Export Tab

- **Export type selector**: Raw data (CSV/JSON), Aggregated report (PDF), Billing summary (CSV)
- **Granularity**: Hourly, Daily, Weekly, Monthly
- **Dimensions selector**: Checkboxes for which dimensions to include (model, workspace, user, agent, org)
- **Date range**: Inherited from main date range selector
- **Format**: CSV, JSON, Parquet
- **Export button**: Triggers server-side generation. Shows progress toast. Delivers file via download link when ready.

---

## 9.14 Audit Logs Page

**Route**: `/admin/audit-logs`
**Permission**: `admin:audit:read`
**Layout**: Full-width log viewer with advanced filtering.

### 9.14.1 Purpose

The audit log is the immutable record of all significant actions performed on the platform. It serves compliance, security investigation, and operational debugging purposes. Every mutation operation (create, update, delete) across all entities generates an audit log entry. Read operations are not logged (to avoid noise), except for sensitive reads (e.g., viewing billing information, exporting user data).

### 9.14.2 Filter Bar

| Filter | Type | Options |
|--------|------|---------|
| جستجو (Search) | Search input | Actor name, target entity name, details text |
| نوع رویداد (Event Type) | Multi-select | USER_CREATED, USER_UPDATED, USER_DELETED, ORG_CREATED, COMPANY_CREATED, BRAND_CREATED, AGENT_CREATED, AGENT_UPDATED, KNOWLEDGE_UPLOADED, PERMISSION_CHANGED, SETTINGS_UPDATED, LOGIN, LOGOUT, LOGIN_FAILED, BILLING_EVENT, API_KEY_ROTATED, EXPORT_DATA |
| عملگر (Actor) | User search combobox | Search by user name or email |
| دامنه (Scope) | Combobox | All, specific org/company/brand/workspace |
| سطح شدت (Severity) | Multi-select | INFO, WARNING, CRITICAL |
| تاریخ (Date Range) | Date range picker | Solar Hijri. Max range: 90 days. |
| آدرس IP (IP Address) | Text input | Filter by actor's IP address |

### 9.14.3 Log Table

| Column | Width | Content | Sortable |
|--------|-------|---------|----------|
| timestamp | 170px | Solar Hijri date + time ("۱۴۰۵/۰۵/۱۱ ۱۴:۳۰") | Yes (default desc) |
| severity | 80px | Colored badge: INFO=blue, WARNING=amber, CRITICAL=red | Yes |
| event_type | 130px | Event type badge (color-coded by category) | Yes |
| actor | 150px | Actor avatar (24px) + display name + email (caption-sm). Linked to user detail. | Yes |
| target | flex | Target entity type icon + entity name. Linked to entity detail if accessible. | No |
| details | flex | Truncated action description ("نام سازمان از 'X' به 'Y' تغییر کرد"). Expandable on click to show full JSON diff. | No |
| ip_address | 120px | Actor's IP address | No |
| scope | 120px | Org/company/brand badge path ("Org > Company > Brand") | Yes |

**Pagination**: Cursor-based (not offset-based) for performance on large datasets. "نمایش جدیدترین ۵۰ رویداد از ۱۲,۳۴۵" (Showing newest 50 of 12,345 events). Infinite scroll with a "بارگذاری بیشتر" (Load More) button.

### 9.14.4 Log Detail Expandable

Clicking any log row expands an inline detail panel below the row showing:

- **Full event description** (Persian, human-readable)
- **Changes diff** (if applicable): Before/After values in a side-by-side or unified diff format. Changed fields highlighted with accent color.
- **Request metadata**: User agent, IP address, geolocation (country/city from IP), session ID
- **Entity snapshot**: Full entity state at the time of the event (if configured to capture)

### 9.14.5 Audit Log Retention & Export

- **Retention**: Configurable per plan. Free: 30 days, Pro: 90 days, Enterprise: 365 days. Super admins can configure custom retention.
- **Export**: "خروجی لاگ‌ها" (Export Logs) button in the page header. Options: date range, event types, scope, format (CSV, JSON). Server-side generation, delivered as download.
- **Compliance**: A read-only compliance view that formats audit logs according to common regulatory requirements (timestamp, actor, action, target, outcome). Accessible via a "نمای تطبیق" (Compliance View) toggle.

---

## 9.15 Roles & Permissions Page

**Route**: `/admin/roles`
**Permission**: `admin:roles:read`, `admin:roles:create`, `admin:roles:update`, `admin:roles:delete`
**Layout**: Split view — role list (left, 30%) + permission matrix (right, 70%).

### 9.15.1 Purpose

Define and manage the RBAC (Role-Based Access Control) system. This page is where admins create custom roles, modify the permissions of existing roles, and visualize the full permission landscape. The split-view design allows simultaneous role selection and permission editing without navigation.

### 9.15.2 Role List Panel (Left)

A scrollable list of all roles within the current tenant scope. Each role item shows:

- Role name (body-md, primary color)
- Role level badge: System (amber, non-editable), Custom (blue, editable)
- User count: "۱۲ کاربر" (12 users)
- Click to select and load permissions in the right panel
- Selected state: `glass-panel-elevated` background + `start` border accent
- Actions: Edit (pencil icon), Duplicate, Delete (system roles cannot be deleted)
- "ایجاد نقش" (Create Role) button at the top of the list

**System Roles** (pre-defined, non-deletable, limited editing):
- Super Admin, Org Admin, Company Admin, Brand Admin, Workspace Admin, Member, Viewer

**Custom Roles** (user-created, fully editable, deletable):
- Any roles created by admins within the tenant scope

### 9.15.3 Permission Matrix (Right)

When a role is selected, the right panel displays a grouped permission matrix. Permissions are organized into resource categories, each expanded as a collapsible section:

| Resource Category | Permissions |
|-------------------|-------------|
| **کاربران (Users)** | users:create, users:read, users:update, users:delete, users:impersonate |
| **سازمان‌ها (Organizations)** | orgs:create, orgs:read, orgs:update, orgs:delete |
| **شرکت‌ها (Companies)** | companies:create, companies:read, companies:update, companies:delete |
| **برندها (Brands)** | brands:create, brands:read, brands:update, brands:delete |
| **عوامل (Agents)** | agents:create, agents:read, agents:update, agents:delete, agents:deploy, agents:test |
| **دانش (Knowledge)** | knowledge:create, knowledge:read, knowledge:update, knowledge:delete, knowledge:upload |
| **حافظه (Memory)** | memory:create, memory:read, memory:update, memory:delete |
| **API و مدل‌ها (API & Models)** | providers:read, providers:create, providers:update, models:read, models:configure |
| **مصرف (Usage)** | usage:read, usage:export |
| **صورتحساب (Billing)** | billing:read, billing:manage, billing:export |
| **لاگ‌ها (Logs)** | audit:read, audit:export, system-logs:read |
| **تنظیمات (Settings)** | settings:read, settings:update |
| **نقش‌ها (Roles)** | roles:create, roles:read, roles:update, roles:delete |

Each permission is a toggle switch. Grouped permissions support bulk toggle (toggle the group header to enable/disable all permissions in that category). The matrix shows:
- **Granted** (toggle on, green accent): Permission is explicitly granted
- **Denied** (toggle off): Permission is not granted
- **Inherited** (muted toggle, with parent role badge shown): Permission is inherited from a parent role in the hierarchy. Cannot be toggled off at this level (must be modified at the parent level).

### 9.15.4 Permission Hierarchy Visualization

A "نمودار سلسله‌مراتب" (Hierarchy Chart) toggle at the top of the permission panel switches to a visual tree view showing the role inheritance chain. Each node is a role, edges show inheritance, and the selected role is highlighted. Clicking a node navigates to that role's permissions. This uses a tree diagram component (not Mermaid — rendered as interactive DOM elements for better UX).

### 9.15.5 Create/Edit Role Dialog

| Field | Type | Validation |
|-------|------|------------|
| نام نقش (Role Name) | Text input | Required, 3-50 chars, unique within scope |
| توضیحات (Description) | Textarea | Optional, max 200 chars |
| نقش والد (Parent Role) | Select | Required. Selects the role this inherits from. All parent permissions are inherited. |
| سطح (Level) | Select | Org, Company, Brand, Workspace. Determines at which tenant level this role applies. |
| دسترسی‌ها (Permissions) | Permission matrix | Same matrix as detail view, interactive |

---

## 9.16 Settings Page

**Route**: `/admin/settings`
**Permission**: `admin:settings:read`, `admin:settings:update`
**Layout**: Vertical tabs (left sidebar within content area) + form sections.

### 9.16.1 Purpose

Platform-wide and organization-wide configuration. This is where super admins configure global system settings, and org admins configure their organization's settings. The page adapts its sections based on the user's admin level.

### 9.16.2 Settings Navigation (Vertical Tabs)

| Tab | Icon | Visibility |
|-----|------|------------|
| **عمومی (General)** | Gear | All admins |
| **امنیت (Security)** | Shield | All admins |
| **هوش مصنوعی (AI)** | Brain | All admins |
| **ایمیل (Email)** | Envelope | Org+ admins |
| **ذخیره‌سازی (Storage)** | Cloud | Org+ admins |
| **پیشرفته (Advanced)** | Wrench | Super admin only |

### 9.16.3 General Settings

| Setting | Type | Description |
|---------|------|-------------|
| نام پلتفرم (Platform Name) | Text input | Display name shown in UI. Default: "HotHoosh". |
| لوگو (Logo) | File upload | Platform logo. Max 2MB. SVG/PNG. |
| فاوآیکون (Favicon) | File upload | Browser tab icon. ICO/PNG. 32x32/64x64. |
| زبان پیش‌فرض (Default Language) | Select | فارسی (Persian), English. Default: فارسی. |
| تم پیش‌فرض (Default Theme) | Select | Dark, Light, System. Default: System. |
| تقویم (Calendar) | Select | Solar Hijri, Gregorian. Default: Solar Hijri. |
| منطقه زمانی (Timezone) | Select | Asia/Tehran default. Full IANA timezone list. |
| فرمت تاریخ (Date Format) | Select | Multiple Persian date format options. |
| فرمت عدد (Number Format) | Toggle | Persian numerals (۱۲۳) vs Western (123). |

### 9.16.4 Security Settings

| Setting | Type | Description |
|---------|------|-------------|
| سیاست رمز عبور (Password Policy) | Form group | Minimum length (default 8), require uppercase, require lowercase, require number, require special char, password expiration days (0=never), prevent password reuse (last N passwords). |
| احراز هویت دو عاملی (2FA) | Toggle + config | Enable/disable organization-wide 2FA. Allowed methods: TOTP, SMS. |
| سیاست نشست (Session Policy) | Form group | Maximum session duration (hours), concurrent sessions allowed, idle timeout (minutes), remember-me duration (days). |
| محدودیت نرخ ورود (Login Rate Limit) | Number inputs | Max login attempts per minute per IP, max login attempts per account per hour, lockout duration (minutes). |
| لیست سفید IP (IP Whitelist) | Tag input | Optional. If non-empty, only these IPs can access the admin panel. |
| هدرهای امنیتی (Security Headers) | Toggle group | CSP, HSTS, X-Frame-Options, X-Content-Type-Options. Each individually toggleable. |
| رمزنگاری (Encryption) | Info display | Shows current encryption status: data at rest (AES-256), data in transit (TLS 1.3), key rotation date. |

### 9.16.5 AI Settings

| Setting | Type | Description |
|---------|------|-------------|
| مدل پیش‌فرض (Default Model) | Select | Default model for new agents. From available chat models. |
| مدل تعبیه پیش‌فرض (Default Embedding Model) | Select | Default for new knowledge bases. |
| حداکثر توکن پاسخ (Max Response Tokens) | Slider | Global max tokens for any single AI response. 100-16000, default 4096. |
| بودجه توکن پیش‌فرض (Default Token Budget) | Number input | Default context allocation strategy: knowledge %, history %, memory %, tool %. Must sum to 100. |
| فعال‌سازی جریانی (Streaming) | Toggle | Enable/disable SSE streaming globally. |
| بهینه‌سازی فارسی (Persian Optimization) | Toggle | Global default for Persian NLP optimization in RAG pipelines. |
| ذخیره مکالمات (Conversation Retention) | Number input | Days to retain completed conversations. Default: 90. 0 = indefinite. |
| حساسیت محتوا (Content Safety) | Toggle + config | Enable content moderation. Severity threshold (low/medium/high). Blocked categories. |

### 9.16.6 Email Settings (Org+ Admins)

| Setting | Type | Description |
|---------|------|-------------|
| تأمین‌کننده SMTP (SMTP Provider) | Select | Built-in (HotHoosh), Custom SMTP |
| میزبان SMTP (SMTP Host) | Text input | Required if Custom. |
| پورت SMTP (SMTP Port) | Number input | Default: 587. |
| رمز عبور SMTP (SMTP Password) | Password input | Masked. |
| فرستنده پیش‌فرض (Default From) | Email input | "noreply@hotHoosh.ir" format. |
| نام فرستنده (From Name) | Text input | Display name for email sender. |
| الگوهای ایمیل (Email Templates) | Template list | List of system email templates (welcome, password reset, invitation, etc.). Each template editable with subject + body (HTML). Variables available: `{{user.name}}`, `{{org.name}}`, `{{link}}`, etc. |
| تست ارسال (Send Test) | Button + form | Sends a test email to the admin's address to verify SMTP configuration. |

### 9.16.7 Storage Settings (Org+ Admins)

| Setting | Type | Description |
|---------|------|-------------|
| تأمین‌کننده (Provider) | Select | S3-compatible, Local filesystem, Azure Blob, GCS |
| تنظیمات اتصال (Connection) | Form group | Endpoint URL, access key, secret key, bucket name (masked fields). |
| آزمایش اتصال (Test Connection) | Button | Verifies storage connectivity and permissions. |
| محدودیت آپلود (Upload Limits) | Form group | Max file size per upload (default 50MB), max total storage per workspace (configurable, default 10GB), allowed file types. |
| پشتیبان‌گیری (Backup) | Info + config | Last backup timestamp, backup frequency (daily/weekly), retention count. Manual backup trigger button. |

### 9.16.8 Advanced Settings (Super Admin Only)

| Setting | Type | Description |
|---------|------|-------------|
| حالت تعمیر (Maintenance Mode) | Toggle + message | Enable/disable. Custom maintenance message (shown to all non-admin users). |
| نسخه API (API Versioning) | Select | Current API version, deprecation policy. |
| صف وظایف (Queue Configuration) | Form group | BullMQ connection details, max concurrency per queue, retry limits. |
| پایگاه داده (Database) | Info display | Connection pool status, table sizes, index usage stats, vacuum status. Read-only. |
| کش (Cache) | Form group | Redis connection, default TTL, cache warming strategy. |
| جستجو (Search) | Form group | Elasticsearch/Meilisearch connection (if configured), index settings. |
| وب‌هوک (Webhooks) | List + CRUD | Outgoing webhook configurations: URL, events subscribed, secret, retry policy, last delivery status. |
| متغیرهای محیطی (Environment Variables) | Key-value list | Read-only display of non-sensitive environment variables. Sensitive values shown as "••••••••". |

All settings forms include a **«ذخیره تغییرات»** (Save Changes) button at the bottom of each section. Changes are saved via PATCH request. A toast notification confirms success. A **«بازنشانی به پیش‌فرض»** (Reset to Default) button is available for each section (with confirmation dialog). Unsaved changes trigger a warning when navigating away.

---

## 9.17 Billing Page

**Route**: `/admin/billing`
**Permission**: `admin:billing:read`, `admin:billing:manage`
**Layout**: Dashboard-style with tabs.

### 9.17.1 Purpose

Manage billing, subscriptions, invoices, and payment methods. This page serves two audiences: (1) Super admins who see platform-wide revenue and all org billing, and (2) Org admins who see their own organization's billing. The page adapts its scope accordingly.

### 9.17.2 Tabs

| Tab | Content |
|-----|---------|
| **نمای کلی (Overview)** | Billing dashboard with key financial metrics |
| **طرح‌ها (Plans)** | Plan configuration and management |
| **فاکتورها (Invoices)** | Invoice list and detail |
| **روش‌های پرداخت (Payment Methods)** | Payment method management |
| **تراکنش‌ها (Transactions)** | Transaction history |

### 9.17.3 Overview Tab

**Current Period KPI Row** (4 cards):

| Metric | Description |
|--------|-------------|
| درآمد (Revenue) | Current billing cycle total revenue. Trend vs last period. |
| سازمان‌های فعال (Active Subscriptions) | Count of orgs with active subscriptions. |
| درآمد متوسط هر سازمان (ARPU) | Average revenue per organization. |
| تراکنش‌های معوق (Outstanding) | Total unpaid invoice amount. |

**Revenue Trend Chart**: Monthly recurring revenue (MRR) over last 12 months. Line chart with area fill.

**Plan Distribution**: Donut chart showing org distribution across plans (Free/Pro/Enterprise).

**Upcoming Renewals**: Table of next 10 subscription renewals with: org name, plan, renewal date, estimated amount.

### 9.17.4 Plans Tab (Super Admin Only)

A configuration interface for subscription plans:

**Plan Cards** (horizontal layout, one card per plan):

For each plan (Free, Pro, Enterprise, and any custom plans):
- Plan name, display name, description
- **Pricing**: Monthly price, annual price (with discount percentage badge)
- **Limits table**:
  
  | Resource | Free | Pro | Enterprise |
  |----------|------|-----|----------|
  | Users | 5 | 50 | Unlimited |
  | Workspaces | 1 | 10 | Unlimited |
  | Agents | 2 | 25 | Unlimited |
  | Knowledge Bases | 1 | 10 | Unlimited |
  | Token Budget (monthly) | 100K | 5M | Custom |
  | Storage | 1GB | 50GB | Custom |
  | Custom Models | No | Yes | Yes |
  | Priority Support | No | Yes | Yes |
  | SSO/SAML | No | No | Yes |
  | SLA | None | 99.5% | 99.9% |
  | Audit Retention | 30 days | 90 days | 365 days |

- **Actions**: Edit Plan, View Subscribers (count + link to filtered org list)

**Create Plan**: Button to add custom plans with the same limit configuration interface.

### 9.17.5 Invoices Tab

**Invoice List Table**:

| Column | Content |
|--------|---------|
| شماره فاکتور (Invoice #) | Auto-generated invoice number (e.g., "INV-1405-0042") |
| سازمان (Organization) | Org name (linked to org detail). Super admins see all; org admins see only their org. |
| مبلغ (Amount) | Invoice amount in IRR, formatted with commas |
| وضعیت (Status) | Badge: Paid (green), Pending (yellow), Overdue (red), Cancelled (gray) |
| تاریخ صدور (Issued) | Solar Hijri date |
| تاریخ سررسید (Due Date) | Solar Hijri date |
| عملیات (Actions) | View Detail, Download PDF, Send Reminder (for pending/overdue), Mark as Paid |

**Invoice Detail** (slide-over panel):
- Invoice header: number, status, issued date, due date
- Bill-to: org name, address, tax ID
- Line items table: description, quantity, unit price, amount
- Subtotal, tax, total
- Payment history: date, method, amount, reference ID
- Notes/internal memo (admin-only, not shown to customer)

### 9.17.6 Payment Methods Tab (Org Admin View)

- **Current payment methods**: Cards/bank accounts on file. Each shows: type icon, last 4 digits, expiry, default badge, actions (set default, remove).
- **Add payment method**: Dialog with payment integration (gateway-specific form fields).
- **Billing address**: Editable billing address form.

### 9.17.7 Transactions Tab

- **Transaction table**: Date, transaction ID, org, amount, method (credit card, bank transfer, wallet), status (success, failed, refunded), invoice reference.
- **Filters**: Date range, org (super admin), status, method, min/max amount.
- **Transaction detail**: Expandable row showing full transaction metadata.

---

## 9.18 System Logs Page

**Route**: `/admin/logs`
**Permission**: `admin:system-logs:read`
**Layout**: Full-width log viewer with real-time streaming.

### 9.18.1 Purpose

Technical system logs for platform operators. Unlike audit logs (which record user actions), system logs capture application-level events: errors, warnings, info messages from all backend services. This page is primarily used by DevOps and engineering teams for debugging and monitoring.

### 9.18.2 Log Stream Controls

| Control | Description |
|---------|-------------|
| **جریان زنده (Live Stream)** | Toggle to enable real-time log streaming via SSE. When enabled, new log entries appear at the top of the list as they arrive. Auto-scroll toggle available. |
| **مکث (Pause)** | Pause the stream to inspect current logs without new entries pushing content. |
| **فیلتر سطح (Level Filter)** | Multi-select: DEBUG, INFO, WARN, ERROR, FATAL. Default: WARN + ERROR. |
| **فیلتر سرویس (Service Filter)** | Multi-select: api-gateway, auth-service, llm-router, context-engine, rag-engine, memory-engine, tool-engine, streaming-engine, queue-worker, scheduler. |
| **جستجو (Search)** | Text input with debounce. Searches log message content. Supports simple wildcards. |
| **بازه زمانی (Time Range)** | Preset: Last 15min, 1h, 6h, 24h, 7d. Custom range with datetime pickers. |

### 9.18.3 Log Entries

Each log entry is rendered as a single-line row with expandable detail:

- **Timestamp**: ISO 8601 with milliseconds ("2025-08-02T14:30:00.123Z") + relative time ("۳۰ ثانیه پیش")
- **Level**: Color-coded badge: DEBUG=gray, INFO=blue, WARN=amber, ERROR=red, FATAL=purple (with pulsing animation)
- **Service**: Service name badge
- **Message**: Log message (truncated to 200 chars in row view, full text in expanded view)
- **Expand**: Click to show full message, stack trace (for ERROR/FATAL), request ID, trace ID, metadata key-value pairs

**Error entries** (ERROR and FATAL) are visually emphasized: red-tinted row background, bold message text. These can be filtered to show only errors using the level filter.

### 9.18.4 Log Detail Panel

Expanding a log entry reveals:

- **Full message**: Untruncated log message with syntax highlighting for stack traces
- **Context**: Request ID, trace ID, session ID (if available)
- **Metadata**: Key-value pairs attached to the log entry (e.g., `user_id`, `org_id`, `model`, `latency_ms`)
- **Stack trace** (ERROR/FATAL only): Formatted, syntax-highlighted stack trace with clickable file paths
- **Related logs**: Button to search for other logs with the same request ID or trace ID
- **Copy button**: Copy full log entry as JSON

### 9.18.5 Log Analytics Panel

A collapsible analytics panel at the top of the page (toggle via "تحلیل‌ها" button) shows:

- **Error rate trend**: 24-hour line chart of error rate (errors/minute)
- **Error distribution by service**: Donut chart
- **Top error messages**: List of top 10 most frequent error messages with count and trend (increasing/decreasing/stable)
- **Latency percentiles**: P50/P95/P99 across all services, 24-hour trend

---

## 9.19 Shared UI Components

The following reusable components are shared across all admin pages. These are part of the core component library (not page-specific).

### 9.19.1 DataTable Component

A wrapper around TanStack Table that provides consistent table behavior across all admin list pages. Features:

- Column definition with type-safe typing via generics
- Built-in sorting (single and multi-column)
- Built-in pagination (offset and cursor-based)
- Built-in row selection (checkbox column, select-all, bulk actions bar)
- Built-in empty state with customizable icon, message, and action button
- Built-in loading skeleton (row-based, not full-page spinner)
- Column visibility toggle (dropdown in table header)
- Responsive: horizontal scroll on mobile with sticky first column and action column
- Row click handler (configurable: navigate, expand, select)
- Row virtualization for large datasets (via `@tanstack/react-virtual`)

### 9.19.2 FilterBar Component

A composable filter component that renders a horizontal row of filter controls. Features:

- Auto-layout: filters wrap to next line on narrow screens
- URL synchronization: each filter maps to a URL search param
- Debounced search inputs (300ms default)
- Clear all filters button
- Active filter count badge (shown on the filter bar toggle when collapsed on mobile)
- Collapsible on mobile: filters hidden behind a "فیلترها" (Filters) button that expands the bar

### 9.19.3 SlideOver Component

A panel that slides in from the `start` edge (right in RTL, left in LTR). Used for create/edit forms. Features:

- Configurable width (400px default, 600px for complex forms)
- Overlay backdrop with click-to-close
- Header with title, subtitle, and close button
- Scrollable body content
- Optional footer with action buttons (primary + secondary)
- Close on Escape key
- Focus trap within the panel
- Animate in/out with CSS transitions (200ms ease-out)

### 9.19.4 DetailPageLayout Component

A layout wrapper for detail pages. Features:

- Back button (navigates to parent list page)
- Breadcrumb trail (auto-generated from route)
- Page header with title, status badge, and primary action buttons
- Tab navigation (horizontal, scrollable on mobile)
- Content area (rendered by active tab)
- Side panel slot (optional, for metrics/relations)

### 9.19.5 StatusBadge Component

A reusable badge for displaying entity status. Variants:

- `active`: Green dot + "فعال" text
- `inactive`: Gray dot + "غیرفعال" text
- `suspended`: Red dot + "معلق" text
- `pending`: Yellow dot + "در انتظار" text
- `processing`: Yellow pulsing dot + "در حال پردازش" text
- `failed`: Red dot + "ناموفق" text
- `draft`: Gray outline + "پیش‌نویس" text

### 9.19.6 StatCard Component

KPI card for dashboard pages. Features:

- Icon (Phosphor icon, configurable size and color)
- Label (caption-sm, muted)
- Value (heading-2xl, primary color, supports formatted numbers with Persian numerals)
- Trend indicator (badge with arrow + percentage, green for up, red for down, gray for neutral)
- Click handler (navigates to drill-down page)
- Loading skeleton state
- Glass panel surface variant configurable (`glass-panel-data` default)

### 9.19.7 ConfirmationDialog Component

A modal dialog for confirming destructive or significant actions. Features:

- Title (required)
- Description (required, supports rich text for highlighting key info like entity names)
- Severity level: `danger` (red accent, used for delete), `warning` (amber, used for suspend), `info` (blue, used for export)
- Confirmation text input: For high-risk actions (delete, bulk delete), the user must type the entity name or a confirmation phrase ("حذف") to proceed
- Primary action button (label configurable, e.g., "حذف", "تعلیق", "خروجی") with loading state
- Secondary button (cancel/close)
- Loading state: disables both buttons, shows spinner on primary
- Full keyboard navigation: Tab between buttons, Enter to confirm, Escape to cancel

### 9.19.8 EmptyState Component

A centered empty state for tables and pages. Features:

- Icon (Phosphor icon, large size, muted color)
- Title (heading-md, muted color)
- Description (body-sm, muted color, optional)
- Primary action button (optional, e.g., "ایجاد اولین عامل" — Create your first agent)
- Secondary action link (optional, e.g., "بیشتر بدانید" — Learn more)
- Illustration support: optional SVG illustration above the icon for key empty states (first user, first agent, no search results)

### 9.19.9 DatePicker Component

A Solar Hijri date picker built on top of a modified calendar library. Features:

- Solar Hijri calendar grid with Persian month/day names
- Single date and date range modes
- Input field that accepts typed dates (with format validation)
- Dropdown calendar panel positioned below the input
- Today button to quickly jump to today's date
- Min/max date constraints (configurable per use case)
- Persian numeral display option
- Jalaali-JS integration for date conversion
- RTL-aware positioning and keyboard navigation

### 9.19.10 CommandPalette Component (Command-K)

A global command palette triggered by `Cmd+K` / `Ctrl+K`. Features:

- Fuzzy search across all admin entities (users, orgs, agents, knowledge bases, etc.)
- Grouped results by entity type with count badges
- Recent searches (persisted in localStorage, max 10)
- Quick actions: "ایجاد کاربر جدید" (Create new user), "ایجاد عامل" (Create agent), etc.
- Navigation actions: type a page name to navigate (e.g., "تنظیمات" → Settings)
- Keyboard navigation: arrow keys to move, Enter to select, Escape to close
- Icons for each result type (matching sidebar navigation icons)
- Accessible: focus trap, ARIA labels, screen reader announcements

---

## 9.20 Admin Route Map

Complete route tree for the admin panel, showing all pages and their permission requirements.

```
/admin
├── /dashboard                          [admin:dashboard:read]
├── /users
│   ├── /                                [admin:users:read]        (list)
│   ├── /create                          [admin:users:create]      (slide-over)
│   └── /[userId]
│       └── /                            [admin:users:read]        (detail)
├── /roles
│   ├── /                                [admin:roles:read]        (split view)
│   ├── /create                          [admin:roles:create]      (dialog)
│   └── /[roleId]
│       └── /                            [admin:roles:read]        (split view, selected)
├── /organizations
│   ├── /                                [admin:orgs:read]         (list)
│   ├── /create                          [admin:orgs:create]       (slide-over)
│   └── /[orgId]
│       ├── /                            [admin:orgs:read]         (detail)
│       ├── /companies                   [admin:companies:read]    (nested list)
│       ├── /users                       [admin:users:read]        (nested list)
│       ├── /settings                    [admin:orgs:update]       (form)
│       ├── /billing                     [admin:billing:read]      (billing summary)
│       └── /logs                        [admin:audit:read]        (nested audit log)
├── /companies
│   ├── /                                [admin:companies:read]    (list)
│   ├── /create                          [admin:companies:create]  (slide-over)
│   └── /[companyId]
│       ├── /                            [admin:companies:read]    (detail)
│       ├── /brands                      [admin:brands:read]       (nested list)
│       ├── /users                       [admin:users:read]        (nested list)
│       ├── /settings                    [admin:companies:update]  (form)
│       └── /logs                        [admin:audit:read]        (nested audit log)
├── /brands
│   ├── /                                [admin:brands:read]       (list)
│   ├── /create                          [admin:brands:create]     (slide-over)
│   └── /[brandId]
│       ├── /                            [admin:brands:read]       (detail)
│       ├── /workspaces                  [admin:workspaces:read]   (nested list)
│       ├── /users                       [admin:users:read]        (nested list)
│       ├── /identity                    [admin:brands:update]     (visual identity)
│       ├── /settings                    [admin:brands:update]     (form)
│       └── /logs                        [admin:audit:read]        (nested audit log)
├── /agents
│   ├── /                                [admin:agents:read]       (list/grid)
│   ├── /create                          [admin:agents:create]     (wizard)
│   └── /[agentId]
│       ├── /                            [admin:agents:read]       (detail)
│       ├── /tools                       [admin:agents:update]     (tools tab)
│       ├── /knowledge                   [admin:agents:update]     (knowledge tab)
│       ├── /memory                      [admin:agents:update]     (memory tab)
│       ├── /permissions                 [admin:agents:update]     (permissions tab)
│       └── /test                        [admin:agents:test]       (test console)
├── /memory-packs
│   ├── /                                [admin:memory:read]       (list)
│   ├── /create                          [admin:memory:create]     (dialog)
│   └── /[memoryPackId]
│       ├── /                            [admin:memory:read]       (detail)
│       └── /versions                    [admin:memory:read]       (version history)
├── /knowledge
│   ├── /                                [admin:knowledge:read]    (list/grid)
│   ├── /create                          [admin:knowledge:create]  (dialog)
│   └── /[knowledgeBaseId]
│       ├── /                            [admin:knowledge:read]    (detail)
│       ├── /documents                   [admin:knowledge:read]    (documents tab)
│       ├── /chunks                      [admin:knowledge:read]    (chunks tab)
│       ├── /settings                    [admin:knowledge:update]  (settings tab)
│       ├── /search-test                 [admin:knowledge:read]    (search test tab)
│       ├── /performance                 [admin:knowledge:read]    (performance tab)
│       └── /connections                 [admin:knowledge:update]  (connections tab)
├── /api-providers
│   ├── /                                [admin:providers:read]    (list)
│   ├── /create                          [admin:providers:create]  (slide-over)
│   └── /[providerId]
│       ├── /                            [admin:providers:read]    (detail)
│       └── /models                      [admin:models:read]       (models tab)
├── /models
│   ├── /                                [admin:models:read]       (list/grid)
│   ├── /compare                         [admin:models:read]       (comparison view)
│   └── /[modelId]
│       ├── /                            [admin:models:read]       (detail)
│       ├── /usage                       [admin:models:read]       (usage tab)
│       └── /routing                     [admin:models:configure]  (routing tab)
├── /usage
│   ├── /                                [admin:usage:read]        (overview tab)
│   ├── /tokens                          [admin:usage:read]        (tokens tab)
│   ├── /conversations                   [admin:usage:read]        (conversations tab)
│   ├── /models                          [admin:usage:read]        (by model tab)
│   ├── /workspaces                      [admin:usage:read]        (by workspace tab)
│   └── /export                          [admin:usage:export]      (export tab)
├── /audit-logs
│   └── /                                [admin:audit:read]        (log viewer)
├── /billing
│   ├── /                                [admin:billing:read]      (overview tab)
│   ├── /plans                           [admin:billing:manage]    (plans tab)
│   ├── /invoices                        [admin:billing:read]      (invoices tab)
│   ├── /payment-methods                 [admin:billing:manage]    (payment methods tab)
│   └── /transactions                    [admin:billing:read]      (transactions tab)
├── /logs
│   └── /                                [admin:system-logs:read]  (log stream)
└── /settings
    ├── /general                         [admin:settings:read]     (general settings)
    ├── /security                        [admin:settings:read]     (security settings)
    ├── /ai                              [admin:settings:read]     (AI settings)
    ├── /email                           [admin:settings:read]     (email settings)
    ├── /storage                         [admin:settings:read]     (storage settings)
    └── /advanced                        [admin:settings:read]     (advanced settings, super admin)
```

---

## 9.21 Permission Taxonomy

Complete list of all admin permissions organized by resource. These are the permission strings stored in the `permissions` table and checked by both route guards and component-level access controls.

### 9.21.1 Permission Naming Convention

All admin permissions follow the pattern: `admin:{resource}:{action}`

- `resource`: plural noun (users, orgs, companies, brands, agents, memory, knowledge, providers, models, usage, billing, audit, system-logs, settings, roles)
- `action`: one of `read`, `create`, `update`, `delete`, `export`, `manage`, `test`, `deploy`, `impersonate`

### 9.21.2 Full Permission List

| Permission | Description | Default Roles |
|-----------|-------------|---------------|
| `admin:dashboard:read` | Access admin dashboard | All admin roles |
| `admin:users:read` | View user list and detail | All admin roles |
| `admin:users:create` | Create new users | Org Admin+ |
| `admin:users:update` | Edit user profiles, roles, status | Org Admin+ |
| `admin:users:delete` | Delete users | Org Admin+ |
| `admin:users:impersonate` | Log in as another user | Super Admin only |
| `admin:users:export` | Export user data as CSV | Org Admin+ |
| `admin:orgs:read` | View organization list and detail | Org Admin+ |
| `admin:orgs:create` | Create organizations | Super Admin only |
| `admin:orgs:update` | Edit organization settings | Super Admin only |
| `admin:orgs:delete` | Delete organizations | Super Admin only |
| `admin:companies:read` | View company list and detail | Company Admin+ |
| `admin:companies:create` | Create companies | Org Admin+ |
| `admin:companies:update` | Edit company settings | Org Admin+ |
| `admin:companies:delete` | Delete companies | Org Admin+ |
| `admin:brands:read` | View brand list and detail | Brand Admin+ |
| `admin:brands:create` | Create brands | Company Admin+ |
| `admin:brands:update` | Edit brand settings, visual identity | Company Admin+ |
| `admin:brands:delete` | Delete brands | Company Admin+ |
| `admin:agents:read` | View agent list and detail | All admin roles |
| `admin:agents:create` | Create agents | Workspace Admin+ |
| `admin:agents:update` | Edit agent configuration | Workspace Admin+ |
| `admin:agents:delete` | Delete agents | Workspace Admin+ |
| `admin:agents:deploy` | Deploy agents to production | Brand Admin+ |
| `admin:agents:test` | Access agent test console | Workspace Admin+ |
| `admin:memory:read` | View memory pack list and detail | All admin roles |
| `admin:memory:create` | Create memory packs | Workspace Admin+ |
| `admin:memory:update` | Edit memory pack content | Workspace Admin+ |
| `admin:memory:delete` | Delete memory packs | Workspace Admin+ |
| `admin:knowledge:read` | View knowledge base list and detail | All admin roles |
| `admin:knowledge:create` | Create knowledge bases | Workspace Admin+ |
| `admin:knowledge:update` | Edit knowledge base settings | Workspace Admin+ |
| `admin:knowledge:delete` | Delete knowledge bases | Workspace Admin+ |
| `admin:knowledge:upload` | Upload documents to knowledge bases | Workspace Admin+ |
| `admin:providers:read` | View API provider list and detail | Org Admin+ |
| `admin:providers:create` | Add API providers | Super Admin only |
| `admin:providers:update` | Edit provider configuration | Super Admin only |
| `admin:providers:delete` | Remove API providers | Super Admin only |
| `admin:models:read` | View model list and detail | All admin roles |
| `admin:models:configure` | Edit model settings, routing rules | Org Admin+ |
| `admin:usage:read` | View usage analytics | All admin roles |
| `admin:usage:export` | Export usage data | Org Admin+ |
| `admin:billing:read` | View billing information | Org Admin+ |
| `admin:billing:manage` | Manage plans, invoices, payment methods | Super Admin only |
| `admin:billing:export` | Export billing data | Org Admin+ |
| `admin:audit:read` | View audit logs | All admin roles |
| `admin:audit:export` | Export audit logs | Org Admin+ |
| `admin:system-logs:read` | View system logs | Super Admin only |
| `admin:settings:read` | View settings pages | All admin roles |
| `admin:settings:update` | Modify settings | Org Admin+ |
| `admin:roles:read` | View roles and permissions | All admin roles |
| `admin:roles:create` | Create custom roles | Org Admin+ |
| `admin:roles:update` | Edit role permissions | Org Admin+ |
| `admin:roles:delete` | Delete custom roles | Org Admin+ |

---

## 9.22 Responsive Behavior

The admin panel follows a desktop-first design philosophy (admin panels are primarily used on desktop/laptop screens) but remains fully functional on tablets and mobile devices.

### 9.22.1 Breakpoints

| Breakpoint | Width | Layout Behavior |
|-----------|-------|----------------|
| **Desktop XL** | >= 1440px | Full layout: 256px sidebar + content. Tables show all columns. |
| **Desktop** | 1024-1439px | Sidebar collapses to icon-only mode (64px width) with tooltip labels. Tables hide less-important columns. |
| **Tablet** | 768-1023px | Sidebar becomes a hamburger menu (off-canvas drawer). Tables switch to card layout on mobile. Filter bar collapses to toggle. |
| **Mobile** | < 768px | No persistent sidebar. Navigation via hamburger menu. Tables render as stacked cards. Slide-over panels become full-screen. Charts stack vertically. |

### 9.22.2 Sidebar Responsive Behavior

- **Desktop XL**: Full sidebar with icons + labels. Group headers visible.
- **Desktop**: Icon-only sidebar. Hovering an icon shows a tooltip with the label. Group headers become thin dividers.
- **Tablet/Mobile**: Sidebar hidden. A hamburger button in the top bar opens the sidebar as an off-canvas drawer with overlay. Drawer is dismissible by clicking outside or pressing Escape.

### 9.22.3 Table Responsive Behavior

- **Desktop**: Full table with all columns visible. Horizontal scroll if columns exceed viewport.
- **Tablet**: Less-important columns are hidden via `columnVisibility`. A column picker button in the table header allows showing/hiding columns.
- **Mobile**: Table rows transform into stacked card layout. Each "card" shows the primary column (name/avatar) as the header, followed by key-value pairs for the remaining columns. Actions move to a bottom sheet on row tap.

### 9.22.4 Chart Responsive Behavior

- **Desktop**: Charts render at their specified dimensions with full interactivity.
- **Tablet**: Charts reduce padding and font sizes. Tooltips remain full-size.
- **Mobile**: Charts stack vertically (no side-by-side). Touch interactions enabled (pinch to zoom on time-series charts). Legend moves below the chart.

---

## 9.23 State Management for Admin Panel

### 9.23.1 Zustand Stores

The admin panel uses dedicated Zustand stores, separate from the main workspace stores. Each major domain has its own store slice:

| Store | State | Actions |
|-------|-------|---------|
| `useAdminFilterStore` | Active filters per page, sort settings, view mode (list/grid) | `setFilter(page, key, value)`, `clearFilters(page)`, `setSort(page, column, direction)`, `setViewMode(page, mode)` |
| `useAdminSelectionStore` | Selected row IDs per table, selection mode (none/single/multi) | `selectRow(page, id)`, `deselectRow(page, id)`, `selectAll(page, ids)`, `clearSelection(page)` |
| `useAdminTenantScopeStore` | Current tenant scope (org/company/brand ID), scope level | `setScope(level, id)`, `resetScope()` |
| `useAdminSidebarStore` | Sidebar collapsed state, active group, mobile drawer open | `toggleCollapse()`, `setActiveGroup(group)`, `openMobileDrawer()`, `closeMobileDrawer()` |
| `useAdminSettingsStore` | Unsaved settings changes per section, dirty state | `updateSetting(section, key, value)`, `discardChanges(section)`, `markSaved(section)` |

### 9.23.2 TanStack Query Keys

All admin data fetching uses TanStack Query with a structured key factory:

```
adminKeys:
  users:       { list: [filters], detail: [userId] }
  orgs:        { list: [filters], detail: [orgId] }
  companies:   { list: [filters], detail: [companyId] }
  brands:      { list: [filters], detail: [brandId] }
  agents:      { list: [filters], detail: [agentId] }
  memory:      { list: [filters], detail: [memoryPackId] }
  knowledge:   { list: [filters], detail: [knowledgeBaseId] }
  providers:   { list: [], detail: [providerId] }
  models:      { list: [], detail: [modelId] }
  usage:       { overview: [range, scope], tokens: [range, scope], ... }
  audit:       { list: [filters] }
  billing:     { overview: [], invoices: [filters], ... }
  roles:       { list: [], detail: [roleId] }
  settings:    { section: [sectionName] }
  dashboard:   { kpis: [scope], charts: [range, scope] }
```

### 9.23.3 Cache Invalidation Strategy

Mutations through the admin panel follow a structured cache invalidation pattern:

- **Create**: Invalidate the `list` query for the corresponding entity. Optimistically prepend to the list (with a temporary ID) and roll back on error.
- **Update**: Invalidate both the `detail` query (for the specific entity) and the `list` query. Optimistically update the detail cache.
- **Delete**: Invalidate the `list` query. Optimistically remove from the list cache. On error, re-insert.
- **Bulk delete**: Invalidate the `list` query. Show a loading overlay on the table during the mutation.
- **Settings update**: Invalidate the specific `settings` section query. Show a toast on success.

All mutations that modify data also trigger a refetch of the dashboard KPIs if the user navigates back to the dashboard, ensuring metrics reflect the latest state.

---

## 9.24 Toast Notification System

The admin panel uses a toast notification system for operation feedback. Toasts appear in the bottom-start corner (bottom-right in LTR) and stack vertically.

| Variant | Icon | Use Case |
|---------|------|----------|
| `success` | Check-circle (green) | Entity created, updated, deleted successfully. Settings saved. |
| `error` | X-circle (red) | Mutation failed. Validation error. Network error. |
| `warning` | Alert-triangle (amber) | Operation succeeded with warnings. Approaching quota limit. |
| `info` | Info (blue) | Background operation started (export, reprocess). Non-critical informational message. |

Toast properties:
- **Auto-dismiss**: 5 seconds for success/info, 10 seconds for warning, no auto-dismiss for error (requires manual dismiss).
- **Action button**: Optional. E.g., "بررسی" (Review) on error toasts that link to the error detail.
- **Undo**: Available on delete toasts. "بازگردانی" (Undo) button that calls the restore API.
- **Progress**: For long-running operations, a progress bar within the toast shows completion percentage.
- **Stack limit**: Maximum 5 visible toasts. Older toasts are dismissed when the limit is exceeded.