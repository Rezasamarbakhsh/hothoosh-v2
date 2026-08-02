# UI System — HotHoosh Enterprise AI Workspace

---

## 1. Design Philosophy

### 1.1 Minimal Glass Enterprise

HotHoosh follows a **Minimal Glass Enterprise** aesthetic — a design language that merges glass morphism with the data-density demands of enterprise software. The visual identity communicates professionalism, clarity, and depth without visual clutter.

Core characteristics:

| Characteristic | Description |
|----------------|-------------|
| **Glass surfaces** | Translucent panels with `backdrop-filter: blur()` create a layered, dimensional UI. Depth is communicated through opacity and blur, not through heavy shadows or borders. |
| **Enterprise data density** | Despite the glass aesthetic, information is never sacrificed for decoration. Tables, dashboards, and forms present dense data with clear hierarchy and scannable structure. |
| **Persian-first, RTL-native** | The entire interface is built RTL-first. Persian (فارسی) is the default language. English is a secondary option. CSS logical properties are mandatory — no physical direction properties. |
| **Depth hierarchy** | Four glass surface tiers (`glass-panel-solid`, `glass-panel-elevated`, `glass-panel-data`, `glass-panel-subtle`) create a clear visual stack: structural chrome → elevated content → data surfaces → interactive states. |
| **Minimal decoration** | No gratuitous gradients, no decorative illustrations in core UI, no unnecessary borders. Content is the focus. |
| **Dark/light parity** | Both themes are first-class citizens. Neither theme is an afterthought. All color pairings in dark mode meet the same WCAG contrast requirements as light mode. |

### 1.2 Guiding Principles

1. **Content over chrome** — UI elements serve content, never compete with it.
2. **Consistency over cleverness** — Predictable patterns beat novel interactions.
3. **Accessibility over aesthetics** — If a visual treatment fails contrast, it is removed.
4. **Performance over polish** — Animations and effects must not degrade rendering performance.
5. **Tokens over values** — Every color, size, and spacing value is a design token. Hardcoded values are forbidden.

---

## 2. Design Tokens — Colors

### 2.1 Primary Colors

Indigo-based primary palette. The primary color is used for interactive elements (buttons, links, selected states) and brand identity.

| CSS Variable | Light Mode | Dark Mode | Usage |
|--------------|------------|-----------|-------|
| `--color-primary-50` | `#eef2ff` | `#1e1b4b` | Minimal primary tint backgrounds |
| `--color-primary-100` | `#e0e7ff` | `#312e81` | Selected row backgrounds, light highlights |
| `--color-primary-200` | `#c7d2fe` | `#3730a3` | Light borders, subtle accents |
| `--color-primary-300` | `#a5b4fc` | `#4338ca` | Disabled/secondary interactive elements |
| `--color-primary-400` | `#818cf8` | `#6366f1` | Hover states, secondary buttons |
| `--color-primary-500` | `#6366f1` | `#818cf8` | **Primary brand color.** Buttons, links, active indicators. |
| `--color-primary-600` | `#4f46e5` | `#a5b4fc` | Pressed states, strong emphasis |
| `--color-primary-700` | `#4338ca` | `#c7d2fe` | Primary text on dark backgrounds |
| `--color-primary-800` | `#3730a3` | `#e0e7ff` | Headings, strong labels |
| `--color-primary-900` | `#312e81` | `#eef2ff` | Maximum emphasis text |

### 2.2 Semantic Colors

| CSS Variable | Light Mode | Dark Mode | Usage |
|--------------|------------|-----------|-------|
| `--color-success-50` | `#f0fdf4` | `#052e16` | Success background tint |
| `--color-success-100` | `#dcfce7` | `#14532d` | Success light background |
| `--color-success-500` | `#22c55e` | `#4ade80` | **Success indicator.** Active status, confirmed actions. |
| `--color-success-600` | `#16a34a` | `#22c55e` | Success text, success hover |
| `--color-success-700` | `#15803d` | `#86efac` | Success strong text |
| `--color-warning-50` | `#fffbeb` | `#451a03` | Warning background tint |
| `--color-warning-100` | `#fef3c7` | `#78350f` | Warning light background |
| `--color-warning-500` | `#f59e0b` | `#fbbf24` | **Warning indicator.** Pending states, caution. |
| `--color-warning-600` | `#d97706` | `#f59e0b` | Warning text, warning hover |
| `--color-warning-700` | `#b45309` | `#fde68a` | Warning strong text |
| `--color-error-50` | `#fef2f2` | `#450a0a` | Error background tint |
| `--color-error-100` | `#fee2e2` | `#7f1d1d` | Error light background |
| `--color-error-500` | `#ef4444` | `#f87171` | **Error indicator.** Validation errors, failed states. |
| `--color-error-600` | `#dc2626` | `#ef4444` | Error text, error hover |
| `--color-error-700` | `#b91c1c` | `#fca5a5` | Error strong text |
| `--color-info-50` | `#eff6ff` | `#172554` | Info background tint |
| `--color-info-100` | `#dbeafe` | `#1e3a5f` | Info light background |
| `--color-info-500` | `#3b82f6` | `#60a5fa` | **Info indicator.** Informational notices, neutral highlights. |
| `--color-info-600` | `#2563eb` | `#3b82f6` | Info text, info hover |
| `--color-info-700` | `#1d4ed8` | `#93c5fd` | Info strong text |

### 2.3 Surface Colors

Glass surface backgrounds for the four-tier depth system.

| CSS Variable | Light Mode | Dark Mode | Usage |
|--------------|------------|-----------|-------|
| `--color-surface-solid` | `rgba(255, 255, 255, 0.92)` | `rgba(17, 17, 27, 0.95)` | Highest opacity. Sidebars, top bars. |
| `--color-surface-elevated` | `rgba(255, 255, 255, 0.80)` | `rgba(30, 30, 46, 0.85)` | Medium opacity. Cards, modals, slide-overs. |
| `--color-surface-data` | `rgba(255, 255, 255, 0.65)` | `rgba(40, 40, 60, 0.70)` | Slightly transparent. Data tables, stat cards. |
| `--color-surface-subtle` | `rgba(255, 255, 255, 0.40)` | `rgba(55, 55, 75, 0.45)` | Lowest opacity. Hover states, separators, ghosts. |
| `--color-background` | `#f8fafc` | `#0d0d14` | Page/body background behind all glass. |
| `--color-background-subtle` | `#f1f5f9` | `#111118` | Subtle background variation. |

