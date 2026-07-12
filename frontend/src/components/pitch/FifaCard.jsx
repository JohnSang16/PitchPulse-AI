import { useState } from "react"

const MONO = "'JetBrains Mono', 'Courier New', monospace"

export default function FifaCard({ x, y, player, isAway = false }) {
  const [hovered, setHovered] = useState(false)

  const W = 54
  const H = 76
  const cx = x - W / 2
  const cy = y - H / 2

  const atk     = Math.round((player.attack_rating  - 1.0) / 1.5 * 99)
  const def     = Math.round((player.defense_rating - 1.0) / 1.5 * 99)
  const overall = Math.round((atk + def) / 2) + 20

  const shortName   = player.name.includes(" ") ? player.name.split(" ").pop() : player.name
  const displayName = (shortName.length > 8 ? shortName.substring(0, 7) + "." : shortName).toUpperCase()

  // Home: lime accents. Away: cyan accents. Both on dark navy card bodies.
  const accent   = isAway ? "#c8503f" : "#d4af37"
  const bodyFill = "#101013"
  const headFill = "#1a1a1f"
  const txtMain  = hovered ? accent : (isAway ? "rgba(200,80,63,0.9)" : "rgba(212,175,55,0.9)")
  const txtName  = "#edf2fa"
  const txtDim   = isAway ? "rgba(200,80,63,0.45)" : "rgba(212,175,55,0.45)"
  const border   = hovered ? accent : (isAway ? "rgba(200,80,63,0.35)" : "rgba(212,175,55,0.35)")
  const bw       = hovered ? "1.25" : "0.75"

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
      <rect x={cx} y={cy} width={W} height={H} rx="4" ry="4"
        fill={bodyFill} stroke={border} strokeWidth={bw} />

      {/* Header band */}
      <rect x={cx} y={cy} width={W} height={20} fill={headFill} rx="4" ry="4" />
      <rect x={cx} y={cy + 10} width={W} height={10} fill={headFill} />

      {/* Header divider */}
      <line x1={cx + 4} y1={cy + 20} x2={cx + W - 4} y2={cy + 20}
        stroke={isAway ? "rgba(200,80,63,0.2)" : "rgba(212,175,55,0.2)"} strokeWidth="0.5" />

      {/* OVR — left of header */}
      <text x={cx + 16} y={cy + 14} textAnchor="middle"
        fill={txtMain} fontSize="13" fontWeight="600" fontFamily={MONO}>
        {overall}
      </text>

      {/* Position — right of header */}
      <text x={cx + W - 8} y={cy + 14} textAnchor="middle"
        fill={txtDim} fontSize="7.5" fontWeight="500" fontFamily={MONO}>
        {player.position}
      </text>

      {/* Player name */}
      <text x={cx + W / 2} y={cy + 42} textAnchor="middle"
        fill={txtName} fontSize="8.5" fontWeight="600" fontFamily={MONO} letterSpacing="0.04em">
        {displayName}
      </text>

      {/* Bottom rule */}
      <line x1={cx + 4} y1={cy + 50} x2={cx + W - 4} y2={cy + 50}
        stroke={isAway ? "rgba(200,80,63,0.15)" : "rgba(212,175,55,0.15)"} strokeWidth="0.5" />

      {/* ATK label */}
      <text x={cx + 5} y={cy + 64} textAnchor="start"
        fill={txtDim} fontSize="5" fontFamily={MONO}>ATK</text>
      {/* ATK value */}
      <text x={cx + 17} y={cy + 64} textAnchor="start"
        fill={txtMain} fontSize="5.5" fontWeight="600" fontFamily={MONO}>{atk}</text>

      {/* DEF label */}
      <text x={cx + W / 2 + 2} y={cy + 64} textAnchor="start"
        fill={txtDim} fontSize="5" fontFamily={MONO}>DEF</text>
      {/* DEF value */}
      <text x={cx + W - 4} y={cy + 64} textAnchor="end"
        fill={txtMain} fontSize="5.5" fontWeight="600" fontFamily={MONO}>{def}</text>
    </g>
  )
}
