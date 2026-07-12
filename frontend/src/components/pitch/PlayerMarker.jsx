const MONO = "'JetBrains Mono', 'Courier New', monospace"

export default function PlayerMarker({ x, y, name, isAway = false }) {
  return (
    <g style={{ cursor: "default" }}>
      <circle
        cx={x} cy={y} r="8"
        fill={isAway ? "#0b101c" : "#d4b56a"}
        stroke={isAway ? "rgba(205,130,114,0.6)" : "none"}
        strokeWidth="1"
      />
      <text
        x={x} y={y + 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={isAway ? "rgba(205,130,114,0.9)" : "#171207"}
        fontSize="6"
        fontWeight="600"
        fontFamily={MONO}
        style={{ pointerEvents: "none" }}
      >
        {name.split(" ").pop().substring(0, 6)}
      </text>
    </g>
  )
}
