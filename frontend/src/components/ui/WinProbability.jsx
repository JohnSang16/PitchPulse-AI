import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

// ── Counting number hook ───────────────────────────────────────────────────
function useCountUp(target, duration = 1100) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = null
    const from = 0
    const to = parseFloat(target) || 0

    const tick = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(+(from + (to - from) * eased).toFixed(1))
      if (p < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [inView, target, duration])

  return [value, ref]
}

// ── Stat column ────────────────────────────────────────────────────────────
function StatColumn({ label, pct, color, delay = 0 }) {
  const [count, ref] = useCountUp(pct, 1000 + delay)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ textAlign: "center", flex: 1 }}
    >
      <p style={{ fontSize: "10px", fontWeight: "600", letterSpacing: "0.13em", textTransform: "uppercase", color, margin: "0 0 6px 0" }}>
        {label}
      </p>
      <p ref={ref} style={{ fontSize: "44px", fontWeight: "800", letterSpacing: "-0.04em", color: "#f8fafc", margin: 0, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
        {Math.round(count)}%
      </p>
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
        height: "100%",
        background: gradient,
        borderRadius: radius,
        boxShadow: glow,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* pulse shimmer */}
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "linear", delay: 1 + delay / 1000 }}
        style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
          width: "60%",
        }}
      />
    </motion.div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export default function WinProbability({ result, homeTeam, awayTeam }) {
  if (!result) return null

  const drawColor = "#94a3b8"

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
        padding: "28px",
        width: "100%",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <p style={{ textAlign: "center", fontSize: "10px", fontWeight: "600", letterSpacing: "0.18em", textTransform: "uppercase", color: "#64748b", margin: "0 0 24px 0" }}>
        Match Prediction
      </p>

      {/* Percentage columns */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
        <StatColumn label={homeTeam} pct={result.home_win_pct} color="#3b82f6" delay={0} />
        <div style={{ textAlign: "center", flex: 1 }}>
          <p style={{ fontSize: "10px", fontWeight: "600", letterSpacing: "0.13em", textTransform: "uppercase", color: drawColor, margin: "0 0 6px 0" }}>Draw</p>
          <StatColumn label="" pct={result.draw_pct} color={drawColor} delay={120} />
        </div>
        <StatColumn label={awayTeam} pct={result.away_win_pct} color="#ef4444" delay={60} />
      </div>

      {/* Probability bar */}
      <div style={{
        display: "flex",
        borderRadius: "100px",
        overflow: "hidden",
        height: "6px",
        background: "rgba(255,255,255,0.04)",
        gap: "2px",
      }}>
        <BarSegment
          pct={result.home_win_pct}
          gradient="linear-gradient(90deg, #1d4ed8, #3b82f6)"
          glow="0 0 10px rgba(59,130,246,0.7)"
          delay={200}
          radius="100px 0 0 100px"
        />
        <BarSegment
          pct={result.draw_pct}
          gradient="rgba(71,85,105,0.7)"
          glow="none"
          delay={280}
        />
        <BarSegment
          pct={result.away_win_pct}
          gradient="linear-gradient(90deg, #ef4444, #dc2626)"
          glow="0 0 10px rgba(239,68,68,0.7)"
          delay={360}
          radius="0 100px 100px 0"
        />
      </div>

      {/* xG row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        style={{ display: "flex", justifyContent: "space-between", marginTop: "14px" }}
      >
        <span style={{ fontSize: "11px", color: "#3b82f6", fontWeight: "600" }}>
          {result.home_expected_goals} xG
        </span>
        <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "500" }}>
          {result.simulations?.toLocaleString()} sims
        </span>
        <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: "600" }}>
          {result.away_expected_goals} xG
        </span>
      </motion.div>
    </motion.div>
  )
}
