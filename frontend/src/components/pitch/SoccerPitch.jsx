import { useState } from "react"
import FifaCard from "./FifaCard"
import { formations } from "./formations"

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

      {/* Formation selectors header */}
      <div style={{
        display: "flex", gap: "12px", padding: "16px 20px",
        borderBottom: "0.5px solid #1e1a12", background: "#080808",
      }}>
        <FormationSelect label="Home Formation" value={homeFormation} onChange={handleHomeFormationChange} />
        <FormationSelect label="Away Formation" value={awayFormation} onChange={handleAwayFormationChange} />
      </div>

      {/* Pitch */}
      <svg viewBox="-15 -12 630 464" style={{ width: "100%", display: "block", maxHeight: "78vh" }}>
        {/* Pitch surface */}
        <rect x="0" y="0" width="600" height="440" fill="#0a1a0a" />

        {/* Pitch markings — all #1a2e1a, stroke 0.5 */}
        <rect x="20" y="20" width="560" height="400" fill="none" stroke="#1a2e1a" strokeWidth="0.5" />
        <line x1="300" y1="20" x2="300" y2="420" stroke="#1a2e1a" strokeWidth="0.5" />
        <circle cx="300" cy="220" r="50" fill="none" stroke="#1a2e1a" strokeWidth="0.5" />
        <circle cx="300" cy="220" r="2" fill="#1a2e1a" />

        {/* Corner arcs */}
        <path d="M20,20 Q27,20 27,27"   fill="none" stroke="#1a2e1a" strokeWidth="0.5" />
        <path d="M580,20 Q573,20 573,27" fill="none" stroke="#1a2e1a" strokeWidth="0.5" />
        <path d="M20,420 Q27,420 27,413" fill="none" stroke="#1a2e1a" strokeWidth="0.5" />
        <path d="M580,420 Q573,420 573,413" fill="none" stroke="#1a2e1a" strokeWidth="0.5" />

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
          slot.player ? (
            <FifaCard key={i} x={slot.x} y={slot.y} player={slot.player} isAway={false} />
          ) : (
            <g key={i}>
              <circle cx={slot.x} cy={slot.y} r="7" fill="#c9a84c" />
              <text x={slot.x} y={slot.y + 2} textAnchor="middle" dominantBaseline="middle"
                fill="#080808" fontSize="6" fontFamily={MONO} style={{ pointerEvents: "none" }}>
                {slot.name}
              </text>
            </g>
          )
        )}

        {/* Away players */}
        {awaySlots.map((slot, i) =>
          slot.player ? (
            <FifaCard key={i} x={slot.x} y={slot.y} player={slot.player} isAway={true} />
          ) : (
            <g key={i}>
              <circle cx={slot.x} cy={slot.y} r="7" fill="#2e2814" stroke="rgba(201,168,76,0.2)" strokeWidth="0.5" />
              <text x={slot.x} y={slot.y + 2} textAnchor="middle" dominantBaseline="middle"
                fill="rgba(201,168,76,0.53)" fontSize="6" fontFamily={MONO} style={{ pointerEvents: "none" }}>
                {slot.name}
              </text>
            </g>
          )
        )}
      </svg>
    </div>
  )
}