### 2.4 Text Colors

| CSS Variable | Light Mode | Dark Mode | Usage |
|--------------|------------|-----------|-------|
| `--color-text-primary` | `#0f172a` | `#f1f5f9` | Headings, primary body text, high-emphasis content. |
| `--color-text-secondary` | `#475569` | `#94a3b8` | Secondary text, descriptions, supporting content. |
| `--color-text-muted` | `#94a3b8` | `#64748b` | Placeholders, captions, disabled labels, timestamps. |
| `--color-text-disabled` | `#cbd5e1` | `#475569` | Disabled input text, inactive elements. |
| `--color-text-inverse` | `#ffffff` | `#0f172a` | Text on primary-colored backgrounds. |
| `--color-text-link` | `var(--color-primary-500)` | `var(--color-primary-400)` | Links and link-like interactive text. |

### 2.5 Accent Color

A distinctive warm accent used sparingly for attention-drawing elements: active sidebar indicators, notification badges, key highlights.

| CSS Variable | Light Mode | Dark Mode | Usage |
|--------------|------------|-----------|-------|
| `--color-accent` | `#f97316` | `#fb923c` | **Primary accent.** Active sidebar indicator, notification dots, key highlights. |
| `--color-accent-light` | `#fed7aa` | `#7c2d12` | Accent light background tint. |
| `--color-accent-dark` | `#c2410c` | `#fdba74` | Accent dark variant, accent text on light bg. |
| `--color-accent-muted` | `#fdba74` | `#9a3412` | Muted accent, secondary accent elements. |

### 2.6 Border Colors

| CSS Variable | Light Mode | Dark Mode | Usage |
|--------------|------------|-----------|-------|
| `--color-border-default` | `rgba(0, 0, 0, 0.08)` | `rgba(255, 255, 255, 0.08)` | Default borders on glass panels, inputs. |
| `--color-border-strong` | `rgba(0, 0, 0, 0.15)` | `rgba(255, 255, 255, 0.15)` | Stronger borders for emphasis, focus rings. |
| `--color-border-focus` | `var(--color-primary-500)` | `var(--color-primary-400)` | Input focus border. |
| `--color-border-error` | `var(--color-error-500)` | `var(--color-error-500)` | Validation error border. |

### 2.7 Dark Mode Switching Mechanism

Dark mode is implemented by re-declaring all CSS variables under the `[data-theme="dark"]` selector. The `data-theme` attribute is set on the `<html>` element.

```css
:root {
  --color-primary-500: #6366f1;
  --color-text-primary: #0f172a;
  --color-background: #f8fafc;
  /* ... all light mode tokens */
}

[data-theme="dark"] {
  --color-primary-500: #818cf8;
  --color-text-primary: #f1f5f9;
  --color-background: #0d0d14;
  /* ... all dark mode tokens */
}
```

Tailwind's `dark:` variant is **never used**. All theme-aware styling references CSS variables via `var(--color-*)`. See §10 for full implementation details.

---

## 3. Design Tokens — Typography

### 3.1 Font Family

| CSS Variable | Value | Fallback | Usage |
|--------------|-------|----------|-------|
| `--font-sans` | `'Vazirmatn', sans-serif` | Tahoma, Arial | All Persian and Latin UI text. |
| `--font-mono` | `'JetBrains Mono', 'Fira Code', monospace` | `monospace` | Code blocks, terminal output, JSON, technical values. |

Vazirmatn is self-hosted from `/public/fonts/`. It is preloaded with `font-display: swap` to prevent layout shift. Persian text automatically renders with Vazirmatn through the `--font-sans` token. Latin text within Persian content also uses Vazirmatn (which includes Latin glyphs).

### 3.2 Type Scale

All font sizes are defined as CSS variables. Hardcoded font sizes are forbidden per Engineering Rules §10.1.4.

| CSS Variable | Token Name | Font Size | Font Weight | Line Height | Letter Spacing | Usage |
|--------------|------------|-----------|-------------|-------------|----------------|-------|
| `--text-caption-xs` | `caption-xs` | `10px` | `400` | `14px` | `0.02em` | Metadata, micro-labels, table footers. |
| `--text-caption-sm` | `caption-sm` | `12px` | `400` | `16px` | `0.01em` | Captions, stat card labels, timestamps, helper text. |
| `--text-body-sm` | `body-sm` | `13px` | `400` | `18px` | `0` | Secondary body text, table cells, descriptions. |
| `--text-body-md` | `body-md` | `14px` | `400` | `20px` | `0` | **Default body text.** Form labels, paragraphs, list items. |
| `--text-body-lg` | `body-lg` | `16px` | `400` | `24px` | `0` | Emphasized body text, chat messages, form input values. |
| `--text-heading-sm` | `heading-sm` | `18px` | `600` | `26px` | `-0.01em` | Section headings, card titles, sidebar section labels. |
| `--text-heading-md` | `heading-md` | `20px` | `600` | `28px` | `-0.01em` | Page sub-headings, dialog titles, form section headers. |
| `--text-heading-lg` | `heading-lg` | `24px` | `600` | `32px` | `-0.02em` | Page titles, major section headings. |
| `--text-heading-xl` | `heading-xl` | `30px` | `700` | `38px` | `-0.02em` | Dashboard hero metrics, empty state titles. |
| `--text-heading-2xl` | `heading-2xl` | `36px` | `700` | `44px` | `-0.03em` | Stat card values, major KPI displays. |
| `--text-display` | `display` | `48px` | `700` | `56px` | `-0.03em` | Hero sections, marketing pages, onboarding. |

### 3.3 Monospace Scale

| CSS Variable | Token Name | Font Size | Line Height | Usage |
|--------------|------------|-----------|-------------|-------|
| `--text-mono-sm` | `mono-sm` | `12px` | `16px` | Inline code, small code references. |
| `--text-mono-md` | `mono-md` | `13px` | `18px` | Code blocks in chat, JSON display. |
| `--text-mono-lg` | `mono-lg` | `14px` | `20px` | Full code blocks, terminal output. |

### 3.4 Font Weight Tokens

| CSS Variable | Value | Usage |
|--------------|-------|-------|
| `--font-weight-regular` | `400` | Body text, captions, form values. |
| `--font-weight-medium` | `500` | Emphasized labels, button text, table headers. |
| `--font-weight-semibold` | `600` | Headings, navigation items, active states. |
| `--font-weight-bold` | `700` | Display text, major KPI values, brand text. |

