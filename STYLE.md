# PitchPulse — Design System
**Aesthetic: Noir Bloomberg**
Jet black surfaces. Champagne gold accents. Thin serif headers. Monospace data type. Luxury terminal energy — think Bloomberg Terminal meets Michelin-star menu.

---

## Color Tokens

```css
/* Define these in your global CSS or index.css */
:root {
  --bg-base:        #080808;   /* page/root background */
  --bg-surface:     #0d0d0d;   /* cards, inputs, dropdowns */
  --bg-raised:      #111111;   /* hover states, elevated elements */

  --border-dim:     #141210;   /* subtle dividers */
  --border-default: #1e1a12;   /* standard borders */
  --border-accent:  #c9a84c33; /* gold-tinted border on focus */

  --gold:           #c9a84c;   /* primary accent — CTAs, active states, home team */
  --gold-dim:       #8a7a52;   /* secondary gold — stat values, muted data */
  --gold-ghost:     #3d3520;   /* very dim gold — labels, inactive nav links */
  --gold-whisper:   #2e2814;   /* near-invisible gold — section labels, borders */

  --text-primary:   #f0ead6;   /* headlines, hero text */
  --text-secondary: #8a7a52;   /* body, data values */
  --text-muted:     #3d3520;   /* labels, eyebrows, inactive */

  --pitch-bg:       #0a1a0a;   /* football pitch surface */
  --pitch-line:     #1a2e1a;   /* pitch markings */
}
```

---

## Typography

```css
/* Google Fonts import — add to index.html or @import in CSS */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400&family=DM+Mono:wght@300;400&display=swap');

/* Usage rules */
font-family: 'Playfair Display', Georgia, serif;  /* ONLY for: logo, page title, hero headers */
font-family: 'DM Mono', 'Courier New', monospace; /* EVERYTHING else: nav, labels, inputs, data */
```

### Scale
| Role | Size | Weight | Letter-spacing | Color |
|---|---|---|---|---|
| Logo / Brand | 13px | 400 | 0.06em | `--gold` |
| Page title | 22–28px | 300 | 0.04em | `--text-primary` |
| Section eyebrow | 8px | 400 | 0.25em | `--text-muted` |
| Section label | 8px | 400 | 0.20em | `--gold-ghost` |
| Field label | 8px | 400 | 0.18em | `--gold-ghost` |
| Input / select text | 10–11px | 400 | 0.06em | `--gold-dim` |
| Nav links | 9px | 400 | 0.18em | `--gold-ghost` (inactive) / `--gold` (active) |
| CTA button | 9px | 400 | 0.22em | `#080808` on gold bg |
| Stat value | 14px | 400 | 0 | `--gold` (primary) / `--gold-dim` (secondary) |
| Stat label | 7px | 400 | 0.20em | `--gold-whisper` |

**Rules:**
- ALL labels and nav items use `text-transform: uppercase`
- Playfair Display headers should be `font-weight: 300` — thin is luxurious
- Never use Inter, Roboto, or system fonts in this project

---

## Component Specs

### Navbar
```
height: 44px
background: --bg-base
border-bottom: 0.5px solid --border-default
padding: 0 24px
```
Logo left. Nav links right. No hover backgrounds — only color change on hover.

### Sidebar / Panel
```
width: 260px
background: --bg-base
border-right: 0.5px solid --border-default
padding: 24px 20px
```
Sections separated by `border-top: 0.5px solid --border-dim` with 16–20px vertical gap.

### Select / Dropdown
```css
background: var(--bg-surface);
border: 0.5px solid var(--border-default);
color: var(--gold-dim);
font-family: 'DM Mono', monospace;
font-size: 10px;
letter-spacing: 0.06em;
padding: 9px 12px;
border-radius: 3px;
appearance: none;
```
On focus: `border-color: var(--border-accent)`
Use a custom `▾` arrow in `--gold-ghost`, positioned absolute right.

### Primary CTA Button (Run Simulation)
```css
background: var(--gold);
color: #080808;
font-family: 'DM Mono', monospace;
font-size: 9px;
letter-spacing: 0.22em;
text-transform: uppercase;
padding: 10px 16px;
border: none;
border-radius: 2px;
width: 100%;
```
Hover: `background: #d4b660`
No border-radius above 3px on any button.

### Stat Cards (bottom bar)
```css
/* Label */
font-size: 7px; letter-spacing: 0.20em; color: var(--gold-whisper); text-transform: uppercase;

/* Value */
font-size: 14px; font-family: 'DM Mono'; color: var(--gold);   /* primary stat */
font-size: 14px; font-family: 'DM Mono'; color: var(--gold-dim); /* secondary stat */
```
Use `—` as placeholder when no simulation has run yet.

### Dividers / Section Separators
```css
border: none;
border-top: 0.5px solid var(--border-dim);
margin: 4px 0 16px;
```

---

## Football Pitch SVG

```
Pitch background:  #0a1a0a
All lines:         #1a2e1a  (stroke-width: 0.5)
Home team nodes:   fill #c9a84c, text fill #080808
Away team nodes:   fill #2e2814, stroke #c9a84c33 (0.5px), text fill #c9a84c88
Node radius:       7px
Node font:         DM Mono, 6px, text-anchor: middle
```

Home players are fully lit gold. Away players are ghost-gold outlines — same palette, dimmed. This keeps the pitch on-brand without introducing a second color.

---

## Layout Grid

```
Navbar:  full width, 44px tall
Body:    CSS grid, 260px sidebar | 1fr main content
Main:    flex column — pitch header / pitch area (flex:1) / stats bar
```

---

## Spacing System
```
Component internal gaps:  6px, 8px, 10px, 12px
Section vertical rhythm:  14px, 16px, 20px, 24px
Page padding:             24px horizontal, 20px vertical
```

---

## What to Avoid
- No purple. Not even close to purple.
- No gradients anywhere — flat fills only.
- No border-radius above 4px (use 2–3px for buttons, 0 for dividers).
- No Inter, Roboto, or system-ui font stacks.
- No bright white (`#ffffff`) — use `--text-primary` (`#f0ead6`) which is warm off-white.
- No colored backgrounds on anything except the CTA button and pitch area.
- No shadows or glow effects.
- Don't make nav links into buttons — they're plain text with a color state only.

---

## Claude Code Usage

Paste this at the top of any prompt:

```
Reference STYLE.md for all design decisions. This project uses the Noir Bloomberg aesthetic:
jet black backgrounds (#080808), champagne gold accents (#c9a84c), Playfair Display for
headers only, DM Mono for all UI text, 0.5px borders in warm dark tones (#1e1a12),
no gradients, no shadows, border-radius max 3px. See STYLE.md for full token reference.
```

Or with Claude Code's `/init` or memory feature, add it to `CLAUDE.md` so it's loaded automatically on every session.
