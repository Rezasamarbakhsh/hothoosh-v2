# Phase 10 — Engineering Rules

## HotHoosh — Non-Violable Engineering Standards

---

> **These rules are mandatory.** Every line of code, every commit, every pull request, and every deployment must comply. There are no exceptions. If a rule feels wrong, propose an amendment through the RFC process — do not violate it.

---

## 10.1 Code Style

### 10.1.1 TypeScript

**Strict Mode is non-negotiable.** The following `tsconfig.json` settings are required across all packages:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "exactOptionalPropertyTypes": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noEmit": false
  }
}
```

**Type rules:**

| Rule | Description |
|------|-------------|
| No `any` | Use `unknown` and narrow with type guards. `any` is only permitted in generic constraint positions (`<T extends any>`). |
| No `as` casts | Prefer type guards, `satisfies`, and `zod` parsing. `as` is only permitted when converting between branded types or when a type guard is infeasible and the cast is documented with a `// SAFETY:` comment. |
| No non-null assertion | Never use `!` postfix. Use optional chaining, nullish coalescing, or early returns. |
| Prefer `interface` for objects | Use `interface` for object shapes and API contracts. Use `type` for unions, intersections, and utility types. |
| Branded types for IDs | All entity IDs use branded types: `type UserId = string & { readonly __brand: 'UserId' }`. This prevents accidental ID misuse. |
| Discriminated unions for state | All state machines, API responses with multiple shapes, and entity statuses must use discriminated unions, not optional fields. |
| Explicit return types on exports | Every exported function, method, and hook must have an explicit return type annotation. Internal functions may rely on inference. |
| No default exports | Every module uses named exports only. This improves refactoring tooling and tree-shaking. |
| Enum ban | Do not use TypeScript `enum`. Use `as const` objects with `type ValueType = typeof Object[keyof typeof Object]` instead. Enums emit runtime code and have subtle type-safety holes. |

**Formatting (enforced by Prettier, not debated):**

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
   "printWidth": 100,
  "tabWidth": 2,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### 10.1.2 Frontend (React / Next.js)

**Component rules:**

| Rule | Description |
|------|-------------|
| Functional components only | No class components. Ever. No exceptions. No legacy wrappers. |
| No default props | Use JavaScript default parameters instead of `Component.defaultProps`. |
| No `propTypes` | TypeScript types replace runtime prop validation entirely. |
| Destructure props at signature | Always destructure props in the function signature, not inside the body. |
| No forwarding refs manually | Use `React.forwardRef` only when wrapping a native element. For component-to-component ref forwarding, use the `ref` prop as a regular prop. |
| Component file structure | Order within a component file: (1) imports, (2) types, (3) constants, (4) helper functions, (5) hooks, (6) component, (7) sub-components, (8) export. |
| Max component length | A single component function body must not exceed 120 lines. If it does, extract sub-components or custom hooks. |
| Max hook file length | A single custom hook file must not exceed 150 lines. If it does, decompose into smaller hooks. |
| No `useEffect` for data fetching | All server data fetching uses TanStack Query. `useEffect` is only for subscriptions, event listeners, and DOM side effects. |
| No `useState` for derived state | If a value can be computed from existing state or props, compute it inline or with `useMemo`. Do not store it in a separate `useState`. |
| Colocate related files | A component, its styles, its types, and its tests live in the same directory. The component file is `index.tsx`. Tests are `*.test.tsx`. Types are `types.ts`. |

**JSX rules:**

| Rule | Description |
|------|-------------|
| Boolean props shorthand | Use `<Modal open />` not `<Modal open={true} />`. |
| String props shorthand | Use `<Input placeholder="..." />` with double quotes for string props. |
| No complex expressions in JSX | If a JSX expression spans more than 2 lines, extract it to a variable or a `render*` function. |
| No inline arrow functions for event handlers in JSX | Define event handlers as named functions inside the component, not inline. Exception: trivial one-liners like `onClick={() => setOpen(false)}`. |
| Fragment shorthand | Use `<>...</>` not `<Fragment>...</Fragment>` unless you need a `key` prop. |
| No array index as key | Never use array index as the `key` prop. Use stable, unique identifiers. |
| Conditional rendering | For large conditional blocks, extract to separate components. For small conditions, use ternary or `&&`. Never nest ternaries. |
| Image components | Always use `next/image` for images. Provide `width`, `height`, and `alt` (in Persian) for all images. |
| Link components | Always use `next/link` for internal navigation. Use `<a>` only for external links with `target="_blank" rel="noopener noreferrer"`. |

**Hook rules:**

| Rule | Description |
|------|-------------|
| Custom hook naming | All custom hooks start with `use` and are named in camelCase: `useUser`, `useAdminFilters`, `useKnowledgeSearch`. |
| No conditional hooks | Hooks must not be called inside conditions, loops, or nested functions. This is a React rule, not a style preference. |
| Extract complex logic to hooks | If a component has more than 3 `useState` calls or more than 2 `useEffect` calls, extract the related logic into a custom hook. |
| Hook return type | Custom hooks that return multiple values must return a named tuple or an object with explicit types. Never return unnamed arrays. |
| No hooks in utility files | Utility functions live in `utils/`. Hooks live in `hooks/`. Never mix them. |

### 10.1.3 Backend (NestJS)

**Module rules:**

| Rule | Description |
|------|-------------|
| Single responsibility modules | Each NestJS module encapsulates exactly one domain concept. A module that manages both users and organizations violates this rule. |
| Module boundary enforcement | Modules communicate through public APIs (injected services), never through shared mutable state. Module-private implementations are never exported. |
| No circular dependencies | If Module A needs Module B and Module B needs Module A, extract the shared concern into a third Module C. Circular dependencies are a design smell, not an inconvenience. |
| Controller thinness | Controllers handle HTTP concerns only: request parsing, response shaping, status codes. All business logic lives in services. A controller method must not exceed 15 lines. |
| Service isolation | Services are injected via DI. A service must never import another module's internal files. It depends only on the injected service's public interface. |
| Guard composition | Authentication and authorization are enforced via NestJS guards, not manual checks in controllers or services. |

**DTO rules:**

| Rule | Description |
|------|-------------|
| Zod for all DTOs | All DTOs use Zod schemas for validation. NestJS `class-validator` is not used. Zod schemas are defined alongside or inside the DTO file and used with a `ZodValidationPipe`. |
| Separate DTOs per operation | One DTO for create, one for update, one for response. Never reuse the same DTO for different operations. Response DTOs never contain password hashes, internal IDs, or other sensitive fields. |
| DTO naming | Create DTOs: `CreateUserDto`, `CreateAgentDto`. Update DTOs: `UpdateUserDto`, `UpdateAgentDto`. Response DTOs: `UserResponseDto`, `AgentResponseDto`. List response DTOs: `UserListResponseDto` (contains pagination metadata). |
| Pick/Omit for variations | When update DTOs differ from create DTOs only by making fields optional, use `z.infer<typeof CreateDto>.partial()` and add additional constraints. |

**Error handling rules:**

| Rule | Description |
|------|-------------|
| Domain exceptions | Each domain defines its own exception class extending `DomainException`. Examples: `UserNotFoundException`, `InsufficientTokenQuotaException`, `AgentAlreadyActiveException`. |
| Exception filters | A global exception filter catches all unhandled exceptions and returns a standardized error response. Never let raw stack traces reach the client. |
| HTTP status mapping | Domain exceptions map to specific HTTP status codes via the exception class definition, not in the controller. |
| Error response format | All error responses follow the same JSON structure: `{ error: { code: string, message: string, details?: Record<string, unknown> } }`. The `message` field is in the user's language (Persian for Persian users, English for English users). |
| Never swallow errors | Empty catch blocks are forbidden. If an error is intentionally handled, add a comment explaining why it's safe to ignore. |
| Never throw non-Error | Always throw instances of `Error` or its subclasses. Never throw strings, numbers, or objects. |

### 10.1.4 CSS / Tailwind