---

## 4. Design Tokens — Spacing

All spacing values are based on a **4px grid**. Tailwind utility classes (`p-4`, `gap-2`, `m-6`) map to this scale. Semantic spacing tokens exist for common patterns.

### 4.1 Spacing Scale

| CSS Variable | Token Name | Value | Tailwind Equivalent |
|--------------|------------|-------|---------------------|
| `--space-1` | `space-1` | `4px` | `1` (e.g., `p-1`) |
| `--space-2` | `space-2` | `8px` | `2` (e.g., `p-2`, `gap-2`) |
| `--space-3` | `space-3` | `12px` | `3` (e.g., `p-3`) |
| `--space-4` | `space-4` | `16px` | `4` (e.g., `p-4`, `gap-4`) |
| `--space-5` | `space-5` | `20px` | `5` (e.g., `p-5`) |
| `--space-6` | `space-6` | `24px` | `6` (e.g., `p-6`, `gap-6`) |
| `--space-8` | `space-8` | `32px` | `8` (e.g., `p-8`) |
| `--space-10` | `space-10` | `40px` | `10` (e.g., `p-10`) |
| `--space-12` | `space-12` | `48px` | `12` (e.g., `p-12`) |
| `--space-16` | `space-16` | `64px` | `16` (e.g., `p-16`) |
| `--space-20` | `space-20` | `80px` | `20` (e.g., `p-20`) |

### 4.2 Semantic Spacing

| CSS Variable | Value | Usage |
|--------------|-------|-------|
| `--space-component-gap` | `var(--space-4)` | Default gap between sibling components. |
| `--space-section-gap` | `var(--space-8)` | Gap between major page sections. |
| `--space-page-padding` | `var(--space-6)` | Default page content padding (`p-6`). |
| `--space-input-padding-x` | `var(--space-3)` | Input horizontal padding. |
| `--space-input-padding-y` | `var(--space-2)` | Input vertical padding. |
| `--space-card-padding` | `var(--space-6)` | Default card inner padding. |
| `--space-table-cell-padding` | `var(--space-3) var(--space-4)` | Table cell padding (block × inline). |

---

## 5. Design Tokens — Border Radius

| CSS Variable | Token Name | Value | Usage |
|--------------|------------|-------|-------|
| `--radius-xs` | `radius-xs` | `2px` | Subtle rounding: code blocks, inline tags, small badges. |
| `--radius-sm` | `radius-sm` | `4px` | Inputs, small buttons, select dropdowns. |
| `--radius-md` | `radius-md` | `8px` | **Default radius.** Cards, dialogs, buttons, tooltips. |
| `--radius-lg` | `radius-lg` | `12px` | Large cards, modals, slide-overs, popovers. |
| `--radius-xl` | `radius-xl` | `16px` | Hero sections, large panels, onboarding cards. |
| `--radius-2xl` | `radius-2xl` | `24px` | Feature showcases, large decorative containers. |
| `--radius-full` | `radius-full` | `9999px` | Circles: avatars, status dots, pill buttons, badges. |

---

## 6. Design Tokens — Shadows

HotHoosh's glass morphism aesthetic relies on `backdrop-filter: blur()` for depth rather than heavy box-shadows. Shadows are used sparingly and only for elements that need to float above glass surfaces (dropdowns, popovers, tooltips).

### 6.1 Shadow Scale

| CSS Variable | Light Mode | Dark Mode | Usage |
|--------------|------------|-----------|-------|
| `--shadow-xs` | `0 1px 2px rgba(0, 0, 0, 0.04)` | `0 1px 2px rgba(0, 0, 0, 0.20)` | Minimal elevation: subtle cards. |
| `--shadow-sm` | `0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)` | `0 1px 3px rgba(0, 0, 0, 0.30), 0 1px 2px rgba(0, 0, 0, 0.20)` | Small elevation: dropdowns, popovers. |
| `--shadow-md` | `0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.04)` | `0 4px 6px rgba(0, 0, 0, 0.35), 0 2px 4px rgba(0, 0, 0, 0.25)` | Medium elevation: slide-overs, command palette. |
| `--shadow-lg` | `0 10px 15px rgba(0, 0, 0, 0.06), 0 4px 6px rgba(0, 0, 0, 0.04)` | `0 10px 15px rgba(0, 0, 0, 0.40), 0 4px 6px rgba(0, 0, 0, 0.30)` | High elevation: modals, dialogs. |
| `--shadow-xl` | `0 20px 25px rgba(0, 0, 0, 0.06), 0 8px 10px rgba(0, 0, 0, 0.04)` | `0 20px 25px rgba(0, 0, 0, 0.45), 0 8px 10px rgba(0, 0, 0, 0.35)` | Maximum elevation: fullscreen overlays. |

### 6.2 Glass Depth Rule

Glass panels **do not** use `box-shadow` for depth. Depth is achieved exclusively through:

1. **Opacity differential** — more opaque surfaces appear closer to the viewer.
2. **Backdrop blur** — higher blur values increase perceived distance from the background.
3. **Border** — a subtle `1px solid` border with `--color-border-default` separates glass layers.

Shadows are reserved for elements that must appear to "float" above all glass surfaces: dropdown menus, tooltip popovers, modal overlays, and the command palette.

---

## 7. Design Tokens — Glass Surfaces

The four glass surface types form the backbone of the visual hierarchy. Each tier has a defined background opacity, blur value, and border treatment.

### 7.1 glass-panel-solid

**Highest opacity.** Used for structural chrome that must feel anchored and permanent.

| Property | Light Mode | Dark Mode |
|----------|------------|-----------|
| Background | `var(--color-surface-solid)` → `rgba(255, 255, 255, 0.92)` | `var(--color-surface-solid)` → `rgba(17, 17, 27, 0.95)` |
| Backdrop Filter | `blur(16px) saturate(180%)` | `blur(16px) saturate(180%)` |
| Border | `1px solid var(--color-border-default)` | `1px solid var(--color-border-default)` |
| Shadow | `none` | `none` |

**Usage:** Sidebars (workspace and admin), top bars, bottom navigation bars, fixed structural panels.

```css
.glass-panel-solid {
  background: var(--color-surface-solid);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid var(--color-border-default);
}
```

