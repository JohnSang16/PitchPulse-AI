import { useEffect, useState } from "react"
import client from "../../api/client"

const glassCard = {
  background: "rgba(255, 255, 255, 0.04)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "12px",
  padding: "16px",
}

export default function TeamSelector({ label, onSelect }) {
  const [teams, setTeams] = useState([])

  useEffect(() => {
    client.get("/teams")
      .then(res => setTeams(res.data))
      .catch(err => console.error("Failed to fetch teams", err))
  }, [])

  return (
    <div style={glassCard}>
      <label style={{
        display: "block",
        fontSize: "10px",
        fontWeight: "600",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "#64748b",
        marginBottom: "10px",
        fontFamily: "'Inter', sans-serif",
      }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <select
          onChange={e => onSelect(Number(e.target.value))}
          style={{
            width: "100%",
            background: "rgba(15, 23, 42, 0.8)",
            color: "#e2e8f0",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            padding: "10px 36px 10px 12px",
            fontSize: "13px",
            fontWeight: "500",
            fontFamily: "'Inter', sans-serif",
            cursor: "pointer",
            outline: "none",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            appearance: "none",
            WebkitAppearance: "none",
          }}
          onFocus={e => {
            e.target.style.borderColor = "rgba(139, 92, 246, 0.5)"
            e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.12)"
          }}
          onBlur={e => {
            e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"
            e.target.style.boxShadow = "none"
          }}
        >
          <option value="" style={{ background: "#1e293b" }}>Select a team...</option>
          {teams.map(team => (
            <option key={team.id} value={team.id} style={{ background: "#1e293b" }}>
              {team.name}
            </option>
          ))}
        </select>
        {/* Custom arrow icon */}
        <svg
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "#64748b",
          }}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  )
}
