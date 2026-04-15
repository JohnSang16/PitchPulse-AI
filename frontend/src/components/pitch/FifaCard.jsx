import { useState } from "react"

const MONO = "'DM Mono', 'Courier New', monospace"

export default function FifaCard({ x, y, player, isAway = false }) {
  const [hovered, setHovered] = useState(false)

  const cardWidth  = 44
  const cardHeight = 54
  const cx = x - cardWidth  / 2
  const cy = y - cardHeight / 2

  const attackOverall  = Math.round((player.attack_rating  - 1.0) / 1.5 * 99)
  const defenseOverall = Math.round((player.defense_rating - 1.0) / 1.5 * 99)
  const overall        = Math.round((attackOverall + defenseOverall) / 2) + 20

  const shortName   = player.name.includes(" ") ? player.name.split(" ").pop() : player.name
  const displayName = shortName.length > 7 ? shortName.substring(0, 6) + "." : shortName

  const bg     = isAway ? "#1e1608" : "#c9a84c"
  const border = isAway ? "rgba(201,168,76,0.55)" : "rgba(201,168,76,0.8)"
  const text   = isAway ? "rgba(201,168,76,0.85)" : "#080808"

  const scale = hovered ? 1.3 : 1

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
      <rect x={cx} y={cy} width={cardWidth} height={cardHeight} rx="2" ry="2"
        fill={bg} stroke={hovered ? "#c9a84c" : border} strokeWidth={hovered ? "1" : "0.5"} />

      {/* Header divider */}
      <line x1={cx} y1={cy + 16} x2={cx + cardWidth} y2={cy + 16}
        stroke={border} strokeWidth="0.5" />

      {/* Overall rating */}
      <text x={cx + 10} y={cy + 12} textAnchor="middle"
        fill={text} fontSize="11" fontFamily={MONO}>
        {overall}
      </text>

      {/* Position */}
      <text x={cx + cardWidth - 10} y={cy + 12} textAnchor="middle"
        fill={text} fontSize="7" fontFamily={MONO}>
        {player.position}
      </text>

      {/* Player name */}
      <text x={cx + cardWidth / 2} y={cy + 40} textAnchor="middle"
        fill={text} fontSize="6.5" fontFamily={MONO}>
        {displayName}
      </text>

      {/* ATK · DEF */}
      <text x={cx + cardWidth / 2} y={cy + 50} textAnchor="middle"
        fill={isAway ? "rgba(201,168,76,0.3)" : "rgba(8,8,8,0.6)"} fontSize="5.5" fontFamily={MONO}>
        {attackOverall} · {defenseOverall}
      </text>
    </g>
  )
}
