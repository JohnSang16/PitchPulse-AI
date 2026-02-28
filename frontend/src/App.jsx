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

  const handleSimulate = async () => {
    if (!homeTeamId || !awayTeamId) return
    if (homeTeamId === awayTeamId) return alert("Please select two different teams!")

    setLoading(true)
    setAiLoading(true)
    setResult(null)
    setInsight(null)

    try {
      // Run simulation first
      const simRes = await client.post("/simulate", {
        home_team_id: homeTeamId,
        away_team_id: awayTeamId
      })
      setResult(simRes.data)
      setHomeTeamName(simRes.data.home_team)
      setAwayTeamName(simRes.data.away_team)
      setLoading(false)

      // Then get AI coaching insight
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

  return (
    <div className="min-h-screen bg-green-950 flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-5xl font-bold text-white">⚽ PitchPulse AI</h1>
      <p className="text-green-400 text-sm uppercase tracking-widest">
        Premier League Match Predictor
      </p>

      <div className="flex gap-8 w-full max-w-lg">
        <div className="flex-1">
          <TeamSelector label="Home Team" onSelect={setHomeTeamId} />
        </div>
        <div className="flex-1">
          <TeamSelector label="Away Team" onSelect={setAwayTeamId} />
        </div>
      </div>

      <button
        onClick={handleSimulate}
        disabled={!homeTeamId || !awayTeamId || loading}
        className="bg-green-500 hover:bg-green-400 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-full transition-all duration-200"
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
        onFormationChange={(home, away) => {
          setHomeFormation(home)
          setAwayFormation(away)
        }}
      />
    </div>
  )
}