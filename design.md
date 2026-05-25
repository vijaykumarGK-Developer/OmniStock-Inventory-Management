# OmniStock Inventory Management System — Complete Design Specification

> **Brand:** Kinetic Enterprise  
> **Theme:** Dark Mode (default) with Glassmorphic accents  
> **Code Name:** OmniStock / StockPro Enterprise v2.0  
> **Design Tool:** Stitch (Tailwind CSS output)

---

## 1. DESIGN SYSTEM — EXACT TOKENS

### 1.1 Color Palette (from Stitch config)

```json
{
  "surface": "#0b1326",
  "surface-dim": "#0b1326",
  "surface-bright": "#31394d",
  "surface-container-lowest": "#060e20",
  "surface-container-low": "#131b2e",
  "surface-container": "#171f33",
  "surface-container-high": "#222a3d",
  "surface-container-highest": "#2d3449",
  "on-surface": "#dae2fd",
  "on-surface-variant": "#c7c4d8",
  "inverse-surface": "#dae2fd",
  "inverse-on-surface": "#283044",
  "outline": "#918fa1",
  "outline-variant": "#464555",
  "surface-tint": "#c3c0ff",
  "primary": "#c3c0ff",
  "on-primary": "#1d00a5",
  "primary-container": "#4f46e5",
  "on-primary-container": "#dad7ff",
  "inverse-primary": "#4d44e3",
  "secondary": "#6bd8cb",
  "on-secondary": "#003732",
  "secondary-container": "#29a195",
  "on-secondary-container": "#00302b",
  "tertiary": "#ffb690",
  "on-tertiary": "#552100",
  "tertiary-container": "#a04500",
  "on-tertiary-container": "#ffd2bd",
  "error": "#ffb4ab",
  "on-error": "#690005",
  "error-container": "#93000a",
  "on-error-container": "#ffdad6",
  "primary-fixed": "#e2dfff",
  "primary-fixed-dim": "#c3c0ff",
  "on-primary-fixed": "#0f0069",
  "on-primary-fixed-variant": "#3323cc",
  "secondary-fixed": "#89f5e7",
  "secondary-fixed-dim": "#6bd8cb",
  "on-secondary-fixed": "#00201d",
  "on-secondary-fixed-variant": "#005049",
  "tertiary-fixed": "#ffdbca",
  "tertiary-fixed-dim": "#ffb690",
  "on-tertiary-fixed": "#341100",
  "on-tertiary-fixed-variant": "#783200",
  "background": "#0b1326",
  "on-background": "#dae2fd",
  "surface-variant": "#2d3449"
}
```

### 1.2 Kinetic Trio — Accent System

| Accent  | Hex       | Usage                              |
| ------- | --------- | ---------------------------------- |
| Teal    | `#0D9488` | Growth, In-Stock, positive trends  |
| Orange  | `#F97316` | Warnings, Low-Stock, critical      |
| Purple  | `#9333EA` | Premium features, data viz clusters|

### 1.3 Typography (Inter only)

| Token              | Size   | Weight | LineH | Tracking | Usage                    |
| ------------------ | ------ | ------ | ----- | -------- | ------------------------ |
| `display-lg`       | 48px   | 700    | 56px  | 0.02em   | Logo, hero titles        |
| `headline-lg`      | 32px   | 600    | 40px  | 0.01em   | Page titles              |
| `headline-lg-mobile`| 24px  | 600    | 32px  | 0.01em   | Page title mobile        |
| `headline-md`      | 24px   | 600    | 32px  | -0.01em  | Section headers          |
| `title-md`         | 20px   | 600    | 28px  | 0.01em   | Card titles, modals      |
| `title-sm`         | 18px   | 600    | 24px  | —        | Sub-headings             |
| `body-md`          | 16px   | 400    | 24px  | 0        | Default body             |
| `body-sm`          | 14px   | 400    | 20px  | —        | Secondary text (or 13/18)|
| `label-sm`         | 12px   | 500    | 16px  | 0.05em   | Badges, table headers    |
| `label-uppercase`  | 11-12px| 600-700| 16px  | 0.05em   | Uppercase labels, nav    |
| `data-tabular`     | 14px   | 500    | 20px  | —        | Numbers, SKU (JetBrains Mono) |

**Font stack:** `'Inter', system-ui, sans-serif` for all text.  
**Mono:** `'JetBrains Mono', monospace` for `data-tabular`.

### 1.4 Spacing Scale

| Token  | Px  | Tailwind  |
| ------ | --- | --------- |
| `xs`   | 4   | `gap-1`   |
| `base` | 8   | `gap-2`   |
| `sm`   | 12  | `gap-3`   |
| `md`   | 24  | `gap-6`   |
| `gutter`| 24 | `p-6`     |
| `lg`   | 40  | `gap-10`  |
| `xl`   | 64  | `gap-16`  |

### 1.5 Border Radius

| Token      | Value  | Tailwind   | Usage             |
| ---------- | ------ | ---------- | ----------------- |
| `rounded-sm` | 4px | `rounded`  | —                 |
| `rounded`   | 8px   | `rounded-lg`| Buttons, inputs  |
| `rounded-md`| 12px  | `rounded-xl`| Cards, containers|
| `rounded-lg`| 16px  | `rounded-2xl`| Modals, hero cards|
| `rounded-full`| 9999px| `rounded-full`| Badges, pills   |

### 1.6 Glassmorphism (exact CSS)

```css
.glass-panel {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.glass-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.glass-input:focus {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
  ring: 1px white/40;
}
```

### 1.7 Gradients (exact)

```css
.bg-gradient-primary {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
}
.bg-gradient-secondary {
  background: linear-gradient(135deg, #29a195 0%, #14b8a6 100%);
}
.bg-gradient-tertiary {
  background: linear-gradient(135deg, #ffb690 0%, #f97316 100%);
}
.shadow-neon-primary {
  box-shadow: 0 4px 20px -2px rgba(79, 70, 229, 0.4);
}
.shadow-soft {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}
```

### 1.8 Shadows

| Shadow     | Value                                                   |
| ---------- | ------------------------------------------------------- |
| `shadow-sm`| `0 1px 2px rgba(0,0,0,0.3)`                              |
| `shadow-md`| `0 4px 6px rgba(0,0,0,0.4)`                              |
| `shadow-lg`| `0 10px 30px rgba(0,0,0,0.5)`                            |
| `glow`     | `0 0 20px rgba(79, 70, 229, 0.4)` (primary-container glow)|
| `neon-primary`| `0 4px 20px -2px rgba(79, 70, 229, 0.4)`            |

### 1.9 Icons