### 7.2 glass-panel-elevated

**Medium opacity.** Used for content containers that float above the page background but below structural chrome.

| Property | Light Mode | Dark Mode |
|----------|------------|-----------|
| Background | `var(--color-surface-elevated)` → `rgba(255, 255, 255, 0.80)` | `var(--color-surface-elevated)` → `rgba(30, 30, 46, 0.85)` |
| Backdrop Filter | `blur(12px) saturate(160%)` | `blur(12px) saturate(160%)` |
| Border | `1px solid var(--color-border-default)` | `1px solid var(--color-border-default)` |
| Shadow | `none` | `none` |

**Usage:** Cards, modals, slide-over panels, dialog containers, form sections, chat panels.

```css
.glass-panel-elevated {
  background: var(--color-surface-elevated);
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
}
```

### 7.3 glass-panel-data

**Slightly transparent.** Used for data-dense surfaces where readability is critical but visual layering is still needed.

| Property | Light Mode | Dark Mode |
|----------|------------|-----------|
| Background | `var(--color-surface-data)` → `rgba(255, 255, 255, 0.65)` | `var(--color-surface-data)` → `rgba(40, 40, 60, 0.70)` |
| Backdrop Filter | `blur(8px) saturate(140%)` | `blur(8px) saturate(140%)` |
| Border | `1px solid var(--color-border-default)` | `1px solid var(--color-border-default)` |
| Shadow | `none` | `none` |

**Usage:** Data tables, stat cards (KPI cards), chart containers, metric panels, admin dashboard cards.

```css
.glass-panel-data {
  background: var(--color-surface-data);
  backdrop-filter: blur(8px) saturate(140%);
  -webkit-backdrop-filter: blur(8px) saturate(140%);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
}
```

### 7.4 glass-panel-subtle

**Lowest opacity.** Used for interactive feedback and visual separation without creating a heavy surface.

| Property | Light Mode | Dark Mode |
|----------|------------|-----------|
| Background | `var(--color-surface-subtle)` → `rgba(255, 255, 255, 0.40)` | `var(--color-surface-subtle)` → `rgba(55, 55, 75, 0.45)` |
| Backdrop Filter | `blur(4px) saturate(120%)` | `blur(4px) saturate(120%)` |
| Border | `1px solid var(--color-border-default)` | `1px solid var(--color-border-default)` |
| Shadow | `none` | `none` |

**Usage:** Hover states on rows/items, subtle separators, ghost buttons background, drag preview, selection highlight.

```css
.glass-panel-subtle {
  background: var(--color-surface-subtle);
  backdrop-filter: blur(4px) saturate(120%);
  -webkit-backdrop-filter: blur(4px) saturate(120%);
  border: 1px solid var(--color-border-default);
}
```

---

## 8. Design Tokens — Animation

### 8.1 Duration Scale

| CSS Variable | Value | Usage |
|--------------|-------|-------|
| `--duration-75` | `75ms` | Micro-interactions: hover color change, toggle switch, checkbox fill. |
| `--duration-150` | `150ms` | Small transitions: button press, tooltip appear, badge pulse. |
| `--duration-200` | `200ms` | Standard transitions: slide-over open/close, filter bar expand. |
| `--duration-300` | `300ms` | Medium transitions: modal open/close, page transitions, tab content switch. |
| `--duration-500` | `500ms` | Large transitions: complex layout changes, multi-element staggered reveals. |

### 8.2 Easing Functions

| CSS Variable | Value | Usage |
|--------------|-------|-------|
| `--ease-out` | `cubic-bezier(0.0, 0.0, 0.2, 1)` | Elements entering the viewport or appearing. |
| `--ease-in-out` | `cubic-bezier(0.4, 0.0, 0.2, 1)` | State changes that reverse (hover in/out, toggle). |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful, bouncy interactions: toast entrance, notification badge pop. |

### 8.3 Animation Rules

| Rule | Description |
|------|-------------|
| Only animate `transform` and `opacity` | Animating layout properties (`width`, `height`, `top`, `margin`, `padding`) causes layout reflow. This is forbidden per Engineering Rules §10.1.4. |
| Use `will-change` sparingly | Apply `will-change: transform, opacity` only to elements that are currently animating, and remove it when the animation completes. |
| Respect `prefers-reduced-motion` | When `prefers-reduced-motion: reduce` is active, all transitions and animations are disabled. State changes are instant. |
| Stagger with delay, not duration | When animating multiple elements in sequence, use `transition-delay` increments (not different durations) to maintain visual consistency. |

### 8.4 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

This is the only context where `!important` is permitted (per Engineering Rules §10.1.4 exception).

---

## 9. Component Library

All components are part of the shared `@hotHoosh/ui` package (`packages/ui/`). Each component lives in its own directory with component file, test file, and barrel export. Admin-specific shared components are defined in Admin Panel §9.19 and are also implemented in this library.

### 9.1 Layout

| Component | Description | Variants | Key Props |
|-----------|-------------|----------|-----------|
| **WorkspaceShell** | Root layout for the user-facing workspace. Contains sidebar, top bar, and content area. Fixed sidebar + scrollable content. | — | `sidebarCollapsed: boolean`, `onSidebarToggle: () => void` |
| **AdminShell** | Root layout for the admin panel. Separate from WorkspaceShell — no shared state or CSS leakage. Fixed sidebar + top bar + scrollable content. | — | `sidebarCollapsed: boolean`, `onSidebarToggle: () => void` |
| **Sidebar** | Collapsible navigation sidebar. Glass-panel-solid surface. Grouped nav items with collapsible sections. Active state uses accent color with `border-inline-start` indicator. | `workspace` / `admin` | `items: NavItem[]`, `collapsed: boolean`, `activeId: string`, `onNavigate: (id: string) => void` |
| **TopBar** | Fixed top bar. Glass-panel-solid surface. Contains logo, global search trigger, notifications, and user menu. | `workspace` / `admin` | `tenantScope?: TenantScope`, `user: User`, `notificationCount: number` |
| **Breadcrumb** | Horizontal breadcrumb trail showing the current route hierarchy. Auto-generated from the route config. | `withIcons` / `withoutIcons` | `items: BreadcrumbItem[]`, `separator?: ReactNode` |

### 9.2 Navigation

