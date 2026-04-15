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

  // Home: bright gold accents. Away: dim gold, ghost style.
  const accent  = isAway ? "rgba(201,168,76,0.35)" : "#c9a84c"
  const txtMain = isAway ? "rgba(201,168,76,0.65)" : "#c9a84c"
  const txtDim  = isAway ? "rgba(201,168,76,0.35)" : "rgba(201,168,76,0.55)"
  const border  = hovered ? "#c9a84c" : (isAway ? "rgba(201,168,76,0.2)" : "rgba(201,168,76,0.4)")
  const bw      = hovered ? "1" : "0.5"

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
        fill="#0d0d0d" stroke={border} strokeWidth={bw} />

      {/* Header band */}
      <rect x={cx} y={cy} width={W} height={20} fill="#111111" rx="2" ry="2" />
      <rect x={cx} y={cy + 10} width={W} height={10} fill="#111111" />

      {/* Left accent strip */}
      <line
        x1={cx + 3} y1={cy + 4}
        x2={cx + 3} y2={cy + H - 4}
        stroke={accent} strokeWidth="3" strokeLinecap="round"
      />

      {/* Header divider */}
      <line x1={cx + 8} y1={cy + 20} x2={cx + W - 4} y2={cy + 20}
        stroke={isAway ? "rgba(201,168,76,0.12)" : "rgba(201,168,76,0.18)"} strokeWidth="0.5" />

      {/* OVR — big, left of header */}
      <text x={cx + 20} y={cy + 14} textAnchor="middle"
        fill={txtMain} fontSize="16" fontFamily={MONO}>
        {overall}
      </text>

      {/* Position — right of header */}
      <text x={cx + W - 8} y={cy + 14} textAnchor="middle"
        fill={txtDim} fontSize="7.5" fontFamily={MONO}>
        {player.position}
      </text>

      {/* Player name */}
      <text x={cx + 10 + (W - 14) / 2} y={cy + 38} textAnchor="middle"
        fill={txtMain} fontSize="8.5" fontFamily={MONO} letterSpacing="0.04em">
        {displayName}
      </text>

      {/* Bottom rule */}
      <line x1={cx + 10} y1={cy + 44} x2={cx + W - 4} y2={cy + 44}
        stroke={isAway ? "rgba(201,168,76,0.1)" : "rgba(201,168,76,0.15)"} strokeWidth="0.5" />

      {/* ATK */}
      <text x={cx + 10} y={cy + 57} textAnchor="start"
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
