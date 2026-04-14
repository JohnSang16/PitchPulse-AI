import { useState } from "react"
import { Analytics } from '@vercel/analytics/react'
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
import { BGPattern } from "./components/ui/bg-pattern"

// ── Font ──────────────────────────────────────────────────────────────────────
const FONT = "'Inter', system-ui, sans-serif"

// ── Moody purple palette ──────────────────────────────────────────────────────
const C = {
  bg:          "#07050e",          // near-black with purple tint
  bgCard:      "rgba(88,28,220,0.07)",   // violet-tinted glass
  bgCardHover: "rgba(88,28,220,0.12)",
  border:      "rgba(139,92,246,0.14)",
  borderHover: "rgba(168,85,247,0.38)",
  accent:      "#a855f7",          // bright amethyst
  accentDeep:  "#7c3aed",          // deep violet
  accentGlow:  "rgba(168,85,247,0.45)",
  accentSoft:  "rgba(168,85,247,0.12)",
  heading:     "#f0ebff",          // lavender white
  body:        "#b09fd8",          // soft lavender
  muted:       "#5e5080",          // dim purple-grey
  navBg:       "rgba(7,5,14,0.9)",
  gradBtn:     "linear-gradient(135deg, #6d28d9 0%, #a855f7 100%)",
  gradTitle:   "linear-gradient(135deg, #f0ebff 0%, #a78bfa 100%)",
  gradLogo:    "linear-gradient(135deg, #7c3aed, #c084fc)",
}

// ── Animation variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:   { opacity: 0, y: -12, transition: { duration: 0.2, ease: "easeIn" } },
}