| Rule | Description |
|------|-------------|
| RTL logical properties only | Use `ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `inline-*`, `block-*`. Never use `left`, `right`, `ml-*`, `mr-*`, `pl-*`, `pr-*`. |
| Tailwind for layout, design tokens for theme | Layout (flex, grid, spacing, sizing) uses Tailwind utility classes. Colors, shadows, and effects use design token CSS variables via `var(--color-accent)`. |
| No `!important` | If Tailwind's `!` prefix doesn't suffice, restructure the specificity. `!important` in custom CSS is forbidden. |
| No inline styles | Inline `style={{}}` is forbidden except for dynamically computed values (e.g., chart colors from API data). All static styling uses Tailwind or CSS modules. |
| BEM for complex components | When a component's styling complexity exceeds what Tailwind utilities reasonably express, use a single CSS module file with BEM naming: `.chat-input`, `.chat-input__send-btn`, `.chat-input--focused`. |
| No hardcoded colors | Never hardcode hex, rgb, or hsl values. Use design tokens. The only exception is `transparent` and `currentColor`. |
| No hardcoded font sizes | All font sizes use the type scale defined in the design system (caption-sm, body-sm, body-md, heading-lg, etc.). |
| No hardcoded spacing | Use the spacing scale (4px increments) via Tailwind (p-4, gap-2, etc.) or CSS variables for semantic spacing. |
| Animation performance | Only animate `transform` and `opacity`. Never animate `width`, `height`, `top`, `left`, `margin`, or `padding`. Use `will-change` sparingly and only for elements that actually animate. |
| Dark mode via CSS variables | Dark mode is implemented by switching CSS variable values on `:root` and `[data-theme="dark"]`. Tailwind's `dark:` variant is not used. |

### 10.1.5 General Code Hygiene

| Rule | Description |
|------|-------------|
| No `console.log` | All logging uses a structured logger. On the frontend, use the `logger` utility. On the backend, use NestJS `Logger` service. `console.log`, `console.warn`, and `console.error` are forbidden in committed code. |
| No TODO without a ticket | `// TODO` comments must include a ticket reference: `// TODO(HOT-1234): implement retry logic`. Plain `// TODO` is forbidden. |
| No commented-out code | Delete dead code. Git preserves history. Commented-out code creates noise and confusion. |
| No magic numbers | Extract all non-obvious numbers to named constants: `const MAX_RETRY_ATTEMPTS = 3`. Zero, one, and negative one as initial values are exempt. |
| No deep nesting | Maximum indentation level is 4. If you exceed this, use early returns, extract functions, or use `async/await` to flatten promise chains. |
| Function length | Functions must not exceed 30 lines. If they do, decompose. |
| Parameter count | Functions must not accept more than 4 parameters. If more are needed, use an options object. |
| File length | Files must not exceed 300 lines. If they do, split into smaller modules. |
| Import order | Imports are organized in this exact order with blank line separators: (1) React/Next.js, (2) third-party libraries, (3) internal packages (`@hotHoosh/*`), (4) relative imports (`./`, `../`). Within each group, imports are alphabetized. |
| No barrel exports in hot paths | `index.ts` barrel files are permitted for leaf modules (components, utils). They are forbidden for service modules, API clients, and any module that would cause unnecessary re-evaluation. |

---

## 10.2 Folder Structure

### 10.2.1 Monorepo Root

```
hotHoosh/
├── apps/
│   ├── web/                          # Next.js 15 frontend (App Router)
│   ├── admin/                        # Next.js 15 admin panel (App Router)
│   └── api/                          # NestJS backend
├── packages/
│   ├── shared/                       # Shared TypeScript types, constants, utils
│   │   ├── src/
│   │   │   ├── types/                # Branded types, domain types, API types
│   │   │   ├── constants/            # Shared constants (status enums, limits)
│   │   │   ├── utils/                # Pure utility functions (date, string, number)
│   │   │   └── validators/           # Shared Zod schemas
│   │   └── package.json
│   ├── ui/                           # Shared React component library (shadcn + custom)
│   │   ├── src/
│   │   │   ├── components/           # Atomic components
│   │   │   │   ├── button/
│   │   │   │   │   ├── button.tsx
│   │   │   │   │   ├── button.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── input/
│   │   │   │   ├── dialog/
│   │   │   │   └── ...               # One directory per component
│   │   │   ├── hooks/                # Shared UI hooks (useMediaQuery, etc.)
│   │   │   ├── primitives/           # Low-level primitives (Slot, AsChild)
│   │   │   └── index.ts              # Public exports only
│   │   └── package.json
│   └── eslint-config/                # Shared ESLint configuration
├── docs/                             # Design documents
├── scripts/                          # Build, deploy, and utility scripts
├── turbo.json                        # Turborepo configuration
├── pnpm-workspace.yaml               # pnpm workspace definition
├── .eslintrc.cjs                     # Root ESLint config
├── .prettierrc                       # Prettier configuration
├── tsconfig.base.json                # Base TypeScript configuration
└── package.json
```

### 10.2.2 Frontend (`apps/web/`)

```
apps/web/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth route group (login, register, forgot-password)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (workspace)/              # Main workspace route group (authenticated)
│   │   │   ├── chat/
│   │   │   │   ├── [chatId]/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── agents/
│   │   │   ├── knowledge/
│   │   │   ├── settings/
│   │   │   └── layout.tsx            # Workspace shell (sidebar, top bar)
│   │   ├── layout.tsx                # Root layout (providers, fonts, dir="rtl")
│   │   ├── page.tsx                  # Landing / redirect
│   │   ├── globals.css               # Design token CSS variables + Tailwind base
│   │   └── not-found.tsx
│   ├── features/                     # Feature-based modules
│   │   ├── auth/                     # Auth feature
│   │   │   ├── components/           # Auth-specific components
│   │   │   ├── hooks/                # useAuth, useLogin, useRegister
│   │   │   ├── stores/               # Zustand auth store
│   │   │   ├── services/             # Auth API calls
│   │   │   ├── types/                # Auth-specific types
│   │   │   └── index.ts              # Feature public API
│   │   ├── chat/
│   │   │   ├── components/
│   │   │   │   ├── chat-input/
│   │   │   │   ├── message-list/
│   │   │   │   ├── message-bubble/
│   │   │   │   ├── branch-selector/
│   │   │   │   └── streaming-indicator/
│   │   │   ├── hooks/
│   │   │   │   ├── useChatMessages.ts
│   │   │   │   ├── useChatStreaming.ts
│   │   │   │   └── useChatBranching.ts
│   │   │   ├── stores/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   ├── agents/
│   │   ├── knowledge/
│   │   ├── memory/
│   │   ├── workspace/
│   │   └── settings/
│   ├── components/                   # App-level shared components (not reusable library)
│   │   ├── layouts/
│   │   │   ├── workspace-shell/
│   │   │   ├── sidebar/
│   │   │   └── top-bar/
│   │   └── providers/
│   ├── hooks/                        # App-level shared hooks
│   ├── lib/                          # App-level configuration and initialization
│   │   ├── api-client.ts             # Axios/fetch instance with interceptors
│   │   ├── query-client.ts           # TanStack Query client configuration
│   │   ├── i18n.ts                   # Internationalization setup
│   │   └── dayjs.ts                  # Day.js with Jalaali plugin
│   └── stores/                       # App-level Zustand stores
│       ├── theme.store.ts
│       └── sidebar.store.ts
├── public/
│   ├── fonts/                        # Vazirmatn and other fonts
│   ├── icons/                        # App icons (favicon, PWA)
│   └── images/                       # Static images
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 10.2.3 Admin Panel (`apps/admin/`)

```
apps/admin/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (admin)/                  # Admin route group
│   │   │   ├── dashboard/
│   │   │   ├── users/
│   │   │   ├── organizations/
│   │   │   ├── companies/
│   │   │   ├── brands/
│   │   │   ├── agents/
│   │   │   ├── memory-packs/
│   │   │   ├── knowledge/
│   │   │   ├── api-providers/
│   │   │   ├── models/
│   │   │   ├── usage/
│   │   │   ├── audit-logs/
│   │   │   ├── billing/
│   │   │   ├── logs/
│   │   │   ├── roles/
│   │   │   ├── settings/
│   │   │   └── layout.tsx            # Admin shell (sidebar, top bar, breadcrumbs)
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── features/
│   │   ├── admin-dashboard/
│   │   ├── admin-users/
│   │   ├── admin-orgs/
│   │   ├── admin-companies/
│   │   ├── admin-brands/
│   │   │   ├── components/
│   │   │   │   ├── brand-list/
│   │   │   │   ├── brand-detail/
│   │   │   │   ├── brand-visual-identity/
│   │   │   │   └── create-brand-dialog/
│   │   │   ├── hooks/
│   │   │   │   ├── useBrands.ts
│   │   │   │   ├── useBrandDetail.ts
│   │   │   │   └── useBrandMutations.ts
│   │   │   ├── stores/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   ├── admin-agents/
│   │   ├── admin-knowledge/
│   │   ├── admin-usage/
│   │   ├── admin-billing/
│   │   ├── admin-audit/
│   │   ├── admin-logs/
│   │   └── admin-settings/
│   ├── components/
│   │   ├── layouts/
│   │   │   ├── admin-shell/
│   │   │   ├── admin-sidebar/
│   │   │   └── admin-top-bar/
│   │   └── shared/                    # Admin-specific shared components
│   │       ├── data-table/
│   │       ├── filter-bar/
│   │       ├── slide-over/
│   │       ├── stat-card/
│   │       ├── status-badge/
│   │       ├── confirmation-dialog/
│   │       ├── empty-state/
│   │       ├── date-picker/
│   │       └── command-palette/
│   ├── hooks/
│   ├── lib/
│   └── stores/
│       ├── admin-filter.store.ts
│       ├── admin-selection.store.ts
│       └── admin-tenant-scope.store.ts
├── public/
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 10.2.4 Backend (`apps/api/`)

