import { useState } from "react"
import FifaCard from "./FifaCard"
import { formations } from "./formations"

const selectStyle = {
  width: "100%",
  background: "rgba(15, 23, 42, 0.8)",
  color: "#e2e8f0",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "8px",
  padding: "9px 32px 9px 12px",
  fontSize: "12px",
  fontWeight: "500",
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  cursor: "pointer",
  outline: "none",
  appearance: "none",
  WebkitAppearance: "none",
}

function FormationSelect({ label, value, onChange, accentColor }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{
      flex: 1,
      background: "rgba(255, 255, 255, 0.03)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: "1px solid rgba(255, 255, 255, 0.07)",
      borderRadius: "12px",
      padding: "12px 14px",
    }}>
      <label style={{
        display: "block",
        fontSize: "10px",
        fontWeight: "600",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: accentColor,
        marginBottom: "8px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={onChange}
          style={{
            ...selectStyle,
            borderColor: focused ? `${accentColor}66` : "rgba(255, 255, 255, 0.1)",
            boxShadow: focused ? `0 0 0 3px ${accentColor}18` : "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          {Object.keys(formations).map(f => (
            <option key={f} value={f} style={{ background: "#1e293b" }}>{f}</option>
          ))}
        </select>
        <svg
          style={{ position: "absolute", right: "9px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8" }}
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  )
}

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

  const matchPlayersToPositions = (players, positions) => {
    return positions.map((pos, i) => ({
      ...pos,
      player: players[i] || null
    }))
  }

  const homeSlots = matchPlayersToPositions(homePlayers, homePositions)
  const awaySlots = matchPlayersToPositions(awayPlayers, awayPositions)

  return (
    <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Formation Selectors */}
      <div style={{ display: "flex", gap: "12px" }}>
        <FormationSelect label="Home Formation" value={homeFormation} onChange={handleHomeFormationChange} accentColor="#3b82f6" />
        <FormationSelect label="Away Formation" value={awayFormation} onChange={handleAwayFormationChange} accentColor="#ef4444" />
      </div>

      {/* Pitch Container */}
      <div style={{
        borderRadius: "20px",
        overflow: "hidden",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset",
      }}>
        <svg viewBox="0 0 600 440" style={{ width: "100%", display: "block" }}>
          <defs>
            {/* Realistic pitch grass gradient */}
            <linearGradient id="pitchGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a3d1a" />
              <stop offset="100%" stopColor="#0c4a1f" />
            </linearGradient>
            {/* Stripe pattern */}
            <pattern id="stripes" x="0" y="0" width="80" height="440" patternUnits="userSpaceOnUse">
              <rect width="80" height="440" fill="rgba(0,0,0,0)" />
              <rect width="40" height="440" fill="rgba(255,255,255,0.025)" />
            </pattern>
            {/* Subtle noise texture */}
            <filter id="noise" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noiseOut" />
              <feColorMatrix type="saturate" values="0" in="noiseOut" result="grayNoise" />
              <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blended" />
              <feComponentTransfer in="blended">
                <feFuncA type="linear" slope="1" />
              </feComponentTransfer>
            </filter>
            {/* Home team gradient */}
            <radialGradient id="homeGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={homeColor} stopOpacity="1" />
              <stop offset="100%" stopColor={homeColor} stopOpacity="0.7" />
            </radialGradient>
            {/* Away team gradient */}
            <radialGradient id="awayGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={awayColor} stopOpacity="1" />
              <stop offset="100%" stopColor={awayColor} stopOpacity="0.7" />
            </radialGradient>
            {/* Glow filter for player badges */}
            <filter id="badgeShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.7)" floodOpacity="1" />
            </filter>
            <filter id="glowBlue" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={homeColor} floodOpacity="0.5" />
            </filter>
            <filter id="glowRed" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={awayColor} floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Pitch base */}
          <rect x="0" y="0" width="600" height="440" fill="url(#pitchGrad)" />
          {/* Grass stripes */}
          <rect x="0" y="0" width="600" height="440" fill="url(#stripes)" />

          {/* Pitch boundary */}
          <rect x="20" y="20" width="560" height="400" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />

          {/* Halfway line */}
          <line x1="300" y1="20" x2="300" y2="420" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />

          {/* Center circle */}
          <circle cx="300" cy="220" r="50" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
          <circle cx="300" cy="220" r="3" fill="rgba(255,255,255,0.7)" />

          {/* Corner arcs */}
          <path d="M20,20 Q27,20 27,27" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          <path d="M580,20 Q573,20 573,27" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          <path d="M20,420 Q27,420 27,413" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          <path d="M580,420 Q573,420 573,413" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

          {/* Left penalty area */}
          <rect x="20" y="140" width="100" height="160" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
          <rect x="20" y="180" width="40" height="80" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
          <circle cx="90" cy="220" r="3" fill="rgba(255,255,255,0.7)" />
          {/* Penalty arc left */}
          <path d="M120,188 Q140,220 120,252" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

          {/* Right penalty area */}
          <rect x="480" y="140" width="100" height="160" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
          <rect x="540" y="180" width="40" height="80" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
          <circle cx="510" cy="220" r="3" fill="rgba(255,255,255,0.7)" />
          {/* Penalty arc right */}
          <path d="M480,188 Q460,220 480,252" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

          {/* Goals */}
          <rect x="8" y="190" width="12" height="60" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
          <rect x="580" y="190" width="12" height="60" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />

          {/* Home players */}
          {homeSlots.map((slot, i) => (
            slot.player ? (
              <FifaCard key={i} x={slot.x} y={slot.y} player={slot.player} isAway={false} />
            ) : (
              <g key={i} filter="url(#badgeShadow)">
                {/* Badge outer ring */}
                <circle cx={slot.x} cy={slot.y} r="17" fill={homeColor} opacity="0.2" />
                {/* Badge body */}
                <circle cx={slot.x} cy={slot.y} r="14" fill="url(#homeGrad)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
                {/* Badge shine */}
                <circle cx={slot.x - 4} cy={slot.y - 4} r="4" fill="rgba(255,255,255,0.15)" />
                <text x={slot.x} y={slot.y + 4} textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="'Plus Jakarta Sans', sans-serif">
                  {slot.name}
                </text>
              </g>
            )
          ))}

          {/* Away players */}
          {awaySlots.map((slot, i) => (
            slot.player ? (
              <FifaCard key={i} x={slot.x} y={slot.y} player={slot.player} isAway={true} />
            ) : (
              <g key={i} filter="url(#badgeShadow)">
                {/* Badge outer ring */}
                <circle cx={slot.x} cy={slot.y} r="17" fill={awayColor} opacity="0.2" />
                {/* Badge body */}
                <circle cx={slot.x} cy={slot.y} r="14" fill="url(#awayGrad)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
                {/* Badge shine */}
                <circle cx={slot.x - 4} cy={slot.y - 4} r="4" fill="rgba(255,255,255,0.15)" />
                <text x={slot.x} y={slot.y + 4} textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="'Plus Jakarta Sans', sans-serif">
                  {slot.name}
                </text>
              </g>
            )
          ))}
        </svg>
      </div>
    </div>
  )
}
