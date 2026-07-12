import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Crest, TrophyCup, Confetti } from "./Tournament"

const UI   = "'Inter', -apple-system, sans-serif"
const MONO = "'JetBrains Mono', 'Courier New', monospace"

const GOLD  = "#d4b56a"
const RED  = "#cd8272"
const SLATE = "#475569"

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

function PctStat({ label, value, color, primary, crest = false, trophy = false }) {
  const count = useCountUp(value)
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{ display: "flex", flexDirection: "column", gap: "8px", cursor: "default", minWidth: 0 }}
    >
      <span style={{
        display: "flex", alignItems: "center", gap: "7px",
        fontFamily: MONO, fontSize: "10px", fontWeight: "500",
        letterSpacing: "0.14em", textTransform: "uppercase", color: "#94a3bd",
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>
        {crest
          ? <Crest color={color} size={14} />
          : <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: color, flexShrink: 0 }} />}
        {label}
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>
        <span style={{
          fontFamily: MONO, fontSize: "30px", fontWeight: "600", lineHeight: 1,
          color: primary ? color : "#edf2fa",
          fontVariantNumeric: "tabular-nums",
          textShadow: primary ? `0 0 20px ${color}33` : "none",
        }}>
          {Math.round(count)}<span style={{ fontSize: "16px", color: "#566179" }}>%</span>
        </span>
        {trophy && <TrophyCup size={17} color={color} />}
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
      <span style={{
        fontFamily: MONO, fontSize: "10px", fontWeight: "500",
        letterSpacing: "0.14em", textTransform: "uppercase", color: "#566179",
        whiteSpace: "nowrap",
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: MONO, fontSize: "30px", fontWeight: "600", lineHeight: 1,
        color: "#94a3bd", fontVariantNumeric: "tabular-nums",
      }}>
        {value ?? "–"}
      </span>
    </motion.div>
  )
}

function StatDivider({ isMobile }) {
  if (isMobile) return null
  return (
    <div style={{
      width: "1px", background: "#131b2b",
      margin: "0 26px", alignSelf: "stretch", flexShrink: 0,
    }} />
  )
}

// Stacked home / draw / away probability bar
function ProbBar({ result }) {
  const segments = [
    { pct: result.home_win_pct, color: GOLD },
    { pct: result.draw_pct,     color: SLATE },
    { pct: result.away_win_pct, color: RED },
  ]
  return (
    <div style={{
      display: "flex", width: "100%", height: "6px",
      borderRadius: "3px", overflow: "hidden", background: "#131b2b",
      marginBottom: "18px",
    }}>
      {segments.map((s, i) => (
        <motion.div
          key={i}
          initial={{ flexGrow: 0 }}
          animate={{ flexGrow: Math.max(s.pct, 0.5) }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: s.color, flexBasis: 0 }}
        />
      ))}
    </div>
  )
}

export default function WinProbability({ result, homeTeam, awayTeam, isMobile = false }) {
  const max = result ? Math.max(result.home_win_pct, result.draw_pct, result.away_win_pct) : null
  const [burst, setBurst] = useState(false)

  useEffect(() => {
    if (!result) return
    setBurst(true)
    const t = setTimeout(() => setBurst(false), 1700)
    return () => clearTimeout(t)
  }, [result])

  return (
    <div style={{
      position: "relative",
      borderTop: "1px solid #1b2436",
      padding: isMobile ? "16px" : "18px 28px 20px",
      background: "#05070d",
      flexShrink: 0,
    }}>
      {burst && <Confetti />}
      {result && <ProbBar result={result} />}
      <div style={{
        display: isMobile ? "grid" : "flex",
        gridTemplateColumns: isMobile ? "1fr 1fr 1fr" : undefined,
        gap: isMobile ? "18px 8px" : undefined,
        alignItems: "flex-start",
      }}>
        {result ? (
          <>
            <PctStat label={homeTeam || "Home Win"} value={result.home_win_pct} color={GOLD} primary={result.home_win_pct === max} crest trophy={result.home_win_pct === max} />
            <StatDivider isMobile={isMobile} />
            <PctStat label="Draw" value={result.draw_pct} color={SLATE} primary={result.draw_pct === max} />
            <StatDivider isMobile={isMobile} />
            <PctStat label={awayTeam || "Away Win"} value={result.away_win_pct} color={RED} primary={result.away_win_pct === max} crest trophy={result.away_win_pct === max} />
            <StatDivider isMobile={isMobile} />
            <PlainStat label="Home xG" value={result.home_expected_goals} />
            <StatDivider isMobile={isMobile} />
            <PlainStat label="Away xG" value={result.away_expected_goals} />
            <StatDivider isMobile={isMobile} />
            <PlainStat label="Simulations" value={result.simulations?.toLocaleString()} />
          </>
        ) : (
          <>
            {["Home Win", "Draw", "Away Win", "Home xG", "Away xG", "Simulations"].map((label, i) => (
              <div key={label} style={{ display: "flex", alignItems: "stretch" }}>
                <PlainStat label={label} value="–" />
                {i < 5 && <StatDivider isMobile={isMobile} />}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
