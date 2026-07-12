import { useState, useEffect } from "react"
import { Analytics } from '@vercel/analytics/react'
import { motion, AnimatePresence } from "framer-motion"
import client from "./api/client"
import TeamSelector from "./components/ui/TeamSelector"
import WinProbability from "./components/ui/WinProbability"
import AICoach from "./components/ui/AICoach"
import SoccerPitch from "./components/pitch/SoccerPitch"

// ── Design tokens: "Floodlight" ───────────────────────────────────────────────
const T = {
  bgBase:       "#05070d",
  bgSurface:    "#0b101c",
  bgRaised:     "#121a2b",
  border:       "#1b2436",
  borderDim:    "#131b2b",
  gold:         "#d4b56a",
  goldBright:   "#e2c98b",
  goldDim:      "rgba(212,181,106,0.55)",
  red:         "#cd8272",
  textPrimary:  "#edf2fa",
  textSecondary:"#94a3bd",
  textMuted:    "#566179",
  UI:           "'Inter', -apple-system, sans-serif",
  DISPLAY:      "'Space Grotesk', 'Inter', sans-serif",
  MONO:         "'JetBrains Mono', 'Courier New', monospace",
}

// ── Card ──────────────────────────────────────────────────────────────────────
function Card({ children, style = {}, hoverable = false }) {
  return (
    <motion.div
      whileHover={hoverable ? { borderColor: "rgba(212,181,106,0.45)", backgroundColor: T.bgRaised, y: -3 } : {}}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{
        backgroundColor: T.bgSurface,
        border: `1px solid ${T.border}`,
        borderRadius: "12px",
        ...style,
      }}
    >
      {children}
    </motion.div>
  )
}

// ── Eyebrow label ─────────────────────────────────────────────────────────────
function Eyebrow({ children }) {
  return (
    <p style={{
      fontFamily: T.MONO, fontSize: "11px", fontWeight: "500",
      letterSpacing: "0.16em", textTransform: "uppercase",
      color: T.textMuted, margin: "0 0 14px 0",
    }}>
      {children}
    </p>
  )
}

// ── Divider ───────────────────────────────────────────────────────────────────
function Divider({ style = {} }) {
  return (
    <hr style={{
      border: "none", borderTop: `1px solid ${T.borderDim}`,
      margin: "4px 0 16px", ...style,
    }} />
  )
}

