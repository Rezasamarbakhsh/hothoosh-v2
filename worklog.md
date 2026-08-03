# HotHoosh — Work Log

---
Task ID: 1
Agent: Lead Software Architect
Task: Feature 1 — Design Foundation (Tokens, Glass Morphism, RTL, Theme, Vazirmatn, Base Layout)

Work Log:
- Read all 12 architecture documents (PRD, Architecture, Database, Backend-Arch, Frontend-Arch, UI-System, Agent-System, IA, Development-Rules, Engineering-Rules, Admin-Panel, Architecture-Lock-Report)
- Verified Architecture Lock status: 0 blocking issues, 97.35/100 readiness, APPROVED
- Downloaded Vazirmatn v33.003 variable font (111KB woff2), self-hosted in /public/fonts/
- Wrote globals.css: 52 color tokens (primary, semantic, surface, text, accent, border), 14 typography tokens, 17 spacing tokens, 7 radius tokens, 5 shadow tokens, 8 animation tokens, 4 glass surface classes, reduced motion, RTL base, WCAG focus indicators, skip link
- Built ThemeProvider with useSyncExternalStore (React 19 compliant), 3-state (light/dark/system), localStorage persistence, system preference listener
- Built ThemeToggle with Persian labels (روشن/تاریک/سیستم)
- Built WorkspaceShell (collapsible sidebar + top bar + scrollable content), Sidebar (5 Persian nav items, accent indicator via border-inline-start, collapsed tooltips, mobile drawer), TopBar (search trigger, theme toggle, user avatar)
- Rewrote layout.tsx: lang=fa dir=rtl, Vazirmatn via next/font/local, data-theme=dark
- Fixed Lightning CSS stripping backdrop-filter: moved glass classes to /public/glass.css loaded via separate <link>
- Fixed @custom-variant dark to match data-theme attribute
- Fixed default theme from system to dark
- Fixed primary palette shade 0 bug (undefined token)
- Browser verification: 15/15 checks pass (dark default, Vazirmatn, RTL, glass morphism, typography scale, semantic colors, primary palette, theme toggle cycling, sidebar collapse)

Stage Summary:
- Foundation is production-ready and fully verified
- All design tokens match UI-System.md specification
- RTL layout uses CSS logical properties (inline-start/end, ms-/me-)
- No Tailwind dark: variant used (per Engineering Rules)
- No hardcoded colors (per Engineering Rules)
- Lint: 0 errors, 0 warnings

---
Task ID: 2
Agent: Lead Software Architect
Task: Feature 2 — Authentication Pages (Login, Register, Forgot Password)

Work Log:
- Fixed brand name from هت‌هوش to هات‌هوش across all files (metadata, layout)
- Refactored root layout.tsx: removed WorkspaceShell from root, now only renders ThemeProvider
- Created (auth) route group with centered, minimal layout (no sidebar, no top bar, Glass Morphism card)
- Created (workspace) route group with WorkspaceShell wrapper
- Updated root page.tsx to redirect to /login
- Created chat placeholder page at /chat within (workspace) group
- Built auth Zod schemas (Zod 4 compatible): loginSchema, registerSchema (FR-AUTH-005 password policy), forgotPasswordSchema
- Built shared AuthFormField component with RTL support, error display, accessibility attributes
- Built Login page: email (LTR dir) + password + remember-me checkbox + forgot-password link + invitation-only note
- Built Register page: invitation token + display name + password + confirm password + password requirements hint + success state
- Built Forgot Password page: email input + success state with email icon
- Split all 3 auth pages into Server Component (metadata) + Client Component (form) pattern per Frontend-Architecture
- Per-page Persian metadata titles: ورود/ثبت‌نام/فراموشی رمز عبور — هات‌هوش