```
apps/api/
├── src/
│   ├── main.ts                       # Bootstrap
│   ├── app.module.ts                 # Root module
│   ├── config/                       # Configuration module
│   │   ├── config.module.ts
│   │   ├── configuration.ts          # Typed config (using @nestjs/config)
│   │   └── env.validation.ts          # Zod-validated environment variables
│   ├── common/                       # Cross-cutting concerns
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── roles.decorator.ts
│   │   │   └── tenant-scope.decorator.ts
│   │   ├── filters/
│   │   │   ├── domain-exception.filter.ts
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   └── tenant-scope.guard.ts
│   │   ├── interceptors/
│   │   │   ├── logging.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   ├── pipes/
│   │   │   └── zod-validation.pipe.ts
│   │   └── utils/
│   ├── modules/                      # Domain modules (hexagonal architecture)
│   │   ├── auth/                     # Authentication & authorization
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   ├── register.dto.ts
│   │   │   │   └── refresh-token.dto.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── local.strategy.ts
│   │   │   ├── entities/
│   │   │   └── __tests__/
│   │   │       ├── auth.service.spec.ts
│   │   │       └── auth.controller.spec.ts
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.module.ts
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   └── __tests__/
│   │   ├── organizations/
│   │   ├── companies/
│   │   ├── brands/
│   │   ├── workspaces/
│   │   ├── agents/
│   │   ├── chat/
│   │   ├── knowledge/
│   │   ├── memory/
│   │   ├── billing/
│   │   └── audit/
│   ├── engines/                      # AI/ML engine modules
│   │   ├── llm-router/
│   │   │   ├── llm-router.module.ts
│   │   │   ├── llm-router.service.ts
│   │   │   ├── providers/
│   │   │   │   ├── openai.provider.ts
│   │   │   │   ├── anthropic.provider.ts
│   │   │   │   └── provider.interface.ts
│   │   │   └── __tests__/
│   │   ├── context-engine/
│   │   ├── rag-engine/
│   │   │   ├── chunking/
│   │   │   │   ├── fixed-size.chunker.ts
│   │   │   │   ├── semantic.chunker.ts
│   │   │   │   └── chunker.interface.ts
│   │   │   ├── persian-nlp/
│   │   │   │   ├── normalizer.ts
│   │   │   │   └── stemmer.ts
│   │   │   └── embedding/
│   │   ├── memory-engine/
│   │   ├── tool-engine/
│   │   └── streaming-engine/
│   ├── infrastructure/               # Technical infrastructure
│   │   ├── database/
│   │   │   ├── database.module.ts
│   │   │   ├── migrations/          # PostgreSQL migrations (using knex or prisma migrate)
│   │   │   └── seeds/
│   │   ├── redis/
│   │   │   ├── redis.module.ts
│   │   │   └── redis.service.ts
│   │   ├── queue/
│   │   │   ├── queue.module.ts
│   │   │   └── processors/
│   │   ├── storage/
│   │   │   ├── storage.module.ts
│   │   │   └── s3.service.ts
│   │   └── search/
│   ├── entities/                     # TypeORM/Prisma entities (shared across modules)
│   └── migrations/                   # Database migration files
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
└── package.json
```

### 10.2.5 Folder Structure Rules

| Rule | Description |
|------|-------------|
| Feature-based, not type-based | Frontend code is organized by feature (`features/chat/`), not by type (`components/`, `hooks/`). Type-based directories exist only for shared/app-level code. |
| Feature self-containment | Each feature directory contains everything it needs: components, hooks, stores, services, types, and tests. A feature must be deletable without affecting other features. |
| Colocate tests | Test files live alongside the files they test. Unit tests: `foo.ts` → `foo.spec.ts`. Component tests: `button.tsx` → `button.test.tsx`. E2E tests for a module: `__tests__/` directory inside the module. |
| Colocate DTOs with their module | DTOs live in the module's `dto/` directory, not in a shared DTO folder. Shared validation schemas (used across modules) live in `packages/shared/src/validators/`. |
| No `utils/` dumping ground | The `utils/` directory is for pure functions with no domain coupling. Domain logic goes into services. UI logic goes into hooks or components. |
| No `helpers/` directory | Use `utils/` for pure utilities and `lib/` for configuration/initialization. `helpers/` is a forbidden directory name. |
| Deep nesting limit | Maximum directory depth from package root is 7 levels. If you exceed this, flatten the structure. |
| Index files for public API | Each feature/module has an `index.ts` that exports only the public API. Internal files are not exported. |

---

## 10.3 Naming

### 10.3.1 File Naming

| Context | Convention | Example |
|---------|-----------|--------|
| Components (React) | PascalCase directory, `index.tsx` entry | `chat-input/index.tsx`, `message-bubble/index.tsx` |
| Hooks | camelCase with `use` prefix | `useChatMessages.ts`, `useAdminFilters.ts` |
| Stores (Zustand) | camelCase with `.store` suffix | `auth.store.ts`, `admin-filter.store.ts` |
| Services (frontend) | camelCase with `.service` suffix | `auth.service.ts`, `knowledge.service.ts` |
| Services (NestJS) | camelCase with `.service.ts` suffix | `users.service.ts`, `llm-router.service.ts` |
| Controllers (NestJS) | camelCase with `.controller.ts` suffix | `users.controller.ts` |
| Modules (NestJS) | kebab-case directory, camelCase module file | `users/users.module.ts`, `llm-router/llm-router.module.ts` |
| DTOs | camelCase with `.dto.ts` suffix | `create-user.dto.ts`, `update-agent.dto.ts` |
| Entities | camelCase with `.entity.ts` suffix | `user.entity.ts`, `chat-session.entity.ts` |
| Types | camelCase with `.types.ts` suffix | `chat.types.ts`, `agent.types.ts` |
| Constants | camelCase with `.const.ts` suffix or SCREAMING_SNAKE_CASE values | `limits.const.ts` containing `MAX_TOKEN_BUDGET` |
| Validators (Zod) | camelCase with `.schema.ts` suffix | `create-user.schema.ts`, `login.schema.ts` |
| Utilities | camelCase | `format-date.ts`, `persian-normalizer.ts` |
| Tests | Same name as source + `.spec.ts` or `.test.tsx` | `users.service.spec.ts`, `button.test.tsx` |
| CSS Modules | Same name as component + `.module.css` | `chat-input.module.css` |
| Migrations | Timestamp-prefixed, descriptive, snake_case | `20250802143000_create_users_table.ts` |
| Environment | `.env.example`, `.env.local`, `.env.production` | Never commit `.env` or `.env.local`. |

### 10.3.2 Code Naming

**Variables and functions:**

