import { useId } from "react"

const MONO = "'JetBrains Mono', 'Courier New', monospace"

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