Stage Summary:
- All 4 routes verified: /login 200, /register 200, /forgot-password 200, /chat 200
- Each auth page has correct Persian title tag
- Route group architecture matches Frontend-Architecture §4.1
- Root / redirects to /login
- (workspace) group wraps content in WorkspaceShell
- (auth) group renders centered glass card without workspace chrome
- Zod 4 compatible schemas with Persian error messages
- Password validation matches PRD FR-AUTH-005 (8+ chars, uppercase, lowercase, number, special)
- Registration requires invitation token (PRD FR-AUTH-001)
- 0 TypeScript errors in src/
- Files created: 10 (3 page.tsx, 3 form.tsx, 2 layouts, 1 schema, 1 component)

---
Task ID: 3
Agent: Lead Software Architect
Task: Feature 3 — Chat System (Layout, List, Session, Messages, Input)

Work Log:
- Created chat feature directory structure: features/chat/{components,hooks,stores,types,services}
- Built chat types: ChatMessage, ChatSession, AgentSummary, ToolCall interfaces with mock data
- Built chat UI Zustand store (useChatUIStore) with streaming/list/agent selectors
- Built ConversationList component: search, session groups (active/archived), relative time, agent badge
- Built MessageBubble component: user/assistant/system variants, bold markdown, timestamps, streaming dots, avatar, RTL
- Built ChatInput component: auto-resize textarea, Enter/Shift+Enter, attachment button placeholder, send button with streaming state, keyboard hint
- Built ChatEmptyState component for no-selection state
- Created chat layout (split view: calc(100dvh - 57px) with conversation list + main area)
- Created chat list page (page.tsx + chat-list-client.tsx) with Persian session cards, glass-panel-elevated
- Created chat session page (page.tsx + chat-session-client.tsx) with split view, message history, simulated send
- Created loading.tsx skeletons for both chat list and chat session (per Frontend-Arch §4.3)
- Created error.tsx boundaries for both routes (Persian error messages, retry/back actions)
- Used force-dynamic for [chatId] route
- All chat routes verified: /chat 200, /chat/session-1 (compiles)
- 0 TypeScript errors in src/

Stage Summary:
- Chat system UI is complete and functional with mock data
- Split-view layout: 272px conversation list (desktop) + scrollable message area + fixed input
- Message bubbles: RTL-aware (user right/primary, assistant left/elevated), bold markdown, timestamps
- Chat input: auto-resize, Enter to send, streaming state, disabled state
- Conversation list: search, grouped by status, relative time in Persian
- Mock data: 3 sessions (2 active, 1 archived), 4 messages (2 user, 2 assistant), 3 agents
- Simulated send: user message → streaming dots (1.5s) → assistant response
- Loading skeletons match page layout structure (per Frontend-Arch §4.3)
- Error boundaries with Persian messages and retry action
- Feature-based organization: features/chat/components/, features/chat/stores/, features/chat/types/
- Files created: 12 (8 components, 2 layouts, 1 store, 1 types file, 2 pages, 2 loading, 2 error, 1 client)

---
Task ID: 4
Agent: Lead Software Architect
Task: Feature 4 — Agent Gallery & Detail (عوامل هوشمند)

