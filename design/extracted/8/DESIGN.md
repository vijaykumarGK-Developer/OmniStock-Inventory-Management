---
name: Kinetic Enterprise
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c7c4d8'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#918fa1'
  outline-variant: '#464555'
  surface-tint: '#c3c0ff'
  primary: '#c3c0ff'
  on-primary: '#1d00a5'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#4d44e3'
  secondary: '#6bd8cb'
  on-secondary: '#003732'
  secondary-container: '#29a195'
  on-secondary-container: '#00302b'
  tertiary: '#ffb690'
  on-tertiary: '#552100'
  tertiary-container: '#a04500'
  on-tertiary-container: '#ffd2bd'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#ffdbca'
  tertiary-fixed-dim: '#ffb690'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#783200'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: 0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0.01em
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The design system is engineered for the modern inventory ecosystem, shifting the narrative from static data management to a high-velocity, "kinetic" experience. The brand personality is authoritative yet energetic, balancing enterprise-grade reliability with a vibrant, forward-thinking aesthetic.

The style leverages **Modern Corporate with Glassmorphic accents**. It utilizes deep, saturated base tones to provide a sophisticated foundation, allowing vibrant accent colors to signal activity, status, and urgency. The emotional response should be one of "controlled energy"—users should feel that their operations are fluid, transparent, and premium. Key visual drivers include subtle depth through layered translucency and a sense of physical weight through soft, rounded geometry.

## Colors

The palette breaks away from traditional muted enterprise grays in favor of a deep Indigo (`#4F46E5`) primary anchor. This is supported by a "Kinetic Trio" of accents:
- **Teal (`#0D9488`):** Used for growth, positive inventory status, and "In-Stock" indicators.
- **Orange (`#F97316`):** Reserved for high-energy actions, low-stock warnings, and critical motion.
- **Purple (`#9333EA`):** Used for secondary categories, premium features, and data visualization clusters.

The default mode is **Dark**, utilizing a rich Slate (`#0F172A`) for the background to make the vibrant accents and glassmorphic surfaces pop. Gradients should be applied subtly to primary buttons and "Hero" cards to create a sense of internal illumination.

## Typography

The typography system relies exclusively on **Inter** for its systematic, utilitarian precision. To elevate the "Enterprise" feel, headings utilize a slightly increased letter spacing and heavier weights to ensure distinct hierarchy against complex data visualizations.

- **Headlines:** Use `700` or `600` weight with `0.01em` to `0.02em` tracking.
- **Body Text:** Standard `400` weight for maximum legibility in dense inventory lists.
- **Labels:** Use `500` weight with all-caps and increased tracking (`0.05em`) for secondary metadata and table headers.

## Layout & Spacing

The system follows a **12-column fluid grid** for desktop and a **4-column grid** for mobile. A strict 8px spacing power-of-two scale ensures mathematical harmony across all components.

- **Desktop:** 48px outer margins with 24px gutters. Sidebars should be fixed at 280px to allow the main content area to remain fluid.
- **Tablet:** 32px margins with 16px gutters.
- **Mobile:** 16px margins. Cards and list items should span the full width of the viewport minus margins.

Spacing should be generous around high-level metrics and tighter within data tables to balance "breathability" with "information density."

## Elevation & Depth

This design system achieves depth through **Glassmorphism and Layered Shadows**. 

1.  **Base Layer:** The deepest level is the solid background (`#0F172A`).
2.  **Surface Layer:** Primary containers use a semi-transparent fill (`rgba(30, 41, 59, 0.7)`) with a 12px backdrop blur and a 1px subtle border (`rgba(255, 255, 255, 0.1)`).
3.  **Raised Layer:** Modals and tooltips use "Ambient Shadows"—multi-layered, low-opacity shadows (e.g., `0 10px 30px rgba(0,0,0,0.5)`) to appear physically closer to the user.
4.  **Interactive States:** On hover, cards should slightly increase in scale (1.02x) and gain a subtle inner glow using the primary Indigo color.

## Shapes

The shape language is defined by a consistent **Rounded (8px-12px)** aesthetic. This softens the industrial nature of inventory data, making the application feel modern and approachable.

- **Standard Components:** Buttons, Input fields, and small Cards use an 8px radius (`rounded-md`).
- **Main Containers:** Dashboard widgets and larger modal windows use a 16px radius (`rounded-xl`).
- **Status Pills:** Badges and chips are fully "Pill-shaped" (circular ends) to contrast against the rectangular grid of the UI.

## Components

### Buttons
Primary buttons feature a subtle vertical gradient of the Indigo brand color. They should include a 1px top-highlight border to mimic a tactile edge. Secondary buttons are "Ghost" style with a 1px Teal or White border.

### Cards
Cards are the primary data vehicle. They must include a subtle 1px border and a background blur. Use "Energetic Orange" as a top-border accent for cards that require immediate user attention.

### Input Fields
Inputs use the "Surface Layer" styling: dark background, 8px radius, and a 2px Indigo border on focus. Icons within inputs should be "Soft Rounded" style and set to 60% opacity unless active.

### Data Visualization
Charts should utilize the full "Kinetic Trio" (Teal, Orange, Purple). Use rounded caps on bar charts and soft-curved lines on area charts with a gradient fill that fades into the card background.

### Empty States
Empty states are opportunities for engagement. Use subtle, oversized decorative patterns (circles or geometric lines) in the background with a centered, rounded illustration and a primary call-to-action button.