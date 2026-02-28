import { useEffect, useState } from "react"
import client from "../../api/client"

export default function TeamSelector({ label, onSelect }) {
  const [teams, setTeams] = useState([])

  useEffect(() => {
    client.get("/teams")
      .then(res => setTeams(res.data))
      .catch(err => console.error("Failed to fetch teams", err))
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <label className="text-green-300 font-semibold text-sm uppercase tracking-widest">
        {label}
      </label>
      <select
        onChange={e => onSelect(Number(e.target.value))}
        className="bg-green-900 text-white border border-green-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        <option value="">Select a team...</option>
        {teams.map(team => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
    </div>
  )
}