Use **Material Symbols** (Google Fonts icon library) exclusively.

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
```

Default style: `font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;`  
Fill style: add class `.fill` or `data-weight="fill"` + `font-variation-settings: 'FILL' 1;`

**Icon reference (complete list):**
| Feature            | Icon Name        |
| ------------------ | ---------------- |
| Dashboard          | `dashboard`      |
| Products           | `inventory_2`    |
| Sales/POS          | `point_of_sale`  |
| Suppliers          | `conveyor_belt`  |
| Analytics/Reports  | `analytics`      |
| Help               | `help`           |
| Logout             | `logout`         |
| Settings           | `settings`       |
| Notifications      | `notifications`  |
| Search             | `search`         |
| Add                | `add`            |
| Filter             | `filter_list`    |
| Sort               | `sort`           |
| More               | `more_vert`      |
| Download           | `download`       |
| Left chevron       | `chevron_left`   |
| Right chevron      | `chevron_right`  |
| Barcode scanner    | `barcode_scanner`|
| Shopping cart      | `shopping_cart`  |
| Delete sweep       | `delete_sweep`   |
| Calendar           | `calendar_today` |
| Arrow forward      | `arrow_forward`  |
| Trending up        | `trending_up`    |
| Trending down      | `trending_down`  |
| Warning            | `warning`        |
| Info               | `info`           |
| Payments           | `payments`       |
| Receipt            | `receipt_long`   |
| Local shipping     | `local_shipping` |
| Verified           | `verified`       |
| Inventory          | `inventory_2`    |
| Edit               | `edit`           |
| Delete             | `delete`         |
| Close              | `close`          |
| Check              | `check`          |
| Visibility off     | `visibility_off` |
| Mail               | `mail`           |
| Lock               | `lock`           |

### 1.10 Breakpoints

| Screen  | Min Width | Grid Columns |
| ------- | --------- | ------------ |
| Mobile  | 0         | 4            |
| Tablet  | 768px     | 8            |
| Desktop | 1024px    | 12           |
| Wide    | 1440px    | 12           |

---

## 2. GLOBAL LAYOUT

### 2.1 App Shell

```
+-------+----------------------------------------------+
|       |  TOPBAR (h-16, fixed, z-40)                  |
|       |  +-----------+  +-------------------------+  |
|  SIDE |  | Search    |  | Notif | Settings | Avatar|  |
|  260px|  +-----------+  +-------------------------+  |
|  fixed+----------------------------------------------+
|  z-50 |  MAIN CONTENT                                 |
|       |  (ml-[260px], p-gutter, overflow-y-auto)      |
|       |  max-w-[1440px] mx-auto w-full                |
|       |                                               |
|       |  +----------------------------------------+  |
|       |  |  Cards / Tables / Charts / Forms        |  |
|       |  +----------------------------------------+  |
+-------+----------------------------------------------+
```

### 2.2 Sidebar Spec

| Property      | Value                                            |
| ------------- | ------------------------------------------------ |
| Width         | 260px (supplier page), 280px (POS page variant)  |
| Position      | fixed, left-0, top-0, h-screen, z-50             |
| Background    | `bg-surface-container-lowest` or `bg-surface`     |
| Border        | `border-r border-outline-variant`                 |
| Padding       | `py-6 px-4`                                       |
| Shadow        | `shadow-soft` or `shadow-sm`                      |

**Structure (top to bottom):**

```
┌─────────────────────────────────┐
│  Logo Area (px-2, mb-4)         │
│  ┌──┐  StockPro                 │
│  │IC│  Enterprise v2.0          │
│  └──┘                           │
├─────────────────────────────────┤
│  [+ New Entry] (CTA button)     │
├─────────────────────────────────┤
│  Dashboard                      │
│  Products   ◄── active: bg-primary-container│
│  Sales/POS                      │
│  Suppliers                      │
│  Analytics                      │
├─────────────────────────────────┤
│  ────────── border-t ─────────  │
│  Help Center                    │
│  Logout (hover: text-error)     │
└─────────────────────────────────┘
```

**Logo area:**
- Icon: w-10 h-10, `rounded-xl`, `bg-primary-container`, centered icon in `text-primary-fixed`
- Title: `font-title-sm text-title-sm text-on-surface`, "StockPro"
- Subtitle: `font-label-uppercase text-label-uppercase text-on-surface-variant`, "Enterprise v2.0"

**CTA Button:**
- `w-full bg-primary-container hover:bg-inverse-primary hover:text-surface text-primary-fixed rounded-xl py-3`
- Gap-2, flex items-center justify-center
- Icon: `add`, text: "New Entry" or contextual (e.g., "New Product")
- `shadow-sm`, `mb-4`

**Nav items (default state):**
- `flex items-center gap-3 px-3 py-2.5 rounded-xl`
- `text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high`
- `transition-all duration-200 ease-in-out`
- Icon size: `text-[20px]`, Label: `font-label-uppercase text-label-uppercase`

**Nav item (active state):**
- Same layout + `text-primary-fixed bg-primary-container` (or `bg-secondary-container text-on-secondary-container`)
- Some variants use `border-l-4 border-primary` with `bg-surface-container-high`

**Divider:** `border-t border-surface-variant` or `border-outline-variant/30`

**Logout hover:** `hover:text-error hover:bg-error-container/20`

### 2.3 Topbar Spec

| Property      | Value                                            |
| ------------- | ------------------------------------------------ |
| Height        | h-16 (64px)                                      |
| Background    | `bg-surface/80 backdrop-blur-md` or `bg-surface-container-lowest` |
| Border        | `border-b border-outline-variant` or `border-surface-variant` |
| Padding       | `px-gutter` (24px)                               |
| Position      | sticky top-0, z-40                               |
| Layout        | flex, justify-between, items-center              |

**Left side:** Search bar or page branding
- Search: `relative w-full max-w-md`
- Icon: `absolute left-3 top-1/2 -translate-y-1/2 text-outline`
- Input: `pl-10 pr-4 py-2 bg-surface-container border border-outline-variant rounded-full`
- Focus: `focus:border-secondary focus:ring-1 focus:ring-secondary`
- Placeholder: "Search across system..." or context-specific

**Right side:**
- Notification bell: `p-2 rounded-full hover:bg-surface-container-high transition-colors`, `text-outline hover:text-on-surface`
  - With red dot indicator: `absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full shadow-[0_0_8px_rgba(107,216,203,0.8)]`
- Settings gear: same styling as bell
- Avatar: `w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant` (or w-10 with border-2)

### 2.4 Stat Card Pattern (used across all pages)

```html
<div class="bg-gradient-to-br from-surface-container to-surface-container-low border border-surface-variant rounded-2xl p-6 shadow-sm flex items-center gap-4 relative overflow-hidden group">
  <div class="absolute -right-4 -top-4 w-24 h-24 bg-primary-fixed/5 rounded-full blur-xl group-hover:bg-primary-fixed/10 transition-colors"></div>
  <div class="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center text-primary-fixed shadow-sm">
    <span class="material-symbols-outlined text-[28px]">{icon}</span>
  </div>
  <div class="z-10">
    <p class="font-label-uppercase text-label-uppercase text-on-surface-variant">{label}</p>
    <p class="font-headline-md text-headline-md text-on-background mt-1 text-[32px]">{value}</p>
  </div>
</div>
```

**Color variants:**
| Variant         | Card border top | Icon bg    | Icon text          |
| --------------- | --------------- | ---------- | ------------------ |
| Primary (indigo)| `border-t-2 border-t-primary-container` | `bg-primary-container` | `text-primary-fixed` |
| Secondary (teal)| `border-t-2 border-t-secondary-container` | `bg-secondary-container` | `text-on-secondary-container` |
| Tertiary (orange)| `border-t-2 border-t-tertiary-container` | `bg-tertiary-container` | `text-on-tertiary-container` |
| Neutral         | none            | `bg-surface-container-high` | `text-on-surface-variant` |
| Success         | none            | `bg-secondary/20` | `text-secondary` |
| Error           | none            | `bg-error/20` | `text-error` |

### 2.5 Table Pattern (exact)

```html
<div class="bg-surface-container-low border border-surface-variant rounded-2xl shadow-sm overflow-hidden flex flex-col">
  <!-- Table toolbar (optional) -->
  <div class="p-4 border-b border-surface-variant flex justify-between items-center bg-surface-container/50 backdrop-blur-sm">
    <div class="flex gap-3">{filter/sort buttons}</div>
    <button class="...">{export/action}</button>
  </div>
  <!-- Table -->
  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse">
      <thead class="bg-surface-container/30 border-b border-surface-variant">
        <tr>
          <th class="px-6 py-4 font-label-uppercase text-label-uppercase text-on-surface-variant">Name</th>
          <th class="px-6 py-4 ...">...</th>
          <th class="px-6 py-4 ... text-right">Actions</th>
        </tr>
      </thead>
      <tbody class="font-body-sm text-body-sm text-on-surface">
        <tr class="border-b border-surface-variant hover:bg-surface-container/50 h-[56px] transition-colors group cursor-pointer">
          <td class="px-6 font-title-sm text-title-sm text-sm text-primary-fixed">Value</td>
          <td class="px-6">...</td>
          <td class="px-6 text-right">
            <button class="text-on-surface-variant hover:text-primary-fixed opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full hover:bg-surface-container-high">
              <span class="material-symbols-outlined text-[20px]">more_vert</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- Pagination -->
  <div class="p-4 border-t border-surface-variant bg-surface-container/30 flex justify-between items-center text-on-surface-variant font-body-sm text-body-sm">
    <span>Showing 1-5 of 142</span>
    <div class="flex gap-2">
      <button class="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-surface-container-high disabled:opacity-50 transition-colors shadow-sm bg-surface-container" disabled>
        <span class="material-symbols-outlined text-[20px]">chevron_left</span>
      </button>
      <button class="w-10 h-10 rounded-xl flex items-center justify-center bg-primary-container text-primary-fixed shadow-sm">1</button>
      <button class="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-surface-container-high transition-colors shadow-sm bg-surface-container">2</button>
      <button class="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-surface-container-high transition-colors shadow-sm bg-surface-container">3</button>
      <span class="w-10 h-10 flex items-center justify-center">...</span>
      <button class="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-surface-container-high transition-colors shadow-sm bg-surface-container">
        <span class="material-symbols-outlined text-[20px]">chevron_right</span>
      </button>
    </div>
  </div>