| Convention | Rule | Example |
|-----------|------|--------|
| Variables | camelCase, descriptive noun | `currentUser`, `tokenBudget`, `selectedAgent` |
| Booleans | `is`/`has`/`should`/`can` prefix | `isActive`, `hasPermission`, `shouldRetry`, `canEdit` |
| Functions | camelCase, verb or verb phrase | `getUserById()`, `validateTokenBudget()`, `formatPersianDate()` |
| Event handlers | `handle` prefix for JSX, `on` prefix for props | `handleClick()`, `onSubmit={handleSubmit}` |
| Async functions | No `Async` suffix in the name. The `async` keyword is sufficient. | `fetchUser()`, not `fetchUserAsync()` |
| Callback props | `on` prefix | `onSelect`, `onChange`, `onError` |
| Render functions | `render` prefix | `renderMessageContent()`, `renderEmptyState()` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRY_ATTEMPTS`, `DEFAULT_PAGE_SIZE`, `TOKEN_BUDGET_PERCENTAGES` |
| Enum-like objects | PascalCase object, SCREAMING_SNAKE_CASE values | `const AgentStatus = { Active: 'active', Inactive: 'inactive' }` |
| Error classes | PascalCase, descriptive | `UserNotFoundException`, `TokenQuotaExceededException` |

**Types and interfaces:**

| Convention | Rule | Example |
|-----------|------|--------|
| Interfaces | PascalCase, no `I` prefix | `User`, `ChatMessage`, `AgentConfig` |
| Type aliases | PascalCase | `UserRole`, `TokenBudget`, `ChatBranch` |
| Generic parameters | Single uppercase letter or short PascalCase | `T`, `TEntity`, `TDto` |
| Branded types | PascalCase, `Brand` suffix optional | `type UserId = string & { readonly __brand: 'UserId' }` |
| Discriminant fields | PascalCase `type` field | `{ type: 'text'; content: string } \| { type: 'image'; url: string }` |
| Nullable/Optional | Use `?` and `\| null` explicitly, never rely on defaults | `email: string \| null` not `email?: string` (unless both undefined and null are valid) |
| Response types | PascalCase + `Response` suffix | `UserResponse`, `AgentListResponse`, `UsageOverviewResponse` |
| DTO types | PascalCase + `Dto` suffix | `CreateUserDto`, `UpdateAgentDto` |
| API route types | PascalCase + `Route` suffix | `UserRoutes`, `ChatRoutes` |

**Database naming:**

| Convention | Rule | Example |
|-----------|------|--------|
| Tables | snake_case, plural | `users`, `chat_sessions`, `knowledge_bases`, `memory_packs` |
| Columns | snake_case | `created_at`, `user_id`, `token_budget`, `is_active` |
| Primary keys | `id` (UUID v7) or `{table}_id` for junction tables | `id`, `workspace_user_id` |
| Foreign keys | `{referenced_table}_id` | `org_id`, `user_id`, `agent_id` |
| Indexes | `idx_{table}_{columns}` | `idx_chat_sessions_user_id`, `idx_knowledge_chunks_vector` |
| Unique constraints | `uniq_{table}_{columns}` | `uniq_users_email`, `uniq_orgs_slug` |
| Check constraints | `chk_{table}_{description}` | `chk_users_email_format` |

**CSS naming:**

| Convention | Rule | Example |
|-----------|------|--------|
| Design tokens | `--{category}-{property}-{variant}` | `--color-accent`, `--spacing-md`, `--radius-lg` |
| Tailwind classes | Utility-first, responsive prefixes | `ms-4`, `bg-glass-panel`, `text-caption-sm` |
| CSS Module classes | BEM: `.block__element--modifier` | `.chat-input__send-btn--disabled` |
| Data attributes | `data-{kebab-case}` | `data-testid="user-list"`, `data-status="active"` |

### 10.3.3 Naming Anti-Patterns (Forbidden)

| Forbidden | Reason | Use Instead |
|-----------|--------|------------|
| `data`, `info`, `item`, `temp`, `obj` | Meaningless | Descriptive names: `user`, `agentConfig`, `uploadProgress` |
| `handleEvent`, `processData`, `doSomething` | Vague verbs | `handleSubmitForm`, `processTokenBudget`, `syncAgentStatus` |
| `flag`, `check`, `result` | Ambiguous type | `isFeatureEnabled`, `hasValidEmail`, `validationResult` |
| Abbreviations in names (except well-known) | Reduces readability | `authentication` not `authn`, `configuration` not `config` (exception: `config` for NestJS config files, `auth` for the auth module) |
| Single-letter variables (except loop indices) | Non-descriptive | Use `user` not `u`, `index` not `i` (except in `for` loops) |
| Hungarian notation | TypeScript provides types | `name` not `strName`, `count` not `nCount` |
| `I` prefix on interfaces | Not TypeScript convention | `User` not `IUser` |
| `get` prefix for non-trivial operations | Misleading | `calculateTokenBudget()` not `getTokenBudget()` if computation is involved |
| `Manager`, `Handler`, `Processor`, `Helper`, `Util` as class suffixes | Vague responsibilities | `TokenAllocator`, `PersianNormalizer`, `ChatStreamMultiplexer` |

---

## 10.4 Architecture

### 10.4.1 Frontend Architecture Rules

| Rule | Description |
|------|-------------|
| App Router only | All routing uses Next.js App Router (`app/` directory). The `pages/` directory does not exist. |
| Server Components by default | All components are React Server Components unless they explicitly need interactivity. Add `'use client'` only when the component uses hooks, event handlers, or browser APIs. |
| Client boundary at feature level | The `'use client'` directive is placed at the feature component level (e.g., the chat input), not on every small interactive element. Child components of a client component are automatically client components. |
| Data fetching on server | Page-level data fetching uses Server Components with `async/await` and direct database or service calls (via Next.js server actions or API routes). Client-side data fetching uses TanStack Query. |
| No client-side `fetch` in components | Components never call `fetch()` directly. All API communication goes through TanStack Query hooks or server actions. |
| State management boundaries | **Server state** (API data) → TanStack Query. **Client state** (UI state) → Zustand. **Form state** → React Hook Form + Zod. **URL state** → Next.js `useSearchParams`. Never overlap these boundaries. |
| No global CSS side effects | Styles are scoped. Global styles are limited to `globals.css` for design tokens, font faces, and Tailwind base/reset. Component styles never leak. |
| Error boundaries | Every route segment has an `error.tsx` boundary. Every feature with async operations has a React error boundary wrapper. |
| Loading states | Every route segment with async data has a `loading.tsx` that renders a skeleton matching the page layout. |
| No direct DOM manipulation | Use React refs only for focus management, scroll positioning, and integrating non-React libraries. Never use `document.querySelector`, `innerHTML`, or `addEventListener` outside of custom hooks. |
| Feature isolation | Features communicate through shared types and the event system (if needed), not through direct imports of each other's internal files. A feature may import from `packages/ui`, `packages/shared`, and its own internal files only. |

### 10.4.2 Backend Architecture Rules

| Rule | Description |
|------|-------------|
| Hexagonal modules | Each domain module has a clear boundary. Controllers define the API, services contain business logic, and repositories (via TypeORM/Prisma) handle data access. The module's internal implementation is not exported. |
| Dependency injection | All dependencies are injected via NestJS DI container. No manual `new` instantiation of services. No import of service files directly — always inject via constructor. |
| Repository pattern | Data access goes through repository classes (TypeORM custom repositories or Prisma service wrappers). Controllers and services never use `createQueryBuilder` directly — that's the repository's responsibility. |
| Domain events | Modules communicate through a domain event system. When `UserService` creates a user, it emits `UserCreatedEvent`. `AuditService` and `BillingService` listen for this event. Modules never import each other's services directly for cross-domain operations. |
| No anemic domain models | Entities contain behavior, not just data. A `User` entity has methods like `canAccessWorkspace()`, `hasRole()`, `isActive()`, not just properties. |
| CQRS for complex operations | Read-heavy and write-heavy operations are separated when they have significantly different requirements. Query services handle reads (optimized for speed). Command services handle writes (optimized for consistency). Simple CRUD does not require CQRS. |
| Interface segregation | Services define narrow interfaces for what they need from other services. A service that only needs to check if a user exists should depend on a `UserExistsChecker` interface, not the full `UserService`. |
| Configuration over hardcoding | All configurable values (timeouts, limits, feature flags) are defined in the configuration module and injected via `ConfigService`. No magic strings or hardcoded values in business logic. |
| Graceful degradation | External service failures (AI provider down, storage unavailable) must not crash the application. Implement circuit breakers, fallbacks, and retry logic. Return degraded responses, not 500 errors. |
| Transaction boundaries | Database transactions are managed at the service method level, not the controller level. Use NestJS `TransactionManager` or the unit of work pattern. |

### 10.4.3 API Design Rules

| Rule | Description |
|------|-------------|
| RESTful resource naming | Resources are plural nouns: `/users`, `/agents`, `/knowledge-bases`, `/memory-packs`. No verbs in URLs. |
| Consistent URL structure | `/{api-version}/{resource}/{id}/{sub-resource}/{sub-id}`. Example: `/v1/organizations/org_123/companies` |
| HTTP methods correctly used | `GET` = read (never modify state), `POST` = create, `PUT` = full replace, `PATCH` = partial update, `DELETE` = delete. |
| Pagination on all list endpoints | Every `GET` endpoint that returns a list supports pagination: `?page=1&limit=20` (offset-based) or `?cursor=xxx&limit=20` (cursor-based). |
| Filtering on list endpoints | Every list endpoint supports filtering via query parameters. Filter parameter names match the response field names: `?status=active&role=admin`. |
| Sorting on list endpoints | Every list endpoint supports sorting: `?sort=created_at&order=desc`. Multi-sort: `?sort=status,created_at&order=asc,desc`. |
| Consistent response envelope | All responses use: `{ data: T, meta?: { page, limit, total, hasMore } }`. Error responses use: `{ error: { code, message, details } }`. |
| API versioning | URL-based versioning: `/v1/`, `/v2/`. No header-based or query-based versioning. |
| Idempotency | `PUT` and `DELETE` are always idempotent. `POST` is idempotent when an `Idempotency-Key` header is provided. |
| Rate limiting | All API endpoints are rate-limited. Limits are configurable per route, per user tier, and per IP. Rate limit headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`) are included in responses. |
| HATEOAS-lite | List responses include `_links` for pagination: `{ _links: { self, next, prev } }`. Detail responses include `_links` for related resources. |
| No nested resource depth > 2 | Maximum URL depth: `/{resource}/{id}/{sub-resource}`. Deeper nesting is forbidden. Use query parameters or separate endpoints instead. |
| Streaming via SSE | All AI streaming responses use Server-Sent Events (`text/event-stream`). No WebSocket for request-response streaming. |

