export default function PlayerMarker({ x, y, name, color = "blue" }) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r="14"
        fill={color}
        stroke="white"
        strokeWidth="2"
        className="cursor-pointer hover:opacity-80 transition-opacity"
      />
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        fill="white"
        fontSize="9"
        fontWeight="bold"
      >
        {name.split(" ").pop().substring(0, 6)}
      </text>
    </g>
  )
}