</div>
```

### 2.6 Status Badge Spec

| Status            | Bg/Tailwind                     | Text                 |
| ----------------- | ------------------------------- | -------------------- |
| Active / In Stock | `bg-secondary-container text-on-secondary-container` | `shadow-sm` |
| Inactive          | `bg-surface-variant text-on-surface-variant`         | —          |
| Low Stock         | `bg-tertiary-container text-on-tertiary-container`   | `shadow-sm` |
| Out of Stock      | `bg-error/20 text-error`        | `border border-error/30` |
| Review / Pending  | `bg-tertiary/20 text-tertiary` or `bg-amber-500/20 text-amber-400` | — |

**HTML:** `<span class="inline-flex items-center px-3 py-1 rounded-full font-label-sm text-label-sm tracking-wide shadow-sm">{text}</span>`

### 2.7 Content Card Pattern (non-stat)

```html
<div class="bg-surface-container-low border border-surface-variant rounded-2xl shadow-sm overflow-hidden flex flex-col">
  <!-- Optional header -->
  <div class="p-5 border-b border-surface-variant flex justify-between items-center bg-surface-container/50 backdrop-blur-sm">
    <h3 class="font-title-md text-title-md text-on-background">Title</h3>
    <button class="...">Action</button>
  </div>
  <!-- Body -->
  <div class="p-5 flex-1">{content}</div>
</div>
```

### 2.8 Primary Button

```html
<button class="bg-primary-container text-primary-fixed px-6 py-3 rounded-xl font-title-sm text-title-sm flex items-center gap-2 hover:bg-inverse-primary hover:text-surface transition-colors shadow-sm">
  <span class="material-symbols-outlined text-[20px]">add</span>
  Label
</button>
```

**Gradient variant (POS sidebar CTA):**
```html
<button class="w-full bg-gradient-primary shadow-neon-primary text-white font-title-sm text-title-sm py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity transform hover:scale-[1.02] active:scale-[0.98]">
  <span class="material-symbols-outlined">add</span>
  New Entry
</button>
```

### 2.9 Secondary / Ghost Button

```html
<button class="px-4 py-2 rounded-xl border border-surface-variant font-body-sm text-body-sm text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-2 shadow-sm">
  <span class="material-symbols-outlined text-[18px]">filter_list</span>
  Label
</button>
```

### 2.10 Form Input Spec

| Property      | Value                                        |
| ------------- | -------------------------------------------- |
| Height        | py-3 (12px top/bottom) — ~44px               |
| Radius        | rounded-xl (12px) or rounded-lg (8px)         |
| Background    | `bg-surface-container` or `bg-surface-container-low` |
| Border        | `border border-surface-container-highest` or `border border-outline-variant` |
| Text          | `font-body-md text-body-md text-on-surface`   |
| Placeholder   | `placeholder:text-on-surface-variant`          |
| Focus         | `focus:border-primary-fixed focus:ring-2 focus:ring-primary-fixed/20 outline-none` |
| Padding       | `pl-12 pr-4 py-4` (with icon) or `px-4 py-3`  |
| Icon          | `absolute left-4 text-outline-variant`         |

### 2.11 Page Header Pattern

```html
<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
  <div>
    <h1 class="font-headline-lg text-headline-lg text-on-background">{title}</h1>
    <p class="font-body-md text-body-md text-on-surface-variant mt-1">{subtitle}</p>
  </div>
  <button class="bg-primary-container text-primary-fixed px-6 py-3 rounded-xl font-title-sm text-title-sm flex items-center gap-2 hover:bg-inverse-primary hover:text-surface transition-colors shadow-sm">
    <span class="material-symbols-outlined text-[20px]">add</span>
    {action}
  </button>