// ── About page ────────────────────────────────────────────────────────────────
function AboutPage() {
  const features = [
    { title: "Monte Carlo Engine",    body: "10,000+ match simulations per prediction using real player rating distributions and Poisson goal models." },
    { title: "Gemini AI Coach",       body: "Google Gemini 2.5 Flash synthesises simulation results into plain-English tactical insights for each matchup." },
    { title: "xG Modelling",          body: "Expected Goals calculated from average goal output across all simulated 90-minute matches." },
    { title: "Formation Visualiser",  body: "Interactive pitch with real squad data mapped to player cards with live formation control." },
  ]

  const techStack = [
    { label: "Data",       chip: "Football API",          desc: "Live squad and player data pulled via a RESTful football data API. Player ratings feed directly into the simulation engine." },
    { label: "Backend",    chip: "Python / Flask",        desc: "Lightweight Flask server handles API routing, data processing, and orchestrates all simulation and AI logic." },
    { label: "Database",   chip: "AWS RDS (PostgreSQL)",  desc: "Match stats and player ratings are persisted in a managed PostgreSQL instance on Amazon RDS." },
    { label: "Simulation", chip: "Monte Carlo",           desc: "10,000 randomised match simulations using NumPy Poisson distributions, aggregated into final probabilities." },
    { label: "AI",         chip: "Gemini 2.5 Flash",      desc: "Synthesises simulation data, formations, and squad strengths into concise tactical coaching reports." },
    { label: "Hosting",    chip: "AWS Elastic Beanstalk", desc: "Flask backend containerised with Docker, deployed to AWS EB with gunicorn workers and GitHub Actions CI/CD." },
  ]

  const infra = [
    { q: "AWS Elastic Beanstalk", a: "The Flask API is containerised via Docker and deployed on AWS EB's Docker platform. Gunicorn serves with 2 workers; health checks run against /api/hello. Every push to main triggers an automated deploy." },
    { q: "Amazon RDS (PostgreSQL)", a: "Player ratings, team records, and match history live in a managed PostgreSQL instance. Schema is version-controlled with Flask-Migrate; migrations run automatically on container start." },
    { q: "Google Gemini 2.5 Flash", a: "After each simulation, match data and formations are sent to Gemini 2.5 Flash. The model returns a structured coaching report covering tactical strengths, key players, and a strategic recommendation." },
    { q: "Monte Carlo Simulation", a: "Uses NumPy's Poisson distribution to model goals across 10,000 independent matches. Win, draw, and loss counts aggregate into final probabilities; average goals become the xG figures." },
  ]

  return (
    <div style={{ width: "100%", maxWidth: "820px", display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Hero */}
      <div style={{ paddingBottom: "6px" }}>
        <h2 style={{ fontFamily: T.DISPLAY, fontSize: "32px", fontWeight: "600", letterSpacing: "-0.02em", color: T.textPrimary, margin: "0 0 12px 0" }}>
          About <span style={{ color: T.gold }}>PitchPulse AI</span>
        </h2>
        <p style={{ fontFamily: T.UI, fontSize: "15px", color: T.textSecondary, lineHeight: 1.75, margin: 0 }}>
          A modern football analytics platform that simulates Premier League matches using statistical modelling and generative AI.
          Every percentage is backed by real squad data and thousands of simulated 90-minute matches.
        </p>
      </div>

      {/* Features grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
        {features.map(item => (
          <Card key={item.title} hoverable style={{ padding: "20px 22px" }}>
            <p style={{ fontFamily: T.DISPLAY, fontSize: "15px", fontWeight: "600", color: T.textPrimary, margin: "0 0 8px 0" }}>
              {item.title}
            </p>
            <p style={{ fontFamily: T.UI, fontSize: "13.5px", color: T.textSecondary, lineHeight: 1.7, margin: 0 }}>
              {item.body}
            </p>
          </Card>
        ))}
      </div>

      {/* Technical deep dive */}
      <div style={{ marginTop: "10px" }}>
        <Eyebrow>Technical Stack</Eyebrow>
      </div>

      <Card style={{ overflow: "hidden", marginTop: "-10px" }}>
        {techStack.map((item, i) => (
          <motion.div
            key={item.label}
            whileHover={{ backgroundColor: T.bgRaised }}
            transition={{ duration: 0.15 }}
            style={{
              display: "flex", gap: "20px", padding: "16px 22px",
              borderBottom: i < techStack.length - 1 ? `1px solid ${T.borderDim}` : "none",
              alignItems: "flex-start",
              cursor: "default",
            }}
          >
            <div style={{ width: "88px", flexShrink: 0, paddingTop: "3px" }}>
              <span style={{ fontFamily: T.MONO, fontSize: "10px", fontWeight: "500", letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted }}>
                {item.label}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontFamily: T.DISPLAY, fontSize: "14px", fontWeight: "600", color: T.gold, display: "block", marginBottom: "5px" }}>
                {item.chip}
              </span>
              <p style={{ fontFamily: T.UI, fontSize: "13.5px", color: T.textSecondary, lineHeight: 1.7, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </Card>

      {/* Cloud infrastructure */}
      <div style={{ marginTop: "6px" }}>
        <Eyebrow>Cloud Infrastructure</Eyebrow>
      </div>

      <Card style={{ overflow: "hidden", marginTop: "-10px" }}>
        {infra.map(({ q, a }, i) => (
          <motion.div
            key={q}
            whileHover={{ backgroundColor: T.bgRaised }}
            transition={{ duration: 0.15 }}
            style={{
              padding: "16px 22px",
              borderBottom: i < infra.length - 1 ? `1px solid ${T.borderDim}` : "none",
              cursor: "default",
            }}
          >
            <p style={{ fontFamily: T.DISPLAY, fontSize: "14px", fontWeight: "600", color: T.textPrimary, margin: "0 0 6px 0" }}>{q}</p>
            <p style={{ fontFamily: T.UI, fontSize: "13.5px", color: T.textSecondary, lineHeight: 1.75, margin: 0 }}>{a}</p>
          </motion.div>
        ))}
      </Card>
    </div>
  )
}

// ── Mobile detection ─────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])
  return isMobile
}

// ── Simulate button ───────────────────────────────────────────────────────────
function SimulateButton({ onClick, disabled, loading, style = {} }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.015, boxShadow: "0 0 24px rgba(212,181,106,0.22)" } : {}}
      whileTap={!disabled ? { scale: 0.985 } : {}}
      transition={{ duration: 0.15 }}
      style={{
        width: "100%",
        background: disabled ? "#1a2233" : T.gold,
        color: disabled ? T.textMuted : "#171207",
        fontFamily: T.DISPLAY, fontSize: "13px", fontWeight: "700",
        letterSpacing: "0.08em", textTransform: "uppercase",
        padding: "14px 16px", border: "none", borderRadius: "10px",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : "0 0 16px rgba(212,181,106,0.10)",
        transition: "background 0.15s",
        ...style,
      }}
    >
      {loading ? "Simulating…" : "Run Simulation"}
    </motion.button>
  )
}