| Component | Description | Variants | Key Props |
|-----------|-------------|----------|-----------|
| **NavLink** | Single sidebar navigation link. Supports icon, label, badge count, and nested children. | `default` / `active` / `disabled` | `icon: IconComponent`, `label: string`, `href: string`, `active: boolean`, `badge?: number`, `children?: NavItem[]` |
| **TabNav** | Horizontal tab navigation bar. Used in detail pages and admin panel content areas. Scrollable on mobile. | `underline` / `pill` | `tabs: Tab[]`, `activeId: string`, `onChange: (id: string) => void` |
| **CommandPalette** | Global command palette triggered by `Cmd+K` / `Ctrl+K`. Fuzzy search across entities with grouped results, recent searches, and quick actions. Keyboard navigable. | — | `open: boolean`, `onOpenChange: (open: boolean) => void`, `groups: CommandGroup[]` |

### 9.3 Data Display

| Component | Description | Variants | Key Props |
|-----------|-------------|----------|-----------|
| **DataTable** | Wrapper around TanStack Table. Column definitions, sorting, pagination, row selection, empty state, loading skeleton, column visibility toggle, row virtualization. | — | `columns: ColumnDef<T>[]`, `data: T[]`, `pagination: PaginationConfig`, `onRowClick?: (row: T) => void`, `selection?: SelectionConfig`, `virtual?: boolean` |
| **StatCard** | KPI card for dashboards. Icon, label, value (heading-2xl), trend indicator, click handler. Glass-panel-data surface. | — | `icon: IconComponent`, `label: string`, `value: string \| number`, `trend?: { direction: 'up' \| 'down' \| 'neutral', value: string }`, `onClick?: () => void`, `loading?: boolean` |
| **StatusBadge** | Reusable badge for entity status. Dot + text. | `active` / `inactive` / `suspended` / `pending` / `processing` / `failed` / `draft` | `status: StatusVariant`, `label?: string`, `size?: 'sm' \| 'md'` |
| **Avatar** | User avatar with image fallback to initials. | `sm` (32px) / `md` (40px) / `lg` (48px) / `xl` (64px) | `src?: string`, `name: string`, `size: AvatarSize` |
| **EmptyState** | Centered empty state for tables and pages. Icon, title, description, optional action button, optional illustration. | — | `icon: IconComponent`, `title: string`, `description?: string`, `primaryAction?: { label: string, onClick: () => void }`, `illustration?: ReactNode` |
| **Skeleton** | Loading placeholder that matches the shape of the content it replaces. | `text` / `circle` / `rect` / `card` / `table-row` | `variant: SkeletonVariant`, `width?: string \| number`, `height?: string \| number`, `lines?: number` |
| **FilterBar** | Composable horizontal filter row. URL-synced filters, debounced search, clear all, collapsible on mobile. | — | `filters: FilterConfig[]`, `values: Record<string, unknown>`, `onChange: (values: Record<string, unknown>) => void` |

### 9.4 Forms

| Component | Description | Variants | Key Props |
|-----------|-------------|----------|-----------|
| **Input** | Text input with label, helper text, and error state. RTL-aware. | `default` / `error` / `disabled` / `search` | `label: string`, `placeholder?: string`, `value: string`, `onChange: (value: string) => void`, `error?: string`, `disabled?: boolean` |
| **Select** | Dropdown selection with label and error state. | `default` / `error` / `disabled` / `searchable` | `label: string`, `options: SelectOption[]`, `value?: string`, `onChange: (value: string) => void`, `placeholder?: string`, `error?: string` |
| **Combobox** | Searchable dropdown with free-text option. Used for entity selection (users, agents, workspaces). | `default` / `creatable` / `multi` | `label: string`, `options: ComboboxOption[]`, `value?: string \| string[]`, `onChange: (value) => void`, `onSearch: (query: string) => void`, `loading?: boolean` |
| **DatePicker** | Solar Hijri date picker. Calendar grid with Persian month/day names, single and range modes, Jalaali-JS integration. | `single` / `range` | `label: string`, `value?: string \| [string, string]`, `onChange: (value) => void`, `minDate?: string`, `maxDate?: string` |
| **Toggle** | On/off switch with label. | `default` / `disabled` | `label: string`, `checked: boolean`, `onChange: (checked: boolean) => void`, `disabled?: boolean` |
| **Checkbox** | Checkbox with label. | `default` / `error` / `disabled` / `indeterminate` | `label: string`, `checked: boolean`, `onChange: (checked: boolean) => void`, `error?: string`, `indeterminate?: boolean` |
| **RadioGroup** | Radio button group with label. | `default` / `disabled` / `card` | `label: string`, `options: RadioOption[]`, `value?: string`, `onChange: (value: string) => void` |
| **Textarea** | Multi-line text input with label, character count, and error state. | `default` / `error` / `disabled` | `label: string`, `value: string`, `onChange: (value: string) => void`, `maxLength?: number`, `error?: string`, `rows?: number` |
| **FileUpload** | File upload area with drag-and-drop, progress indicator, and file list. | `single` / `multi` | `label: string`, `accept?: string`, `maxSize?: number`, `value?: File[]`, `onChange: (files: File[]) => void`, `uploading?: boolean`, `progress?: number` |
| **TagInput** | Input that converts entered text into tags/pills. Used for adding labels, categories, or multi-value fields. | — | `label: string`, `tags: string[]`, `onChange: (tags: string[]) => void`, `placeholder?: string`, `suggestions?: string[]` |

### 9.5 Feedback

| Component | Description | Variants | Key Props |
|-----------|-------------|----------|-----------|
| **Toast** | Non-blocking notification toast. Appears at bottom-start (RTL: bottom-right). Auto-dismisses. | `success` / `error` / `warning` / `info` | `title: string`, `description?: string`, `variant: ToastVariant`, `duration?: number` |
| **ConfirmationDialog** | Modal for confirming destructive or significant actions. Supports severity levels and text-input confirmation for high-risk actions. | `danger` / `warning` / `info` | `title: string`, `description: string`, `severity: SeverityLevel`, `confirmText?: string`, `confirmationInput?: string`, `onConfirm: () => void`, `onCancel: () => void` |
| **AlertDialog** | Modal for non-destructive important information. Title, description, single dismiss button. | — | `title: string`, `description: string`, `dismissLabel: string` |
| **Progress** | Progress indicator bar. | `linear` / `circular` | `value: number`, `max?: number`, `label?: string`, `size?: 'sm' \| 'md' \| 'lg'` |
| **Spinner** | Loading spinner. | `sm` (16px) / `md` (24px) / `lg` (40px) | `size: SpinnerSize`, `label?: string` (for screen readers) |