</div>
```

---

## 3. LOGIN PAGE (from Stitch — Design 4)

```
+--------------------------------------------------+
|     Full-screen gradient bg (indigo→violet→teal)  |
|     Decorative glowing orbs (blur-3xl)            |
|                                                    |
|     ┌──────────────────────────────────┐           |
|     │        Glass Panel (w-[420px])   │           |
|     │        rounded-2xl              │           |
|     │        backdrop-blur-2xl        │           |
|     │        border white/20          │           |
|     │        shadow-[0_24px_64px]     │           |
|     │        p-8                      │           |
|     │                                  │           |
|     │        [Inventory icon]          │           |
|     │        StockPro (display-lg)     │           |
|     │        Enterprise Logistics      │           |
|     │                                  │           |
|     │        Sign In (headline-md)     │           |
|     │                                  │           |
|     │        Corporate Email           │           |
|     │        ┌──────────────────────┐  │           |
|     │        │ 📧 manager@...       │  │           |
|     │        └──────────────────────┘  │           |
|     │                                  │           |
|     │        Password                  │           |
|     │        ┌──────────────────────┐  │           |
|     │        │ 🔒 ********    👁    │  │           |
|     │        └──────────────────────┘  │           |
|     │        Forgot password?  →       │           |
|     │                                  │           |
|     │        [✓] Remember this device  │           |
|     │                                  │           |
|     │   ┌────────────────────────────┐ │           |
|     │   │        Sign In             │ │           |
|     │   └────────────────────────────┘ │           |
|     │        (bg-gradient-primary)     │           |
|     │                                  │           |
|     │        ──── OR ────              │           |
|     │                                  │           |
|     │   ┌────────────────────────────┐ │           |
|     │   │  Google SSO                │ │           |
|     │   └────────────────────────────┘ │           |
|     │        (border white/15)         │           |
|     │                                  │           |
|     │   Don't have an account? Sign up │           |
|     └──────────────────────────────────┘           |
+--------------------------------------------------+
```

**Background:** `bg-gradient-to-br from-indigo-700 via-violet-600 to-teal-500` + 3 glowing orbs (purple/teal/indigo, blur-[100-120px], mix-blend-screen, opacity 60-80%)

**Glass panel:** `glass-panel` class — bg rgba(255,255,255,0.08), backdrop-blur(24px), border rgba(255,255,255,0.2)

**Brand header:**
- Icon: w-14 h-14, `bg-white/10 rounded-xl`, icon `inventory_2` 32px white
- Title: `font-display-lg`, `text-4xl font-bold text-white`, "StockPro"
- Subtitle: `font-label-uppercase`, `text-white/70`, "Enterprise Logistics"

**Form labels:** `font-label-uppercase text-label-uppercase text-white/80`

**Inputs:** `glass-input` — bg rgba(255,255,255,0.05), border rgba(255,255,255,0.15), rounded-xl, py-3 pl-10 pr-4, text-white, placeholder:text-white/40, focus:ring-1 focus:ring-white/40

**Password toggle:** eye icon button, toggle between `visibility_off` / `visibility`

**Role selector:** select with glass styling, options: "Administrator / Manager / Staff"

**Remember me:** checkbox styled with glassmorphism + label

**Sign In button:** `w-full bg-gradient-primary`, rounded-xl, py-3.5, text-white font-semibold, hover:opacity-90, shadow-lg

**Google SSO:** `w-full glass-input`, rounded-xl, py-3, icon + "Sign in with Google"

**Footer link:** "Don't have an account? Sign up" — text-white/70, hover:text-white

---

## 4. PRODUCT CATALOG PAGE (from Stitch — Design 6)

### 4.1 Layout

```
+-------+----------------------------------------------+
|  SIDE |  TOPBAR: [🔍 Search across system...]  🔔 ⚙️ 👤 |
|  260px+----------------------------------------------+
|  fixed|  MAIN                                       |
|       |                                              |
|  Nav: |  Product Management (headline-lg)             |
|  Dash |  Manage your catalog, stock levels, and pricing.|
|  PROD |                                     [+ Add Product]|
|  POS  |                                              |
|  Supp |  [Search products...] [Category ▼]            |
|  Anal |                                              |
|       |  ┌─────────── Table ───────────────────────┐ |
|  ———  |  │ Image │ Name/SKU │ Cat │ Price │ Stock │ │
|  Help |  ├─────────── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤ |
|  Logout|  │  📦  │ Wireless Mouse │ Elect │ ₹1200 │▓▓░░│ |
|       |  │      │ SKU-001        │       │       │    │ |
|       |  └─────────── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘ |
|       |  Showing 1-12 of 120    [<] [1] [2] [3] [>] |
+-------+----------------------------------------------+
```

### 4.2 Specific Elements

**Active nav:** Products tab — `bg-secondary-container text-on-secondary-container rounded-lg` (teal variant)

**Page header subtitle:** "Manage your catalog, stock levels, and pricing."

**Add Product button:** `bg-primary-container text-on-primary-container font-label-sm uppercase tracking-wider py-2 px-4 rounded hover:bg-primary hover:text-on-primary transition-colors flex items-center gap-2 shadow-sm`

**Table columns:** Image + Name/SKU | Category | Price | Stock (with progress bar) | Status | Actions

**Product image:** w-10 h-10 rounded bg-surface-container-low with icon fallback

**Progress bar (stock level):** h-1.5 w-20 bg-surface-variant rounded-full with fill based on percentage

**Status badges:** `bg-secondary/10 text-secondary border border-secondary/30` for "In Stock", `bg-tertiary/10 text-tertiary` for low stock, etc.

---

## 5. POS / SALES PAGE (from Stitch — Design 3, 8)

### 5.1 Layout

```
+-------+----------------------------------------------+
|  SIDE |  TOPBAR: POS specific                        |
|  280px|                                              |
|  fixed|  8 cols (products) │ 4 cols (cart, sticky)    |
|       |                    │                          |
|  Nav: |  [🔍 Scan barcode or search...]  [📷]       |
|  Dash |                                              |
|  Prod |  [All Items] [Packaging] [Equipment] [Safety] │
|  POS  |                                              |
|  Supp |  ┌───┐ ┌───┐ ┌───┐ ┌───┐   │ ┌─── Cart ───┐ │
|  Anal |  │📦 │ │📦 │ │📦 │ │📦 │   │ │ Item  x5   │ │
|       |  │$4 │ │$3 │ │$24│ │$18│   │ │ $22.50     │ │
|  ———  |  └───┘ └───┘ └───┘ └───┘   │ │ [+][5][-]  │ │
|  Help |                              │ │─────────  │ │
|  Logout|  Grid 2-4 cols, scrollable   │ │ Subtotal   │ │
|       |                              │ │ Tax 8%     │ │
|       |                              │ │ Total $220 │ │
|       |                              │ │─────────  │ │
|       |                              │ │ Name/Phone │ │
|       |                              │ │ [Cash][Card]│ │
|       |                              │ │ [UPI][Credit]││
|       |                              │ │ [Place Ord]│ │
|       |                              └──────────────┘ │
+-------+----------------------------------------------+
```

### 5.2 Specific Elements

**Active nav:** Sales/POS — `bg-surface-container-high border-l-4 border-primary shadow-sm` OR gradient sidebar

**POS header:** "Point of Sale" headline-md + "Register 04 • Cashier: Admin" body-sm

**Search input:** `rounded-2xl`, `pl-12 pr-14 py-4`, with barcode scanner button (`right-3`, `bg-primary-container`, `rounded-xl`, icon `barcode_scanner`)

**Category pills:** `rounded-full`, `px-5 py-2`, active = `bg-primary-container text-white`, inactive = `bg-surface-container border border-surface-container-highest text-on-surface-variant`

**Product cards:** 2-4 col grid, `bg-surface border border-surface-container-highest rounded-2xl p-4`, hover: `shadow-soft hover:border-primary-fixed-dim`, image area: `aspect-square bg-surface-container-low rounded-xl`, overlay gradient on hover

**Out-of-stock card:** `border-error/30 opacity-75`, grayscale image, "OUT" badge (top-right, `bg-error/20 text-error`)

**Cart panel:** sticky, `h-[calc(100vh-48px)]`, `bg-surface border rounded-2xl shadow-soft`, top gradient bar (`h-1 bg-gradient-primary`), header with cart icon + "Clear Cart" button, scrollable items, quantity controls (`border rounded-lg h-9`, `w-9` buttons, `w-12 text-center`), footer with totals + customer info + payment methods

**Quantity control:** `<div class="flex items-center border border-surface-container-highest rounded-lg bg-surface-container h-9 overflow-hidden">`

**Payment method buttons:** 4 buttons in a row, toggle-style, `flex-1`, active = `bg-gradient-primary text-white`

**Place Order button:** `w-full bg-gradient-primary shadow-neon-primary text-white py-4 rounded-xl font-title-sm`, hover scale effect

---

## 6. SUPPLIER MANAGEMENT PAGE (from Stitch — Design 1, 2, 7, 10)

### 6.1 Layout

```
+-------+----------------------------------------------+
|  SIDE |  TOPBAR: [🔍 Search suppliers...]   🔔 ⚙️ 👤  |
|  260px+----------------------------------------------+
|  fixed|  Suppliers (display-lg)                       |
|       |  Manage your vendor relationships...          |
|  Nav: |                                     [+ New Supplier]|
|  Dash |                                              |
|  Prod |  ┌─────────────┐ ┌──────────┐ ┌──────────┐  |
|  POS  |  │🧑‍🤝‍🧑 Total 142  │ │✅ Active │ │⚠️ Pending│  |
|  SUPP |  │  Suppliers   │ │  118     │ │   7      │  |
|  Anal |  └─────────────┘ └──────────┘ └──────────┘  |
|       |                                              |
|  ———  |  ┌─── Table ────────────────────────────┐   |
|  Help |  │ [Filter] [Sort]       [Export CSV ↓] │   |
|  Logout|  ├──────────────────────────────────────┤   |
|       |  │ Supplier │ Contact │ Phone/Email│... │   |
|       |  │ Global   │ Sarah   │ s@gtc.com  │[⋮] │   |
|       |  │ Apex     │ Marcus  │ m@apex.com │[⋮] │   |
|       |  └──────────────────────────────────────┘   |
|       |  1-5 of 142       [<] [1] [2] [3] [...] [>] |
+-------+----------------------------------------------+
```

### 6.2 Specific Elements

**Active nav:** Suppliers — `text-primary-fixed bg-primary-container`

**Topbar search:** `rounded-full w-72`, placeholder "Search suppliers..."

**Stat cards:** 3-column grid (`grid-cols-1 md:grid-cols-3 gap-gutter`)
- Card 1 (Total Suppliers): `border-t-2 border-t-primary-container`, icon `local_shipping`
- Card 2 (Active Partners): `border-t-2 border-t-secondary-container`, icon `verified`
- Card 3 (Pending Review): `border-t-2 border-t-tertiary-container`, icon `warning`

**Table toolbar:** Filter + Sort buttons (ghost style) + "Export CSV" button (text-secondary with download icon)

**Table columns:** Supplier Name (250px) | Contact Person (200px) | Phone/Email (200px) | Products Supplied (flex) | Status (120px) | Actions (80px)

**Supplier name:** `font-title-sm text-title-sm text-sm text-primary-fixed`

**Contact info:** Two-line (email + phone), `font-data-tabular text-data-tabular text-on-surface-variant`

**Products supplied:** Truncated with `truncate max-w-[200px]`

**Actions:** `more_vert` icon, opacity-0 group-hover:opacity-100

**Inactive row:** `opacity-70 bg-surface-container-lowest/30`, text in `text-on-surface-variant`

---

## 7. ANALYTICS & REPORTS PAGE (from Stitch — Design 5, 9)

### 7.1 Layout

```
+-------+----------------------------------------------+
|  SIDE |  TOPBAR: [🔍 Search reports...]   🔔 ⚙️ 👤   |
|  260px+----------------------------------------------+
|  fixed|  Detailed Analytics (headline-lg)             |
|       |  Review your inventory performance...         |
|  Nav: |                    [7D] [30D] [90D] [Custom] |
|  Dash |                                              |
|  Prod |  ┌─────────┐ ┌──────┐ ┌────────┐ ┌────────┐ |
|  POS  |  │💰 Total │ │📦 U.│ │🧾 Avg │ │⚠️ OOS  │ |
|  Supp |  │ Revenue │ │Sold │ │ Order  │ │ Items  │ |
|  ANAL |  │$124,500 │ │8,234│ │$415.20 │ │  24    │ |
|       |  └─────────┘ └──────┘ └────────┘ └────────┘ |
|  ———  |                                              |
|  Help |  ┌─── Chart (8 cols) ───┐ ┌─── Pie (4) ───┐ |
|  Logout|  │ Revenue Over Time   │ │ Category       │ |
|       |  │ [📈 area chart]     │ │ [🍩 donut]     │ |
|       |  └─────────────────────┘ └────────────────┘ |
|       |                                              |
|       |  ┌─── Top Performing Products ───────────┐   |
|       |  │ SKU    │Cat │ Units │ Revenue │ Stock│   |
|       |  │Sensor..│Elect│ 1,204 │$45,150  │[✓]  │   |
|       |  └─────────────────────────────────────────┘  |
+-------+----------------------------------------------+
```

### 7.2 Specific Elements

**Active nav:** Analytics — `text-primary bg-primary-container/20 border border-primary-container/30` + `glow-effect`

**Time range filter:** Pill-style button group: `bg-surface-container-low border rounded-lg p-1`, buttons: `px-3 py-1.5 rounded-md`, active = `bg-primary-container text-on-primary font-semibold`, divider: `w-px h-4 bg-outline-variant/30`

**Metric cards (bento grid style):** 4-col grid, `bg-gradient-to-br from-surface-container-highest/60 to-surface-container-low/40 backdrop-blur-sm`, `rounded-xl`, decorative blur-3xl orb in corner
- Metric 1 (Total Revenue): icon `payments`, secondary bg, number `$124,500`
- Metric 2 (Units Sold): icon `local_shipping`, primary bg, number `8,234`
- Metric 3 (Avg Order): icon `receipt_long`, neutral bg, number `$415.20`
- Metric 4 (OOS Items): icon `warning`, error bg, number `24`

**Chart containers:**
- Revenue chart (8 cols): `bg-surface-container-low border rounded-xl p-6`, SVG area chart with gradient fill (`#4f46e5` to transparent), glow filter, grid lines at `bg-outline-variant/20`, data points as circles with teal stroke
- Category pie (4 cols): conic gradient, donut hole with total %, legend with colored dots + glow shadows