### 10.4.4 State Management Architecture

**Zustand store rules:**

| Rule | Description |
|------|-------------|
| One store per concern | Each store manages one domain of client state. Do not create god stores. |
| Store as state machine | When state has distinct modes (idle → loading → success → error), model it explicitly, not as a collection of independent booleans. Use a `status` field with a discriminated union type. |
| No derived state in stores | If a value can be computed from store state, compute it in the component using a selector. Do not store it. |
| Persist only when needed | Use `zustand/middleware` persist only for user preferences (theme, sidebar state). Never persist server state (that's TanStack Query's job). |
| Store actions are pure | Store actions modify state synchronously. Async operations (API calls) live in TanStack Query mutations, which call store actions on success. |
| Selectors for performance | Components read store state via selectors, not by subscribing to the entire store. `useThemeStore(s => s.theme)`, not `useThemeStore()`. |

**TanStack Query rules:**

| Rule | Description |
|------|-------------|
| Query keys are structured | Use a key factory function: `adminKeys.agents.detail(agentId)`. Never use raw strings. |
| Stale time configured | Every query has an explicit `staleTime` and `gcTime`. Server data that changes infrequently has longer stale times. Real-time data has shorter stale times or uses polling. |
| Optimistic updates for mutations | Create, update, and delete mutations optimistically update the cache. Roll back on error. |
| Error boundaries per query | Query errors are caught by React error boundaries, not by `try/catch` in components. |
| No `useQuery` in event handlers | Queries are declared at the component level. Event handlers trigger mutations, not queries. To refetch, use `queryClient.invalidateQueries()`. |
| Prefetch on hover | Navigation links prefetch their target page's data on hover using `queryClient.prefetchQuery()`. |
| Infinite queries for large lists | Audit logs, system logs, and any list that exceeds 10,000 records use `useInfiniteQuery`. |

---

## 10.5 Testing

### 10.5.1 Testing Principles

| Principle | Description |
|-----------|-------------|
| Tests are code | Tests are held to the same quality standards as production code. They must be readable, well-named, and maintainable. |
| Test behavior, not implementation | Tests verify what the system does (outputs, side effects), not how it does it (internal function calls, variable assignments). |
| No test interdependency | Each test must run in isolation. No test depends on another test's execution order, side effects, or database state. |
| Deterministic | Tests must produce the same result every time. No reliance on wall-clock time, random values, or external service availability. Mock time, randomness, and external calls. |
| Fast | Unit tests run in milliseconds. Integration tests run in seconds. The full test suite completes in under 5 minutes. If a test is slow, profile and fix it. |

### 10.5.2 Test Structure

Every test file follows the **AAA pattern** (Arrange, Act, Assert):

```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a user with valid data and emit UserCreatedEvent', async () => {
      // Arrange
      const dto = createValidUserDto();
      const hashedPassword = 'hashed_password';
      passwordService.hash.mockResolvedValue(hashedPassword);

      // Act
      const result = await userService.createUser(dto);

      // Assert
      expect(result).toEqual(expect.objectContaining({
        email: dto.email,
        displayName: dto.displayName,
      }));
      expect(eventBus.emit).toHaveBeenCalledWith(
        expect.any(UserCreatedEvent),
      );
    });
  });
});
```

### 10.5.3 Naming Conventions

| Context | Convention | Example |
|---------|-----------|--------|
| `describe` block | The unit under test | `describe('UserService')`, `describe('useChatMessages')` |
| Nested `describe` | The method or scenario | `describe('createUser')`, `describe('when user is suspended')` |
| `it` / `test` block | Expected behavior, starting with 'should' | `it('should throw UserNotFoundException when user does not exist')` |
| Test file | Same name as source + `.spec.ts` or `.test.tsx` | `users.service.spec.ts`, `button.test.tsx` |
| Test directory | `__tests__/` inside the module | `modules/users/__tests__/` |
| E2E test file | `*.e2e-spec.ts` | `auth.e2e-spec.ts` |
| Mock files | `*.mock.ts` | `users.service.mock.ts`, `llm-provider.mock.ts` |
| Fixture files | `*.fixture.ts` | `users.fixture.ts`, `chat-messages.fixture.ts` |

### 10.5.4 Unit Testing Rules

| Rule | Description |
|------|-------------|
| Cover business logic | Every service method, utility function, and custom hook with non-trivial logic must have unit tests. |
| No testing framework globals | Import `describe`, `it`, `expect` from the test framework. Do not rely on globals. |
| Mock at boundaries | Mock external dependencies (database, HTTP, file system, AI providers). Do not mock the unit under test. |
| Use test factories | Create factory functions for generating test data: `createUserDto(overrides?)`, `createAgentEntity(overrides?)`. Do not hardcode test data inline. |
| Test edge cases | For every function, test: happy path, empty input, null/undefined input, boundary values, error cases. |
| Test error paths | Verify that functions throw the correct exception type and message when given invalid input. |
| No implementation details | Do not test private methods, internal variable assignments, or function call counts unless verifying side effects. |
| Minimum 90% coverage on services | Service layer must maintain 90%+ branch coverage. Other layers: 80%+. |

### 10.5.5 Integration Testing Rules

| Rule | Description |
|------|-------------|
| Test API contracts | Every API endpoint has an integration test that verifies the request/response contract. |
| Use test database | Integration tests use a dedicated test database (PostgreSQL). Tests are responsible for setup and teardown. |
| Test with real dependencies | Integration tests use real database queries (TypeORM/Prisma), real Zod validation, and real NestJS DI. Only external services (AI providers, S3) are mocked. |
| Test authentication and authorization | Verify that protected endpoints reject unauthenticated requests and that role-based access control works correctly. |
| Test file uploads | Verify that file upload endpoints accept valid files and reject invalid types/sizes. |
| Test pagination, filtering, sorting | List endpoints must have tests verifying pagination behavior, filter combinations, and sort directions. |

### 10.5.6 E2E Testing Rules

