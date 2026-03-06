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

// ── About page ─────────────────────────────────────────────────────────────
function AboutPage() {
  const items = [
    { icon: "⚡", title: "Monte Carlo Engine", body: "10,000+ match simulations per prediction using real player rating distributions." },
    { icon: "🧠", title: "AI Coach Insights", body: "Claude-powered tactical analysis tailored to formations, strengths, and weaknesses." },
    { icon: "📊", title: "xG Modelling", body: "Expected Goals calculated from historical shot data and positional ratings." },
    { icon: "🏟️", title: "Formation Visualiser", body: "Interactive pitch with real squad data mapped to FIFA-style player cards." },
  ]

  return (
    <motion.div
      key="about"
      variants={stagger}
      initial="hidden"
      animate="show"
      exit="exit"
      style={{ width: "100%", maxWidth: "640px", display: "flex", flexDirection: "column", gap: "16px" }}
    >
      <motion.h2
        variants={fadeUp}
        style={{ fontSize: "22px", fontWeight: "800", letterSpacing: "-0.03em", color: "#f1f5f9", margin: 0 }}
      >
        About PitchPulse AI
      </motion.h2>
      <motion.p variants={fadeUp} style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.7, margin: 0 }}>
        A modern football analytics platform that simulates Premier League matches using statistical modelling and generative AI.
      </motion.p>

      {items.map(item => (
        <motion.div
          key={item.title}
          variants={fadeUp}
          whileHover={{ scale: 1.02, boxShadow: "0 0 28px rgba(139,92,246,0.18), 0 8px 32px rgba(0,0,0,0.4)" }}
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "20px",
            display: "flex",
            gap: "16px",
            alignItems: "flex-start",
            cursor: "default",
            transition: "border-color 0.2s",
          }}
          onHoverStart={e => e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)"}
          onHoverEnd={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
        >
          <div style={{
            width: "38px", height: "38px", borderRadius: "10px", flexShrink: 0,
            background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))",
            border: "1px solid rgba(139,92,246,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
          }}>
            {item.icon}
          </div>
          <div>
            <p style={{ fontSize: "14px", fontWeight: "700", color: "#e2e8f0", margin: "0 0 4px 0" }}>{item.title}</p>
            <p style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.65, margin: 0 }}>{item.body}</p>
          </div>
        </motion.div>
      ))}
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
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>

      {/* ── Nav ── */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%",
          padding: "16px 24px",
          background: "rgba(15,23,42,0.8)",
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
                fontSize: "12px", fontWeight: "600", fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.02em", textTransform: "capitalize",
                background: page === p ? "rgba(139,92,246,0.18)" : "transparent",
                color: page === p ? "#a78bfa" : "#64748b",
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

      {/* ── Page content ── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px 80px" }}>
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
              <p style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.18em", textTransform: "uppercase", color: "#334155", margin: 0 }}>
                Powered by Monte Carlo Simulation
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
                  fontSize: "14px", fontWeight: "700", fontFamily: "'Inter', sans-serif",
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