**Top products table:**
- Header: "Top Performing Products" + "View All →" link
- Columns: SKU/Product Name | Category | Units Sold | Revenue | Stock Status
- Revenue cell: `text-primary` font-mono
- Stock status: In Stock badge with `shadow-[0_0_8px_rgba(107,216,203,0.15)]`

---

## 8. DASHBOARD PAGE (NEW — must match Kinetic Enterprise theme)

### 8.1 Layout

```
+-------+----------------------------------------------+
|  SIDE |  TOPBAR: [🔍 Search dashboard...]  🔔 ⚙️ 👤  |
|  260px+----------------------------------------------+
|  fixed|  Dashboard (headline-lg)                      |
|       |  Real-time overview of your business operations|
|  Nav: |                                              |
|  DASH |  ┌──────┐ ┌──────┐ ┌──────┐ ┌─────────┐     |
|  Prod |  │📦Total│ │📊 Avail│ │🚫Out │ │⚠️ Low   │     |
|  POS  |  │Products│ │Stock │ │of Stock│ │Stock    │     |
|  Supp |  │ 1,245 │ │32,580│ │  23  │ │  12     │     |
|  Anal |  │ +12 wk│ │+2.5% │ │ -5   │ │  +3     │     |
|       |  └──────┘ └──────┘ └──────┘ └─────────┘     |
|  ———  |                                              |
|  Help |  ┌─── Revenue Chart (8 cols) ───┐ ┌─ Recent │ |
|  Logout|  │ 📈 Monthly Revenue Overview │ │ Sales   │ |
|       |  │ [area chart with gradient]   │ │ •Mousex2│ |
|       |  │ Jan Feb Mar Apr May Jun      │ │ •KB x1  │ |
|       |  └─────────────────────────────┘ │ $2,596  │ |
|       |                                  └─────────┘ |
|       |  ┌─── Low Stock Alerts ─────────┐ ┌─ Top Sell│ |
|       |  │ Product │Stk│Min│Status│Action│ │ [horiz  │ |
|       |  │ Keyboard│ 3 │ 10│🔴Low│[Stk] │ │  bar]   │ |
|       |  │ Mouse   │ 5 │ 10│🟡Crit│[Stk]│ │ Mouse#1 │ |
|       |  └──────────────────────────────┘ └─────────┘ |
|       |                                              |
|       |  ┌─── Quick Actions ──────────────────────┐   |
|       |  │ [+Add Product] [+New Sale] [+Supplier] │   |
|       |  └─────────────────────────────────────────┘   |
+-------+----------------------------------------------+
```

### 8.2 Stat Cards (exact match with supplier page style)

4-column grid with the exact `bg-gradient-to-br` card pattern:

**Card 1 — Total Products**
- Icon: `inventory_2` in `bg-primary-container text-primary-fixed`
- Label: "Total Products"
- Value: "1,245"
- Trend: "+12 this week" with teal `trending_up` icon

**Card 2 — Available Stock**
- Icon: `warehouse` in `bg-secondary-container text-on-secondary-container`
- Label: "Available Stock"
- Value: "32,580"
- Trend: "+2.5%" with teal arrow

**Card 3 — Out of Stock**
- Icon: `error` or `cancel` in `bg-error/20 text-error`
- Label: "Out of Stock"
- Value: "23"
- Trend: "-5 from last month" with teal arrow (positive)

**Card 4 — Low Stock Alerts**
- Icon: `warning` in `bg-tertiary-container text-on-tertiary-container`
- Label: "Low Stock Alerts"
- Value: "12"
- Trend: "+3" with orange `trending_up` icon (negative)

### 8.3 Revenue Chart (match analytics page chart styling)

```
<div class="lg:col-span-8 bg-surface-container-low border border-outline-variant/30 rounded-xl shadow-lg p-6 flex flex-col relative overflow-hidden">
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary-container/5 blur-[100px] rounded-full pointer-events-none"></div>
  <div class="flex justify-between items-center mb-6 relative z-10">
    <h2 class="font-title-md text-title-md text-on-background">Revenue Overview</h2>
    <div class="flex items-center bg-surface-container-low border border-outline-variant/30 rounded-lg p-1">
      <button class="px-3 py-1.5 font-body-md text-body-md text-on-surface-variant hover:text-on-background rounded-md transition-colors">Month</button>
      <button class="px-3 py-1.5 font-body-md text-body-md bg-primary-container text-on-primary font-semibold rounded-md shadow-sm transition-colors">Year</button>
    </div>
  </div>
  <!-- SVG area chart -> same as analytics page -->
  <div class="flex-1 w-full h-[240px] relative mt-2 border-l border-b border-outline-variant/30 z-10">
    <!-- Y-axis labels, grid lines, SVG path with gradient fill, data points, X-axis labels -->
    <!-- Same structure as Analytics Revenue chart -->
  </div>
</div>
```

### 8.4 Recent Sales (mini list, right column)

```
<div class="lg:col-span-4 bg-surface-container-low border border-outline-variant/30 rounded-xl shadow-lg p-6 flex flex-col">
  <div class="flex justify-between items-center mb-4">
    <h2 class="font-title-md text-title-md text-on-background">Recent Sales</h2>
    <a class="font-body-md text-body-md text-primary hover:text-primary-fixed transition-colors" href="#">View All →</a>
  </div>
  <div class="flex-1 flex flex-col gap-4">
    <!-- Sale item (exact match with POS cart item style) -->
    <div class="flex justify-between items-start pb-4 border-b border-surface-container-highest group">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary">
          <span class="material-symbols-outlined text-[20px]">inventory_2</span>
        </div>
        <div>
          <p class="font-body-md text-body-md text-on-surface font-medium group-hover:text-primary-fixed transition-colors">Wireless Mouse</p>
          <p class="font-body-sm text-body-sm text-on-surface-variant">x2 • 2 min ago</p>
        </div>
      </div>
      <span class="font-data-tabular text-data-tabular text-on-background font-medium">₹1,200</span>
    </div>
    <!-- Repeat 5 items, last one without border -->
  </div>
</div>
```

### 8.5 Low Stock Alerts Table (match supplier table)

