import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import client from "../../api/client"

export default function TeamSelector({ label, onSelect }) {
  const [teams, setTeams] = useState([])
  const [focused, setFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)

  useEffect(() => {
    client.get("/teams")
      .then(res => setTeams(res.data))
      .catch(err => console.error("Failed to fetch teams", err))
  }, [])

  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        boxShadow: "0 0 28px rgba(139,92,246,0.18), 0 8px 32px rgba(0,0,0,0.35)",
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: focused
          ? "1px solid rgba(139,92,246,0.45)"
          : "1px solid rgba(255,255,255,0.08)",
        borderRadius: "14px",
        padding: "16px",
        transition: "border-color 0.2s ease",
      }}
    >
      <label style={{
        display: "block",
        fontSize: "10px",
        fontWeight: "600",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: focused ? "#a78bfa" : "#475569",
        marginBottom: "10px",
        fontFamily: "'Inter', sans-serif",
        transition: "color 0.2s",
      }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <select
          onChange={e => {
            onSelect(Number(e.target.value))
            setHasValue(!!e.target.value)
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            background: "rgba(15,23,42,0.8)",
            color: hasValue ? "#e2e8f0" : "#475569",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            padding: "10px 36px 10px 12px",
            fontSize: "13px",
            fontWeight: "500",
            fontFamily: "'Inter', sans-serif",
            cursor: "pointer",
            outline: "none",
            appearance: "none",
            WebkitAppearance: "none",
            boxShadow: focused ? "0 0 0 3px rgba(139,92,246,0.14)" : "none",
            transition: "box-shadow 0.2s, border-color 0.2s",
          }}
        >
          <option value="" style={{ background: "#1e293b", color: "#64748b" }}>Select a team...</option>
          {teams.map(team => (
            <option key={team.id} value={team.id} style={{ background: "#1e293b", color: "#e2e8f0" }}>
              {team.name}
            </option>
          ))}
        </select>
        {/* Animated chevron */}
        <motion.svg
          animate={{ rotate: focused ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{ position: "absolute", right: "10px", top: "50%", marginTop: "-7px", pointerEvents: "none", color: focused ? "#a78bfa" : "#475569" }}
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </div>
    </motion.div>
  )
}
