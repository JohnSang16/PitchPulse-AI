# PitchPulse — Design System
**Aesthetic: FWC 26 Broadcast**
Modeled on the FIFA World Cup 26 identity (fifa.com/worldcup and the Atlanta host city site): near-black surfaces, metallic trophy gold as the primary accent (home team, CTAs, brand), Atlanta persian red for the away team, iris blue as the tertiary accent. Archivo Black stands in for the custom FWC26 display face, Noto Sans (FIFA's real secondary font) for UI text, JetBrains Mono for data. The real World Cup trophy PNG anchors the scoreboard, results, and About hero.

---

## Color Tokens

```css
/* Defined in src/index.css */
:root {
  --bg-base:        #060607;   /* page/root background (near-black, FIFA style) */
  --bg-surface:     #101013;   /* cards, inputs, dropdowns */
  --bg-raised:      #1a1a1f;   /* hover states, elevated elements */

  --border-dim:     #161619;   /* subtle dividers */
  --border-default: #242428;   /* standard borders */
  --border-accent:  rgba(212,175,55,0.35); /* gold-tinted border on focus */

  --gold:           #d4af37;   /* metallic trophy gold — CTAs, home team, brand */
  --gold-bright:    #e6c752;   /* hover state for gold elements */
  --gold-dim:       rgba(212,175,55,0.55);

  --red:           #c8503f;   /* Atlanta persian red — away team, away advice */
  --red-dim:       rgba(200,80,63,0.55);

  --text-primary:   #edf2fa;   /* headlines, stat values, selected inputs */
  --text-secondary: #94a3bd;   /* body copy, data labels */
  --text-muted:     #566179;   /* eyebrows, placeholders, inactive nav */

  --pitch-bg:       #08130c;   /* pitch surface */
  --pitch-stripe:   #0a170e;   /* alternating mow stripes */
  --pitch-line:     #23402c;   /* pitch markings */
}
```

**Color meaning is load-bearing:** gold always means home, red always means away, slate `#475569` means draw, iris blue `#7b80e0` (Atlanta host city accent) marks the key battle. Never reuse these hues for anything else.

---

## Typography

```css
/* Google Fonts — loaded in index.html */
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Noto+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

font-family: 'Archivo Black', 'Noto Sans', sans-serif;     /* DISPLAY: FWC26-style poster face — brand, titles, headings, CTA */
font-family: 'Noto Sans', -apple-system, sans-serif;       /* UI: FIFA's secondary font — body copy, nav, descriptions */
font-family: 'JetBrains Mono', 'Courier New', monospace;   /* MONO: numbers, stats, eyebrows, formation labels */
```

### Scale
| Role | Font | Size | Weight | Color |
|---|---|---|---|---|
| Brand | Archivo Black | 18px | 700 | `--text-primary` + gold "AI" |
| Page title | Archivo Black | 32px | 600 | `--text-primary` |
| Card heading | Archivo Black | 14-15px | 600 | `--text-primary` or `--gold` |
| Body copy | Noto Sans | 13-15px | 400 | `--text-secondary` |
| Nav links | Noto Sans | 13px | 500 | `--text-muted` / `--text-primary` active |
| CTA button | Archivo Black | 13px | 700, uppercase, 0.08em | `#171207` on gold |
| Eyebrow / label | JetBrains Mono | 10-11px | 500, uppercase, 0.14-0.16em | `--text-muted` |
| Stat value | JetBrains Mono | 30px | 600, tabular-nums | team color or `--text-primary` |

**Rules:**
- Eyebrows and field labels are mono + uppercase; everything else reads as normal case.
- Numbers always use JetBrains Mono with `font-variant-numeric: tabular-nums`.
- Labels tied to a team carry a 7px colored dot (gold = home, red = away).

---

## Component Specs

### Navbar
```
height: 60px
background: rgba(5,7,13,0.85) + backdrop-filter: blur(12px)
border-bottom: 1px solid --border-default
```
Brand left (pulsing gold champion's star ★ + wordmark). Nav links right as pill buttons: active gets `--bg-raised` background and 1px border, inactive is plain muted text.

### Cards
```
background: --bg-surface
border: 1px solid --border-default
border-radius: 10-12px
```
Hover (when interactive): border shifts toward gold at 45% alpha, background to `--bg-raised`, lift `y: -3`.

### Select / Dropdown
```
background: --bg-surface;  color: --text-primary
border: 1px solid --border-default;  border-radius: 10px
font: Noto Sans 13.5px / mono 13px for formations;  padding: 11px 30px 11px 13px
```
Focus: border tints to the owning team's accent at 40% alpha. Custom `▾` arrow in `--text-muted`.

### Primary CTA (Run Simulation)
```
background: --gold;  color: #171207
font: Archivo Black 13px 700 uppercase 0.08em
padding: 14px 16px;  border-radius: 10px
resting glow: 0 0 16px rgba(212,181,106,0.10)
hover: scale 1.015 + glow 0 0 24px rgba(212,181,106,0.22)
disabled: background #1a2233, text --text-muted, no glow
```

### Stats Bar (bottom of dashboard)
- Stacked probability bar first: 6px tall, radius 3px, segments gold / slate / red sized by percentage, animated on result.
- Win % values in JetBrains Mono 30px 600; the most likely outcome renders in its team color with a soft matching text-shadow, others in `--text-primary`.
- xG and simulation count in `--text-secondary`. Placeholder before first run: `–`.

### AI Coach Cards
```
background: --bg-surface;  border: 1px solid --border-default
border-left: 3px solid [section color];  border-radius: 10px
```
Section colors: Tactical Overview gold, Key Battle steel blue `#8fa8cc`, Home Advice gold, Away Advice red. Cards stagger in with a 70ms delay each.

---

## Football Pitch SVG

```
Surface:         #08130c with 75px-wide alternating mow stripes #0a170e
All lines:       #23402c (stroke-width: 1)
Home nodes:      fill #d4af37, text #171207 (dark on gold)
Away nodes:      fill #101013, stroke rgba(200,80,63,0.6), text red
Node radius:     8px;  font: JetBrains Mono 6px 600
Player cards:    body #101013, header #1a1a1f, radius 4,
                 gold accents (home) / red accents (away), name in --text-primary
```

---

## Tournament Chrome

All tournament components live in `frontend/src/components/ui/Tournament.jsx`. Every color is a muted tint of the core palette; nothing here introduces a new hue.

### Ribbon
Fixed strip under the navbar, 32px tall, `--bg-surface` with 1px `--border-default` bottom border. FWC26 emblem-style block strips (alternating squares and quarter-circles, the geometric vocabulary of the World Cup 26 identity) in gold, iris, and persian red at roughly 0.5 alpha flank a centered JetBrains Mono 10px uppercase label: "PITCHPULSE INVITATIONAL · WE ARE 26". The `Pennants` component renders this pattern. Content offset stays 92px (60 navbar + 32 ribbon).

### Federation crest
Generic rounded-square SVG badge: one star above a horizontal band, `--bg-raised` fill, accent stroke at 0.55 alpha. Two colorways only: gold (home) and red (away). Used in team selectors, stats bar labels, scoreboard, and fixture card. Never a national flag.

### Scoreboard
Appears above the pitch once both teams are selected. Home crest and name left in gold, trophy PNG over "VS" center in Archivo Black 700 flanked by laurel SVGs, away crest and name right in red. After simulation, win percentages render under each name and the favourite gets a 2px underline in its color with a soft shadow at 0.2 alpha.

### Trophy moment
The real World Cup trophy PNG (`src/assets/world-cup-trophy.png`, transparent background) rendered at 17px beside the leading win percentage in the stats bar, with a drop-shadow glow in the leading team's color. The same asset appears at 30px above "VS" in the scoreboard and at 44px in the About hero. Never shown when Draw leads. On new results, a one-time confetti burst plays over the stats bar: 48 particles in gold, slate, and red, roughly 1.5s. Both respect `prefers-reduced-motion` (global CSS kill switch in `index.css`, plus `useReducedMotion` in the component).

### Floodlight backdrop
`radial-gradient(ellipse 60% 45% at 50% 0%, rgba(212,181,106,0.04), transparent 70%)` on the pitch container. Barely visible by design; do not raise the alpha.

### Fixture card
Sidebar card above AI Coach when both teams are picked: "MATCH 01 · KNOCKOUT STAGE" eyebrow, crest + name rows (gold then red), "SIMULATED · 90 MIN + ET" footer. Static presentation, no logic.

### About hero
Laurel pair flanking the page title, one short pennant row (max-width 260px) under it.

### Legal rule (revised 2026-07-12)
The owner opted in to using the real World Cup trophy PNG and FWC26-inspired styling for this personal project. Still no FIFA wordmarks or official emblems, and no recognisable national flags. Fonts are free lookalikes (Archivo Black for FWC26), not the licensed typeface.

---

## Layout Grid

```
Navbar:  full width, 60px tall, fixed, blurred
Ribbon:  full width, 32px tall, fixed below navbar (content offset 92px)
Body:    CSS grid, 360px sidebar | 1fr main content
Main:    flex column — scoreboard / pitch header (sticky, blurred) / pitch (flex:1) / stats bar
Mobile:  single column at <768px, pitch wrapped in a 14px-radius bordered card
```

---

## What to Avoid
- No neon. Gold is metallic trophy gold (`#d4af37`), never bright yellow or lemon.
- Gold and red never swap meaning. Home is gold. Away is red. Always.
- No pure white `#ffffff`; use `--text-primary` (`#edf2fa`).
- Glows only on gold/red accents (CTA, brand dot, leading stat). Never on neutral surfaces.
- No text below 10px in HTML (SVG pitch internals excepted).
- Radius vocabulary is 8 / 10 / 12 / 14px. No sharp 0-2px corners.

---

## Claude Code Usage

Paste this at the top of any prompt:

```
Reference STYLE.md for all design decisions. This project uses the FWC 26 Broadcast aesthetic:
near-black backgrounds (#060607), metallic trophy gold primary (#d4af37, home/CTA),
Atlanta persian red secondary (#c8503f, away), iris blue tertiary (#7b80e0),
Archivo Black for display headings, Noto Sans for UI text, JetBrains Mono for data,
1px borders in #242428, 10-12px radii, subtle gold glows on accents only,
real World Cup trophy PNG in src/assets. See STYLE.md for full token reference.
```
