export default function FifaCard({ x, y, player, isAway = false }) {
  const cardWidth = 42
  const cardHeight = 52
  const cx = x - cardWidth / 2
  const cy = y - cardHeight / 2

  const getCardColor = (rating) => {
    const overall = Math.round((rating - 1.0) / 1.5 * 99) + 20
    if (overall >= 87) return { bg: "#e8b408", border: "#f5d060", text: "#5a3e00" }
    if (overall >= 83) return { bg: "#c0c0c0", border: "#e8e8e8", text: "#2a2a2a" }
    if (overall >= 75) return { bg: "#cd7f32", border: "#e8a850", text: "#2a1a00" }
    return { bg: "#1a3a5c", border: "#2d5f8a", text: "#ffffff" }
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

      {/* Top section */}
      <rect
        x={cx} y={cy}
        width={cardWidth} height={16}
        rx="4" ry="4"
        fill={isAway ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.2)"}
      />
      <rect
        x={cx} y={cy + 12}
        width={cardWidth} height={4}
        fill={isAway ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.2)"}
      />

      {/* Overall rating */}
      <text
        x={cx + 9} y={cy + 12}
        textAnchor="middle"
        fill={colors.border}
        fontSize="11"
        fontWeight="bold"
        fontFamily="Arial"
      >
        {overall}
      </text>

      {/* Position */}
      <text
        x={cx + cardWidth - 9} y={cy + 12}
        textAnchor="middle"
        fill={colors.border}
        fontSize="8"
        fontWeight="bold"
        fontFamily="Arial"
      >
        {player.position}
      </text>

      {/* Player icon circle */}
      <circle
        cx={cx + cardWidth / 2}
        cy={cy + 28}
        r="8"
        fill={isAway ? "rgba(239,68,68,0.3)" : "rgba(59,130,246,0.3)"}
        stroke={colors.border}
        strokeWidth="1"
      />
      <text
        x={cx + cardWidth / 2}
        y={cy + 32}
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
        y={cy + 43}
        textAnchor="middle"
        fill={colors.text}
        fontSize="6.5"
        fontWeight="bold"
        fontFamily="Arial"
      >
        {displayName}
      </text>

      {/* Stats */}
      <text
        x={cx + cardWidth / 2}
        y={cy + 50}
        textAnchor="middle"
        fill={colors.text}
        fontSize="5.5"
        fontFamily="Arial"
      >
        ATK {attackOverall} · DEF {defenseOverall}
      </text>
    </g>
  )
}