```
<div class="bg-surface-container-low border border-surface-variant rounded-2xl shadow-sm overflow-hidden">
  <div class="p-5 border-b border-surface-variant flex justify-between items-center bg-surface-container/50 backdrop-blur-sm">
    <h3 class="font-title-md text-title-md text-on-background flex items-center gap-2">
      Low Stock Alerts
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-error/20 text-error font-label-sm text-label-sm">12</span>
    </h3>
    <a class="font-body-md text-body-md text-primary hover:text-primary-fixed transition-colors" href="#">View All →</a>
  </div>
  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse">
      <thead class="bg-surface-container/30 border-b border-surface-variant">
        <tr>
          <th class="px-6 py-4 font-label-uppercase text-label-uppercase text-on-surface-variant">Product</th>
          <th class="px-6 py-4 font-label-uppercase text-label-uppercase text-on-surface-variant text-right">Current</th>
          <th class="px-6 py-4 font-label-uppercase text-label-uppercase text-on-surface-variant text-right">Minimum</th>
          <th class="px-6 py-4 font-label-uppercase text-label-uppercase text-on-surface-variant">Status</th>
          <th class="px-6 py-4 font-label-uppercase text-label-uppercase text-on-surface-variant text-right">Action</th>
        </tr>
      </thead>
      <tbody class="font-body-sm text-body-sm text-on-surface">
        <tr class="border-b border-surface-variant hover:bg-surface-container/50 h-[56px] transition-colors group">
          <td class="px-6 font-title-sm text-title-sm text-sm text-primary-fixed">Keyboard</td>
          <td class="px-6 text-right font-mono text-error">3</td>
          <td class="px-6 text-right font-mono text-on-surface-variant">10</td>
          <td class="px-6"><span class="inline-flex items-center px-3 py-1 rounded-full bg-error/20 text-error font-label-sm text-label-sm">Critical</span></td>
          <td class="px-6 text-right">
            <button class="px-3 py-1.5 text-xs font-medium bg-primary-container text-primary-fixed rounded-lg hover:bg-inverse-primary transition-colors opacity-0 group-hover:opacity-100">Restock</button>
          </td>
        </tr>
        <!-- More rows... -->
      </tbody>
    </table>
  </div>
</div>
```

### 8.6 Top Selling Products (horizontal bar)

```
<div class="bg-surface-container-low border border-outline-variant/30 rounded-xl shadow-lg p-6">
  <h2 class="font-title-md text-title-md text-on-background mb-6">Top Selling Products</h2>
  <div class="flex flex-col gap-4">
    <!-- Bar item -->
    <div>
      <div class="flex justify-between mb-1">
        <span class="font-body-sm text-body-sm text-on-surface">Wireless Mouse</span>
        <span class="font-data-tabular text-data-tabular text-on-surface-variant">245 units</span>
      </div>
      <div class="w-full h-2.5 bg-surface-variant rounded-full overflow-hidden">
        <div class="h-full rounded-full bg-gradient-to-r from-primary-container to-secondary" style="width: 85%"></div>
      </div>
    </div>
    <!-- Repeat 5 items -->
  </div>
</div>
```

### 8.7 Quick Actions Bar

```
<div class="grid grid-cols-1 md:grid-cols-4 gap-gutter">
  <div class="bg-gradient-to-br from-surface-container to-surface-container-low border border-surface-variant rounded-xl p-5 flex items-center gap-4 group hover:border-primary-fixed-dim transition-colors cursor-pointer">
    <div class="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-primary-fixed">
      <span class="material-symbols-outlined text-[24px]">add</span>
    </div>
    <div>
      <p class="font-title-sm text-title-sm text-on-surface group-hover:text-primary-fixed transition-colors">Add Product</p>
      <p class="font-body-sm text-body-sm text-on-surface-variant">New inventory item</p>
    </div>
  </div>
  <!-- Repeat: +New Sale, +Add Supplier, +New Purchase -->
</div>
```

---

## 9. ADD/EDIT PRODUCT PAGE (NEW — must match theme)

### 9.1 Layout

```
+-------+----------------------------------------------+
|  SIDE |  TOPBAR: Products > Add New Product           |
|  260px+----------------------------------------------+
|  fixed|                                              |
|       |  Add New Product (headline-lg)               |
|  Nav: |                              [Cancel] [Save]  |
|  Dash |                                              |
|  PROD |  60% (left)           │  40% (right)         |
|  POS  |  ┌────────────────────┐│ ┌─────────────────┐ |
|  Supp |  │ Basic Information  ││ │ Product Image   │ |
|  Anal |  │                    ││ │                 │ |
|       |  │ Product Name * ─── ││ │  ┌───────────┐  │ |
|  ———  |  │ SKU Code * ────── ││ │  │ [dropzone] │  │ |
|  Help |  │ Category * ────── ││ │  │   📁 Drag  │  │ |
|  Logout|  │ Brand ──────────── ││ │  │  & drop    │  │ |
|       |  │ Description ────── ││ │  └───────────┘  │ |
|       |  │ (textarea)         ││ │  JPG, PNG, WEBP │ |
|       |  ├────────────────────┤│ └─────────────────┘ |
|       |  │ Pricing & Stock   ││                      |
|       |  │ Price * ───────────││                      |
|       |  │ Cost Price ───────││                      |
|       |  │ Stock Qty * ──────││                      |
|       |  │ Min Stock Level ──││                      |
|       |  │ Unit ─────────────││                      |
|       |  └────────────────────┘│                      |
+-------+----------------------------------------------+
```

### 9.2 Form Elements (exact match)

**Form section card:** `bg-surface-container-low border border-surface-variant rounded-2xl p-6`

**Section title:** `font-title-md text-title-md text-on-background mb-6`, with `border-b border-surface-variant pb-4 mb-6`

**Field label:** `font-label-uppercase text-label-uppercase text-on-surface-variant mb-2`

**Input:** `w-full bg-surface-container border border-surface-container-highest rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary-fixed focus:ring-2 focus:ring-primary-fixed/20 outline-none transition-all`

**Textarea:** same as input + `min-h-[120px] resize-y`

**Select:** same as input + custom chevron

**Image dropzone:**
```
<div class="h-64 border-2 border-dashed border-surface-container-highest rounded-2xl flex flex-col items-center justify-center bg-surface-container/50 hover:border-primary-fixed hover:bg-primary-container/5 transition-colors cursor-pointer">
  <span class="material-symbols-outlined text-[48px] text-on-surface-variant">upload</span>
  <p class="font-body-md text-body-md text-on-surface-variant mt-4">Drag & drop product image here</p>
  <p class="font-body-sm text-body-sm text-primary mt-2">or click to browse</p>
</div>
```

**Required field indicator:** asterisk `*` in `text-error`

**Inline error:** `<p class="font-body-sm text-body-sm text-error mt-1">Field is required</p>`

---

## 10. PURCHASES PAGE (NEW — must match theme)

### 10.1 Layout

```
+-------+----------------------------------------------+
|  SIDE |  TOPBAR: [🔍 Search POs...]  🔔 ⚙️ 👤        |
|  260px+----------------------------------------------+
|  fixed|  Purchase Orders (headline-lg)               |
|       |  Track incoming stock and supplier orders    |
|  Nav: |                                    [+ New PO] |
|  Dash |                                              |
|  Prod |  ┌───────┐ ┌───────┐ ┌────────┐ ┌────────┐  |
|  POS  |  │📋Total │ │⏳Pending│ │✅Recvd │ │💰Total │  |
|  Supp |  │ 156   │ │  23   │ │  128  │ │₹45.2L │  |
|  Anal |  └───────┘ └───────┘ └────────┘ └────────┘  |
|       |                                              |
|  ———  |  ┌──── Table ──────────────────────────────┐ |
|  Help |  │ PO#  │ Supplier │ Items │ Total │Status│ │
|  Logout|  │PO-042│ ABC Corp │ 5 it. │₹45,000│ 📦Rcvd│ |
|       |  │PO-043│ TechZone │ 3 it. │₹12,500│ ⏳Ordrd│ |
|       |  └──────────────────────────────────────────┘ |
+-------+----------------------------------------------+
```

### 10.2 Specific Elements

**Stat cards (4-col):**
1. Total Orders — icon `receipt_long`, primary-container
2. Pending — icon `schedule`, tertiary-container
3. Received — icon `verified`, secondary-container
4. Total Spent — icon `payments`, primary-container

**Table columns:** PO Number (mono, link) | Supplier | Items Count | Total Amount | Status | Date | Actions

**Status badges:**
| Status      | Bg + Text                                    |
| ----------- | -------------------------------------------- |
| Received    | `bg-secondary-container text-on-secondary-container` |
| Ordered     | `bg-primary-container/20 text-primary`       |
| Pending     | `bg-tertiary/20 text-tertiary`               |
| Cancelled   | `bg-surface-variant text-on-surface-variant` |

