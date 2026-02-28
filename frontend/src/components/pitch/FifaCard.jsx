export default function FifaCard({ x, y, player, isAway = false }) {
  const cardWidth = 52
  const cardHeight = 64
  const cx = x - cardWidth / 2
  const cy = y - cardHeight / 2

  // Color scheme based on overall rating
  const getCardColor = (rating) => {
    const overall = Math.round((rating - 1.0) / 1.5 * 99)
    if (overall >= 87) return { bg: "#e8b408", border: "#f5d060", text: "#5a3e00" }
    if (overall >= 83) return { bg: "#c0c0c0", border: "#e8e8e8", text: "#2a2a2a" }
    if (overall >= 75) return { bg: "#cd7f32", border: "#e8a850", text: "#2a1a00" }
    return { bg: "#1a3a5c", border: "#2d5f8a", text: "#ffffff" }
  }

  const attackOverall = Math.round((player.attack_rating - 1.0) / 1.5 * 99)
  const defenseOverall = Math.round((player.defense_rating - 1.0) / 1.5 * 99)
  const overall = Math.round((attackOverall + defenseOverall) / 2)
  const colors = getCardColor(player.attack_rating)

  // Shorten name to fit card
  const shortName = player.name.includes(" ")
    ? player.name.split(" ").pop()
    : player.name
  const displayName = shortName.length > 8
    ? shortName.substring(0, 7) + "."
    : shortName

  return (
    <g className="cursor-pointer" style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.5))" }}>
      {/* Card background */}
      <rect
        x={cx} y={cy}
        width={cardWidth} height={cardHeight}
        rx="4" ry="4"
        fill={colors.bg}
        stroke={colors.border}
        strokeWidth="1.5"
      />

      {/* Top section - Overall + Position */}
      <rect
        x={cx} y={cy}
        width={cardWidth} height={20}
        rx="4" ry="4"
        fill={isAway ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.2)"}
      />
      <rect
        x={cx} y={cy + 16}
        width={cardWidth} height={4}
        fill={isAway ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.2)"}
      />

      {/* Overall rating */}
      <text
        x={cx + 10} y={cy + 14}
        textAnchor="middle"
        fill={colors.border}
        fontSize="13"
        fontWeight="bold"
        fontFamily="Arial"
      >
        {overall}
      </text>

      {/* Position */}
      <text
        x={cx + cardWidth - 10} y={cy + 14}
        textAnchor="middle"
        fill={colors.border}
        fontSize="9"
        fontWeight="bold"
        fontFamily="Arial"
      >
        {player.position}
      </text>

      {/* Player silhouette circle */}
      <circle
        cx={cx + cardWidth / 2}
        cy={cy + 34}
        r="10"
        fill={isAway ? "rgba(239,68,68,0.3)" : "rgba(59,130,246,0.3)"}
        stroke={colors.border}
        strokeWidth="1"
      />
      <text
        x={cx + cardWidth / 2}
        y={cy + 38}
        textAnchor="middle"
        fill={colors.border}
        fontSize="10"
      >
        {player.position === "GK" ? "🧤" :
         player.position === "CB" ? "🛡️" :
         player.position === "CM" ? "⚙️" : "⚽"}
      </text>

      {/* Player name */}
      <text
        x={cx + cardWidth / 2}
        y={cy + 52}
        textAnchor="middle"
        fill={colors.text}
        fontSize="7.5"
        fontWeight="bold"
        fontFamily="Arial"
      >
        {displayName}
      </text>

      {/* Stats bar */}
      <text
        x={cx + cardWidth / 2}
        y={cy + 61}
        textAnchor="middle"
        fill={colors.text}
        fontSize="6"
        fontFamily="Arial"
      >
        ATK {attackOverall} · DEF {defenseOverall}
      </text>
    </g>
  )
}