import { useState } from "react"
import FifaCard from "./FifaCard"
import { formations } from "./formations"

function PositionNode({ x, y, name, isAway }) {
  const [hovered, setHovered] = useState(false)
  const scale = hovered ? 1.18 : 1
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
      {isAway ? (
        <circle cx={x} cy={y} r="7" fill="#1e1608"
          stroke={hovered ? "rgba(201,168,76,0.9)" : "rgba(201,168,76,0.55)"}
          strokeWidth={hovered ? "1.5" : "1"} />
      ) : (
        <circle cx={x} cy={y} r="7"
          fill={hovered ? "#d4b660" : "#c9a84c"} />
      )}
      <text x={x} y={y + 2} textAnchor="middle" dominantBaseline="middle"
        fill={isAway ? "rgba(201,168,76,0.85)" : "#080808"}
        fontSize="6" fontFamily={MONO} style={{ pointerEvents: "none" }}>
        {name}
      </text>
    </g>
  )
}

const MONO = "'DM Mono', 'Courier New', monospace"

const SELECT_STYLE = {
  width: "100%",
  background: "#0d0d0d",
  color: "#8a7a52",
  border: "0.5px solid #1e1a12",
  borderRadius: "3px",
  padding: "10px 28px 10px 12px",
  fontSize: "13px",
  fontFamily: MONO,
  letterSpacing: "0.06em",
  cursor: "pointer",
  outline: "none",
  appearance: "none",
  WebkitAppearance: "none",
}

function FormationSelect({ label, value, onChange }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ flex: 1 }}>
      <label style={{
        display: "block", fontFamily: MONO, fontSize: "11px",
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: "#8a7a52", marginBottom: "8px",
      }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...SELECT_STYLE,
            borderColor: focused ? "#c9a84c33" : "#1e1a12",
            transition: "border-color 0.15s",
          }}
        >
          {Object.keys(formations).map(f => (
            <option key={f} value={f} style={{ background: "#0d0d0d" }}>{f}</option>
          ))}
        </select>
        <span style={{
          position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
          pointerEvents: "none", color: "#3d3520", fontSize: "10px", lineHeight: 1,
        }}>
          ▾
        </span>
      </div>
    </div>
  )
}

export default function SoccerPitch({ onFormationChange, homePlayers = [], awayPlayers = [] }) {
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
  const awayPositions = formations[awayFormation].map(p => ({ ...p, x: 600 - p.x, y: p.y }))

  const matchPlayersToPositions = (players, positions) =>
    positions.map((pos, i) => ({ ...pos, player: players[i] || null }))

  const homeSlots = matchPlayersToPositions(homePlayers, homePositions)
  const awaySlots = matchPlayersToPositions(awayPlayers, awayPositions)

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0", fontFamily: MONO }}>

      {/* Formation selectors header — sticky so it stays visible on scroll */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        display: "flex", gap: "12px", padding: "16px 20px",
        borderBottom: "0.5px solid #1e1a12", background: "#080808",
      }}>
        <FormationSelect label="Home Formation" value={homeFormation} onChange={handleHomeFormationChange} />
        <FormationSelect label="Away Formation" value={awayFormation} onChange={handleAwayFormationChange} />
      </div>

      {/* Pitch */}
      <svg viewBox="-15 -12 630 464" style={{ width: "100%", display: "block" }}>
        {/* Pitch surface */}
        <rect x="0" y="0" width="600" height="440" fill="#0a1a0a" />

        {/* Pitch markings — all #1a2e1a, stroke 0.5 */}
        <rect x="20" y="20" width="560" height="400" fill="none" stroke="#1a2e1a" strokeWidth="0.5" />
        <line x1="300" y1="20" x2="300" y2="420" stroke="#1a2e1a" strokeWidth="0.5" />
        <circle cx="300" cy="220" r="50" fill="none" stroke="#1a2e1a" strokeWidth="0.5" />
        <circle cx="300" cy="220" r="2" fill="#1a2e1a" />


        {/* Corner kick boxes */}
        <rect x="20"  y="20"  width="22" height="22" fill="none" stroke="#1a2e1a" strokeWidth="0.5" />
        <rect x="558" y="20"  width="22" height="22" fill="none" stroke="#1a2e1a" strokeWidth="0.5" />
        <rect x="20"  y="398" width="22" height="22" fill="none" stroke="#1a2e1a" strokeWidth="0.5" />
        <rect x="558" y="398" width="22" height="22" fill="none" stroke="#1a2e1a" strokeWidth="0.5" />

        {/* Left penalty area */}
        <rect x="20" y="140" width="100" height="160" fill="none" stroke="#1a2e1a" strokeWidth="0.5" />
        <rect x="20" y="180" width="40"  height="80"  fill="none" stroke="#1a2e1a" strokeWidth="0.5" />
        <circle cx="90" cy="220" r="2" fill="#1a2e1a" />
        <path d="M120,188 Q140,220 120,252" fill="none" stroke="#1a2e1a" strokeWidth="0.5" />

        {/* Right penalty area */}
        <rect x="480" y="140" width="100" height="160" fill="none" stroke="#1a2e1a" strokeWidth="0.5" />
        <rect x="540" y="180" width="40"  height="80"  fill="none" stroke="#1a2e1a" strokeWidth="0.5" />
        <circle cx="510" cy="220" r="2" fill="#1a2e1a" />
        <path d="M480,188 Q460,220 480,252" fill="none" stroke="#1a2e1a" strokeWidth="0.5" />

        {/* Goals */}
        <rect x="8"   y="190" width="12" height="60" fill="none" stroke="#1a2e1a" strokeWidth="0.5" />
        <rect x="580" y="190" width="12" height="60" fill="none" stroke="#1a2e1a" strokeWidth="0.5" />

        {/* Home players */}
        {homeSlots.map((slot, i) =>
          slot.player
            ? <FifaCard key={i} x={slot.x} y={slot.y} player={slot.player} isAway={false} />
            : <PositionNode key={i} x={slot.x} y={slot.y} name={slot.name} isAway={false} />
        )}

        {/* Away players */}
        {awaySlots.map((slot, i) =>
          slot.player
            ? <FifaCard key={i} x={slot.x} y={slot.y} player={slot.player} isAway={true} />
            : <PositionNode key={i} x={slot.x} y={slot.y} name={slot.name} isAway={true} />
        )}
      </svg>
    </div>
  )
}
