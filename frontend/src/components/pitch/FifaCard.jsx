import { useState } from "react"

const MONO = "'DM Mono', 'Courier New', monospace"

export default function FifaCard({ x, y, player, isAway = false }) {
  const [hovered, setHovered] = useState(false)

  const W = 54
  const H = 66
  const cx = x - W / 2
  const cy = y - H / 2

  const atk     = Math.round((player.attack_rating  - 1.0) / 1.5 * 99)
  const def     = Math.round((player.defense_rating - 1.0) / 1.5 * 99)
  const overall = Math.round((atk + def) / 2) + 20

  const shortName   = player.name.includes(" ") ? player.name.split(" ").pop() : player.name
  const displayName = (shortName.length > 8 ? shortName.substring(0, 7) + "." : shortName).toUpperCase()

  // Home: gold-tinted body, bright accents. Away: dark body, dim accents.
  const bodyFill = isAway ? "#0d0d0d" : "#12100a"
  const headFill = isAway ? "#111111" : "#1a150a"
  const txtMain  = isAway ? "rgba(201,168,76,0.55)" : "#c9a84c"
  const txtDim   = isAway ? "rgba(201,168,76,0.28)" : "rgba(201,168,76,0.5)"
  const border   = hovered ? "#c9a84c" : (isAway ? "rgba(201,168,76,0.15)" : "rgba(201,168,76,0.5)")
  const bw       = hovered ? "1" : (isAway ? "0.5" : "0.75")

  const scale = hovered ? 1.12 : 1

  return (
    <g
      style={{
        cursor: "pointer",
        transform: `scale(${scale})`,
        transformOrigin: `${x}px ${y}px`,
        transition: "transform 0.18s ease-out",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card body */}
      <rect x={cx} y={cy} width={W} height={H} rx="2" ry="2"
        fill={bodyFill} stroke={border} strokeWidth={bw} />

      {/* Header band */}
      <rect x={cx} y={cy} width={W} height={20} fill={headFill} rx="2" ry="2" />
      <rect x={cx} y={cy + 10} width={W} height={10} fill={headFill} />

      {/* Header divider */}
      <line x1={cx + 4} y1={cy + 20} x2={cx + W - 4} y2={cy + 20}
        stroke={isAway ? "rgba(201,168,76,0.12)" : "rgba(201,168,76,0.22)"} strokeWidth="0.5" />

      {/* OVR — left of header */}
      <text x={cx + 16} y={cy + 14} textAnchor="middle"
        fill={txtMain} fontSize="13" fontFamily={MONO}>
        {overall}
      </text>

      {/* Position — right of header */}
      <text x={cx + W - 8} y={cy + 14} textAnchor="middle"
        fill={txtDim} fontSize="7.5" fontFamily={MONO}>
        {player.position}
      </text>

      {/* Player name */}
      <text x={cx + W / 2} y={cy + 38} textAnchor="middle"
        fill={txtMain} fontSize="8.5" fontFamily={MONO} letterSpacing="0.04em">
        {displayName}
      </text>

      {/* Bottom rule */}
      <line x1={cx + 4} y1={cy + 44} x2={cx + W - 4} y2={cy + 44}
        stroke={isAway ? "rgba(201,168,76,0.1)" : "rgba(201,168,76,0.15)"} strokeWidth="0.5" />

      {/* ATK */}
      <text x={cx + 6} y={cy + 57} textAnchor="start"
        fill={txtDim} fontSize="6" fontFamily={MONO}>
        ATK {atk}
      </text>

      {/* DEF */}
      <text x={cx + W - 4} y={cy + 57} textAnchor="end"
        fill={txtDim} fontSize="6" fontFamily={MONO}>
        DEF {def}
      </text>
    </g>
  )
}
