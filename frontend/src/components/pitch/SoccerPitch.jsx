import { useState } from "react"
import FifaCard from "./FifaCard"
import { formations } from "./formations"

export default function SoccerPitch({ 
  homeColor = "#3b82f6", 
  awayColor = "#ef4444", 
  onFormationChange,
  homePlayers = [],
  awayPlayers = []
}) {
  const [homeFormation, setHomeFormation] = useState("4-4-2")
  const [awayFormation, setAwayFormation] = useState("4-3-3")

  const handleHomeFormationChange = (e) => {
    setHomeFormation(e.target.value)
    if (onFormationChange) onFormationChange(e.target.value, awayFormation)
  }

  const handleAwayFormationChange = (e) => {
    setAwayFormation(e.target.value)
    if (onFormationChange) onFormationChange(homeFormation, e.target.value)
  }

  const homePositions = formations[homeFormation]
  const awayPositions = formations[awayFormation].map(p => ({
    ...p,
    x: 600 - p.x,
    y: p.y
  }))

  // Match players to positions
  const matchPlayersToPositions = (players, positions) => {
    return positions.map((pos, i) => ({
      ...pos,
      player: players[i] || null
    }))
  }

  const homeSlots = matchPlayersToPositions(homePlayers, homePositions)
  const awaySlots = matchPlayersToPositions(awayPlayers, awayPositions)

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4">
      {/* Formation Selectors */}
      <div className="flex justify-between gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-blue-300 text-xs uppercase tracking-widest font-semibold">
            Home Formation
          </label>
          <select
            value={homeFormation}
            onChange={handleHomeFormationChange}
            className="bg-green-900 text-white border border-green-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {Object.keys(formations).map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <label className="text-red-300 text-xs uppercase tracking-widest font-semibold">
            Away Formation
          </label>
          <select
            value={awayFormation}
            onChange={handleAwayFormationChange}
            className="bg-green-900 text-white border border-green-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {Object.keys(formations).map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pitch */}
      <svg
        viewBox="0 0 600 400"
        className="w-full rounded-xl border-2 border-green-600"
        style={{ background: "#1a5c2a" }}
      >
        {/* Stripes */}
        {[...Array(7)].map((_, i) => (
          <rect key={i} x={20 + i * 80} y="20" width="80" height="360"
            fill={i % 2 === 0 ? "rgba(255,255,255,0.03)" : "transparent"} />
        ))}

        {/* Pitch markings */}
        <rect x="20" y="20" width="560" height="360" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="300" cy="200" r="50" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="300" cy="200" r="3" fill="white" />
        <line x1="300" y1="20" x2="300" y2="380" stroke="white" strokeWidth="2" />
        <rect x="20" y="120" width="100" height="160" fill="none" stroke="white" strokeWidth="2" />
        <rect x="20" y="160" width="40" height="80" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="90" cy="200" r="3" fill="white" />
        <rect x="480" y="120" width="100" height="160" fill="none" stroke="white" strokeWidth="2" />
        <rect x="540" y="160" width="40" height="80" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="510" cy="200" r="3" fill="white" />
        <rect x="8" y="170" width="12" height="60" fill="none" stroke="white" strokeWidth="2" />
        <rect x="580" y="170" width="12" height="60" fill="none" stroke="white" strokeWidth="2" />

        {/* Home players */}
        {homeSlots.map((slot, i) => (
          slot.player ? (
            <FifaCard
              key={i}
              x={slot.x}
              y={slot.y}
              player={slot.player}
              isAway={false}
            />
          ) : (
            <g key={i}>
              <circle cx={slot.x} cy={slot.y} r="14"
                fill={homeColor} stroke="white" strokeWidth="2" />
              <text x={slot.x} y={slot.y + 5} textAnchor="middle"
                fill="white" fontSize="9" fontWeight="bold">
                {slot.name}
              </text>
            </g>
          )
        ))}

        {/* Away players */}
        {awaySlots.map((slot, i) => (
          slot.player ? (
            <FifaCard
              key={i}
              x={slot.x}
              y={slot.y}
              player={slot.player}
              isAway={true}
            />
          ) : (
            <g key={i}>
              <circle cx={slot.x} cy={slot.y} r="14"
                fill={awayColor} stroke="white" strokeWidth="2" />
              <text x={slot.x} y={slot.y + 5} textAnchor="middle"
                fill="white" fontSize="9" fontWeight="bold">
                {slot.name}
              </text>
            </g>
          )
        ))}
      </svg>
    </div>
  )
}