// ── Brand mark ────────────────────────────────────────────────────────────────
function Brand({ compact = false }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
      <span style={{
        color: T.gold, fontSize: compact ? "12px" : "14px", lineHeight: 1,
        textShadow: "0 0 10px rgba(212,181,106,0.45)",
        animation: "pulse-dot 2.4s ease-in-out infinite",
      }}>★</span>
      <span style={{ fontFamily: T.DISPLAY, fontSize: compact ? "16px" : "18px", fontWeight: "700", letterSpacing: "-0.01em", color: T.textPrimary }}>
        PitchPulse<span style={{ color: T.gold }}> AI</span>
      </span>
    </span>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
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
    if (homeTeamId === awayTeamId) return alert("Please select two different teams.")
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
  const isMobile = useIsMobile()

  return (
    <div style={{
      height: isMobile ? "auto" : "100vh",
      minHeight: "100vh",
      overflow: isMobile ? "visible" : "hidden",
      background: T.bgBase, fontFamily: T.UI,
    }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
        height: "60px", display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: isMobile ? "0 16px" : "0 24px",
        background: "rgba(5,7,13,0.85)", backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${T.border}`,
      }}>
        <Brand compact={isMobile} />

        <div style={{ display: "flex", gap: "6px" }}>
          {["home", "about"].map(p => (
            <motion.button
              key={p}
              onClick={() => setPage(p)}
              whileHover={{ color: T.textPrimary }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.12 }}
              style={{
                background: page === p ? T.bgRaised : "none",
                border: page === p ? `1px solid ${T.border}` : "1px solid transparent",
                padding: "7px 14px", borderRadius: "8px", cursor: "pointer",
                fontFamily: T.UI, fontSize: "13px", fontWeight: "500",
                color: page === p ? T.textPrimary : T.textMuted,
              }}
            >
              {p === "home" ? "Dashboard" : "About"}
            </motion.button>
          ))}
        </div>
      </nav>

      {/* ── Body ── */}
      <AnimatePresence mode="sync" initial={false}>
        {page === "about" ? (
          <motion.div
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.25 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            style={{
              marginTop: "60px",
              height: isMobile ? "auto" : "calc(100vh - 60px)",
              overflowY: "auto",
              padding: isMobile ? "24px 16px 48px" : "44px 24px 64px",
              display: "flex", justifyContent: "center", alignItems: "flex-start",
            }}
          >
            <AboutPage />
          </motion.div>

        ) : isMobile ? (
          /* ── Mobile dashboard ── */
          <motion.div
            key="home-mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.25 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            style={{ marginTop: "60px", padding: "20px 16px 40px", display: "flex", flexDirection: "column", gap: "18px" }}
          >
            {/* Team selectors */}
            <div>
              <Eyebrow>Matchup</Eyebrow>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                <TeamSelector label="Home" accent={T.gold} onSelect={handleHomeTeamSelect} />
                <TeamSelector label="Away" accent={T.red} onSelect={handleAwayTeamSelect} />
              </div>
              <SimulateButton onClick={handleSimulate} disabled={!canSimulate} loading={loading} />
            </div>

            {/* Pitch */}
            <div style={{ border: `1px solid ${T.border}`, borderRadius: "14px", overflow: "hidden" }}>
              <SoccerPitch
                homePlayers={homePlayers}
                awayPlayers={awayPlayers}
                onFormationChange={(home, away) => { setHomeFormation(home); setAwayFormation(away) }}
              />
            </div>

            {/* Stats */}
            <WinProbability result={result} homeTeam={homeTeamName} awayTeam={awayTeamName} isMobile />

            {/* AI Coach */}
            <AnimatePresence>
              {(insight || aiLoading) && (
                <motion.div
                  key="aicoach-mobile"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Divider style={{ margin: "0 0 16px" }} />
                  <AICoach insight={insight} loading={aiLoading} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        ) : (
          /* ── Desktop dashboard ── */
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.25 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            style={{
              display: "grid",
              gridTemplateColumns: "360px 1fr",
              height: "calc(100vh - 60px)",
              maxHeight: "calc(100vh - 60px)",
              marginTop: "60px",
              overflow: "hidden",
            }}
          >
            {/* ── Sidebar ── */}
            <aside style={{
              background: T.bgBase,
              borderRight: `1px solid ${T.border}`,
              padding: "26px 22px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "0",
            }}>
              <Eyebrow>Matchup</Eyebrow>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <TeamSelector label="Home Team" accent={T.gold} onSelect={handleHomeTeamSelect} />
                <TeamSelector label="Away Team" accent={T.red} onSelect={handleAwayTeamSelect} />
              </div>

              <SimulateButton onClick={handleSimulate} disabled={!canSimulate} loading={loading} style={{ marginTop: "16px" }} />

              <Divider style={{ margin: "22px 0 18px" }} />

              <AnimatePresence>
                {(insight || aiLoading) && (
                  <motion.div
                    key="aicoach"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AICoach insight={insight} loading={aiLoading} />
                  </motion.div>
                )}
              </AnimatePresence>
            </aside>

            {/* ── Main ── */}
            <main style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ flex: 1, overflowY: "auto" }}>
                <SoccerPitch
                  homePlayers={homePlayers}
                  awayPlayers={awayPlayers}
                  onFormationChange={(home, away) => { setHomeFormation(home); setAwayFormation(away) }}
                />
              </div>
              <WinProbability result={result} homeTeam={homeTeamName} awayTeam={awayTeamName} />
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      <Analytics />
    </div>
  )
}
