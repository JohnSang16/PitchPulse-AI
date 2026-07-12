import { useId } from "react"
import { motion } from "framer-motion"

const MONO    = "'JetBrains Mono', 'Courier New', monospace"
const DISPLAY = "'Space Grotesk', 'Inter', sans-serif"

// Muted bunting colors: gold, slate, jersey red tinted toward the navy base
const PENNANT_COLORS = ["rgba(212,181,106,0.5)", "rgba(71,85,105,0.5)", "rgba(205,130,114,0.5)"]

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
export function Crest({ color = "#d4b56a", size = 14, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ flexShrink: 0, display: "block", ...style }}>
      <rect x="1.5" y="1.5" width="17" height="17" rx="4.5"
        fill="#121a2b" stroke={color} strokeWidth="1" strokeOpacity="0.55" />
      <polygon
        points="10,3.5 10.82,5.87 13.33,5.92 11.33,7.43 12.06,9.83 10,8.4 7.94,9.83 8.67,7.43 6.67,5.92 9.18,5.87"
        fill={color} fillOpacity="0.9" />
      <rect x="4.5" y="12" width="11" height="2.5" rx="1.25" fill={color} fillOpacity="0.7" />
    </svg>
  )
}

// Thin laurel branch: stem arc with three leaves. flip mirrors it for the right side.
export function Laurel({ flip = false, color = "rgba(212,181,106,0.5)", height = 24 }) {
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
  const GOLD = "#d4b56a"
  const RED  = "#cd8272"
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
        background: "#0b101c", borderBottom: "1px solid #1b2436",
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

export function TournamentRibbon({ isMobile }) {
  const sideStyle = isMobile ? { flex: "0 0 48px" } : {}
  return (
    <div style={{
      position: "fixed", top: "60px", left: 0, right: 0, zIndex: 9998,
      height: "32px", display: "flex", alignItems: "center",
      gap: isMobile ? "10px" : "16px", padding: isMobile ? "0 12px" : "0 24px",
      background: "#0b101c", borderBottom: "1px solid #1b2436",
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