| Rule | Description |
|------|-------------|
| Critical user journeys only | E2E tests cover the 10-15 most critical user journeys: registration, login, create chat, send message, create agent, upload knowledge base, admin CRUD operations. |
| No E2E for edge cases | Edge cases are covered by unit and integration tests. E2E tests verify that the system works end-to-end for normal flows. |
| Independent test database | E2E tests run against a dedicated, isolated database that is reset between test suites. |
| Page Object Model | E2E tests use the Page Object pattern. Page objects encapsulate selectors and interactions. Tests use page objects, not raw CSS selectors. |
| Visual regression | Key pages have visual regression snapshots. Tests fail if the UI changes unexpectedly. |
| Run in CI only | E2E tests are too slow for local development. They run in CI pipelines. |

### 10.5.7 Component Testing Rules

| Rule | Description |
|------|-------------|
| Render, act, assert | Use `@testing-library/react`: render the component, perform user actions with `fireEvent` or `userEvent`, assert on the rendered output. |
| Query by role, not by class | Use `screen.getByRole()`, `screen.getByLabelText()`, `screen.getByText()`. Never use `container.querySelector` or `getByTestId` except as a last resort. |
| Test user-visible behavior | Test what the user sees and does. Do not test internal state variables or whether a specific function was called (unless verifying a side effect like navigation or API call). |
| Test accessibility | Verify that interactive elements are accessible: buttons have accessible names, forms have labels, modals trap focus. |
| Test loading, error, and empty states | Every component that fetches data has tests for its loading skeleton, error state, and empty state. |

---

## 10.6 Security

### 10.6.1 Authentication Rules

| Rule | Description |
|------|-------------|
| Dual-token JWT | Access token: RS256, 15-minute expiry, in `Authorization: Bearer` header. Refresh token: HS256, 7-day expiry, in `HttpOnly`, `Secure`, `SameSite=Strict` cookie. |
| No JWT in localStorage | Access tokens are stored in memory only. On page refresh, a silent refresh is triggered using the refresh token cookie. |
| Token rotation on refresh | Every refresh token usage generates a new refresh token and invalidates the old one (rotation). If a previously-used refresh token is presented again, all sessions for that user are revoked (theft detection). |
| Password hashing | Argon2id with OWASP-recommended parameters. Never use MD5, SHA-1, SHA-256, or bcrypt (Argon2id is resistant to GPU attacks). |
| Password policy enforcement | Minimum 8 characters, at least one uppercase, one lowercase, one number, one special character. Checked on both client and server. |
| Rate limiting on auth endpoints | Login: 5 attempts per minute per IP, 10 per hour per account. Password reset: 3 per hour per email. Registration: 5 per hour per IP. |
| Account lockout | After 10 failed login attempts within 1 hour, the account is locked for 30 minutes. The user is notified via email. |

### 10.6.2 Authorization Rules

| Rule | Description |
|------|-------------|
| 3-layer RBAC | Organization role → Workspace role → Resource-level permissions. All three layers are checked for every authenticated request. |
| Permission checks on server | Authorization is enforced server-side via NestJS guards. Client-side permission checks (hiding UI elements) are UX only — never security. |
| PostgreSQL RLS | Row-Level Security policies enforce tenant isolation at the database level. Even if application code has a bug, RLS prevents cross-tenant data access. |
| Principle of least privilege | Users and services have the minimum permissions necessary. A service that reads user profiles does not need write access. |
| Admin impersonation audit | When a super admin impersonates a user, an audit log entry is created with both the admin's and the target user's IDs. The impersonated session is clearly marked. |

### 10.6.3 Input Validation Rules

| Rule | Description |
|------|-------------|
| Validate everything | Every input from the client (body, query params, path params, headers) is validated with Zod schemas. No exceptions. |
| Server-side validation is authoritative | Client-side validation is UX only. Server-side validation is the source of truth and must be complete. |
| Sanitize all strings | All string inputs are sanitized: trimmed, stripped of null bytes and control characters. HTML content is sanitized with a library like DOMPurify. |
| No user input in file paths | User-provided strings are never used directly in file system paths. Use UUIDs for file naming. |
| No user input in SQL | All database queries use parameterized queries via TypeORM/Prisma. Raw SQL is forbidden except in migrations. |
| No user input in commands | User input is never passed to `child_process`, `eval()`, or `Function()`. |
| File upload validation | Validate file type (by magic bytes, not extension), file size, and file content. Quarantine uploaded files until validation is complete. |

### 10.6.4 Data Protection Rules

| Rule | Description |
|------|-------------|
| Encrypt at rest | All sensitive data (passwords, API keys, tokens) is encrypted at rest using AES-256. Database-level encryption for PII fields. |
| Encrypt in transit | TLS 1.3 for all connections. HSTS header enabled. No plain HTTP, not even internally. |
| No PII in logs | Passwords, tokens, API keys, and personal identifying information are never logged. Log only non-sensitive identifiers (user ID, not email or phone). |
| No PII in URLs | Personal data does not appear in query parameters or path segments. Use POST body or server-side lookups instead. |
| Data masking in responses | Sensitive fields (passwords, API keys, internal IDs) are never included in API responses. Use DTOs to control exactly which fields are returned. |
| Right to erasure | User data deletion is supported. When a user is deleted, all their personal data is purged within 30 days (with a grace period for accidental deletion recovery). |

### 10.6.5 API Security Rules

| Rule | Description |
|------|-------------|
| CORS configuration | Explicit allowlist of origins. No `*` wildcard. Credentials allowed only for known origins. |
| CSRF protection | All state-changing requests require the `Authorization` header (which prevents CSRF since custom headers trigger preflight). Cookie-based refresh token endpoints use CSRF tokens additionally. |
| Security headers | `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` are set on all responses. |
| Rate limiting headers | `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` on every response. |
| No sensitive data in query params | API keys, tokens, and secrets are never passed in URL query parameters. |
| Request size limits | Body size is limited: 1MB for JSON, 50MB for file uploads. |
| Dependency auditing | `npm audit` runs in CI. Critical and high vulnerabilities block the build. Dependabot or Renovate is enabled for automatic PRs. |

---

## 10.7 Accessibility

### 10.7.1 Fundamental Rules

| Rule | Description |
|------|-------------|
| WCAG 2.2 AA compliance | All user-facing features meet WCAG 2.2 Level AA. This is a requirement, not a goal. |
| Semantic HTML | Use the correct HTML element for every piece of content: `<button>` for actions, `<a>` for navigation, `<nav>` for navigation landmarks, `<main>` for main content, `<aside>` for complementary content. Never use `<div>` or `<span>` for interactive elements. |
| Keyboard navigation | Every interactive element is reachable and operable via keyboard. Tab order follows the visual order. Focus indicators are always visible (never `outline: none` without a replacement). |
| Screen reader compatible | All content is accessible via screen reader. Images have `alt` text in Persian. Icon-only buttons have `aria-label`. Dynamic content changes are announced via ARIA live regions. |
| No color-only information | Information is never conveyed by color alone. Status indicators always include text or icons in addition to color. |
| Focus management | When a modal opens, focus moves to the modal. When a modal closes, focus returns to the trigger element. When navigating between pages, focus moves to the page heading or a skip-link target. |

### 10.7.2 ARIA Rules

| Rule | Description |
|------|-------------|
| Native elements first | Use native HTML elements with built-in ARIA semantics before adding ARIA attributes. ARIA is a supplement, not a replacement for semantic HTML. |
| ARIA labels in Persian | All `aria-label`, `aria-describedby`, and `aria-placeholder` values are in the user's current language (Persian by default). |
| Live regions for dynamic content | Chat messages, toast notifications, and real-time status updates use `aria-live="polite"` (or `"assertive"` for critical errors). |
| Dialog roles | Modals use `role="dialog"`, `aria-modal="true"`, `aria-labelledby` (pointing to the title), and focus trap. |
| Tab and tabpanel | Tab interfaces use `role="tablist"`, `role="tab"` with `aria-selected`, and `role="tabpanel"` with `aria-labelledby` pointing to the tab. |
| Table accessibility | Data tables use `<table>` with proper `<thead>`, `<th scope="col">`, and `<caption>`. Tables with interactive elements use appropriate ARIA grid roles. |
| Loading announcements | Loading states that take more than 3 seconds announce their status via `aria-live`: "در حال بارگذاری..." (Loading...). |

### 10.7.3 Visual Accessibility Rules

