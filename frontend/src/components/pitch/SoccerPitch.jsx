import { useState } from "react"
import FifaCard from "./FifaCard"
import { formations } from "./formations"

const UI   = "'Inter', -apple-system, sans-serif"
const MONO = "'JetBrains Mono', 'Courier New', monospace"

const LIME = "#a3e635"
const CYAN = "#38bdf8"
const LINE = "#23402c"

function PositionNode({ x, y, name, isAway }) {
  const [hovered, setHovered] = useState(false)
  const scale = hovered ? 1.18 : 1
  const color = isAway ? CYAN : LIME
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
        <circle cx={x} cy={y} r="8" fill="#0b101c"
          stroke={hovered ? CYAN : "rgba(56,189,248,0.6)"}
          strokeWidth={hovered ? "1.5" : "1"} />
      ) : (
        <circle cx={x} cy={y} r="8"
          fill={hovered ? "#bef264" : LIME} />
      )}
      <text x={x} y={y + 2} textAnchor="middle" dominantBaseline="middle"
        fill={isAway ? "rgba(56,189,248,0.9)" : "#0a0f04"}
        fontSize="6" fontWeight="600" fontFamily={MONO} style={{ pointerEvents: "none" }}>
        {name}
      </text>
    </g>
  )
}

const SELECT_STYLE = {
  width: "100%",
  background: "#0b101c",
  color: "#edf2fa",
  border: "1px solid #1b2436",
  borderRadius: "10px",
  padding: "10px 30px 10px 13px",
  fontSize: "13px",
  fontWeight: "500",
  fontFamily: MONO,
  cursor: "pointer",
  outline: "none",
  appearance: "none",
  WebkitAppearance: "none",
}

function FormationSelect({ label, accent, value, onChange }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ flex: 1 }}>
      <label style={{
        display: "flex", alignItems: "center", gap: "7px",
        fontFamily: MONO, fontSize: "10px", fontWeight: "500",
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: "#566179", marginBottom: "8px",
      }}>
        <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: accent, flexShrink: 0 }} />
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
            borderColor: focused ? accent + "66" : "#1b2436",
            transition: "border-color 0.15s",
          }}
        >
          {Object.keys(formations).map(f => (
            <option key={f} value={f} style={{ background: "#0b101c" }}>{f}</option>
          ))}
        </select>
        <span style={{
          position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
          pointerEvents: "none", color: "#566179", fontSize: "10px", lineHeight: 1,
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
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0", fontFamily: UI }}>

      {/* Formation selectors header — sticky so it stays visible on scroll */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        display: "flex", gap: "14px", padding: "16px 20px",
        borderBottom: "1px solid #1b2436",
        background: "rgba(5,7,13,0.9)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
      }}>
        <FormationSelect label="Home Formation" accent={LIME} value={homeFormation} onChange={handleHomeFormationChange} />
        <FormationSelect label="Away Formation" accent={CYAN} value={awayFormation} onChange={handleAwayFormationChange} />
      </div>

      {/* Pitch */}
      <svg viewBox="-15 -12 630 464" style={{ width: "100%", maxHeight: "calc(100vh - 310px)", display: "block", margin: "0 auto" }}>
        {/* Pitch surface with mow stripes */}
        <rect x="0" y="0" width="600" height="440" fill="#08130c" />
        {[1, 3, 5, 7].map(i => (
          <rect key={i} x={i * 75} y="0" width="75" height="440" fill="#0a170e" />
        ))}

        {/* Pitch markings */}
        <rect x="20" y="20" width="560" height="400" fill="none" stroke={LINE} strokeWidth="1" />
        <line x1="300" y1="20" x2="300" y2="420" stroke={LINE} strokeWidth="1" />
        <circle cx="300" cy="220" r="50" fill="none" stroke={LINE} strokeWidth="1" />
        <circle cx="300" cy="220" r="2" fill={LINE} />

        {/* Corner kick boxes */}
        <rect x="20"  y="20"  width="16" height="16" fill="none" stroke={LINE} strokeWidth="1" />
        <rect x="564" y="20"  width="16" height="16" fill="none" stroke={LINE} strokeWidth="1" />
        <rect x="20"  y="404" width="16" height="16" fill="none" stroke={LINE} strokeWidth="1" />
        <rect x="564" y="404" width="16" height="16" fill="none" stroke={LINE} strokeWidth="1" />

        {/* Left penalty area */}
        <rect x="20" y="140" width="100" height="160" fill="none" stroke={LINE} strokeWidth="1" />
        <rect x="20" y="180" width="40"  height="80"  fill="none" stroke={LINE} strokeWidth="1" />
        <circle cx="90" cy="220" r="2" fill={LINE} />
        <path d="M120,188 Q140,220 120,252" fill="none" stroke={LINE} strokeWidth="1" />

        {/* Right penalty area */}
        <rect x="480" y="140" width="100" height="160" fill="none" stroke={LINE} strokeWidth="1" />
        <rect x="540" y="180" width="40"  height="80"  fill="none" stroke={LINE} strokeWidth="1" />
        <circle cx="510" cy="220" r="2" fill={LINE} />
        <path d="M480,188 Q460,220 480,252" fill="none" stroke={LINE} strokeWidth="1" />

        {/* Goals */}
        <rect x="8"   y="190" width="12" height="60" fill="none" stroke={LINE} strokeWidth="1" />
        <rect x="580" y="190" width="12" height="60" fill="none" stroke={LINE} strokeWidth="1" />

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