Work Log:
- Determined Feature 4 scope from Frontend-Architecture.md §4.2 route tree and PRD FR-AGENT-001 through FR-AGENT-008
- Created agent types file with: Agent, AgentDetail, AgentKnowledgeBinding, AgentToolBinding, AgentMemoryBinding interfaces
- Created type filter/sort types: AgentTypeFilter, AgentStatusFilter, AgentSortField, SortOrder, AgentFilters
- Created Persian label/color maps: AGENT_TYPE_LABELS, AGENT_STATUS_LABELS, AGENT_TYPE_COLORS, AGENT_STATUS_COLORS
- Created 6 mock agents covering all 5 types (chat×2, rag×1, tool_use×2, autonomous×1) and all 3 statuses (active×3, draft×2, deprecated×1)
- Created MOCK_AGENT_DETAILS with full binding data (knowledge, tools, memory) for each agent
- Built AgentCard molecule: avatar with type icon, name, type badge, status badge, description (2-line clamp), model name, usage stats, binding indicators (KB/tools/memory)
- Built AgentGallery organism: search input, type filter pills (6 options), status filter pills (4 options), sort buttons (name/sessions/updated), quick stats row (4 cards), empty state, responsive 3-column grid
- Built AgentDetail organism with 5 tabs: Config (basic info grid + sampling parameter bars + system prompt display), Knowledge (binding list with threshold/chunks), Tools (binding list with enabled/disabled state), Memory (binding list with type), Test Console
- Built TestConsole: chat-like panel with streaming dots simulation, auto-scroll, Enter to send, disabled state during streaming
- Created /agents/page.tsx (Server Component with metadata, passes MOCK_AGENTS to AgentGallery client component)
- Created /agents/loading.tsx (3-column card skeleton matching gallery layout per Frontend-Arch §4.3)
- Created /agents/error.tsx (Persian error message, retry + back buttons)
- Created /agents/[agentId]/page.tsx (Server Component with dynamic metadata, 404 for invalid IDs, passes AgentDetail)
- Created /agents/[agentId]/loading.tsx (header + tab bar + config skeleton)
- Created /agents/[agentId]/error.tsx (Persian error message, retry + back to gallery)
- Migrated Sidebar from callback-based navigation (onNavigate) to real Next.js Link + usePathname for active detection
- Removed activeNav state and onNavigate prop from WorkspaceShell
- Fixed brand name in sidebar from هت‌هوش to هات‌هوش
- All routes verified: /agents 200, /agents/agent-1 200, /agents/agent-2 200, /chat 200, /login 200
- 0 TypeScript errors in src/

Stage Summary:
- Agent gallery is fully functional with client-side filtering, sorting, and search
- 6 mock agents with realistic Persian names, descriptions, and binding data
- Agent detail page: 5-tab interface (config/knowledge/tools/memory/test console)
- Test console: interactive chat-like panel with simulated streaming responses
- Sidebar now uses real Next.js routing (Link + usePathname) instead of callback pattern
- Loading skeletons match page layouts (per Frontend-Arch §4.3)
- Error boundaries with Persian messages on all agent routes
- Feature-based organization: features/agents/{components,types,hooks,stores,services}/
- Files created: 10 (3 feature components, 1 types file, 6 route files)
- Files modified: 2 (sidebar.tsx, workspace-shell.tsx)

---
Task ID: 5
Agent: Lead Software Architect
Task: Feature 5 — Knowledge Base System (پایگاه دانش)

Work Log:
- Read PRD FR-KNOW-001 through FR-KNOW-007, Database §7 (knowledge_bases, knowledge_documents, knowledge_chunks), Backend-Arch RAG Engine, IA §4.2
- Created knowledge types file with: KnowledgeBase, KnowledgeDocument, KnowledgeChunk, SearchResult, KnowledgeBaseDetail interfaces
- Created processing pipeline types: KBType (5 types), KBProcessingStatus (4 states), DocumentProcessingStatus (7 pipeline stages), ChunkingStrategy (4 strategies), DocumentFileType (7 formats)
- Created Persian label/color maps for all entity types and statuses
- Created 7 mock knowledge bases covering: 4 ready (document type), 1 processing (document, 3 files in pipeline), 1 empty, 1 web type
- Created MOCK_KB_DETAILS with realistic document lists (including processing pipeline states: extracting, chunking, embedding, ready, failed with error message)
- Built KBCard molecule: status icon (animated pulse for processing), type badge, description, file stats (documents/chunks/size), bound agent count
- Built KBList organism: search input, status filter pills (5), type filter pills (6), sort buttons (name/docs/updated), quick stats row (4 cards: total/ready/docs/chunks), empty state, responsive 3-column grid
- Built KBDetail organism with 4 tabs per IA §4.2:
  - Documents: drag-and-drop upload area placeholder, document list with file type icons, size, chunk count, 7-state processing badges, error display
  - Chunks: chunk cards with index, token count, heading metadata, content preview, RTL direction
  - Search Test: info panel, query input, simulated 1.2s search with spinner, results with score percentages and search type badges (hybrid/vector/BM25)
  - Settings: basic info grid, chunking config with overlap ratio progress bar, danger zone with delete button
