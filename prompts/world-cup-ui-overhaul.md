# Prompt: Full World Cup UI Overhaul

Paste everything below the line into Claude Code from the repo root. It assumes the `ui/floodlight-redesign` branch state (Floodlight, World Cup Edition theme) as the starting point.

---

Transform the PitchPulse AI frontend into a complete World Cup tournament broadcast experience. Work in `frontend/` (React + Vite, framer-motion, inline-style design tokens in each component, global tokens in `frontend/src/index.css`). The current theme is documented in `STYLE.md`: deep navy surfaces (`#05070d`, `#0b101c`), muted trophy gold `#d4b56a` (home team, CTA, brand star), soft jersey red `#cd8272` (away team), Space Grotesk for headings, Inter for UI, JetBrains Mono for data. Build on this foundation, do not restart from scratch or change the core palette. The goal is tournament atmosphere layered on top of the existing calm, eye-friendly design.

## Hard constraints

1. **No FIFA intellectual property.** Do not use or imitate the FIFA logo, the World Cup trophy silhouette in exact form, official tournament wordmarks, mascots, or poster art. Use generic tournament visual language: stars, laurels, bunting, generic cup iconography drawn as original SVG.
2. **Keep it muted.** The owner already rejected neon. Every new color must be desaturated to sit with `#d4b56a` and `#cd8272`. No pure saturated flag colors: tint every flag and banner toward the navy background (reduce saturation roughly 30 to 40 percent, or overlay `rgba(5,7,13,0.35)`).
3. **Gold means home, red means away, everywhere.** Never violate this.
4. **All assets self-contained.** Inline SVG or CSS only. No external image URLs, no new font files, no new npm packages.
5. **Do not touch backend logic, API calls, or simulation flow.** `App.jsx` state handling, `client.js`, and component props stay as they are. This is visual only.
6. **Mobile must still work.** Every new element needs a sensible collapsed or hidden state below 768px (the existing `useIsMobile` hook).

## What to build

### 1. Tournament header ribbon
A slim strip directly under the navbar (28 to 32px tall): repeating bunting made of small SVG triangle pennants alternating muted gold, slate, and jersey red, on a `#0b101c` background with a 1px `#1b2436` bottom border. Center a small label in JetBrains Mono 10px uppercase: "PITCHPULSE INVITATIONAL · SUMMER 2026". On mobile, keep the strip but drop the pennant count.

### 2. Flag treatment for teams
The teams are Premier League clubs, so do not use national flags for them. Instead, design a generic "federation crest" system: a small rounded-square SVG badge next to each team name in the selectors and the stats bar, built from the team's accent color (gold home, red away) with a single star above a horizontal band. Same badge, two colorways. Where a purely decorative flag row fits (About page hero, tournament ribbon ends), use small hand-drawn SVG tricolor pennants in muted tones, never identifiable national flags.

### 3. Broadcast scoreboard matchup header
When both teams are selected, show a scoreboard bar above the pitch (replacing nothing, sliding in via framer-motion): home crest and name left in gold, "VS" center in Space Grotesk 700 with thin laurel SVG flourishes either side, away crest and name right in red. After simulation, the win percentages appear under each name and the favourite's side gets a subtle gold or red underline glow at the existing muted intensities (alpha 0.2 or lower).

### 4. Trophy moment on results
When simulation results land: a small original cup icon (simple SVG chalice, two handles, muted gold, no FIFA trophy silhouette) appears beside the leading outcome in the stats bar, and a one-time confetti burst plays over the stats bar only, 40 to 60 particles max in gold, slate, and red, 1.5 seconds, respecting `prefers-reduced-motion` (skip entirely if set). Draw as leading outcome shows no trophy.

### 5. Stadium atmosphere backdrop
Behind the pitch area, add a very subtle radial gradient suggesting floodlight spill: `radial-gradient` from `rgba(212,181,106,0.04)` top-center fading to transparent. Barely perceptible, no banding. Optionally add two tiny CSS "floodlight" glows in the top corners of the pitch container at alpha 0.03.

### 6. Group-stage framing
Above the AI Coach section in the sidebar, add a small static card styled like a fixture listing: "MATCH 01 · KNOCKOUT STAGE" eyebrow, the two selected team names with crests, kickoff placeholder "SIMULATED · 90 MIN + ET". Pure presentation, populated from existing state.

### 7. About page hero upgrade
Add the bunting pennant SVG as a thin decorative row under the hero heading, and a muted gold laurel pair flanking the "About PitchPulse AI" title. Everything else on the page stays.

## Style discipline

- Fonts and sizes follow the existing STYLE.md scale. No new fonts.
- Radius vocabulary stays 8 / 10 / 12 / 14px.
- Glows stay at or below current alphas (0.10 resting, 0.22 hover, 0.33 text-shadow max).
- New SVG detail lines use `#1b2436` or the muted accents, stroke width 1.
- Whitespace over decoration: if an element crowds the layout, cut it.

## Process

1. Read `STYLE.md`, `frontend/src/App.jsx`, and the components in `frontend/src/components/` before writing anything.
2. Build one section at a time in the order above; run `npm run build` in `frontend/` after each.
3. Launch `npm run dev` (proxy to the live backend is already configured in `vite.config.ts`), drive it headless (select two teams, run a simulation), and screenshot desktop 1440x900 and mobile 390x844. Actually look at the screenshots and fix what looks wrong before moving on.
4. Check the browser console for errors after each flow.
5. Update `STYLE.md` with a "Tournament Chrome" section documenting every new element, color, and rule.
6. Commit each numbered section as its own conventional commit on the current branch. Do not push.

## Acceptance checklist

- [ ] Ribbon, crests, scoreboard, trophy moment, backdrop, fixture card, About hero all present
- [ ] No FIFA trademarks or recognisable national flags
- [ ] Nothing neon: every new hex sits at or below the saturation of `#d4b56a`
- [ ] Gold home / red away meaning intact everywhere
- [ ] `npm run build` passes, zero console errors in the full simulate flow
- [ ] Mobile layout verified by screenshot, not assumption
- [ ] `prefers-reduced-motion` disables confetti and pulse animations
- [ ] STYLE.md updated, one commit per section
