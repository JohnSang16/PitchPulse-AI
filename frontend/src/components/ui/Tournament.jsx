import { useId, useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"

const MONO    = "'JetBrains Mono', 'Courier New', monospace"
const DISPLAY = "'Archivo Black', 'Noto Sans', sans-serif"

// Muted bunting colors: gold, slate, jersey red tinted toward the navy base
const PENNANT_COLORS = ["rgba(212,175,55,0.5)", "rgba(71,85,105,0.5)", "rgba(200,80,63,0.5)"]

export function Pennants({ height = 10, style = {} }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "")
  return (
    <svg height={height} width="100%" preserveAspectRatio="none"
      style={{ flex: 1, minWidth: 0, display: "block", ...style }}>
      <defs>
        <pattern id={id} width="54" height={height} patternUnits="userSpaceOnUse">
          {PENNANT_COLORS.map((c, i) => (
            <path key={i} d={`M${i * 18},0 L${i * 18 + 14},0 L${i * 18 + 7},${height - 1} Z`} fill={c} />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#${id})`} />
    </svg>
  )
}

// Generic federation crest: rounded square, one star above a horizontal band.
// Same mark in two colorways — gold (home) and red (away). Not a national flag.
export function Crest({ color = "#d4af37", size = 14, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ flexShrink: 0, display: "block", ...style }}>
      <rect x="1.5" y="1.5" width="17" height="17" rx="4.5"
        fill="#1a1a1f" stroke={color} strokeWidth="1" strokeOpacity="0.55" />
      <polygon
        points="10,3.5 10.82,5.87 13.33,5.92 11.33,7.43 12.06,9.83 10,8.4 7.94,9.83 8.67,7.43 6.67,5.92 9.18,5.87"
        fill={color} fillOpacity="0.9" />
      <rect x="4.5" y="12" width="11" height="2.5" rx="1.25" fill={color} fillOpacity="0.7" />
    </svg>
  )
}

// Thin laurel branch: stem arc with three leaves. flip mirrors it for the right side.
export function Laurel({ flip = false, color = "rgba(212,175,55,0.5)", height = 24 }) {
  return (
    <svg width={height * 0.7} height={height} viewBox="0 0 17 24"
      style={{ display: "block", transform: flip ? "scaleX(-1)" : "none", flexShrink: 0 }}>
      <path d="M13,2 C6,6 4,13 7,22" stroke={color} strokeWidth="1" fill="none" />
      <path d="M11,5 q-5,-2 -8,1 q5,2 8,-1 Z" fill={color} />
      <path d="M9,11 q-5,-1 -7,2 q5,1 7,-2 Z" fill={color} />
      <path d="M8,17 q-5,0 -6,3 q5,0 6,-3 Z" fill={color} />
    </svg>
  )
}

// Broadcast scoreboard: home crest/name left in gold, VS with laurels center,
// away crest/name right in red. Win % appears under names once a result exists.
export function Scoreboard({ homeName, awayName, result, isMobile }) {
  const GOLD = "#d4af37"
  const RED  = "#c8503f"
  const homePct = result?.home_win_pct
  const awayPct = result?.away_win_pct
  const homeFav = result && homePct >= awayPct && homePct >= result.draw_pct
  const awayFav = result && awayPct > homePct && awayPct >= result.draw_pct

  const side = (name, pct, color, fav, alignRight) => (
    <div style={{
      flex: 1, minWidth: 0, display: "flex", flexDirection: "column",
      alignItems: alignRight ? "flex-end" : "flex-start", gap: "4px",
    }}>
      <span style={{
        display: "flex", alignItems: "center", gap: "8px",
        flexDirection: alignRight ? "row-reverse" : "row",
        paddingBottom: "3px",
        borderBottom: fav ? `2px solid ${color}` : "2px solid transparent",
        boxShadow: fav ? `0 6px 10px -6px ${color}33` : "none",
        maxWidth: "100%",
      }}>
        <Crest color={color} size={isMobile ? 15 : 18} />
        <span style={{
          fontFamily: DISPLAY, fontSize: isMobile ? "13px" : "15px", fontWeight: "600",
          color, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {name}
        </span>
      </span>
      {result && (
        <span style={{ fontFamily: MONO, fontSize: "11px", fontWeight: "500", color: "#94a3bd", fontVariantNumeric: "tabular-nums" }}>
          {Math.round(pct)}% win
        </span>
      )}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        display: "flex", alignItems: "center", gap: isMobile ? "10px" : "20px",
        padding: isMobile ? "12px 14px" : "14px 24px",
        background: "#101013", borderBottom: "1px solid #242428",
      }}
    >
      {side(homeName, homePct, GOLD, homeFav, false)}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        <Laurel />
        <span style={{ fontFamily: DISPLAY, fontSize: isMobile ? "13px" : "15px", fontWeight: "700", letterSpacing: "0.06em", color: "#edf2fa" }}>
          VS
        </span>
        <Laurel flip />
      </div>
      {side(awayName, awayPct, RED, awayFav, true)}
    </motion.div>
  )
}

// Original cup mark: simple chalice with two handles. Deliberately generic.
export function TrophyCup({ size = 16, color = "#d4af37" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ flexShrink: 0, display: "block" }}>
      <path d="M6,3 h8 v3.5 a4,4 0 0 1 -8,0 Z" fill={color} fillOpacity="0.9" />
      <path d="M6,4.5 C3,4.5 3,8.5 6.4,8.8" stroke={color} strokeOpacity="0.7" strokeWidth="1.2" fill="none" />
      <path d="M14,4.5 C17,4.5 17,8.5 13.6,8.8" stroke={color} strokeOpacity="0.7" strokeWidth="1.2" fill="none" />
      <rect x="9" y="10.5" width="2" height="3.2" fill={color} fillOpacity="0.8" />
      <rect x="6.2" y="13.7" width="7.6" height="1.9" rx="0.95" fill={color} fillOpacity="0.9" />
    </svg>
  )
}

