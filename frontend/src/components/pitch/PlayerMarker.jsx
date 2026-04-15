const MONO = "'DM Mono', 'Courier New', monospace"

export default function PlayerMarker({ x, y, name, isAway = false }) {
  return (
    <g style={{ cursor: "default" }}>
      <circle
        cx={x} cy={y} r="7"
        fill={isAway ? "#1e1608" : "#c9a84c"}
        stroke={isAway ? "rgba(201,168,76,0.55)" : "none"}
        strokeWidth="1"
      />
      <text
        x={x} y={y + 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={isAway ? "rgba(201,168,76,0.53)" : "#080808"}
        fontSize="6"
        fontFamily={MONO}
        style={{ pointerEvents: "none" }}
      >
        {name.split(" ").pop().substring(0, 6)}
      </text>
    </g>
  )
}