### 9.6 Overlays

| Component | Description | Variants | Key Props |
|-----------|-------------|----------|-----------|
| **Dialog** | Centered modal dialog with overlay backdrop, focus trap, and close-on-escape. | `default` / `full-screen` | `open: boolean`, `onOpenChange: (open: boolean) => void`, `title: string`, `children: ReactNode`, `footer?: ReactNode` |
| **SlideOver** | Panel that slides in from the `start` edge (right in RTL, left in LTR). Used for create/edit forms. Overlay backdrop with click-to-close. | `default` (400px) / `wide` (600px) | `open: boolean`, `onOpenChange: (open: boolean) => void`, `title: string`, `subtitle?: string`, `children: ReactNode`, `footer?: ReactNode` |
| **Drawer** | Bottom drawer for mobile. Slides up from bottom edge. | `default` / `full-height` | `open: boolean`, `onOpenChange: (open: boolean) => void`, `title: string`, `children: ReactNode` |
| **Popover** | Floating panel positioned relative to a trigger. Click or hover to open. | `click` / `hover` | `trigger: ReactNode`, `content: ReactNode`, `align?: 'start' \| 'center' \| 'end'`, `side?: 'top' \| 'bottom' \| 'inline-start' \| 'inline-end'` |
| **DropdownMenu** | Dropdown menu triggered by a button. Keyboard navigable. | — | `trigger: ReactNode`, `items: MenuItem[]`, `align?: 'start' \| 'end'` |
| **Tooltip** | Small informational popup on hover/focus. | `default` / `info` / `error` | `content: string`, `children: ReactNode`, `side?: 'top' \| 'bottom' \| 'inline-start' \| 'inline-end'`, `delay?: number` |

### 9.7 Chat

| Component | Description | Variants | Key Props |
|-----------|-------------|----------|-----------|
| **ChatInput** | Multi-line chat input with agent selector, knowledge base toggle, memory pack selector, file attachment, and send button. | `default` / `disabled` / `streaming` | `value: string`, `onChange: (value: string) => void`, `onSend: () => void`, `onAttach: (files: File[]) => void`, `disabled?: boolean`, `isStreaming?: boolean` |
| **MessageList** | Scrollable list of chat messages with auto-scroll to bottom on new messages. Virtualized for performance (100+ messages). | — | `messages: Message[]`, `isLoading: boolean`, `onLoadMore: () => void`, `hasMore: boolean` |
| **MessageBubble** | Single chat message. User messages and AI messages have distinct styling. Supports markdown rendering, code blocks, and copy button. | `user` / `assistant` / `system` | `message: Message`, `onCopy?: (text: string) => void`, `onRegenerate?: (messageId: string) => void` |
| **BranchSelector** | Inline control for navigating between message branches. Shows branch count and allows switching. | `compact` / `expanded` | `branches: Branch[]`, `activeBranchIndex: number`, `onSelect: (index: number) => void` |
| **StreamingIndicator** | Animated indicator showing AI is generating a response. Pulsing dots or typing animation. | `dots` / `typing` | `agentName?: string` |
| **AgentSelector** | Dropdown or sidebar selector for choosing which AI agent to converse with. Shows agent name, avatar, and status. | `dropdown` / `sidebar` | `agents: Agent[], `activeAgentId: string`, `onSelect: (agentId: string) => void` |

### 9.8 Admin Shared Components (§9.19 Reference)

The following components are shared across all admin pages and are part of the core component library:

| Component | Description | Key Features |
|-----------|-------------|--------------|
| **DataTable** | (See §9.3) TanStack Table wrapper with sorting, pagination, row selection, virtualization, empty state, loading skeleton. | Type-safe generics, column visibility toggle, responsive horizontal scroll. |
| **FilterBar** | (See §9.3) Composable filter row with URL sync. | Debounced search (300ms), collapsible on mobile, active filter count badge. |
| **SlideOver** | (See §9.6) Start-edge sliding panel. | 400px / 600px width, focus trap, Escape to close, 200ms ease-out animation. |
| **DetailPageLayout** | Layout wrapper for detail pages. | Back button, breadcrumb, page header, tab navigation, content area, optional side panel. |
| **StatusBadge** | (See §9.3) Entity status badge. | 7 status variants: active, inactive, suspended, pending, processing, failed, draft. |
| **StatCard** | (See §9.3) Dashboard KPI card. | Icon, label, value (heading-2xl), trend indicator, loading skeleton, glass-panel-data surface. |
| **ConfirmationDialog** | (See §9.5) Destructive action confirmation. | Severity levels (danger/warning/info), text-input confirmation for high-risk actions. |
| **EmptyState** | (See §9.3) Empty state placeholder. | Icon, title, description, optional SVG illustration, primary/secondary actions. |
| **DatePicker** | (See §9.4) Solar Hijri date picker. | Persian month/day names, single/range modes, Jalaali-JS, RTL keyboard navigation. |
| **CommandPalette** | (See §9.2) Global Cmd+K search. | Fuzzy search, grouped results, recent searches (max 10), quick actions, keyboard navigation. |

---

## 10. Dark Mode Implementation

### 10.1 Mechanism

Dark mode is implemented exclusively through **CSS variable switching** on the `<html>` element. The `data-theme` attribute controls which set of variable values is active.

```html
<html lang="fa" dir="rtl" data-theme="dark">
```

```css
/* Light mode (default) */
:root {
  --color-primary-500: #6366f1;
  --color-text-primary: #0f172a;
  --color-background: #f8fafc;
  --color-surface-solid: rgba(255, 255, 255, 0.92);
  /* ... all light tokens */
}