| Rule | Description |
|------|-------------|
| Color contrast | Text-to-background contrast ratio: minimum 4.5:1 for normal text, 3:1 for large text (18px+ or 14px+ bold). Non-text UI components have minimum 3:1 contrast against adjacent colors. |
| Focus indicator | Custom focus indicators have minimum 2px offset and 3:1 contrast against the background. Never remove the default focus indicator without providing a visible replacement. |
| Text resizing | All text scales up to 200% without loss of content or functionality. No fixed-width containers that clip text. No fixed-height containers that hide overflow. |
| Reduced motion | Respect `prefers-reduced-motion`. When this media query is active, disable animations and transitions. Provide instant state changes instead. |
| Dark mode contrast | Dark mode is not an afterthought. All color pairings in dark mode meet the same contrast requirements as light mode. |
| Touch targets | All interactive elements have minimum 44x44px touch targets on mobile. No tap targets smaller than this, even on dense data tables (use spacing or padding to expand the hit area). |

---

## 10.8 Performance

### 10.8.1 Frontend Performance Rules

| Rule | Description |
|------|-------------|
| Core Web Vitals targets | LCP < 2.5s, FID < 100ms, CLS < 0.1, INP < 200ms. These are monitored in production and alerted on breach. |
| Bundle size budget | Initial JavaScript bundle: < 200KB gzipped. Each route chunk: < 100KB gzipped. Total JS per page: < 500KB gzipped (including lazy-loaded chunks). |
| Code splitting by route | Every route is a separate chunk. Dynamic imports (`next/dynamic`) for heavy components (charts, editors, chat input). |
| Image optimization | All images use `next/image` with explicit dimensions. Serve WebP/AVIF format. Lazy-load below-the-fold images. |
| Font loading | Vazirmatn font is self-hosted. Use `font-display: swap`. Preload the critical font file. No layout shift from font loading. |
| No layout shift | CLS is monitored. Images and embeds have explicit `aspect-ratio`. Dynamic content has reserved space. No content injection that shifts existing elements. |
| Memoization | `React.memo` for components that receive complex props and re-render infrequently. `useMemo` for expensive computations. `useCallback` for functions passed as props to memoized children. Do not overuse — profile before optimizing. |
| Virtualization | Lists with more than 100 items use virtualization (`@tanstack/react-virtual`). This includes chat messages, audit logs, system logs, and data tables. |
| Prefetching | Link hover triggers route prefetch. Next.js built-in prefetching is configured for viewport-based prefetching. |
| No synchronous blocking imports | All third-party libraries that are not needed for initial render are dynamically imported. Charts, editors, and PDF viewers are never in the critical path. |

### 10.8.2 Backend Performance Rules

| Rule | Description |
|------|-------------|
| Response time targets | P50 < 200ms, P95 < 500ms, P99 < 1s for all API endpoints (excluding AI streaming). AI endpoints: time-to-first-token < 2s. |
| Database query optimization | All queries use indexed columns. `EXPLAIN ANALYZE` is run for every new query in development. No N+1 queries — use eager loading (TypeORM `find({ relations: ... })` or Prisma `include`). |
| Connection pooling | PostgreSQL connection pool sized for the expected concurrent load. PgBouncer or Prisma's built-in pool is configured. Redis connection pooling is enabled. |
| Caching strategy | Frequently accessed, rarely changing data is cached in Redis with appropriate TTL. Cache keys include tenant scope to prevent cross-tenant leaks. Cache invalidation is explicit, not time-only. |
| Queue offloading | Heavy operations (document processing, embedding generation, bulk exports, email sending) are offloaded to BullMQ queues. No long-running operations in request handlers. |
| Pagination is mandatory | No endpoint returns unbounded result sets. Default page size is 20. Maximum page size is 100. |
| Compression | All API responses are gzip-compressed when they exceed 1KB. Static assets are pre-compressed (Brotli + gzip) and served via CDN. |
| Rate limiting per tenant | Rate limits are enforced per tenant to prevent noisy-neighbor problems. No single tenant can consume disproportionate resources. |

### 10.8.3 Database Performance Rules

| Rule | Description |
|------|-------------|
| Index all foreign keys | Every foreign key column has an index. Every column used in `WHERE`, `JOIN`, `ORDER BY`, or `GROUP BY` clauses has an appropriate index. |
| Index selectively | Do not over-index. Each index slows down writes. Create indexes based on actual query patterns, not speculation. |
| Use UUID v7 for new tables | UUID v7 is time-sortable and avoids index fragmentation on append-heavy tables (audit logs, usage logs, chat messages). Legacy tables with BIGINT auto-increment are acceptable for append-only tables. |
| Vacuum and analyze | PostgreSQL auto-vacuum is configured appropriately for the workload. Manual `VACUUM ANALYZE` runs weekly for heavy-write tables. |
| Query logging | Slow queries (> 500ms) are logged. Weekly review of slow query logs. |
| pgvector HNSW configuration | HNSW index parameters (`m`, `ef_construction`) are tuned for the expected dataset size and query latency requirements. |
| Connection pooling | PgBouncer in transaction mode for high-concurrency scenarios. Direct connections for long-running transactions. |
| Read replicas | Read-heavy workloads (dashboard queries, analytics) are directed to read replicas when available. |

---

## 10.9 Git Rules

### 10.9.1 Branching Model

| Rule | Description |
|------|-------------|
| Main branch is always deployable | The `main` branch must always be in a state where it can be deployed to production at any time. No broken tests, no incomplete features, no debug code. |
| Feature branches from main | All feature branches are created from `main` and merged back into `main` via pull request. |
| Branch naming | `{type}/{ticket}-{short-description}`. Example: `feat/HOT-1234-user-search-filter`, `fix/HOT-5678-login-redirect-loop`. |
| Branch types | `feat/` (new feature), `fix/` (bug fix), `chore/` (maintenance, dependencies), `docs/` (documentation), `refactor/` (code restructuring without behavior change), `perf/` (performance improvement), `test/` (adding or fixing tests), `security/` (security fix). |
| No long-lived branches | Feature branches must be merged or closed within 5 business days. If a branch needs more time, it should be broken into smaller incremental PRs. |
| Rebase before merge | Feature branches must be rebased onto the latest `main` before merging (not merged with a merge commit, unless resolving complex conflicts). Squash merge is the default strategy. |
| No direct commits to main | All changes to `main` go through pull requests. Direct commits are blocked by branch protection rules. |
| Release branches | Release branches (`release/v1.2.0`) are created from `main` for production releases. Hotfix branches (`hotfix/v1.2.1`) are created from release branches or `main`. |

### 10.9.2 Branch Protection

The `main` branch has the following protections:

- No direct push (require PR)
- Require 1 approval (2 for database schema changes)
- Require passing CI checks (lint, type-check, test)
- Require up-to-date branch (rebase before merge)
- Require signed commits (GPG or SSH)
- No force push
- Linear history (squash merge only)

### 10.9.3 Git Hygiene

| Rule | Description |
|------|-------------|
| No committed secrets | `.env` files, API keys, tokens, and credentials are in `.gitignore`. A pre-commit hook (git-secrets or gitleaks) scans for accidentally committed secrets. |
| No committed build artifacts | `node_modules/`, `dist/`, `.next/`, `build/`, and other build outputs are in `.gitignore`. |
| No large files | Files larger than 10MB are tracked via Git LFS. This includes videos, large datasets, and model files. |
| No merge conflicts in committed code | PRs with merge conflicts are not mergable. Resolve all conflicts before merging. |
| `.gitignore` is comprehensive | The project `.gitignore` covers all common ignores: node_modules, dist, build, .env, .DS_Store, *.log, coverage, .turbo. |

---

## 10.10 Pull Request Rules

### 10.10.1 PR Requirements

| Rule | Description |
|------|-------------|
| PR title follows Conventional Commits | `feat(users): add search and filter to user list` — type(scope): description. Persian descriptions are acceptable. |
| PR description is complete | Every PR includes: (1) What changed and why, (2) How to test, (3) Screenshots for UI changes, (4) Breaking changes (if any), (5) Links to related tickets. |
| PR size limit | PRs must not exceed 400 lines of changed code (excluding tests and generated files). If a change is larger, split it into multiple incremental PRs. |
| PR links to a ticket | Every PR references at least one ticket number in the description: `Closes HOT-1234` or `Related to HOT-1234`. |
| All CI checks pass | Lint, type-check, unit tests, and integration tests must pass before a PR is reviewed. |
| No draft PRs in review | Mark PRs as "Ready for Review" only when they are ready. Draft PRs are not reviewed. |

