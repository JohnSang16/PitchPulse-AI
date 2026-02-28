import { useState } from "react"
import client from "./api/client"
import TeamSelector from "./components/ui/TeamSelector"
import WinProbability from "./components/ui/WinProbability"

export default function App() {
  const [homeTeamId, setHomeTeamId] = useState(null)
  const [awayTeamId, setAwayTeamId] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [homeTeamName, setHomeTeamName] = useState("")
  const [awayTeamName, setAwayTeamName] = useState("")

  const handleSimulate = async () => {
    if (!homeTeamId || !awayTeamId) return
    if (homeTeamId === awayTeamId) return alert("Please select two different teams!")

    setLoading(true)
    setResult(null)

    try {
      const res = await client.post("/simulate", {
        home_team_id: homeTeamId,
        away_team_id: awayTeamId
      })
      setResult(res.data)
      setHomeTeamName(res.data.home_team)
      setAwayTeamName(res.data.away_team)
    } catch (err) {
      console.error("Simulation failed", err)
    } finally {
      setLoading(false)
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
    </div>
  )
}