// ── Glass card ────────────────────────────────────────────────────────────────
function GlassCard({ children, hover = true, style = {}, onClick }) {
  return (
    <motion.div
      variants={fadeUp}
      onClick={onClick}
      whileHover={hover ? {
        scale: 1.012,
        boxShadow: `0 0 36px ${C.accentGlow}, 0 8px 32px rgba(0,0,0,0.6)`,
      } : {}}
      whileTap={onClick ? { scale: 0.99 } : {}}
      onHoverStart={hover ? e => {
        e.currentTarget.style.borderColor = C.borderHover
        e.currentTarget.style.background  = C.bgCardHover
      } : undefined}
      onHoverEnd={hover ? e => {
        e.currentTarget.style.borderColor = C.border
        e.currentTarget.style.background  = C.bgCard
      } : undefined}
      style={{
        background: C.bgCard,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${C.border}`,
        borderRadius: "16px",
        transition: "border-color 0.2s, background 0.2s",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </motion.div>
  )
}

// ── Pipeline step ─────────────────────────────────────────────────────────────
function PipelineStep({ number, label, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flex: 1 }}>
      <motion.div
        whileHover={{ scale: 1.18, boxShadow: `0 0 18px ${color}66` }}
        transition={{ type: "spring", stiffness: 360 }}
        style={{
          width: "36px", height: "36px", borderRadius: "50%",
          background: `linear-gradient(135deg, ${color}28, ${color}50)`,
          border: `1px solid ${color}55`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "13px", fontWeight: "800", color, fontFamily: FONT,
          cursor: "default",
        }}
      >
        {number}
      </motion.div>
      <span style={{ fontSize: "10px", fontWeight: "600", color: C.muted, textAlign: "center", letterSpacing: "0.04em" }}>
        {label}
      </span>
    </div>
  )
}

function Arrow() {
  return (
    <div style={{ display: "flex", alignItems: "center", paddingBottom: "20px" }}>
      <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
        <path d="M0 6H16M16 6L10 1M16 6L10 11" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function Chip({ children, color = C.accent }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 9px",
      borderRadius: "5px",
      background: `${color}18`,
      border: `1px solid ${color}30`,
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

// ── About page ────────────────────────────────────────────────────────────────
function AboutPage() {
  const features = [
    { icon: "⚡", title: "Monte Carlo Engine",    body: "10,000+ match simulations per prediction using real player rating distributions and Poisson goal models." },
    { icon: "🧠", title: "Gemini AI Coach",       body: "Google Gemini 2.5 Flash synthesises simulation results into plain-English tactical insights for each matchup." },
    { icon: "📊", title: "xG Modelling",          body: "Expected Goals calculated from average goal output across all simulated 90-minute matches." },
    { icon: "🏟️", title: "Formation Visualiser", body: "Interactive pitch with real squad data mapped to FIFA-style player cards with live formation control." },
  ]

  const techStack = [
    { label: "Data Layer",  chip: "Football API",          chipColor: "#818cf8", desc: "Live squad and player data pulled via a RESTful football data API. Player ratings feed directly into the simulation engine." },
    { label: "Backend",     chip: "Python / Flask",        chipColor: "#a855f7", desc: "Lightweight Flask server handles API routing, data processing, and orchestrates all simulation and AI logic." },
    { label: "Database",    chip: "AWS RDS (PostgreSQL)",  chipColor: "#c084fc", desc: "Match stats and player ratings are persisted in a managed PostgreSQL instance on Amazon RDS for historical querying and trend analysis." },
    { label: "Simulation",  chip: "Monte Carlo",           chipColor: "#e879f9", desc: "The win-probability engine runs 10,000 randomised match simulations using NumPy Poisson distributions and aggregates outcomes into final probabilities." },
    { label: "AI Layer",    chip: "Gemini 2.5 Flash",      chipColor: "#d946ef", desc: "Google's Gemini 2.5 Flash model synthesises simulation data, formations, and squad strengths into concise tactical coaching reports." },
    { label: "Hosting",     chip: "AWS Elastic Beanstalk", chipColor: "#a78bfa", desc: "The Flask backend is containerised with Docker and deployed to AWS Elastic Beanstalk with automated health checks, gunicorn workers, and zero-downtime deploys via GitHub Actions CI/CD." },
  ]

  return (
    <div style={{ width: "100%", maxWidth: "700px", display: "flex", flexDirection: "column", gap: "14px" }}>

      {/* Hero blurb */}
      <div>
        <h2 style={{ fontSize: "24px", fontWeight: "800", letterSpacing: "-0.03em", color: C.heading, margin: "0 0 10px 0", fontFamily: FONT }}>
          About PitchPulse AI
        </h2>
        <p style={{ fontSize: "13px", color: C.body, lineHeight: 1.75, margin: 0, fontFamily: FONT }}>
          A modern football analytics platform that simulates Premier League matches using statistical modelling and generative AI.
          Every percentage is backed by real squad data and thousands of simulated 90-minute matches — not gut feeling.
          The backend runs on AWS Elastic Beanstalk with a managed PostgreSQL database on Amazon RDS.
        </p>
      </div>

      {/* Feature pills */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {features.map(item => (
          <GlassCard key={item.title} style={{ padding: "16px 18px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "9px", flexShrink: 0,
              background: `linear-gradient(135deg, ${C.accentDeep}28, ${C.accent}28)`,
              border: `1px solid ${C.borderHover}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
            }}>{item.icon}</div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "700", color: C.heading, margin: "0 0 3px 0", fontFamily: FONT }}>{item.title}</p>
              <p style={{ fontSize: "11px", color: C.body, lineHeight: 1.6, margin: 0, fontFamily: FONT }}>{item.body}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Technical Deep Dive header */}
      <div style={{ marginTop: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "7px",
            background: `linear-gradient(135deg, ${C.accentDeep}30, ${C.accent}30)`,
            border: `1px solid ${C.borderHover}`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
          }}>🔬</div>
          <h3 style={{ fontSize: "16px", fontWeight: "800", letterSpacing: "-0.02em", color: C.heading, margin: 0, fontFamily: FONT }}>
            Technical Deep Dive
          </h3>
        </div>
      </div>

      {/* Data pipeline */}
      <GlassCard hover={false} style={{ padding: "20px 24px" }}>
        <p style={{ fontSize: "10px", fontWeight: "600", letterSpacing: "0.16em", textTransform: "uppercase", color: C.muted, margin: "0 0 16px 0", fontFamily: FONT }}>
          Data Pipeline
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <PipelineStep number="1" label="Football API"   color="#818cf8" />
          <Arrow />
          <PipelineStep number="2" label="Flask / AWS EB" color="#a855f7" />
          <Arrow />
          <PipelineStep number="3" label="AWS RDS"        color="#c084fc" />
          <Arrow />
          <PipelineStep number="4" label="Monte Carlo"    color="#e879f9" />
          <Arrow />
          <PipelineStep number="5" label="Gemini AI"      color="#d946ef" />
        </div>
      </GlassCard>

      {/* Stack breakdown */}
      <GlassCard hover={false} style={{ padding: "0" }}>
        {techStack.map((item, i) => (
          <motion.div
            key={item.label}
            whileHover={{ background: C.accentSoft }}
            style={{
              display: "flex",
              gap: "16px",
              padding: "18px 22px",
              borderBottom: i < techStack.length - 1 ? `1px solid ${C.border}` : "none",
              alignItems: "flex-start",
              borderRadius: i === 0 ? "16px 16px 0 0" : i === techStack.length - 1 ? "0 0 16px 16px" : "0",
              transition: "background 0.15s",
            }}
          >
            <div style={{ width: "78px", flexShrink: 0, paddingTop: "2px" }}>
              <span style={{ fontSize: "10px", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", color: C.muted, fontFamily: FONT }}>
                {item.label}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: "6px" }}>
                <Chip color={item.chipColor}>{item.chip}</Chip>
              </div>
              <p style={{ fontSize: "12.5px", color: C.body, lineHeight: 1.7, margin: 0, fontFamily: FONT }}>
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </GlassCard>

      {/* Cloud infrastructure */}
      <GlassCard hover={false} style={{ padding: "22px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: C.heading, margin: "0 0 12px 0", fontFamily: FONT }}>
          Cloud Infrastructure
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            { q: "AWS Elastic Beanstalk", a: "The Flask API is containerised via Docker and deployed on AWS Elastic Beanstalk's Docker platform. Gunicorn serves the app with 2 workers, and health checks run against /api/hello. GitHub Actions handles CI/CD — every push to main triggers an automated deploy." },
            { q: "Amazon RDS (PostgreSQL)", a: "Player ratings, team records, and match history live in a managed PostgreSQL instance on Amazon RDS. The schema is version-controlled with Flask-Migrate, and migrations run automatically on container start via flask db upgrade." },
            { q: "Google Gemini 2.5 Flash", a: "After each simulation, the backend sends match data and formations to Gemini 2.5 Flash. The model returns a structured coaching report covering tactical strengths, weaknesses, key players, and a strategic recommendation — all generated in seconds." },
            { q: "Monte Carlo Simulation", a: "The simulation engine uses NumPy's Poisson distribution to model goals for each team across 10,000 independent matches. Win, draw, and loss counts are aggregated into final probabilities, and average goals across runs become the xG figures." },
          ].map(({ q, a }) => (
            <motion.div
              key={q}
              whileHover={{ borderColor: C.borderHover, background: C.accentSoft }}
              transition={{ duration: 0.15 }}
              style={{
                background: "rgba(88,28,220,0.05)",
                border: `1px solid ${C.border}`,
                borderRadius: "10px",
                padding: "14px 16px",
                transition: "border-color 0.15s, background 0.15s",
              }}
            >
              <p style={{ fontSize: "12px", fontWeight: "700", color: C.accent, margin: "0 0 5px 0", fontFamily: FONT }}>{q}</p>
              <p style={{ fontSize: "12px", color: C.body, lineHeight: 1.72, margin: 0, fontFamily: FONT }}>{a}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  useReducedMotion()
  const [page, setPage]                   = useState("home")
  const [homeTeamId, setHomeTeamId]       = useState(null)
  const [awayTeamId, setAwayTeamId]       = useState(null)
  const [homeFormation, setHomeFormation] = useState("4-4-2")
  const [awayFormation, setAwayFormation] = useState("4-3-3")
  const [result, setResult]               = useState(null)
  const [insight, setInsight]             = useState(null)
  const [loading, setLoading]             = useState(false)
  const [aiLoading, setAiLoading]         = useState(false)
  const [homeTeamName, setHomeTeamName]   = useState("")
  const [awayTeamName, setAwayTeamName]   = useState("")
  const [homePlayers, setHomePlayers]     = useState([])
  const [awayPlayers, setAwayPlayers]     = useState([])

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
    setLoading(true); setAiLoading(true); setResult(null); setInsight(null)
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
      setLoading(false); setAiLoading(false)
    }
  }

  const canSimulate = homeTeamId && awayTeamId && !loading

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, position: "relative", overflow: "hidden" }}>

      {/* ── Background layers ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: [
          "radial-gradient(ellipse at 15% 0%, rgba(109,40,217,0.18) 0%, transparent 55%)",
          "radial-gradient(ellipse at 85% 10%, rgba(168,85,247,0.12) 0%, transparent 50%)",
          "radial-gradient(ellipse at 50% 90%, rgba(88,28,220,0.1) 0%, transparent 60%)",
          C.bg,
        ].join(", "),
      }} />
      <BGPattern
        variant="dots"
        mask="fade-edges"
        fill="rgba(168,85,247,0.12)"
        size={22}
        className="fixed"
        style={{ zIndex: 1 }}
      />

      {/* ── Nav ── */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 28px",
          background: C.navBg,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <motion.div
            whileHover={{ scale: 1.1, boxShadow: `0 0 24px ${C.accentGlow}` }}
            transition={{ type: "spring", stiffness: 400 }}
            style={{
              width: "34px", height: "34px", borderRadius: "9px",
              background: C.gradLogo,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px",
              boxShadow: `0 0 18px rgba(124,58,237,0.5)`,
              cursor: "default",
            }}
          >⚽</motion.div>
          <span style={{ fontSize: "16px", fontWeight: "800", letterSpacing: "-0.03em", color: C.heading, fontFamily: FONT }}>
            PitchPulse{" "}
            <span style={{ background: C.gradLogo, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              AI
            </span>
          </span>
        </div>

        <div style={{ display: "flex", gap: "4px" }}>
          {["home", "about"].map(p => (
            <motion.button
              key={p}
              onClick={() => setPage(p)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              style={{
                padding: "7px 16px", borderRadius: "8px", border: "1px solid",
                cursor: "pointer", fontSize: "12px", fontWeight: "600", fontFamily: FONT,
                letterSpacing: "0.02em", textTransform: "capitalize",
                background: page === p ? C.accentSoft : "rgba(255,255,255,0)",
                color: page === p ? C.accent : C.muted,
                borderColor: page === p ? C.borderHover : "rgba(255,255,255,0)",
                transition: "all 0.2s",
              }}
            >
              {p === "home" ? "Dashboard" : "About"}
            </motion.button>
          ))}
        </div>
      </motion.nav>

      {/* ── Page content ── */}
      <div style={{ position: "relative", zIndex: 2, padding: "88px 24px 60px" }}>
        <AnimatePresence mode="wait" initial={false}>
          {page === "about" ? (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.15, ease: "easeIn" } }}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <AboutPage />
            </motion.div>
          ) : (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.15, ease: "easeIn" } }}
              style={{ width: "100%", maxWidth: "1280px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}
            >
              {/* Header */}
              <div style={{ textAlign: "center" }}>
                <h1 style={{
                  fontSize: "clamp(26px, 4vw, 40px)", fontWeight: "800", letterSpacing: "-0.04em",
                  background: C.gradTitle,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  margin: "0 0 6px 0", fontFamily: FONT,
                }}>
                  Premier League Predictor
                </h1>
                <p style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, margin: 0, fontFamily: FONT }}>
                  Powered by Monte Carlo Simulation &amp; Gemini AI
                </p>
              </div>

              {/* Two-column layout */}
              <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 420px) 1fr", gap: "20px", alignItems: "start" }}>

                {/* LEFT */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                  {/* Team selector card */}
                  <GlassCard hover={false} style={{ padding: "20px" }}>
                    <p style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted, margin: "0 0 14px 0", fontFamily: FONT }}>
                      Select Teams
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <TeamSelector label="Home Team" onSelect={handleHomeTeamSelect} />
                      <TeamSelector label="Away Team" onSelect={handleAwayTeamSelect} />
                    </div>

                    {/* Simulate button */}
                    <motion.button
                      onClick={handleSimulate}
                      disabled={!canSimulate}
                      whileHover={canSimulate ? {
                        scale: 1.03,
                        boxShadow: `0 0 44px ${C.accentGlow}, 0 8px 24px rgba(0,0,0,0.5)`,
                      } : {}}
                      whileTap={canSimulate ? { scale: 0.97 } : {}}
                      style={{
                        width: "100%",
                        marginTop: "16px",
                        padding: "13px 0", borderRadius: "10px", border: "none",
                        cursor: canSimulate ? "pointer" : "not-allowed",
                        fontSize: "13px", fontWeight: "700", fontFamily: FONT,
                        letterSpacing: "0.03em", color: "#fff",
                        background: canSimulate ? C.gradBtn : "rgba(255,255,255,0.05)",
                        opacity: canSimulate ? 1 : 0.4,
                        boxShadow: canSimulate
                          ? `0 0 24px rgba(124,58,237,0.35), 0 4px 14px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)`
                          : "none",
                        transition: "background 0.2s, opacity 0.2s",
                      }}
                    >
                      {loading ? (
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                            style={{ display: "inline-block" }}
                          >⚽</motion.span>
                          Simulating...
                        </span>
                      ) : "Run Simulation ⚡"}
                    </motion.button>
                  </GlassCard>

                  {/* Win probability */}
                  <AnimatePresence>
                    {result && (
                      <motion.div key="winprob" variants={fadeUp} initial="hidden" animate="show" exit="exit">
                        <WinProbability result={result} homeTeam={homeTeamName} awayTeam={awayTeamName} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* AI Coach */}
                  <AnimatePresence>
                    {(insight || aiLoading) && (
                      <motion.div key="aicoach" variants={fadeUp} initial="hidden" animate="show" exit="exit">
                        <AICoach insight={insight} loading={aiLoading} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* RIGHT: Pitch sticky */}
                <div style={{ position: "sticky", top: "100px" }}>
                  <SoccerPitch
                    homeColor="#a855f7"
                    awayColor="#e879f9"
                    homePlayers={homePlayers}
                    awayPlayers={awayPlayers}
                    onFormationChange={(home, away) => { setHomeFormation(home); setAwayFormation(away) }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Analytics />
    </div>
  )
}
