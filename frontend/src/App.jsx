import { useState } from "react"
import { Analytics } from '@vercel/analytics/react'
import { motion, AnimatePresence } from "framer-motion"
import client from "./api/client"
import TeamSelector from "./components/ui/TeamSelector"
import WinProbability from "./components/ui/WinProbability"
import AICoach from "./components/ui/AICoach"
import SoccerPitch from "./components/pitch/SoccerPitch"

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  bgBase:       "#080808",
  bgSurface:    "#0d0d0d",
  border:       "#1e1a12",
  borderDim:    "#141210",
  gold:         "#c9a84c",
  goldDim:      "#8a7a52",
  goldGhost:    "#3d3520",
  goldWhisper:  "#2e2814",
  textPrimary:  "#f0ead6",
  textSecondary:"#8a7a52",
  textMuted:    "#3d3520",
  MONO:         "'DM Mono', 'Courier New', monospace",
  SERIF:        "'Playfair Display', Georgia, serif",
}

// ── Flat card ─────────────────────────────────────────────────────────────────
function FlatCard({ children, style = {} }) {
  return (
    <div style={{
      background: T.bgSurface,
      border: `0.5px solid ${T.border}`,
      borderRadius: "2px",
      ...style,
    }}>
      {children}
    </div>
  )
}

// ── Eyebrow label ─────────────────────────────────────────────────────────────
function Eyebrow({ children }) {
  return (
    <p style={{
      fontFamily: T.MONO, fontSize: "8px", fontWeight: "400",
      letterSpacing: "0.25em", textTransform: "uppercase",
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
      border: "none", borderTop: `0.5px solid ${T.borderDim}`,
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
    <div style={{ width: "100%", maxWidth: "680px", display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Hero */}
      <div style={{ paddingBottom: "4px" }}>
        <h2 style={{ fontFamily: T.SERIF, fontSize: "24px", fontWeight: "300", letterSpacing: "0.04em", color: T.textPrimary, margin: "0 0 10px 0" }}>
          About PitchPulse AI
        </h2>
        <p style={{ fontFamily: T.MONO, fontSize: "12px", color: T.textSecondary, lineHeight: 1.8, margin: 0 }}>
          A modern football analytics platform that simulates Premier League matches using statistical modelling and generative AI.
          Every percentage is backed by real squad data and thousands of simulated 90-minute matches.
        </p>
      </div>

      {/* Features grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {features.map(item => (
          <FlatCard key={item.title} style={{ padding: "14px 16px" }}>
            <p style={{ fontFamily: T.MONO, fontSize: "9px", fontWeight: "400", letterSpacing: "0.16em", textTransform: "uppercase", color: T.gold, margin: "0 0 6px 0" }}>
              {item.title}
            </p>
            <p style={{ fontFamily: T.MONO, fontSize: "11px", color: T.textSecondary, lineHeight: 1.7, margin: 0 }}>
              {item.body}
            </p>
          </FlatCard>
        ))}
      </div>

      {/* Technical deep dive */}
      <div style={{ marginTop: "8px" }}>
        <p style={{ fontFamily: T.MONO, fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: T.textMuted, margin: "0 0 10px 0" }}>
          Technical Stack
        </p>
      </div>

      <FlatCard>
        {techStack.map((item, i) => (
          <div
            key={item.label}
            style={{
              display: "flex", gap: "16px", padding: "14px 20px",
              borderBottom: i < techStack.length - 1 ? `0.5px solid ${T.borderDim}` : "none",
              alignItems: "flex-start",
            }}
          >
            <div style={{ width: "70px", flexShrink: 0, paddingTop: "1px" }}>
              <span style={{ fontFamily: T.MONO, fontSize: "8px", letterSpacing: "0.14em", textTransform: "uppercase", color: T.textMuted }}>
                {item.label}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontFamily: T.MONO, fontSize: "10px", color: T.gold, display: "block", marginBottom: "5px" }}>
                {item.chip}
              </span>
              <p style={{ fontFamily: T.MONO, fontSize: "11px", color: T.textSecondary, lineHeight: 1.7, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </FlatCard>

      {/* Cloud infrastructure */}
      <div style={{ marginTop: "4px" }}>
        <p style={{ fontFamily: T.MONO, fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: T.textMuted, margin: "0 0 10px 0" }}>
          Cloud Infrastructure
        </p>
      </div>

      <FlatCard>
        {infra.map(({ q, a }, i) => (
          <div
            key={q}
            style={{
              padding: "14px 20px",
              borderBottom: i < infra.length - 1 ? `0.5px solid ${T.borderDim}` : "none",
            }}
          >
            <p style={{ fontFamily: T.MONO, fontSize: "10px", color: T.gold, margin: "0 0 5px 0" }}>{q}</p>
            <p style={{ fontFamily: T.MONO, fontSize: "11px", color: T.textSecondary, lineHeight: 1.75, margin: 0 }}>{a}</p>
          </div>
        ))}
      </FlatCard>
    </div>
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

  return (
    <div style={{ minHeight: "100vh", background: T.bgBase, fontFamily: T.MONO }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
        height: "44px", display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 24px",
        background: T.bgBase, borderBottom: `0.5px solid ${T.border}`,
      }}>
        <span style={{ fontFamily: T.SERIF, fontSize: "13px", fontWeight: "400", letterSpacing: "0.06em", color: T.gold }}>
          PitchPulse AI
        </span>

        <div style={{ display: "flex", gap: "24px" }}>
          {["home", "about"].map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                background: "none", border: "none", padding: 0, cursor: "pointer",
                fontFamily: T.MONO, fontSize: "9px", fontWeight: "400",
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: page === p ? T.gold : T.goldGhost,
                transition: "color 0.15s",
              }}
            >
              {p === "home" ? "Dashboard" : "About"}
            </button>
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
            style={{ marginTop: "44px", padding: "40px 24px 60px", display: "flex", justifyContent: "center" }}
          >
            <AboutPage />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.25 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            style={{
              display: "grid",
              gridTemplateColumns: "260px 1fr",
              height: "calc(100vh - 44px)",
              marginTop: "44px",
            }}
          >
            {/* ── Sidebar ── */}
            <aside style={{
              background: T.bgBase,
              borderRight: `0.5px solid ${T.border}`,
              padding: "24px 20px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "0",
            }}>
              <Eyebrow>Select Teams</Eyebrow>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <TeamSelector label="Home Team" onSelect={handleHomeTeamSelect} />
                <TeamSelector label="Away Team" onSelect={handleAwayTeamSelect} />
              </div>

              <button
                onClick={handleSimulate}
                disabled={!canSimulate}
                style={{
                  width: "100%", marginTop: "12px",
                  background: canSimulate ? T.gold : T.goldWhisper,
                  color: canSimulate ? "#080808" : T.goldGhost,
                  fontFamily: T.MONO, fontSize: "9px", fontWeight: "400",
                  letterSpacing: "0.22em", textTransform: "uppercase",
                  padding: "10px 16px", border: "none", borderRadius: "2px",
                  cursor: canSimulate ? "pointer" : "not-allowed",
                  transition: "background 0.15s",
                }}
              >
                {loading ? "Running..." : "Run Simulation"}
              </button>

              <Divider style={{ margin: "20px 0 16px" }} />

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
