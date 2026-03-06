export default function PlayerMarker({ x, y, name, color = "#3b82f6", isAway = false }) {
  const gradId = `playerGrad-${x}-${y}`
  return (
    <g style={{ cursor: "pointer" }}>
      <defs>
        <radialGradient id={gradId} cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
      </defs>
      {/* Glow ring */}
      <circle cx={x} cy={y} r="18" fill={color} opacity="0.18" />
      {/* Badge body */}
      <circle
        cx={x}
        cy={y}
        r="14"
        fill={`url(#${gradId})`}
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.5"
        style={{ filter: "drop-shadow(0px 3px 6px rgba(0,0,0,0.6))" }}
      />
      {/* Shine highlight */}
      <circle cx={x - 4} cy={y - 4} r="4" fill="rgba(255,255,255,0.18)" />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fill="white"
        fontSize="8"
        fontWeight="700"
        fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
        style={{ pointerEvents: "none" }}
      >
        {name.split(" ").pop().substring(0, 6)}
      </text>
    </g>
  )
}
