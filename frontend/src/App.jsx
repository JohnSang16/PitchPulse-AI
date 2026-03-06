import { useState } from "react"
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion"
import client from "./api/client"
import TeamSelector from "./components/ui/TeamSelector"
import WinProbability from "./components/ui/WinProbability"
import AICoach from "./components/ui/AICoach"
import SoccerPitch from "./components/pitch/SoccerPitch"

// ── Shared animation variants ──────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:   { opacity: 0, y: -16, transition: { duration: 0.3, ease: "easeIn" } },
}

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
}

// ── Reusable glass card ─────────────────────────────────────────────────────
function GlassCard({ children, hover = true, style = {} }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={hover ? { scale: 1.015, boxShadow: "0 0 28px rgba(139,92,246,0.16), 0 8px 32px rgba(0,0,0,0.4)" } : {}}
      onHoverStart={hover ? e => e.currentTarget.style.borderColor = "rgba(139,92,246,0.28)" : undefined}
      onHoverEnd={hover ? e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)" : undefined}
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "18px",
        transition: "border-color 0.2s",
        cursor: "default",
        ...style,
      }}
    >
      {children}
    </motion.div>
  )
}

// ── Pipeline step ────────────────────────────────────────────────────────────
function PipelineStep({ number, label, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flex: 1 }}>
      <div style={{
        width: "36px", height: "36px", borderRadius: "50%",
        background: `linear-gradient(135deg, ${color}33, ${color}55)`,
        border: `1px solid ${color}66`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "13px", fontWeight: "800", color, fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        {number}
      </div>
      <span style={{ fontSize: "10px", fontWeight: "600", color: "#94a3b8", textAlign: "center", letterSpacing: "0.04em" }}>
        {label}
      </span>
    </div>
  )
}

// ── Connector arrow ──────────────────────────────────────────────────────────
function Arrow() {
  return (
    <div style={{ display: "flex", alignItems: "center", paddingBottom: "20px", color: "#1e293b" }}>
      <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
        <path d="M0 6H16M16 6L10 1M16 6L10 11" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

// ── Inline code chip ─────────────────────────────────────────────────────────
function Chip({ children, color = "#3b82f6" }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: "5px",
      background: `${color}18`,
      border: `1px solid ${color}33`,
      color,
      fontSize: "11px",
      fontWeight: "600",
      fontFamily: "monospace",
      letterSpacing: "0.02em",
    }}>
      {children}
    </span>
  )
}

