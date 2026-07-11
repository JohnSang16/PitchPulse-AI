# PitchPulse — Design System
**Aesthetic: Floodlight**
A night match under stadium lights. Deep navy-black surfaces, electric lime as the primary accent (home team, CTAs, the "pulse"), sky cyan for the away team. Space Grotesk headlines, Inter UI text, JetBrains Mono for data. Broadcast-graphics energy: think Premier League on-screen stats package, not a spreadsheet.

---

## Color Tokens

```css
/* Defined in src/index.css */
:root {
  --bg-base:        #05070d;   /* page/root background */
  --bg-surface:     #0b101c;   /* cards, inputs, dropdowns */
  --bg-raised:      #121a2b;   /* hover states, elevated elements */

  --border-dim:     #131b2b;   /* subtle dividers */
  --border-default: #1b2436;   /* standard borders */
  --border-accent:  rgba(163,230,53,0.35); /* lime-tinted border on focus */

  --lime:           #a3e635;   /* primary accent — CTAs, home team, brand pulse */
  --lime-bright:    #bef264;   /* hover state for lime elements */
  --lime-dim:       rgba(163,230,53,0.55);

  --cyan:           #38bdf8;   /* secondary accent — away team, away advice */
  --cyan-dim:       rgba(56,189,248,0.55);

  --text-primary:   #edf2fa;   /* headlines, stat values, selected inputs */
  --text-secondary: #94a3bd;   /* body copy, data labels */
  --text-muted:     #566179;   /* eyebrows, placeholders, inactive nav */

  --pitch-bg:       #08130c;   /* pitch surface */
  --pitch-stripe:   #0a170e;   /* alternating mow stripes */
  --pitch-line:     #23402c;   /* pitch markings */
}
```

**Color meaning is load-bearing:** lime always means home, cyan always means away, slate `#475569` means draw, amber `#f59e0b` marks the key battle. Never reuse these hues for anything else.

---

## Typography

```css
/* Google Fonts — loaded in index.html */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

font-family: 'Space Grotesk', 'Inter', sans-serif;         /* DISPLAY: brand, page titles, card headings, CTA */
font-family: 'Inter', -apple-system, sans-serif;           /* UI: body copy, nav links, descriptions */
font-family: 'JetBrains Mono', 'Courier New', monospace;   /* MONO: numbers, stats, eyebrows, formation labels */
```

### Scale
| Role | Font | Size | Weight | Color |
|---|---|---|---|---|
| Brand | Space Grotesk | 18px | 700 | `--text-primary` + lime "AI" |
| Page title | Space Grotesk | 32px | 600 | `--text-primary` |
| Card heading | Space Grotesk | 14-15px | 600 | `--text-primary` or `--lime` |
| Body copy | Inter | 13-15px | 400 | `--text-secondary` |
| Nav links | Inter | 13px | 500 | `--text-muted` / `--text-primary` active |
| CTA button | Space Grotesk | 13px | 700, uppercase, 0.08em | `#0a0f04` on lime |
| Eyebrow / label | JetBrains Mono | 10-11px | 500, uppercase, 0.14-0.16em | `--text-muted` |
| Stat value | JetBrains Mono | 30px | 600, tabular-nums | team color or `--text-primary` |

**Rules:**
- Eyebrows and field labels are mono + uppercase; everything else reads as normal case.
- Numbers always use JetBrains Mono with `font-variant-numeric: tabular-nums`.
- Labels tied to a team carry a 7px colored dot (lime = home, cyan = away).

---

## Component Specs

### Navbar
```
height: 60px
background: rgba(5,7,13,0.85) + backdrop-filter: blur(12px)
border-bottom: 1px solid --border-default
```
Brand left (pulsing lime dot + wordmark). Nav links right as pill buttons: active gets `--bg-raised` background and 1px border, inactive is plain muted text.

### Cards
```
background: --bg-surface
border: 1px solid --border-default
border-radius: 10-12px
```
Hover (when interactive): border shifts toward lime at 45% alpha, background to `--bg-raised`, lift `y: -3`.

### Select / Dropdown
```
background: --bg-surface;  color: --text-primary
border: 1px solid --border-default;  border-radius: 10px
font: Inter 13.5px / mono 13px for formations;  padding: 11px 30px 11px 13px
```
Focus: border tints to the owning team's accent at 40% alpha. Custom `▾` arrow in `--text-muted`.

### Primary CTA (Run Simulation)
```
background: --lime;  color: #0a0f04
font: Space Grotesk 13px 700 uppercase 0.08em
padding: 14px 16px;  border-radius: 10px
resting glow: 0 0 20px rgba(163,230,53,0.18)
hover: scale 1.015 + glow 0 0 28px rgba(163,230,53,0.35)
disabled: background #1a2233, text --text-muted, no glow
```

### Stats Bar (bottom of dashboard)
- Stacked probability bar first: 6px tall, radius 3px, segments lime / slate / cyan sized by percentage, animated on result.
- Win % values in JetBrains Mono 30px 600; the most likely outcome renders in its team color with a soft matching text-shadow, others in `--text-primary`.
- xG and simulation count in `--text-secondary`. Placeholder before first run: `–`.

### AI Coach Cards
```
background: --bg-surface;  border: 1px solid --border-default
border-left: 3px solid [section color];  border-radius: 10px
```
Section colors: Tactical Overview lime, Key Battle amber `#f59e0b`, Home Advice lime, Away Advice cyan. Cards stagger in with a 70ms delay each.

---

## Football Pitch SVG

```
Surface:         #08130c with 75px-wide alternating mow stripes #0a170e
All lines:       #23402c (stroke-width: 1)
Home nodes:      fill #a3e635, text #0a0f04 (dark on lime)
Away nodes:      fill #0b101c, stroke rgba(56,189,248,0.6), text cyan
Node radius:     8px;  font: JetBrains Mono 6px 600
Player cards:    navy body #0b101c, header #121a2b, radius 4,
                 lime accents (home) / cyan accents (away), name in --text-primary
```

---

## Layout Grid

```
Navbar:  full width, 60px tall, fixed, blurred
Body:    CSS grid, 360px sidebar | 1fr main content
Main:    flex column — pitch header (sticky, blurred) / pitch (flex:1) / stats bar
Mobile:  single column at <768px, pitch wrapped in a 14px-radius bordered card
```

---

## What to Avoid
- No gold, champagne, or warm-luxury tones. That was the old theme.
- Lime and cyan never swap meaning. Home is lime. Away is cyan. Always.
- No pure white `#ffffff`; use `--text-primary` (`#edf2fa`).
- Glows only on lime/cyan accents (CTA, brand dot, leading stat). Never on neutral surfaces.
- No text below 10px in HTML (SVG pitch internals excepted).
- Radius vocabulary is 8 / 10 / 12 / 14px. No sharp 0-2px corners.

---

## Claude Code Usage

Paste this at the top of any prompt:

```
Reference STYLE.md for all design decisions. This project uses the Floodlight aesthetic:
deep navy-black backgrounds (#05070d), electric lime primary (#a3e635, home/CTA),
sky cyan secondary (#38bdf8, away), Space Grotesk for headings, Inter for UI text,
JetBrains Mono for data, 1px borders in #1b2436, 10-12px radii, subtle lime glows
on accents only. See STYLE.md for full token reference.
```
