export default function FifaCard({ x, y, player, isAway = false }) {
  const cardWidth = 44
  const cardHeight = 54
  const cx = x - cardWidth / 2
  const cy = y - cardHeight / 2

  const getCardColor = (rating) => {
    const overall = Math.round((rating - 1.0) / 1.5 * 99) + 20
    if (overall >= 87) return {
      bg: "#c8960c", bg2: "#f5c842",
      border: "rgba(245, 200, 66, 0.8)", text: "#fff8e0",
      glow: "rgba(245, 200, 66, 0.5)"
    }
    if (overall >= 83) return {
      bg: "#8a8a8a", bg2: "#d4d4d4",
      border: "rgba(212, 212, 212, 0.8)", text: "#f0f0f0",
      glow: "rgba(200, 200, 200, 0.4)"
    }
    if (overall >= 75) return {
      bg: "#8b5a2b", bg2: "#d4863a",
      border: "rgba(212, 134, 58, 0.8)", text: "#fff0d8",
      glow: "rgba(212, 134, 58, 0.4)"
    }
    return {
      bg: "#1a3a5c", bg2: "#2d5f8a",
      border: "rgba(100, 160, 220, 0.6)", text: "#dceeff",
      glow: "rgba(59, 130, 246, 0.4)"
    }
  }

  const attackOverall = Math.round((player.attack_rating - 1.0) / 1.5 * 99)
  const defenseOverall = Math.round((player.defense_rating - 1.0) / 1.5 * 99)
  const overall = Math.round((attackOverall + defenseOverall) / 2) + 20
  const colors = getCardColor(player.attack_rating)

  const shortName = player.name.includes(" ")
    ? player.name.split(" ").pop()
    : player.name
  const displayName = shortName.length > 7
    ? shortName.substring(0, 6) + "."
    : shortName

  const filterId = `cardGlow-${x}-${y}`
  const gradTopId = `cardGradTop-${x}-${y}`
  const gradBgId = `cardGradBg-${x}-${y}`

  return (
    <g
      className="cursor-pointer"
      style={{ filter: `drop-shadow(0px 3px 8px rgba(0,0,0,0.75)) drop-shadow(0px 0px 6px ${colors.glow})` }}
    >
      <defs>
        <linearGradient id={gradBgId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.bg2} />
          <stop offset="100%" stopColor={colors.bg} />
        </linearGradient>
        <linearGradient id={gradTopId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(0,0,0,0.45)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
        </linearGradient>
      </defs>

      {/* Card background with gradient */}
      <rect
        x={cx} y={cy}
        width={cardWidth} height={cardHeight}
        rx="5" ry="5"
        fill={`url(#${gradBgId})`}
        stroke={colors.border}
        strokeWidth="1"
      />

      {/* Top header section */}
      <rect
        x={cx} y={cy}
        width={cardWidth} height={17}
        rx="5" ry="5"
        fill={`url(#${gradTopId})`}
      />
      {/* Fix rounded corners on bottom of header */}
      <rect x={cx} y={cy + 12} width={cardWidth} height={5} fill="rgba(0,0,0,0.3)" />

      {/* Card shine highlight */}
      <rect
        x={cx + 2} y={cy + 2}
        width={cardWidth - 4} height={cardHeight / 2}
        rx="4" ry="4"
        fill="rgba(255,255,255,0.07)"
      />

      {/* Overall rating */}
      <text
        x={cx + 10} y={cy + 12}
        textAnchor="middle"
        fill={colors.border}
        fontSize="11"
        fontWeight="800"
        fontFamily="'Inter', Arial, sans-serif"
      >
        {overall}
      </text>

      {/* Position */}
      <text
        x={cx + cardWidth - 10} y={cy + 12}
        textAnchor="middle"
        fill={colors.border}
        fontSize="7.5"
        fontWeight="700"
        fontFamily="'Inter', Arial, sans-serif"
      >
        {player.position}
      </text>

      {/* Player icon circle */}
      <circle
        cx={cx + cardWidth / 2}
        cy={cy + 29}
        r="9"
        fill={isAway ? "rgba(239,68,68,0.25)" : "rgba(59,130,246,0.25)"}
        stroke={colors.border}
        strokeWidth="1"
      />
      <text
        x={cx + cardWidth / 2}
        y={cy + 33}
        textAnchor="middle"
        fill={colors.border}
        fontSize="8"
      >
        {player.position === "GK" ? "🧤" :
         player.position === "CB" ? "🛡️" :
         player.position === "CM" ? "⚙️" : "⚽"}
      </text>

      {/* Player name */}
      <text
        x={cx + cardWidth / 2}
        y={cy + 44}
        textAnchor="middle"
        fill={colors.text}
        fontSize="6.5"
        fontWeight="700"
        fontFamily="'Inter', Arial, sans-serif"
      >
        {displayName}
      </text>

      {/* Stats bar */}
      <text
        x={cx + cardWidth / 2}
        y={cy + 51}
        textAnchor="middle"
        fill={`${colors.text}bb`}
        fontSize="5.5"
        fontFamily="'Inter', Arial, sans-serif"
      >
        ATK {attackOverall} · DEF {defenseOverall}
      </text>
    </g>
  )
}