- Created /knowledge/page.tsx (Server Component with Persian metadata)
- Created /knowledge/loading.tsx (3-column card skeleton per Frontend-Arch §4.3)
- Created /knowledge/error.tsx (Persian error, retry + back)
- Created /knowledge/[kbId]/page.tsx (Server Component with dynamic metadata, 404 for invalid IDs)
- Created /knowledge/[kbId]/loading.tsx (breadcrumb + header + tab bar + document list skeleton)
- Created /knowledge/[kbId]/error.tsx (Persian error, retry + back to list)
- Fixed TypeScript error: `unknown` type from metadata.heading resolved with typeof guard
- All routes verified: /knowledge 200, /knowledge/kb-1 200, /knowledge/kb-5 200, /agents 200, /chat 200
- 0 TypeScript errors in src/

Stage Summary:
- Knowledge base gallery is fully functional with client-side filtering, sorting, and search
- 7 mock knowledge bases with realistic Persian names, varied statuses, and processing pipeline states
- KB detail page: 4-tab interface (documents/chunks/search test/settings) per IA §4.2
- Search Test panel: simulated hybrid retrieval with score display and search type badges
- Document list shows 7-stage processing pipeline (uploaded → extracting → chunking → embedding → indexed → ready → failed)
- Settings tab shows chunking configuration with visual overlap ratio
- Feature-based organization: features/knowledge/{components,types,hooks,stores,services}/
- Files created: 8 (3 feature components, 1 types file, 6 route files)
- Files modified: 0

---
Task ID: 6
Agent: Lead Software Architect
Task: Feature 6 — Memory System (حافظه)

Work Log:
- Read PRD FR-MEM-001 through FR-MEM-005, Frontend-Arch §4.2 (memory route), §6.3 (memoryKeys factory)
- Created memory types file with: MemoryPack, MemoryVersion, MemoryPackDetail interfaces
- Created entity types: MemoryType (4: context/preference/knowledge/system), MemoryPackStatus (3: draft/active/archived), MemoryScope (4: workspace/brand/company/organization)
- Created filter/sort types: MemoryTypeFilter, MemoryStatusFilter, MemoryScopeFilter, MemorySortField, SortOrder, MemoryFilters
- Created Persian label/color maps for all types, statuses, and scopes; type icon SVG paths
- Created 8 mock memory packs covering all 4 types, all 3 statuses, all 4 scopes with realistic Persian content
- Created MOCK_MEMORY_DETAILS with version history (1-8 versions per pack) and bound agent references
- Built MemoryPackCard molecule: type icon avatar, name, type/status/scope badges, auto-inject indicator, description (2-line clamp), stats (tokens/versions/injections), bound agent count, last injection relative time
- Built MemoryPackGallery organism: search input, 3 filter pill rows (type 5, status 4, scope 5), sort button (5 fields, asc/desc toggle), quick stats row (4 cards: total/active/draft/archived), empty state, responsive 3-column grid
- Built MemoryPackDetail organism with 4 tabs:
  - Config: basic info grid (9 fields), full content display in RTL bordered box, relevance score progress bar (color-coded), auto-inject badge
  - Versions: version timeline sorted desc, current version highlight ring, token diff indicator, content preview, author + date
  - Bindings: linked agent cards with type badge, navigates to /agents/[id], empty state
  - Usage: injection stats (3 big numbers), token usage progress bar against 8192 limit (color-coded), version timeline summary