// One-time confetti burst over the stats bar. Skipped under prefers-reduced-motion.
const CONFETTI_COLORS = ["rgba(212,175,55,0.85)", "rgba(71,85,105,0.85)", "rgba(200,80,63,0.85)"]

export function Confetti({ count = 48 }) {
  const reduced = useReducedMotion()
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      left: Math.random() * 100,
      size: 3.5 + Math.random() * 2.5,
      drift: (Math.random() - 0.5) * 60,
      rotate: (Math.random() - 0.5) * 540,
      delay: Math.random() * 0.25,
      duration: 1.0 + Math.random() * 0.5,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    })), [count])

  if (reduced) return null

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((p, i) => (
        <motion.span
          key={i}
          initial={{ y: -12, x: 0, opacity: 1, rotate: 0 }}
          animate={{ y: 130, x: p.drift, opacity: 0, rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: [0.25, 0.6, 0.5, 1] }}
          style={{
            position: "absolute", top: 0, left: `${p.left}%`,
            width: `${p.size}px`, height: `${p.size * 1.6}px`,
            background: p.color, borderRadius: "1px",
          }}
        />
      ))}
    </div>
  )
}

// Static fixture listing styled like a tournament match card. Presentation only.
export function FixtureCard({ homeName, awayName }) {
  const row = (name, color) => (
    <div style={{ display: "flex", alignItems: "center", gap: "9px", padding: "7px 0" }}>
      <Crest color={color} size={15} />
      <span style={{
        fontFamily: DISPLAY, fontSize: "13.5px", fontWeight: "600", color,
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>
        {name}
      </span>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{
        background: "#101013", border: "1px solid #242428",
        borderRadius: "10px", padding: "12px 14px", marginBottom: "18px",
      }}
    >
      <p style={{
        fontFamily: MONO, fontSize: "9.5px", fontWeight: "500",
        letterSpacing: "0.16em", textTransform: "uppercase",
        color: "#566179", margin: "0 0 8px 0",
      }}>
        Match 01 · Knockout Stage
      </p>
      {row(homeName, "#d4af37")}
      {row(awayName, "#c8503f")}
      <p style={{
        fontFamily: MONO, fontSize: "9px", fontWeight: "500",
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: "#566179", margin: "8px 0 0 0", paddingTop: "8px",
        borderTop: "1px solid #161619",
      }}>
        Simulated · 90 min + ET
      </p>
    </motion.div>
  )
}

export function TournamentRibbon({ isMobile }) {
  const sideStyle = isMobile ? { flex: "0 0 48px" } : {}
  return (
    <div style={{
      position: "fixed", top: "60px", left: 0, right: 0, zIndex: 9998,
      height: "32px", display: "flex", alignItems: "center",
      gap: isMobile ? "10px" : "16px", padding: isMobile ? "0 12px" : "0 24px",
      background: "#101013", borderBottom: "1px solid #242428",
    }}>
      <Pennants style={sideStyle} />
      <span style={{
        fontFamily: MONO, fontSize: isMobile ? "9px" : "10px", fontWeight: "500",
        letterSpacing: "0.18em", textTransform: "uppercase",
        color: "#566179", whiteSpace: "nowrap", flexShrink: 0,
      }}>
        Pitchpulse Invitational · Summer 2026
      </span>
      <Pennants style={sideStyle} />
    </div>
  )
}
