import { useState } from "react"
import client from "./api/client"
import TeamSelector from "./components/ui/TeamSelector"
import WinProbability from "./components/ui/WinProbability"
import AICoach from "./components/ui/AICoach"
import SoccerPitch from "./components/pitch/SoccerPitch"

export default function App() {
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
      const simRes = await client.post("/simulate", {
        home_team_id: homeTeamId,
        away_team_id: awayTeamId
      })
      setResult(simRes.data)
      setHomeTeamName(simRes.data.home_team)
      setAwayTeamName(simRes.data.away_team)
      setLoading(false)

      const coachRes = await client.post("/coach", {
        home_team_id: homeTeamId,
        away_team_id: awayTeamId,
        home_formation: homeFormation,
        away_formation: awayFormation
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
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 20% 0%, rgba(56, 189, 248, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 0%, rgba(139, 92, 246, 0.06) 0%, transparent 50%), #0f172a",
        fontFamily: "'Inter', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 24px 80px",
        gap: "32px",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)",
          }}>
            ⚽
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: "800",
            letterSpacing: "-0.03em",
            background: "linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            margin: 0,
          }}>
            PitchPulse AI
          </h1>
        </div>
        <p style={{
          fontSize: "11px",
          fontWeight: "600",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#475569",
          margin: 0,
        }}>
          Premier League Match Predictor
        </p>
      </div>

      {/* Team Selectors */}
      <div style={{ display: "flex", gap: "16px", width: "100%", maxWidth: "520px" }}>
        <div style={{ flex: 1 }}>
          <TeamSelector label="Home Team" onSelect={handleHomeTeamSelect} />
        </div>
        <div style={{ flex: 1 }}>
          <TeamSelector label="Away Team" onSelect={handleAwayTeamSelect} />
        </div>
      </div>

      {/* Run Simulation Button */}
      <button
        onClick={handleSimulate}
        disabled={!canSimulate}
        style={{
          padding: "14px 36px",
          borderRadius: "100px",
          border: "none",
          cursor: canSimulate ? "pointer" : "not-allowed",
          fontSize: "14px",
          fontWeight: "700",
          fontFamily: "'Inter', sans-serif",
          letterSpacing: "0.02em",
          color: "#ffffff",
          background: canSimulate
            ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
            : "rgba(255,255,255,0.06)",
          opacity: canSimulate ? 1 : 0.5,
          boxShadow: canSimulate
            ? "0 0 24px rgba(139, 92, 246, 0.35), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)"
            : "none",
          transition: "box-shadow 0.25s ease, transform 0.15s ease, opacity 0.2s ease",
          transform: "translateY(0)",
        }}
        onMouseEnter={e => {
          if (canSimulate) {
            e.currentTarget.style.boxShadow = "0 0 40px rgba(139, 92, 246, 0.6), 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)"
            e.currentTarget.style.transform = "translateY(-1px)"
          }
        }}
        onMouseLeave={e => {
          if (canSimulate) {
            e.currentTarget.style.boxShadow = "0 0 24px rgba(139, 92, 246, 0.35), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)"
            e.currentTarget.style.transform = "translateY(0)"
          }
        }}
        onMouseDown={e => {
          if (canSimulate) e.currentTarget.style.transform = "translateY(1px)"
        }}
        onMouseUp={e => {
          if (canSimulate) e.currentTarget.style.transform = "translateY(-1px)"
        }}
      >
        {loading ? "Simulating..." : "Run Simulation ⚡"}
      </button>

      <WinProbability
        result={result}
        homeTeam={homeTeamName}
        awayTeam={awayTeamName}
      />

      <AICoach insight={insight} loading={aiLoading} />

      <SoccerPitch
        homeColor="#3b82f6"
        awayColor="#ef4444"
        homePlayers={homePlayers}
        awayPlayers={awayPlayers}
        onFormationChange={(home, away) => {
          setHomeFormation(home)
          setAwayFormation(away)
        }}
      />
    </div>
  )
}