### 10.3 Add Purchase Form (full-width)

```
<div class="bg-surface-container-low border border-surface-variant rounded-2xl p-6">
  <!-- Header -->
  <div class="flex justify-between items-center pb-5 border-b border-surface-variant mb-6">
    <h2 class="font-title-md text-title-md text-on-background">Create Purchase Order</h2>
    <div class="flex gap-3">
      <button class="px-4 py-2 rounded-xl border border-surface-variant font-body-sm text-body-sm text-on-surface hover:bg-surface-container-high transition-colors">Cancel</button>
      <button class="bg-primary-container text-primary-fixed px-6 py-2 rounded-xl font-title-sm text-title-sm hover:bg-inverse-primary transition-colors shadow-sm">Save PO</button>
    </div>
  </div>
  <!-- Supplier + Date row -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-6">
    <div class="flex flex-col gap-2">
      <label class="font-label-uppercase text-label-uppercase text-on-surface-variant">Supplier *</label>
      <select class="w-full bg-surface-container border border-surface-container-highest rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface"><option>Select supplier...</option></select>
    </div>
    <div class="flex flex-col gap-2">
      <label class="font-label-uppercase text-label-uppercase text-on-surface-variant">Order Date</label>
      <input type="date" class="w-full bg-surface-container border border-surface-container-highest rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface" />
    </div>
    <div class="flex flex-col gap-2">
      <label class="font-label-uppercase text-label-uppercase text-on-surface-variant">Expected Delivery</label>
      <input type="date" class="w-full bg-surface-container border border-surface-container-highest rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface" />
    </div>
  </div>
  <!-- Items table -->
  <div class="mb-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-title-sm text-title-sm text-on-background">Order Items</h3>
      <button class="flex items-center gap-2 text-primary font-body-md text-body-md hover:text-primary-fixed transition-colors">
        <span class="material-symbols-outlined text-[18px]">add</span> Add Item
      </button>
    </div>
    <table class="w-full text-left border-collapse">
      <thead class="bg-surface-container/30 border-b border-surface-variant">
        <tr>
          <th class="px-4 py-3 font-label-uppercase text-label-uppercase text-on-surface-variant">Product</th>
          <th class="px-4 py-3 font-label-uppercase text-label-uppercase text-on-surface-variant text-right">Qty</th>
          <th class="px-4 py-3 font-label-uppercase text-label-uppercase text-on-surface-variant text-right">Unit Price</th>
          <th class="px-4 py-3 font-label-uppercase text-label-uppercase text-on-surface-variant text-right">Total</th>
          <th class="px-4 py-3 w-16"></th>
        </tr>
      </thead>
      <tbody class="font-body-sm text-body-sm text-on-surface">
        <tr class="border-b border-surface-variant h-[56px]">
          <td class="px-4"><input class="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-sm" placeholder="Search or select product..." /></td>
          <td class="px-4 text-right"><input type="number" class="w-20 bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-sm text-right" value="1" /></td>
          <td class="px-4 text-right"><input type="number" class="w-28 bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-sm text-right" placeholder="0.00" /></td>
          <td class="px-4 text-right font-data-tabular text-data-tabular text-on-background">₹0.00</td>
          <td class="px-4 text-center"><button class="text-error hover:bg-error/10 p-1 rounded-lg transition-colors"><span class="material-symbols-outlined text-[18px]">delete</span></button></td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- Notes + Total -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
    <div class="flex flex-col gap-2">
      <label class="font-label-uppercase text-label-uppercase text-on-surface-variant">Notes</label>
      <textarea class="w-full bg-surface-container border border-surface-container-highest rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface min-h-[100px] resize-y" placeholder="Additional notes..."></textarea>
    </div>
    <div class="flex flex-col items-end justify-end gap-3">
      <div class="flex justify-between w-full max-w-xs font-body-md text-body-md">
        <span class="text-on-surface-variant">Subtotal</span>
        <span class="font-data-tabular text-on-surface">₹0.00</span>
      </div>
      <div class="flex justify-between w-full max-w-xs font-title-md text-title-md">
        <span class="text-on-background">Total</span>
        <span class="font-data-tabular text-primary">₹0.00</span>
      </div>
    </div>
  </div>
</div>
```

---

## 11. INVOICE MODAL (NEW — must match theme)

### 11.1 Layout

```
+------------------------------------------------------------+
│                      🎉 Sale Complete!                      │
│                                   [X] close (icon button)   |
+------------------------------------------------------------+
│                                                              │
│   Invoice #INV-2026-0042             Date: 25 May 2026      │
│                                         12:30 PM            │
│                                                              │
│   ┌─── Items ───────────────────────────────────────┐      │
│   │ Wireless Mouse x2 .................. ₹1,000     │      │
│   │ Keyboard x1 ........................ ₹1,200     │      │
│   │ Monitor x1 ........................ ₹15,000     │      │
│   └──────────────────────────────────────────────────┘      │
│                                                              │
│   Subtotal: ₹2,200     Tax (18%): ₹396     Total: ₹2,596    │
│                                                              │
│   Payment: UPI          Customer: Walk-in                    │
│                                                              │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│   │Download  │ │  Print   │ │ New Sale │ │ Go to Dashbd │  │
│   │   PDF    │ │          │ │          │ │              │  │
│   └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
+------------------------------------------------------------+
```

### 11.2 Modal Spec (match glassmorphism)

**Backdrop:** `fixed inset-0 bg-black/50 backdrop-blur-sm z-50`

**Modal card:** `fixed inset-0 m-auto w-full max-w-lg h-fit bg-surface border border-surface-container-highest rounded-2xl shadow-soft z-50 overflow-hidden`

**Header:** `p-6 border-b border-surface-container-highest flex justify-between items-center`
- Title: "Sale Complete" with check icon in `text-secondary`
- Close: icon button `text-on-surface-variant hover:text-on-surface`

**Body items:** Same cart item styling as POS cart

**Totals section:** `p-6 border-t border-surface-container-highest bg-surface-container/50`

**Action buttons:** 4 buttons in a 4-col grid, each using `bg-surface-container border border-surface-container-highest rounded-xl py-3 text-center hover:bg-surface-container-high transition-colors`

---

## 12. SETTINGS PAGE (NEW — must match theme)

### 12.1 Layout

```
+-------+----------------------------------------------+
|  SIDE |  TOPBAR: Settings                             |
|  260px+----------------------------------------------+
|  fixed|  Settings (headline-lg)                       |
|       |  Manage your application preferences          |
|  Nav: |                                              |
|  Dash |  ┌─ Settings Sidebar ─┐ ┌─ Content ────────┐ |
|  Prod |  │ General            │ │                    | |
|  POS  |  │ Notifications      │ │ Store Name: ────  | |
|  Supp |  │ Users              │ │ Address: ────────  | |
|  Anal |  │ Billing            │ │ Currency: ───────  | |
|       |  │ Appearance     ◄── │ │ Tax Rate: ───────  | |
|  ———  |  └────────────────────┘ │ Low Stock: ──────  | |
|  Help |                        │ Timezone: ──────── | |
|  Logout|                       │ [Save Changes]      │ |
|       |                        └────────────────────┘ |
+-------+----------------------------------------------+
```

### 12.2 Settings Sidebar

```
<div class="w-56 flex-shrink-0">
  <div class="bg-surface-container-low border border-surface-variant rounded-2xl overflow-hidden">
    <a class="flex items-center gap-3 px-5 py-3.5 font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors border-b border-surface-variant" href="#">General</a>
    <a class="flex items-center gap-3 px-5 py-3.5 font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors border-b border-surface-variant" href="#">Notifications</a>
    <a class="flex items-center gap-3 px-5 py-3.5 font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors border-b border-surface-variant" href="#">Users</a>
    <a class="flex items-center gap-3 px-5 py-3.5 font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors border-b border-surface-variant" href="#">Billing</a>
    <a class="flex items-center gap-3 px-5 py-3.5 font-body-md text-body-md text-primary bg-primary-container/10 border-l-2 border-primary" href="#">Appearance</a>
  </div>
</div>
```

### 12.3 Content Cards

Each settings section in a `bg-surface-container-low border border-surface-variant rounded-2xl p-6` card.

