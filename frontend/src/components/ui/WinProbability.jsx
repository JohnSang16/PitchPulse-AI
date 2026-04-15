import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const MONO = "'DM Mono', 'Courier New', monospace"

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let start = null
    const to = parseFloat(target) || 0
    if (!to) { setValue(0); return }
    const tick = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setValue(+(to * (1 - Math.pow(1 - p, 3))).toFixed(1))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return value
}

function PctStat({ label, value, primary }) {
  const count = useCountUp(value)
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{ display: "flex", flexDirection: "column", gap: "8px", cursor: "default" }}
    >
      <motion.span
        whileHover={{ color: "#c9a84c" }}
        transition={{ duration: 0.15 }}
        style={{ fontFamily: MONO, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#8a7a52" }}
      >
        {label}
      </motion.span>
      <span style={{
        fontFamily: MONO, fontSize: "32px", lineHeight: 1,
        color: primary ? "#c9a84c" : "#8a7a52",
        fontVariantNumeric: "tabular-nums",
      }}>
        {Math.round(count)}%
      </span>
    </motion.div>
  )
}

function PlainStat({ label, value }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{ display: "flex", flexDirection: "column", gap: "8px", cursor: "default" }}
    >
      <motion.span
        whileHover={{ color: "#c9a84c" }}
        transition={{ duration: 0.15 }}
        style={{ fontFamily: MONO, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#8a7a52" }}
      >
        {label}
      </motion.span>
      <span style={{
        fontFamily: MONO, fontSize: "32px", lineHeight: 1,
        color: "#8a7a52", fontVariantNumeric: "tabular-nums",
      }}>
        {value ?? "—"}
      </span>
    </motion.div>
  )
}

function StatDivider() {
  return (
    <div style={{
      width: "0.5px", background: "#141210",
      margin: "0 28px", alignSelf: "stretch", flexShrink: 0,
    }} />
  )
}

export default function WinProbability({ result, homeTeam, awayTeam }) {
  const max = result ? Math.max(result.home_win_pct, result.draw_pct, result.away_win_pct) : null

  return (
    <div style={{
      borderTop: "0.5px solid #1e1a12",
      padding: "20px 28px",
      background: "#080808",
      display: "flex",
      alignItems: "flex-start",
      flexShrink: 0,
    }}>
      {result ? (
        <>
          <PctStat label={homeTeam || "Home Win"} value={result.home_win_pct} primary={result.home_win_pct === max} />
          <StatDivider />
          <PctStat label="Draw" value={result.draw_pct} primary={result.draw_pct === max} />
          <StatDivider />
          <PctStat label={awayTeam || "Away Win"} value={result.away_win_pct} primary={result.away_win_pct === max} />
          <StatDivider />
          <PlainStat label="Home xG" value={result.home_expected_goals} />
          <StatDivider />
          <PlainStat label="Away xG" value={result.away_expected_goals} />
          <StatDivider />
          <PlainStat label="Simulations" value={result.simulations?.toLocaleString()} />
        </>
      ) : (
        <>
          {["Home Win", "Draw", "Away Win", "Home xG", "Away xG", "Simulations"].map((label, i) => (
            <div key={label} style={{ display: "flex", alignItems: "stretch" }}>
              <PlainStat label={label} value="—" />
              {i < 5 && <StatDivider />}
            </div>
          ))}
        </>
      )}
    </div>
  )
}
