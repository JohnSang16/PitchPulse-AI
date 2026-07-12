import { useEffect, useState } from "react"
import client from "../../api/client"

const UI   = "'Inter', -apple-system, sans-serif"
const MONO = "'JetBrains Mono', 'Courier New', monospace"

export default function TeamSelector({ label, accent = "#d4b56a", onSelect }) {
  const [teams, setTeams] = useState([])
  const [focused, setFocused] = useState(false)
  const [selected, setSelected] = useState(false)

  useEffect(() => {
    client.get("/teams")
      .then(res => setTeams(res.data))
      .catch(err => console.error("Failed to fetch teams", err))
  }, [])

  return (
    <div>
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
          onChange={e => {
            if (!e.target.value) return
            setSelected(true)
            onSelect(Number(e.target.value))
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            background: "#0b101c",
            color: selected ? "#edf2fa" : "#94a3bd",
            border: `1px solid ${focused ? accent + "66" : "#1b2436"}`,
            borderRadius: "10px",
            padding: "11px 30px 11px 13px",
            fontSize: "13.5px",
            fontWeight: "500",
            fontFamily: UI,
            cursor: "pointer",
            outline: "none",
            appearance: "none",
            WebkitAppearance: "none",
            transition: "border-color 0.15s",
          }}
        >
          <option value="" style={{ background: "#0b101c", color: "#566179" }}>Select a team…</option>
          {teams.map(team => (
            <option key={team.id} value={team.id} style={{ background: "#0b101c", color: "#edf2fa" }}>
              {team.name}
            </option>
          ))}
        </select>
        {/* Custom arrow */}
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