// ── About page ─────────────────────────────────────────────────────────────
function AboutPage() {
  const features = [
    { icon: "⚡", title: "Monte Carlo Engine", body: "10,000+ match simulations per prediction using real player rating distributions." },
    { icon: "🧠", title: "AI Coach Insights", body: "Claude-powered tactical analysis tailored to formations, strengths, and weaknesses." },
    { icon: "📊", title: "xG Modelling", body: "Expected Goals calculated from historical shot data and positional ratings." },
    { icon: "🏟️", title: "Formation Visualiser", body: "Interactive pitch with real squad data mapped to FIFA-style player cards." },
  ]

  const techStack = [
    { label: "Data Layer", chip: "Football API", chipColor: "#3b82f6", desc: "Live squad and player data pulled via a RESTful football data API on demand." },
    { label: "Backend", chip: "Python / Flask", chipColor: "#8b5cf6", desc: "A lightweight Flask server handles API routing, data processing, and orchestrates all simulation logic." },
    { label: "Database", chip: "PostgreSQL", chipColor: "#06b6d4", desc: "Match stats and player ratings are persisted in Postgres for historical querying and trend analysis." },
    { label: "Simulation", chip: "Monte Carlo", chipColor: "#f59e0b", desc: "The win-probability engine runs thousands of randomised match simulations and aggregates the outcomes into probabilities." },
    { label: "AI Layer", chip: "Claude API", chipColor: "#ec4899", desc: "Anthropic's Claude synthesises the simulation results into plain-English tactical insights for each matchup." },
  ]

  return (
    <motion.div
      key="about"
      variants={stagger}
      initial="hidden"
      animate="show"
      exit="exit"
      style={{ width: "100%", maxWidth: "680px", display: "flex", flexDirection: "column", gap: "14px" }}
    >
      {/* ── Hero blurb ── */}
      <motion.div variants={fadeUp}>
        <h2 style={{ fontSize: "24px", fontWeight: "800", letterSpacing: "-0.03em", color: "#f1f5f9", margin: "0 0 10px 0" }}>
          About PitchPulse AI
        </h2>
        <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.75, margin: 0 }}>
          A modern football analytics platform that simulates Premier League matches using statistical modelling and generative AI. Every percentage you see on the dashboard is backed by real squad data and thousands of simulated 90-minute matches — not gut feeling.
        </p>
      </motion.div>

      {/* ── Feature pills ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {features.map(item => (
          <GlassCard key={item.title} style={{ padding: "16px 18px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "9px", flexShrink: 0,
              background: "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(139,92,246,0.18))",
              border: "1px solid rgba(139,92,246,0.22)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
            }}>{item.icon}</div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#e2e8f0", margin: "0 0 3px 0" }}>{item.title}</p>
              <p style={{ fontSize: "11px", color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>{item.body}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* ── Technical Deep Dive ── */}
      <motion.div variants={fadeUp} style={{ marginTop: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "7px",
            background: "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(139,92,246,0.25))",
            border: "1px solid rgba(139,92,246,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
          }}>🔬</div>
          <h3 style={{ fontSize: "16px", fontWeight: "800", letterSpacing: "-0.02em", color: "#f1f5f9", margin: 0 }}>
            Technical Deep Dive
          </h3>
        </div>
      </motion.div>

      {/* ── Data pipeline visual ── */}
      <GlassCard hover={false} style={{ padding: "20px 24px" }}>
        <p style={{ fontSize: "10px", fontWeight: "600", letterSpacing: "0.16em", textTransform: "uppercase", color: "#64748b", margin: "0 0 16px 0" }}>
          Data Pipeline
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <PipelineStep number="1" label="Football API" color="#3b82f6" />
          <Arrow />
          <PipelineStep number="2" label="Flask Backend" color="#8b5cf6" />
          <Arrow />
          <PipelineStep number="3" label="PostgreSQL" color="#06b6d4" />
          <Arrow />
          <PipelineStep number="4" label="Monte Carlo" color="#f59e0b" />
          <Arrow />
          <PipelineStep number="5" label="Claude AI" color="#ec4899" />
        </div>
      </GlassCard>

      {/* ── Stack breakdown ── */}
      <GlassCard hover={false} style={{ padding: "0" }}>
        {techStack.map((item, i) => (
          <motion.div
            key={item.label}
            variants={fadeUp}
            style={{
              display: "flex",
              gap: "16px",
              padding: "18px 22px",
              borderBottom: i < techStack.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              alignItems: "flex-start",
            }}
          >
            {/* Label column */}
            <div style={{ width: "72px", flexShrink: 0, paddingTop: "2px" }}>
              <span style={{ fontSize: "10px", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", color: "#64748b" }}>
                {item.label}
              </span>
            </div>

            {/* Content column */}
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: "6px" }}>
                <Chip color={item.chipColor}>{item.chip}</Chip>
              </div>
              <p style={{ fontSize: "12.5px", color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </GlassCard>

      {/* ── Where do the numbers come from? ── */}
      <GlassCard hover={false} style={{ padding: "22px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: "#e2e8f0", margin: "0 0 12px 0" }}>
          Where do the numbers actually come from?
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            {
              q: "The squad data",
              a: "When you select a team, PitchPulse fetches the latest squad from a live football API — real players, real positions, real ratings. No made-up numbers.",
            },
            {
              q: "The simulation",
              a: "The Flask backend takes each team's attack and defence ratings and runs 10,000 independent matches. In each match, a random number draw against those ratings decides who scores. Across 10,000 runs, the win/draw/loss split becomes your probability.",
            },
            {
              q: "The database",
              a: "Every player rating fetched gets written to PostgreSQL. That history lets us track how squads evolve over a season and spot trends — a team's xG creep over recent weeks, for instance.",
            },
            {
              q: "The xG figures",
              a: "Expected Goals are derived from the average goal output across all 10,000 simulations. If a team scores 1.8 goals on average across the runs, their xG reads 1.8 — a statistically honest estimate of how dangerous they are.",
            },
          ].map(({ q, a }) => (
            <div key={q} style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "10px",
              padding: "14px 16px",
            }}>
              <p style={{ fontSize: "12px", fontWeight: "700", color: "#94a3b8", margin: "0 0 5px 0" }}>{q}</p>
              <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.72, margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>
      </GlassCard>

    </motion.div>
  )
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const prefersReducedMotion = useReducedMotion()
  const [page, setPage] = useState("home") // "home" | "about"
  const [homeTeamId, setHomeTeamId] = useState(null)
  const [awayTeamId, setAwayTeamId] = useState(null)
  const [homeFormation, setHomeFormation] = useState("4-4-2")
  const [awayFormation, setAwayFormation] = useState("4-3-3")
  const [result, setResult] = useState(null)
  const [insight, setInsight] = useState(null)
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [homeTeamName, setHomeTeamName] = useState("")
  const [awayTeamName, setAwayTeamName] = useState("")
  const [homePlayers, setHomePlayers] = useState([])
  const [awayPlayers, setAwayPlayers] = useState([])

  const handleHomeTeamSelect = async (id) => {
    setHomeTeamId(id)
    const res = await client.get(`/teams/${id}/players`)
    setHomePlayers(res.data.players)
  }

  const handleAwayTeamSelect = async (id) => {
    setAwayTeamId(id)
    const res = await client.get(`/teams/${id}/players`)
    setAwayPlayers(res.data.players)
  }

  const handleSimulate = async () => {
    if (!homeTeamId || !awayTeamId) return
    if (homeTeamId === awayTeamId) return alert("Please select two different teams!")
    setLoading(true)
    setAiLoading(true)
    setResult(null)
    setInsight(null)
    try {
      const simRes = await client.post("/simulate", { home_team_id: homeTeamId, away_team_id: awayTeamId })
      setResult(simRes.data)
      setHomeTeamName(simRes.data.home_team)
      setAwayTeamName(simRes.data.away_team)
      setLoading(false)
      const coachRes = await client.post("/coach", {
        home_team_id: homeTeamId, away_team_id: awayTeamId,
        home_formation: homeFormation, away_formation: awayFormation,
      })
      setInsight(coachRes.data.insight)
    } catch (err) {
      console.error("Error", err)
    } finally {
      setLoading(false)
      setAiLoading(false)
    }
  }

  const canSimulate = homeTeamId && awayTeamId && !loading

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 20% 0%, rgba(56,189,248,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 0%, rgba(139,92,246,0.06) 0%, transparent 50%), #0f172a",
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    }}>

      {/* ── Nav (fixed so Framer Motion stacking contexts can never cover it) ── */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 24px",
          background: "rgba(15,23,42,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "9px",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px",
            boxShadow: "0 0 18px rgba(139,92,246,0.4)",
          }}>⚽</div>
          <span style={{ fontSize: "17px", fontWeight: "800", letterSpacing: "-0.03em", color: "#f8fafc" }}>
            PitchPulse <span style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>AI</span>
          </span>
        </div>

        <div style={{ display: "flex", gap: "4px" }}>
          {["home", "about"].map(p => (
            <motion.button
              key={p}
              onClick={() => setPage(p)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                padding: "7px 16px", borderRadius: "8px", border: "none", cursor: "pointer",
                fontSize: "12px", fontWeight: "600", fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: "0.02em", textTransform: "capitalize",
                background: page === p ? "rgba(139,92,246,0.18)" : "transparent",
                color: page === p ? "#a78bfa" : "#94a3b8",
                borderColor: page === p ? "rgba(139,92,246,0.3)" : "transparent",
                borderStyle: "solid", borderWidth: "1px",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {p === "home" ? "Dashboard" : "About"}
            </motion.button>
          ))}
        </div>
      </motion.nav>

      {/* ── Page content (paddingTop clears the fixed nav) ── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "96px 24px 80px" }}>
      <AnimatePresence mode="wait">
        {page === "about" ? (
          <AboutPage key="about" />
        ) : (
          <motion.div
            key="home"
            variants={stagger}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{ width: "100%", maxWidth: "900px", display: "flex", flexDirection: "column", alignItems: "center", gap: "28px" }}
          >
            {/* Header */}
            <motion.div variants={fadeUp} style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <h1 style={{
                fontSize: "clamp(28px, 5vw, 42px)", fontWeight: "800", letterSpacing: "-0.03em",
                background: "linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: 0,
              }}>
                Premier League Predictor
              </h1>
              <p style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.18em", textTransform: "uppercase", color: "#64748b", margin: 0 }}>
                Powered by AI Prediction Simulation
              </p>
            </motion.div>

            {/* Team selectors */}
            <motion.div variants={fadeUp} style={{ display: "flex", gap: "16px", width: "100%", maxWidth: "520px" }}>
              <div style={{ flex: 1 }}><TeamSelector label="Home Team" onSelect={handleHomeTeamSelect} /></div>
              <div style={{ flex: 1 }}><TeamSelector label="Away Team" onSelect={handleAwayTeamSelect} /></div>
            </motion.div>

            {/* Simulate button */}
            <motion.div variants={fadeUp}>
              <motion.button
                onClick={handleSimulate}
                disabled={!canSimulate}
                whileHover={canSimulate ? { scale: 1.04, boxShadow: "0 0 40px rgba(139,92,246,0.6), 0 8px 24px rgba(0,0,0,0.4)" } : {}}
                whileTap={canSimulate ? { scale: 0.97 } : {}}
                style={{
                  padding: "14px 40px", borderRadius: "100px", border: "none",
                  cursor: canSimulate ? "pointer" : "not-allowed",
                  fontSize: "14px", fontWeight: "700", fontFamily: "'Plus Jakarta Sans', sans-serif",
                  letterSpacing: "0.02em", color: "#ffffff",
                  background: canSimulate
                    ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
                    : "rgba(255,255,255,0.06)",
                  opacity: canSimulate ? 1 : 0.45,
                  boxShadow: canSimulate
                    ? "0 0 24px rgba(139,92,246,0.35), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)"
                    : "none",
                  transition: "background 0.2s, opacity 0.2s",
                }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      style={{ display: "inline-block" }}
                    >⚽</motion.span>
                    Simulating...
                  </span>
                ) : "Run Simulation ⚡"}
              </motion.button>
            </motion.div>

            {/* Results */}
            <AnimatePresence>
              {result && (
                <motion.div
                  key="winprob"
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  style={{ width: "100%", maxWidth: "520px" }}
                >
                  <WinProbability result={result} homeTeam={homeTeamName} awayTeam={awayTeamName} />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {(insight || aiLoading) && (
                <motion.div
                  key="aicoach"
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  style={{ width: "100%" }}
                >
                  <AICoach insight={insight} loading={aiLoading} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pitch — always visible */}
            <motion.div variants={fadeUp} style={{ width: "100%" }}>
              <SoccerPitch
                homeColor="#3b82f6"
                awayColor="#ef4444"
                homePlayers={homePlayers}
                awayPlayers={awayPlayers}
                onFormationChange={(home, away) => { setHomeFormation(home); setAwayFormation(away) }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  )
}
