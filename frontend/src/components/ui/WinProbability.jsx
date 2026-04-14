import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

// ── Counting number hook ───────────────────────────────────────────────────
function useCountUp(target, duration = 1100) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    let start = null
    const to = parseFloat(target) || 0
    const tick = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(+(to * eased).toFixed(1))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])

  return [value, ref]
}

// ── Stat column ────────────────────────────────────────────────────────────
function StatColumn({ label, pct, color, delay = 0, xG, isWinner }) {
  const [count, ref] = useCountUp(pct, 1000 + delay)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}
    >
      {/* Outcome label */}
      <p style={{
        fontSize: "10px", fontWeight: "600", letterSpacing: "0.13em",
        textTransform: "uppercase", color, margin: 0,
      }}>
        {label}
      </p>

      {/* Big percentage */}
      <div style={{ position: "relative", display: "inline-block" }}>
        {isWinner && (
          <div style={{
            position: "absolute", inset: "-10px", borderRadius: "20px",
            background: `radial-gradient(ellipse, ${color}28 0%, transparent 70%)`,
          }} />
        )}
        <p ref={ref} style={{
          fontSize: "52px", fontWeight: "800", letterSpacing: "-0.04em",
          color: isWinner ? color : "#e2e8f0",
          margin: 0, lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          position: "relative",
          textShadow: isWinner ? `0 0 32px ${color}55` : "none",
          transition: "color 0.3s",
        }}>
          {Math.round(count)}%
        </p>
      </div>

      {/* xG pill — only for home/away */}
      {xG != null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.75 + delay / 1000, duration: 0.3 }}
          style={{
            display: "inline-flex", alignItems: "center",
            padding: "3px 10px", borderRadius: "100px",
            background: `${color}14`,
            border: `1px solid ${color}30`,
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: "700", color, fontVariantNumeric: "tabular-nums" }}>
            {xG} xG
          </span>
        </motion.div>
      )}
    </motion.div>
  )
}

// ── Pulsing bar segment ────────────────────────────────────────────────────
function BarSegment({ pct, gradient, glow, delay = 0, radius = "0" }) {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${pct}%` }}
      transition={{ delay: delay / 1000, duration: 1, ease: [0.34, 1.2, 0.64, 1] }}
      style={{
        height: "100%", background: gradient, borderRadius: radius,
        boxShadow: glow, position: "relative", overflow: "hidden",
      }}
    >
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "linear", delay: 1 + delay / 1000 }}
        style={{
          position: "absolute", inset: 0, width: "60%",
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
        }}
      />
    </motion.div>
  )
}

// ── Divider ────────────────────────────────────────────────────────────────
function Divider() {
  return (
    <div style={{
      width: "1px", alignSelf: "stretch", margin: "8px 0",
      background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.08), transparent)",
    }} />
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export default function WinProbability({ result, homeTeam, awayTeam }) {
  if (!result) return null

  const home = result.home_win_pct
  const draw = result.draw_pct
  const away = result.away_win_pct
  const max = Math.max(home, draw, away)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "20px",
        padding: "28px 24px 22px",
        width: "100%",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Header */}
      <p style={{
        textAlign: "center", fontSize: "10px", fontWeight: "600",
        letterSpacing: "0.18em", textTransform: "uppercase",
        color: "#475569", margin: "0 0 22px 0",
      }}>
        Match Prediction
      </p>

      {/* Stat columns */}
      <div style={{ display: "flex", alignItems: "stretch", marginBottom: "20px" }}>
        <StatColumn
          label={homeTeam || "Home"}
          pct={home}
          color="#3b82f6"
          delay={0}
          xG={result.home_expected_goals}
          isWinner={home === max && home !== draw}
        />
        <Divider />
        <StatColumn
          label="Draw"
          pct={draw}
          color="#94a3b8"
          delay={120}
          isWinner={draw === max && draw !== home && draw !== away}
        />
        <Divider />
        <StatColumn
          label={awayTeam || "Away"}
          pct={away}
          color="#ef4444"
          delay={60}
          xG={result.away_expected_goals}
          isWinner={away === max && away !== draw}
        />
      </div>

      {/* Probability bar */}
      <div style={{
        display: "flex", borderRadius: "100px", overflow: "hidden",
        height: "8px", background: "rgba(255,255,255,0.04)", gap: "2px",
      }}>
        <BarSegment
          pct={home}
          gradient="linear-gradient(90deg, #1d4ed8, #3b82f6)"
          glow="0 0 10px rgba(59,130,246,0.7)"
          delay={200}
          radius="100px 0 0 100px"
        />
        <BarSegment
          pct={draw}
          gradient="rgba(71,85,105,0.7)"
          glow="none"
          delay={280}
        />
        <BarSegment
          pct={away}
          gradient="linear-gradient(90deg, #ef4444, #dc2626)"
          glow="0 0 10px rgba(239,68,68,0.7)"
          delay={360}
          radius="0 100px 100px 0"
        />
      </div>

      {/* Simulations count */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.4 }}
        style={{
          textAlign: "center", fontSize: "10px", color: "#334155",
          fontWeight: "500", margin: "12px 0 0 0", letterSpacing: "0.04em",
        }}
      >
        {result.simulations?.toLocaleString()} simulations
      </motion.p>
    </motion.div>
  )
}