- Created /memory/page.tsx (Server Component with Persian metadata 'حافظه — هات‌هوش')
- Created /memory/loading.tsx (stats + search + filter pills + 3-column card skeleton per Frontend-Arch §4.3)
- Created /memory/error.tsx (Persian error, reset + back buttons)
- Created /memory/[packId]/page.tsx (Server Component with dynamic metadata, 404 for invalid IDs)
- Created /memory/[packId]/loading.tsx (breadcrumb + header + tabs + config grid skeleton)
- Created /memory/[packId]/error.tsx (Persian error, reset + back to list)
- Fixed error.tsx files: replaced useRouteError (react-router) with Next.js error boundary props ({ reset, error })
- Fixed card component: stray backtick in href template literal
- Fixed detail component: removed invalid AGENT_TYPE_LABELS import, used local copy
- Worked around tool-level [m character stripping issue for directory names; used [packId] as dynamic segment
- Next.js build verified: /memory (static), /memory/[packId] (dynamic) both registered
- 0 TypeScript errors in src/

Stage Summary:
- Memory gallery is fully functional with client-side filtering (type/status/scope), sorting (5 fields), and search
- 8 mock memory packs with realistic Persian content spanning all types, statuses, and hierarchical scopes (FR-MEM-005)
- Memory detail page: 4-tab interface (config/versions/bindings/usage)
- Version timeline shows diff indicators (token delta between versions) per FR-MEM-003
- Usage tab visualizes token consumption against context window limit with color-coded progress bar
- Auto-inject toggle indicator on cards and detail header per FR-MEM-004
- Hierarchical memory scopes (workspace → brand → company → organization) per FR-MEM-005
- Feature-based organization: features/memory/{components,types}/
- Files created: 9 (3 feature components, 1 types file, 6 route files — page/loading/error for list + detail)
- Files modified: 0

---
Task ID: 2
Agent: main
Task: Redesign Chat UI to ChatGPT-like

Work Log:
- Updated chat.types.ts with 6 PTA agents (auto + 5 PTA agents: Marketing, Branding, Advertising, PR, Holding) and 10 mock sessions spread across agents with both active and archived statuses, dated August 2026
- Added 6 realistic mock messages for session-1 about خشکبار کوروش business analysis with markdown formatting and real company references
- Rewrote conversation-list.tsx: ChatGPT-style dark sidebar (w-72, bg-background-subtle), time-grouped sessions (امروز/دیروز/هفته گذشته/ماه گذشته), search, agent pills at bottom, Plus icon for new chat, no 'گفتگوی فعال' phrase
- Rewrote message-bubble.tsx: ChatGPT-clean style — user messages right-aligned with primary-500 bubble (rounded-2xl rounded-tr-sm), assistant messages no bubble background with Bot icon, agent name label, max-w-2xl, streaming dots preserved
- Rewrote chat-input.tsx: centered max-w-3xl input with rounded-2xl textarea, agent selector popover (Popover + Command from shadcn/ui) above input, Paperclip attachment button, Send button, keyboard hint
- Rewrote chat-empty-state.tsx: centered welcome screen with large 'هات‌هوش' logo, 'چگونه می‌توانم کمکتان کنم?' subtitle, 2x2 suggestion cards grid with lucide-react icons (BarChart3, TrendingUp, FileText, Palette)
- Updated chat-list-client.tsx to simply render ChatEmptyState
- Rewrote chat-session-client.tsx: no top header bar, desktop sidebar (lg:block), mobile floating PanelLeft toggle button, Sheet for mobile conversation list, messages in max-w-3xl centered, ChatInput at bottom
- Updated chat layout.tsx to use h-dvh flex container
- Updated workspace-shell.tsx: added usePathname() to detect /chat routes and remove padding/overflow-y-auto for full-height chat experience
- Updated chat-ui.store.ts: changed default activeAgentId from 'agent-1' to 'auto'
- All text in Persian, RTL layout, lucide-react icons throughout, CSS custom properties for colors
- Lint: 0 errors

Stage Summary:
Chat UI redesigned to ChatGPT-like experience with PTA agent selector, time-grouped conversations, clean message bubbles, and full-height layout

---
Task ID: 3
Agent: main
Task: Rename عوامل هوشمند → دستیاران هوشمند, update sidebar icons, replace MOCK_AGENTS with PTA agents

Work Log:
- Sidebar: replaced bullet point (•) icons with lucide-react icons (MessageSquare, Bot, Database, Brain, ShieldCheck)
- Sidebar: changed NavItem interface to use React.ReactNode for icon field
- Sidebar: replaced 'عوامل هوشمند' with 'دستیاران هوشمند' label
- Sidebar: removed Settings nav item, added Admin Panel (پنل مدیریت) with ShieldCheck icon
- Sidebar: added admin-only visibility check using useSession from next-auth/react (filters nav when role !== 'admin')
- Sidebar: added 'admin' route detection in getActiveId()
- Sidebar: icon rendering changed to <span className='shrink-0 h-5 w-5'>{item.icon}</span>
- Agent types: replaced 6 generic MOCK_AGENTS with 5 PTA agents (Marketing, Branding, Advertising, PR, Holding)
- Agent types: replaced MOCK_AGENT_DETAILS with matching knowledge/tool/memory bindings per PTA agent
- PTA Holding bound to all 10 knowledge base IDs (kb-hatro, kb-koush-dryfruits, kb-koush-rice, kb-proushat, kb-golbarg, kb-basti-arin, kb-tala-nab, kb-pakban, kb-koush-protein, kb-koush-fruit)
- Replaced all occurrences of 'عوامل هوشمند' with 'دستیاران هوشمند' across 10 files
- Replaced standalone 'عامل' with 'دستیار هوشمند' in all UI-facing text across 10 files
- Files modified: sidebar.tsx, agent.types.ts, agent-gallery.tsx, agent-detail.tsx, agents/page.tsx, agents/error.tsx, agents/[agentId]/page.tsx, agents/[agentId]/error.tsx, memory/page.tsx, memory.types.ts, kb-card.tsx, kb-detail.tsx, memory-pack-card.tsx, memory-pack-detail.tsx
- Fixed typo in memory.types.ts: 'обязатель' → 'مختلف'
- Lint: 0 errors, dev log: no compile errors

Stage Summary:
Sidebar updated with lucide-react icons and admin-only panel. All Persian UI text renamed from عوامل/عامل to دستیاران هوشمند/دستیار هوشمند. MOCK_AGENTS replaced with 5 PTA agents with domain-specific knowledge bindings.

---
Task ID: 7
Agent: main
Task: Replace knowledge base mock data with 10 Hatro company KBs; add Add Knowledge card to kb-detail

Work Log:
- Replaced MOCK_KNOWLEDGE_BASES (7 generic KBs) with 10 Hatro company knowledge bases:
  1. kb-hatro: کسب و کار هاترو (holding, 15 docs, 2340 chunks, 80MB, ready)
  2. kb-koush-dryfruits: صنعت خشکبار و حبوبات کوروش (12 docs, 1560 chunks, 45MB, ready)
  3. kb-koush-rice: کشت و صنعت برنج کوروش (8 docs, 890 chunks, 32MB, ready)
  4. kb-proushat: فرآورده‌های غذایی پروشات کوروش (10 docs, 1200 chunks, 38MB, ready)
  5. kb-golbarg: گلبرگ غذایی کوروش (9 docs, 1100 chunks, 35MB, ready)
  6. kb-basti-arin: هستی آرین تامین (14 docs, 1780 chunks, 52MB, ready)
  7. kb-tala-nab: طلای ناب کوروش (7 docs, 650 chunks, 22MB, ready)
  8. kb-pakban: صنایع غذایی پاکبان (11 docs, 1450 chunks, 48MB, ready)
  9. kb-koush-protein: فرآورده‌های پروتئینی کوروش (6 docs, 0 chunks, 18MB, processing)
  10. kb-koush-fruit: صنعت میوه کوروش (0 docs, 0 chunks, 0MB, empty)
- All KBs use: kbType: document, chunkingStrategy: heading_based, chunkSize: 512, chunkOverlap: 100, embeddingModel: text-embedding-3-small, persianNlpEnabled: true
- Created MOCK_KB_DETAILS for all 10 KBs with 2-3 mock documents each (Persian file names, PDF/DOCX/MD types)
- kb-hatro includes Hatro-Overview.pdf as specified
- Each KB has 2 recent chunks with company description content (200-400 token counts)
- kb-koush-protein documents have 'chunking' and 'embedding' processing statuses
- kb-koush-fruit has empty documents and recentChunks arrays
- Updated MOCK_SEARCH_RESULTS to reference new KB IDs and Persian content
- Added AddKnowledgeCard component to kb-detail.tsx with:
  - shadcn/ui Tabs (افزودن متن / آپلود فایل)
  - Textarea with character count and Submit button (disabled when empty)
  - File upload dropzone with drag-and-drop styling and lucide-react icons (FileText, Upload, Plus)
  - Added imports for lucide-react icons, shadcn Tabs, Textarea, Button
- Updated search placeholder text to Hatro-relevant query
- Lint: 0 errors, dev log: all routes compile successfully

Stage Summary:
Knowledge base mock data fully replaced with 10 Hatro (هاترو) company KBs covering the entire food industry group. Each KB has realistic documents, chunks with Persian company descriptions, and proper processing states. KB detail page now includes an Add Knowledge card with text input and file upload dropzone using shadcn/ui components.

---
Task ID: 8
Agent: main
Task: Admin Panel — API Key Management at /admin

Work Log:
- Created admin types file (features/admin/types/admin.types.ts):
  - ApiKey interface with id, name, provider, key, status, monthlySpend, monthlyBudget, totalRequests, tokensUsed, lastUsedAt, createdAt
  - Provider type: openai | anthropic | google | local
  - ApiKeyStatus type: active | revoked | expired
  - PROVIDER_LABELS, PROVIDER_COLORS maps (CSS variable-based colors)
  - 6 MOCK_API_KEYS: 2 OpenAI, 2 Anthropic, 1 Google AI, 1 local Llama — with realistic spend, request counts, token usage, and August 2026 timestamps
- Created ApiKeysManager component (features/admin/components/api-keys-manager.tsx):
  - 4 summary cards (active keys, monthly spend, total requests, tokens used) with Key/DollarSign/Activity/Cpu icons
  - Card list of API keys with provider badge, name, masked key, status badge, monthly usage Progress bar, last used relativeTime, token count
  - DropdownMenu per key with copy/revoke/delete actions
  - 'Add New Key' button → Dialog with form (name, provider Select, key Input with LTR dir, budget number Input)
  - formatNumber with fa-IR locale, formatCurrency with Intl.NumberFormat('fa-IR'), relativeTime helper
  - Uses shadcn: Card, Button, Badge, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Input, Separator, Progress
- Created AdminPanelClient component (features/admin/components/admin-panel-client.tsx):
  - ShieldCheck icon + 'پنل مدیریت' title
  - shadcn Tabs with 2 tabs: 'مدیریت API' (renders ApiKeysManager) and 'تنظیمات سیستم' (coming soon placeholder)
- Created /admin/page.tsx: Server Component with metadata 'پنل مدیریت — هات‌هوش', renders AdminPanelClient
- Created /admin/loading.tsx: Skeleton loading matching page layout (header, tabs, stats row, key list cards)
- Created /admin/error.tsx: Next.js error boundary with Persian text, reset + back to /chat buttons
- All components use glass-panel-elevated class and CSS custom properties (var(--color-*))
- Lint: 0 errors, /admin route returns 200

Stage Summary:
Admin panel created at /admin with API key management. 6 mock API keys across 4 providers (OpenAI, Anthropic, Google AI, local). Summary stats, card list with usage bars, add dialog, and dropdown actions. Uses shadcn/ui components throughout with Persian RTL layout, CSS variables, and fa-IR number formatting.