### 10.10.2 Review Rules

| Rule | Description |
|------|-------------|
| At least 1 approval required | Every PR requires at least 1 approving review from a team member. PRs touching security, authentication, or billing require 2 approvals. |
| Review within 24 hours | PRs must receive a first review within 24 hours of being marked "Ready for Review". If no review is available, the PR author may self-merge trivial changes (typos, config) after 48 hours. |
| Reviews are constructive | Review comments must be specific, actionable, and respectful. "This is wrong" is not a review comment. "This query lacks an index on `user_id`, which will cause a seq scan. See: [EXPLAIN output]" is. |
| Address all comments | All review comments must be addressed (fixed, discussed, or explicitly deferred with a reason). Push a new commit to address comments — do not amend the existing commit. |
| No rubber-stamping | Reviewers must actually read and understand the code. A review that only checks the "Approve" button without comments is not a review. |
| Self-review first | PR authors must self-review their own diff before requesting review. Use GitHub's "Review changes" feature. |

### 10.10.3 PR Template

```markdown
## Summary
<!-- What does this PR do? Why is it needed? -->

## Related Tickets
<!-- Closes HOT-XXXX -->

## Changes
<!-- Bullet list of key changes -->

## How to Test
<!-- Steps to verify the changes -->

## Screenshots
<!-- If UI changes, attach screenshots (before/after for visual changes) -->

## Breaking Changes
<!-- List any breaking changes and migration steps -->

## Checklist
- [ ] Code follows engineering rules
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No hardcoded secrets
- [ ] No console.log left
```

---

## 10.11 Commit Rules

### 10.11.1 Conventional Commits

All commits follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

| Type | Description | Example |
|------|-------------|--------|
| `feat` | New feature | `feat(chat): add message branching UI` |
| `fix` | Bug fix | `fix(auth): resolve token refresh loop on expired JWT` |
| `docs` | Documentation only | `docs(api): update authentication endpoint spec` |
| `style` | Code style (formatting, semicolons) | `style(lint): fix trailing comma issues` |
| `refactor` | Code restructuring, no behavior change | `refactor(agents): extract tool-binding logic to separate service` |
| `perf` | Performance improvement | `perf(rag): add query caching for vector search results` |
| `test` | Adding or updating tests | `test(users): add integration tests for bulk user creation` |
| `chore` | Maintenance, dependencies, config | `chore(deps): update Next.js to 15.1.0` |
| `ci` | CI/CD changes | `ci(github): add E2E test job to pipeline` |
| `build` | Build system or dependencies | `build(turbo): configure remote caching` |
| `revert` | Revert a previous commit | `revert: feat(chat): add message branching UI` |

**Scope** (optional but recommended):

The scope is the module or feature area affected. Use the module/directory name: `auth`, `users`, `agents`, `chat`, `knowledge`, `rag`, `billing`, `admin`, `ui`, `shared`, `config`.

**Subject rules:**

| Rule | Description |
|------|-------------|
| Imperative mood | Use "add", not "added" or "adds". |
| Lowercase | Do not capitalize the first letter. |
| No period | Do not end with a period. |
| Maximum 72 characters | Keep the subject line concise. |
| Persian acceptable | The subject may be in Persian if the change is user-facing or team convention. |

**Body rules:**

- Explain **what** and **why**, not **how** (the code shows how).
- Separate from subject with a blank line.
- Wrap at 72 characters.
- Use bullet points for multiple changes.

**Footer rules:**

- Reference tickets: `Closes HOT-1234` or `Related to HOT-1234`.
- Breaking changes: `BREAKING CHANGE: description of what broke and migration steps.`

### 10.11.2 Commit Discipline

| Rule | Description |
|------|-------------|
| One logical change per commit | A commit contains one logical change. A feature with 3 unrelated files gets 3 commits. A bug fix and a refactor are separate commits. |
| Atomic commits | Each commit is atomic: it either applies completely or not at all. No partially complete commits. |
| No whitespace-only commits | Whitespace changes are bundled with the logical change they accompany. |
| No "fix lint" follow-up commits | Lint and format issues are fixed before committing. Pre-commit hooks (lint-staged + husky) enforce this. |
| No WIP commits | Work-in-progress commits are not pushed. Use `git stash` locally. Push only when the change is ready for review. |
| Signed commits | All commits are signed (GPG or SSH key). Unsigned commits are rejected by branch protection. |
| Meaningful commit messages | `fix stuff`, `update`, `wip`, `asdf` are forbidden. Every commit message must clearly describe the change. |

### 10.11.3 Pre-Commit Hooks

| Hook | Tool | Purpose |
|------|------|---------|
| `pre-commit` | lint-staged | Runs ESLint and Prettier on staged files only. Fixes auto-fixable issues. Rejects the commit if unfixable issues exist. |
| `pre-commit` | tsc (type-check) | Runs TypeScript type-checking on the entire project. Rejects the commit if type errors exist. |
| `pre-commit` | git-secrets | Scans staged files for secrets, API keys, tokens, and credentials. Rejects the commit if found. |
| `commit-msg` | commitlint | Validates commit message against Conventional Commits format. Rejects the commit if the format is wrong. |

---

## 10.12 Documentation Rules

### 10.12.1 Code Documentation

| Rule | Description |
|------|-------------|
| JSDoc on public APIs | All exported functions, classes, interfaces, and types have JSDoc comments describing their purpose, parameters, and return value. |
| JSDoc language | JSDoc descriptions are in English (developer-facing). UI-facing text (labels, messages) is in Persian. |
| No obvious JSDoc | `/** Returns the user's display name */` on `getDisplayName()` adds no value. Only document non-obvious behavior, edge cases, and constraints. |
| Complex logic comments | Non-obvious algorithms, business rules, and workarounds have inline comments explaining **why**, not **what**. |
| `// SAFETY:` for unsafe operations | Any `as` cast, `!` assertion, or type coercion must be preceded by a `// SAFETY:` comment explaining why it's safe. |
| `// TODO(ticket):` for deferred work | All TODOs reference a ticket number. Plain TODOs are forbidden. |
| No commented-out code | Dead code is deleted, not commented. Git preserves history. |
| No file-level headers | No `// @file`, `// @author`, `// @date` headers. This information is in git metadata. |

### 10.12.2 API Documentation

| Rule | Description |
|------|-------------|
| OpenAPI spec maintained | All REST API endpoints are documented in an OpenAPI 3.1 specification file. The spec is auto-generated from NestJS decorators (`@ApiTags`, `@ApiOperation`, `@ApiResponse`) using `@nestjs/swagger`. |
| Example requests and responses | Every endpoint includes at least one example request body and one example response body (both success and error). |
| Authentication documented | Authenticated endpoints document the required authentication method and the expected token format. |
| Error responses documented | Every endpoint documents all possible error responses (400, 401, 403, 404, 409, 422, 429, 500) with example bodies. |
| Pagination documented | Paginated endpoints document the pagination parameters, response structure, and default/maximum page sizes. |
| SSE events documented | Streaming endpoints document all SSE event types, their payloads, and the expected event sequence. |

### 10.12.3 Architecture Documentation

| Rule | Description |
|------|-------------|
| ADRs for decisions | Every significant architectural decision is documented in an Architecture Decision Record (ADR) in `docs/adr/`. Format: Context, Decision, Consequences. |
| Diagrams are kept current | Architecture diagrams, ER diagrams, and sequence diagrams in the docs directory are updated when the code changes. Outdated diagrams are worse than no diagrams. |
| Runbook for operations | Critical operations (deployment, database migration, backup/restore, incident response) have runbooks in `docs/runbooks/`. |
| Onboarding guide | `docs/onboarding.md` contains step-by-step setup instructions that a new developer can follow to get the project running locally. |

### 10.12.4 README Rules

Every package (root, apps/web, apps/admin, apps/api, packages/*) has a `README.md` containing:

| Section | Content |
|---------|---------|
| Package name and description | One-line description of what this package does. |
| Prerequisites | Required tools, versions, and accounts. |
| Installation | `pnpm install`, environment setup, database setup. |
| Development | How to run the dev server, how to run tests, how to run the linter. |
| Architecture | Brief description of the package's internal architecture and how it relates to other packages. |
| Contributing | Link to the contributing guide and engineering rules. |