**Form fields:** Same input spec as Add Product form.

**Toggle switch:**
```
<div class="flex items-center justify-between py-3">
  <div>
    <p class="font-body-md text-body-md text-on-surface">Dark Mode</p>
    <p class="font-body-sm text-body-sm text-on-surface-variant">Switch between light and dark theme</p>
  </div>
  <button class="relative w-12 h-6 rounded-full bg-primary-container transition-colors">
    <span class="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform translate-x-6"></span>
  </button>
</div>
```

### 12.4 User Management Table

Same table pattern as Suppliers page with columns:
Name | Email | Role | Status | Last Login | Actions

Add User button: same primary button style.
Role badges: "Admin" in `bg-primary-container/20 text-primary`, "Manager" in `bg-secondary/20 text-secondary`, "Staff" in `bg-surface-variant text-on-surface-variant`

---

## 13. NOTIFICATIONS & TOASTS

### 13.1 Notification Dropdown (topbar bell)

```
<div class="absolute top-full right-0 mt-2 w-96 bg-surface border border-surface-container-highest rounded-2xl shadow-soft z-50 overflow-hidden">
  <div class="p-4 border-b border-surface-container-highest flex justify-between items-center bg-surface-container/50">
    <h3 class="font-title-sm text-title-sm text-on-background">Notifications</h3>
    <button class="font-body-sm text-body-sm text-primary hover:text-primary-fixed">Mark all read</button>
  </div>
  <div class="max-h-80 overflow-y-auto">
    <div class="flex gap-3 p-4 hover:bg-surface-container/50 transition-colors border-b border-surface-container-highest bg-primary-container/5">
      <div class="w-9 h-9 rounded-lg bg-tertiary/20 flex items-center justify-center text-tertiary flex-shrink-0">
        <span class="material-symbols-outlined text-[18px]">warning</span>
      </div>
      <div>
        <p class="font-body-sm text-body-sm text-on-surface">Low stock: Keyboard (only 3 left)</p>
        <p class="font-body-sm text-body-sm text-on-surface-variant text-xs mt-1">2 min ago</p>
      </div>
    </div>
    <!-- More items... -->
  </div>
  <div class="p-3 border-t border-surface-container-highest text-center">
    <a class="font-body-sm text-body-sm text-primary hover:text-primary-fixed" href="#">View all notifications</a>
  </div>
</div>
```

### 13.2 Toast Notification

Position: fixed top-right, z-50, mt-4, mr-4

```
<div class="flex items-start gap-3 bg-surface border border-surface-container-highest rounded-xl shadow-soft p-4 w-80 animate-slide-in">
  <div class="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary flex-shrink-0">
    <span class="material-symbols-outlined text-[18px]">check</span>
  </div>
  <div class="flex-1">
    <p class="font-body-sm text-body-sm text-on-surface font-medium">Product added</p>
    <p class="font-body-sm text-body-sm text-on-surface-variant text-xs mt-0.5">Wireless Mouse has been added successfully.</p>
  </div>
  <button class="text-on-surface-variant hover:text-on-surface">
    <span class="material-symbols-outlined text-[18px]">close</span>
  </button>
</div>
```

---

## 14. EMPTY STATES, LOADING & ERROR

### 14.1 Empty State

```
<div class="flex flex-col items-center justify-center py-16 px-4">
  <span class="material-symbols-outlined text-[64px] text-on-surface-variant opacity-30">inventory_2</span>
  <h3 class="font-title-md text-title-md text-on-surface mt-6">No products yet</h3>
  <p class="font-body-md text-body-md text-on-surface-variant mt-2 text-center max-w-sm">Get started by adding your first product to the inventory.</p>
  <button class="mt-6 bg-primary-container text-primary-fixed px-6 py-3 rounded-xl font-title-sm text-title-sm flex items-center gap-2 hover:bg-inverse-primary hover:text-surface transition-colors shadow-sm">
    <span class="material-symbols-outlined text-[20px]">add</span>
    Add Product
  </button>
</div>
```

### 14.2 Loading Skeleton

```
<div class="animate-pulse flex flex-col gap-4">
  <div class="h-8 w-48 bg-surface-container-high rounded-lg"></div>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-gutter">
    <div class="h-28 bg-surface-container-high rounded-2xl"></div>
    <div class="h-28 bg-surface-container-high rounded-2xl"></div>
    <div class="h-28 bg-surface-container-high rounded-2xl"></div>
    <div class="h-28 bg-surface-container-high rounded-2xl"></div>
  </div>
  <div class="h-80 bg-surface-container-high rounded-2xl"></div>
</div>
```

### 14.3 Error State

```
<div class="flex flex-col items-center justify-center py-16 px-4">
  <div class="w-16 h-16 rounded-2xl bg-error/20 flex items-center justify-center text-error mb-6">
    <span class="material-symbols-outlined text-[32px]">warning</span>
  </div>
  <h3 class="font-title-md text-title-md text-on-surface">Failed to load products</h3>
  <p class="font-body-md text-body-md text-on-surface-variant mt-2 text-center max-w-sm">Something went wrong. Please try again.</p>
  <button class="mt-6 px-6 py-3 rounded-xl border border-error/30 text-error font-title-sm text-title-sm hover:bg-error/10 transition-colors">Retry</button>
</div>
```

---

## 15. EDGE CASES & STATES

| Scenario                    | Handling                                                     |
| --------------------------- | ------------------------------------------------------------ |
| Very long product name      | `truncate` + `line-clamp-1` + tooltip on hover               |
| Large numbers (>9999)       | `font-data-tabular` (mono), format with commas               |
| Zero stock / active product | Row opacity-75, grayscale image, "OUT" badge, status "Out of Stock" |
| Negative quantity           | Prevented by min=0 on inputs, server validation error shown as toast |
| Duplicate SKU               | Inline error below field: "SKU already exists" in error color |
| Empty cart in POS           | Centered `shopping_cart` icon (48px, dimmed) + "Cart is empty" text |
| No search results           | Empty state with search icon + "No results found for "{query}"" |
| Slow API                    | Skeleton loading shimmer + timeout toast after 30s           |
| Offline                     | Persistent banner: "You are offline. Changes will sync when connected." |

---

## 16. ANIMATIONS

| Element              | CSS                                                        |
| -------------------- | ---------------------------------------------------------- |
| Card hover           | `hover:shadow-soft hover:border-primary-fixed-dim transition-all duration-300` |
| Card scale hover     | `hover:scale-[1.02] active:scale-[0.98]`                   |
| Sidebar nav hover    | `transition-all duration-200 ease-in-out`                   |
| Row action appear    | `opacity-0 group-hover:opacity-100 transition-opacity`      |
| Image hover          | `group-hover:scale-110 transition-all duration-500`         |
| Toast enter          | `animate-slide-in` (translateX from right)                  |
| Modal enter          | `animate-fade-in` + `animate-scale-in`                     |
| Button hover         | `hover:opacity-90 transition-opacity`                       |
| Progress bar         | `transition-width duration-300`                             |

---

## 17. RESPONSIVE BREAKDOWN

| Element        | Desktop (≥1024)          | Tablet (768-1023)         | Mobile (<768)            |
| -------------- | ------------------------ | ------------------------- | ------------------------ |
| Sidebar        | 260px fixed, visible      | Icon-only (64px) + hover expand | Hidden, hamburger overlay |
| Topbar         | Full search bar           | Shorter search            | Icon-only search          |
| Stat cards     | 4-column grid             | 2x2 grid                  | 1 column stack           |
| Tables         | Full columns              | Horizontal scroll         | Card list format         |
| Product grid   | 4-6 columns               | 3 columns                 | 2 columns                |
| Sales page     | Side-by-side              | Stack vertically          | Stack, cart below        |
| Forms          | 2-column layout           | 2-column collapses        | Single column            |
| Filters        | Inline row                | Compact row               | Accordion / collapsible  |
| Charts         | Full size                 | Slightly compact          | Simplified, fewer ticks  |
| Modals         | Centered (max-w-lg)       | Centered (w-[90%])        | Full screen, no backdrop |

---

**End of Design Specification — Kinetic Enterprise / OmniStock Theme**

All pages above follow the exact same design language extracted from the Stitch exports: same colors, same typography scale, same glassmorphism, same spacing, same Material Symbols icon set, same gradient patterns, same shadow system, same card/table/button/form styling. Every UI element belongs to a single unified theme.