/* Dark mode */
[data-theme="dark"] {
  --color-primary-500: #818cf8;
  --color-text-primary: #f1f5f9;
  --color-background: #0d0d14;
  --color-surface-solid: rgba(17, 17, 27, 0.95);
  /* ... all dark tokens */
}
```

### 10.2 Rules

| Rule | Description |
|------|-------------|
| No Tailwind `dark:` variant | Tailwind's class-based dark mode is forbidden. All theme-aware values use `var(--color-*)`. This is non-negotiable per Engineering Rules §10.1.4. |
| No hardcoded colors | Hex, rgb, hsl values are forbidden. The only exceptions are `transparent` and `currentColor`. |
| Variable-only references | Components reference tokens, never raw values: `background: var(--color-surface-elevated)`, not `background: rgba(255,255,255,0.8)`. |
| Tailwind for layout only | Layout (flex, grid, spacing, sizing) uses Tailwind utilities. Colors, shadows, and effects use design token CSS variables via `var()`. |

### 10.3 Theme Toggle Component

| Prop | Type | Description |
|------|------|-------------|
| `theme` | `'light' \| 'dark' \| 'system'` | Current theme selection. |
| `onThemeChange` | `(theme: ThemePreference) => void` | Callback when user selects a theme. |

The toggle offers three options: light (☀️), dark (🌙), and system (follows OS preference). The icon-only toggle cycles through the three states on click. An expanded popover shows all three options with labels.

### 10.4 System Preference Detection

On initial load (and on change), the app detects the OS preference via `window.matchMedia('(prefers-color-scheme: dark)')`:

1. If the user has an explicit preference stored (`theme` in user preferences API), use it.
2. If no stored preference, follow the system preference.
3. If system preference changes and user has not set an explicit preference, follow the new system preference.
4. If user has set an explicit preference, system changes are ignored.

### 10.5 Persistence

Theme preference is stored per-user in the backend API (`PATCH /users/me/preferences { theme: 'dark' }`). On login, the preference is fetched and applied before the first render to prevent flash-of-wrong-theme (FOWT). The value is also cached in `localStorage` as a fallback for offline/reduced-functionality scenarios.

---

## 11. Responsive Breakpoints

### 11.1 Breakpoint Definitions

| Name | Min Width | Tailwind Prefix | Description |
|------|-----------|-----------------|-------------|
| `sm` | `640px` | `sm:` | Large phones / small tablets in landscape. |
| `md` | `768px` | `md:` | Tablets in portrait. |
| `lg` | `1024px` | `lg:` | Small laptops / large tablets. |
| `xl` | `1440px` | `xl:` | Desktops and large screens. |

### 11.2 Layout Behavior by Breakpoint

#### Mobile (< 640px)

| Element | Behavior |
|---------|----------|
| **Sidebar** | Hidden by default. Accessible via hamburger menu as a Drawer (bottom sheet or full-height overlay). |
| **Top bar** | Full-width, compact. Logo only (no text). Search icon triggers CommandPalette. |
| **Content area** | Full-width with `var(--space-4)` padding. |
| **Data tables** | Horizontal scroll with sticky first column and action column. Alternatively, card-based layout for simple entities. |
| **Stat cards** | Stacked vertically (1 column). |
| **SlideOver** | Replaced by Drawer (bottom sheet). |
| **Tab navigation** | Horizontally scrollable with fade edges. |
| **Filter bar** | Collapsed behind a toggle button. |
| **Chat** | Full-screen message list with input fixed at bottom. Agent selector as a dropdown. |

#### Tablet (640px–1023px)

| Element | Behavior |
|---------|----------|
| **Sidebar** | Collapsed (icons only, 64px wide) by default. Expandable on hover or toggle. |
| **Top bar** | Full-width with logo text and condensed search. |
| **Content area** | `var(--space-6)` padding. |
| **Data tables** | Horizontal scroll. Key columns visible, less-important columns hidden via column visibility toggle. |
| **Stat cards** | 2-column grid. |
| **SlideOver** | Standard 400px width. |
| **Filter bar** | Visible but wrapped to multiple lines. |

#### Desktop (1024px–1439px)

| Element | Behavior |
|---------|----------|
| **Sidebar** | Expanded (256px / `w-64`) by default. User can collapse to icons-only. |
| **Top bar** | Full with all elements: logo, scope selector, search, notifications, user menu. |
| **Content area** | `var(--space-6)` padding. |
| **Data tables** | Full columns visible. Horizontal scroll only if columns exceed viewport. |
| **Stat cards** | 3-column grid (admin dashboard), 2-column (workspace). |
| **Filter bar** | Single horizontal row. |

#### Large Desktop (≥ 1440px)

| Element | Behavior |
|---------|----------|
| **Sidebar** | Expanded (256px). |
| **Content area** | `var(--space-8)` padding. Max content width `1440px`, centered. |
| **Data tables** | All columns visible, comfortable spacing. |
| **Stat cards** | 3–6 column grid depending on card count. |
| **Admin detail pages** | Split view enabled: list on one side, detail on the other (for roles/permissions). |

### 11.3 Desktop-First for Admin, Mobile-Aware for Workspace

The admin panel is **desktop-first** — it is designed and optimized for 1024px+ screens. Mobile and tablet views are functional but secondary. The user workspace is **mobile-aware** — chat and basic navigation work well on mobile, but complex features (agent configuration, knowledge base management) are optimized for desktop.

---

## 12. Accessibility Standards

All user-facing features meet **WCAG 2.2 Level AA** compliance. This is a requirement, not a goal.

### 12.1 Semantic HTML

| Rule | Description |
|------|-------------|
| Correct elements | Use `<button>` for actions, `<a>` for navigation, `<nav>` for navigation landmarks, `<main>` for main content, `<aside>` for complementary content. |
| No div/span for interaction | Never use `<div>` or `<span>` with `onClick` for interactive elements. Use the correct semantic element. |
| Landmarks | Every page has `<header>`, `<main>`, and (where applicable) `<nav>` and `<aside>` landmarks. |
| Headings | Proper heading hierarchy (`h1` → `h2` → `h3`). Never skip levels. Each page has exactly one `h1`. |

### 12.2 Focus Indicators

| Requirement | Standard |
|-------------|----------|
| Default focus | Never use `outline: none` without a visible replacement. |
| Custom focus ring | Minimum `2px` offset, `3:1` contrast against adjacent background. |
| Focus visible | Use `:focus-visible` (not `:focus`) so keyboard users see the ring but mouse users do not. |
| Focus management — modals | When a dialog opens, focus moves to the first focusable element inside the dialog. When it closes, focus returns to the trigger. |
| Focus management — pages | On navigation, focus moves to the page heading or a skip-link target. |
| Focus trap | Modals, slide-overs, and command palette trap focus within their container. Tab does not escape. |

### 12.3 Color Contrast

| Context | Minimum Ratio |
|---------|---------------|
| Normal text (< 18px, < 14px bold) | **4.5:1** against background |
| Large text (≥ 18px, ≥ 14px bold) | **3:1** against background |
| Non-text UI components (borders, icons, form controls) | **3:1** against adjacent color |
| Focus indicators | **3:1** against background |
| Dark mode | Same requirements as light mode. Dark mode is not an afterthought. |

No information is conveyed by color alone. Status indicators always include text labels or icons in addition to color (e.g., a green dot + "فعال" text, not just a green dot).

### 12.4 Touch Targets

| Context | Minimum Size |
|---------|--------------|
| All interactive elements on mobile | **44 × 44px** minimum |
| Dense data table rows | Expand the tap target with padding to meet 44px, even if the visible element is smaller. |
| Inline links within text | Minimum 44px height tap area via line-height or padding. |
| Icon-only buttons | 44 × 44px container, even if the icon is 16px or 24px. |

### 12.5 Screen Reader Support

| Requirement | Implementation |
|-------------|---------------|
| `alt` text | All images have descriptive `alt` text in the user's current language (Persian by default). |
| Icon-only buttons | Every icon-only button has `aria-label` in Persian (e.g., `aria-label="بستن"` for close). |
| Dynamic content | Chat messages, toast notifications, and real-time status updates use `aria-live="polite"` (or `"assertive"` for critical errors). |
| Loading states | Loading states exceeding 3 seconds announce status via `aria-live`: "در حال بارگذاری..." (Loading...). |
| Dialog roles | Modals use `role="dialog"`, `aria-modal="true"`, `aria-labelledby` (pointing to the dialog title). |
| Tab interfaces | Use `role="tablist"`, `role="tab" with `aria-selected`, `role="tabpanel" with `aria-labelledby`. |
| Data tables | Use `<table>` with proper `<thead>`, `<th scope="col">`, and `<caption>`. |
| Language declaration | `<html lang="fa" dir="rtl">` for Persian. Switches to `lang="en" dir="ltr"` for English. |

### 12.6 Keyboard Navigation

| Requirement | Standard |
|-------------|----------|
| All interactive elements | Reachable and operable via keyboard (Tab, Shift+Tab, Enter, Space, Arrow keys, Escape). |
| Tab order | Follows the visual/logical order of the page (top-to-bottom, start-to-end in RTL). |
| Skip link | A "skip to content" link is the first focusable element on every page. Visible on focus only. |
| Command palette | `Cmd+K` / `Ctrl+K` opens the global command palette. Arrow keys navigate, Enter selects, Escape closes. |
| Dropdown menus | Arrow keys navigate items. Enter selects. Escape closes. Focus returns to trigger. |
| Dialogs | Escape closes. Tab cycles through focusable elements within the dialog. |
| Checkboxes and toggles | Space key toggles state. |
| Radio groups | Arrow keys move between options. |

### 12.7 Reduced Motion

| Requirement | Implementation |
|-------------|---------------|
| `prefers-reduced-motion: reduce` | All transitions and animations are disabled. State changes are instant. |
| Loading indicators | Replace animated spinners with static "در حال بارگذاری..." text or a static progress bar. |
| Streaming indicator | Replace animated dots with static "در حال تولید پاسخ..." text. |
| Auto-scroll | Chat auto-scroll still works (no animation to disable) but does not use smooth scrolling. |

---

## Appendix A: CSS Variable Quick Reference

### A.1 Color Variables (Complete List)

```
/* Primary */
--color-primary-50, --color-primary-100, --color-primary-200, --color-primary-300,
--color-primary-400, --color-primary-500, --color-primary-600, --color-primary-700,
--color-primary-800, --color-primary-900

