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
