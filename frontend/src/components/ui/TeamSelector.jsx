import { useEffect, useState } from "react"
import client from "../../api/client"
import { Crest } from "./Tournament"

const UI   = "'Noto Sans', -apple-system, sans-serif"
const MONO = "'JetBrains Mono', 'Courier New', monospace"

export default function TeamSelector({ label, accent = "#d4af37", onSelect }) {
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
        <Crest color={accent} size={14} />
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <select
          onChange={e => {
            if (!e.target.value) return
            setSelected(true)
            onSelect(Number(e.target.value), e.target.options[e.target.selectedIndex].text)
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            background: "#101013",
            color: selected ? "#edf2fa" : "#94a3bd",
            border: `1px solid ${focused ? accent + "66" : "#242428"}`,
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
          <option value="" style={{ background: "#101013", color: "#566179" }}>Select a team…</option>
          {teams.map(team => (
            <option key={team.id} value={team.id} style={{ background: "#101013", color: "#edf2fa" }}>
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
