# LoyalPass - Master Design System
Generated via UI UX Pro Max Guidelines

## 1. Core Identity
- **Product Type**: SaaS / B2B Loyalty Platform
- **Style**: Premium SaaS (Glassmorphism + Dark/Aurora accents)
- **Vibe**: Trustworthy, Professional, Modern, High-Conversion
- **Industry**: Retail / Local Businesses

## 2. Typography
- **Primary Font**: Outfit (Sans-serif, geometric, modern)
- **Fallback**: Inter / system-ui
- **Hierarchy**:
  - H1: 4xl to 6xl, font-bold, tight tracking
  - H2: 3xl to 4xl, font-semibold
  - Body: 16px (1rem), line-height 1.5 to 1.75
- **Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

## 3. Color Palette
- **Primary**: Emerald Green (`#10B981`) - High trust, ROI focus.
- **Background (Light)**: Pure White (`#FFFFFF`) to Off-White (`#F9FAFB`)
- **Background (Dark Elements)**: Charcoal Grey (`#1F2937`), Graphite Grey (`#111827`)
- **Text (Dark)**: Slate-900 (`#0F172A`) for headings, Slate-600 (`#475569`) for body.
- **Text (Light on Dark)**: White or Slate-200.
- **CRITICAL RULE**: STRICTLY NO BLUE. NOT ANYWHERE.

## 4. UI Patterns & Elements
- **Glassmorphism**: 
  - Use `bg-white/80` or `bg-white/90` with `backdrop-blur-md` in Light Mode. 
  - Avoid `bg-white/10` in light mode (invisible).
- **Cards**:
  - Bento Grid layout for feature sections.
  - Subtle borders: `border border-gray-200` (Light) or `border-white/10` (Dark).
  - Shadows: `shadow-lg` for floating cards, `shadow-sm` for standard cards.
- **Buttons**:
  - Primary: Emerald background, white text, subtle hover lift (`hover:-translate-y-0.5`).
  - Secondary: Ghost or Outline with Emerald text.
  - Always add `cursor-pointer`.

## 5. Interaction & Animation (Emil Kowalski Philosophy)
- **Duration**: Fast and tight. 150ms to 300ms maximum.
- **Easing**: Natural ease-out for entrances, ease-in for exits.
- **Hover States**: Use color/opacity transitions (`transition-colors duration-200`). Do not use layout-shifting transforms (like scale that pushes other content).
- **Micro-interactions**: Purposeful, invisible motion. Don't over-animate.

## 6. Accessibility & UX Strict Rules
- **Contrast**: Minimum 4.5:1 ratio for text.
- **Icons**: NO EMOJIS as UI elements. Use Lucide React SVG icons.
- **Size**: Fixed viewBox (24x24), use `w-6 h-6`.
- **Touch**: 44x44px minimum for mobile tap targets.
- **Responsiveness**: Max width containers (`max-w-7xl`), no horizontal scroll on 375px.