/* Semantic */
--color-success-50, --color-success-100, --color-success-500, --color-success-600, --color-success-700
--color-warning-50, --color-warning-100, --color-warning-500, --color-warning-600, --color-warning-700
--color-error-50, --color-error-100, --color-error-500, --color-error-600, --color-error-700
--color-info-50, --color-info-100, --color-info-500, --color-info-600, --color-info-700

/* Surface */
--color-surface-solid, --color-surface-elevated, --color-surface-data, --color-surface-subtle
--color-background, --color-background-subtle

/* Text */
--color-text-primary, --color-text-secondary, --color-text-muted, --color-text-disabled,
--color-text-inverse, --color-text-link

/* Accent */
--color-accent, --color-accent-light, --color-accent-dark, --color-accent-muted

/* Border */
--color-border-default, --color-border-strong, --color-border-focus, --color-border-error
```

**Total color tokens: 52**

### A.2 Typography Variables

```
--font-sans, --font-mono
--font-weight-regular, --font-weight-medium, --font-weight-semibold, --font-weight-bold
--text-caption-xs, --text-caption-sm, --text-body-sm, --text-body-md, --text-body-lg
--text-heading-sm, --text-heading-md, --text-heading-lg, --text-heading-xl, --text-heading-2xl
--text-display
--text-mono-sm, --text-mono-md, --text-mono-lg
```

### A.3 Spacing Variables

```
--space-1 (4px), --space-2 (8px), --space-3 (12px), --space-4 (16px), --space-5 (20px),
--space-6 (24px), --space-8 (32px), --space-10 (40px), --space-12 (48px),
--space-16 (64px), --space-20 (80px)

--space-component-gap, --space-section-gap, --space-page-padding,
--space-input-padding-x, --space-input-padding-y, --space-card-padding, --space-table-cell-padding
```

### A.4 Border Radius Variables

```
--radius-xs (2px), --radius-sm (4px), --radius-md (8px), --radius-lg (12px),
--radius-xl (16px), --radius-2xl (24px), --radius-full (9999px)
```

### A.5 Shadow Variables

```
--shadow-xs, --shadow-sm, --shadow-md, --shadow-lg, --shadow-xl
```

### A.6 Animation Variables

```
--duration-75, --duration-150, --duration-200, --duration-300, --duration-500
--ease-out, --ease-in-out, --ease-spring
```

### A.7 Glass Surface Classes

```
.glass-panel-solid   /* backdrop-filter: blur(16px), opacity 0.92/0.95 */
.glass-panel-elevated /* backdrop-filter: blur(12px), opacity 0.80/0.85 */
.glass-panel-data    /* backdrop-filter: blur(8px),  opacity 0.65/0.70 */
.glass-panel-subtle  /* backdrop-filter: blur(4px),  opacity 0.40/0.45 */
```
