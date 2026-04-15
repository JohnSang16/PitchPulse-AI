import { useEffect, useState } from "react"
import client from "../../api/client"

const MONO = "'DM Mono', 'Courier New', monospace"

export default function TeamSelector({ label, onSelect }) {
  const [teams, setTeams] = useState([])
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    client.get("/teams")
      .then(res => setTeams(res.data))
      .catch(err => console.error("Failed to fetch teams", err))
  }, [])

  return (
    <div>
      <label style={{
        display: "block",
        fontFamily: MONO, fontSize: "8px", fontWeight: "400",
        letterSpacing: "0.18em", textTransform: "uppercase",
        color: "#3d3520", marginBottom: "6px",
      }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <select
          onChange={e => onSelect(Number(e.target.value))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            background: "#0d0d0d",
            color: "#8a7a52",
            border: `0.5px solid ${focused ? "#c9a84c33" : "#1e1a12"}`,
            borderRadius: "3px",
            padding: "9px 28px 9px 12px",
            fontSize: "10px",
            fontFamily: MONO,
            letterSpacing: "0.06em",
            cursor: "pointer",
            outline: "none",
            appearance: "none",
            WebkitAppearance: "none",
            transition: "border-color 0.15s",
          }}
        >
          <option value="" style={{ background: "#0d0d0d", color: "#3d3520" }}>Select a team...</option>
          {teams.map(team => (
            <option key={team.id} value={team.id} style={{ background: "#0d0d0d", color: "#8a7a52" }}>
              {team.name}
            </option>
          ))}
        </select>
        {/* Custom arrow */}
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
