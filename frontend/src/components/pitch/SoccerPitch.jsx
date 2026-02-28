import { useState } from "react"
import PlayerMarker from "./PlayerMarker"
import { formations } from "./formations"

export default function SoccerPitch({ homeColor = "#3b82f6", awayColor = "#ef4444" }) {
  const [homeFormation, setHomeFormation] = useState("4-4-2")
  const [awayFormation, setAwayFormation] = useState("4-3-3")

  const homePlayers = formations[homeFormation]
  const awayPlayers = formations[awayFormation].map(p => ({
    ...p,
    x: 600 - p.x,
    y: p.y
  }))

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">
      {/* Formation Selectors */}
      <div className="flex justify-between gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-blue-300 text-xs uppercase tracking-widest font-semibold">
            Home Formation
          </label>
          <select
            value={homeFormation}
            onChange={e => setHomeFormation(e.target.value)}
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
            onChange={e => setAwayFormation(e.target.value)}
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
        {/* Pitch stripes */}
        {[...Array(7)].map((_, i) => (
          <rect
            key={i}
            x={20 + i * 80}
            y="20"
            width="80"
            height="360"
            fill={i % 2 === 0 ? "rgba(255,255,255,0.03)" : "transparent"}
          />
        ))}

        {/* Pitch outline */}
        <rect x="20" y="20" width="560" height="360" fill="none" stroke="white" strokeWidth="2" />

        {/* Center circle */}
        <circle cx="300" cy="200" r="50" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="300" cy="200" r="3" fill="white" />

        {/* Halfway line */}
        <line x1="300" y1="20" x2="300" y2="380" stroke="white" strokeWidth="2" />

        {/* Left penalty box */}
        <rect x="20" y="120" width="100" height="160" fill="none" stroke="white" strokeWidth="2" />
        <rect x="20" y="160" width="40" height="80" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="90" cy="200" r="3" fill="white" />

        {/* Right penalty box */}
        <rect x="480" y="120" width="100" height="160" fill="none" stroke="white" strokeWidth="2" />
        <rect x="540" y="160" width="40" height="80" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="510" cy="200" r="3" fill="white" />

        {/* Goals */}
        <rect x="8" y="170" width="12" height="60" fill="none" stroke="white" strokeWidth="2" />
        <rect x="580" y="170" width="12" height="60" fill="none" stroke="white" strokeWidth="2" />

        {/* Home players */}
        {homePlayers.map(player => (
          <PlayerMarker
            key={player.id}
            x={player.x}
            y={player.y}
            name={player.name}
            color={homeColor}
          />
        ))}

        {/* Away players */}
        {awayPlayers.map(player => (
          <PlayerMarker
            key={player.id}
            x={player.x}
            y={player.y}
            name={player.name}
            color={awayColor}
          />
        ))}
      </svg>
    </div>
  )
}