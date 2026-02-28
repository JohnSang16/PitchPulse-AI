import { useEffect, useState } from "react"

export default function App() {
  const [status, setStatus] = useState("Connecting...")

  useEffect(() => {
    fetch("http://localhost:5001/api/hello")
      .then(res => res.json())
      .then(data => setStatus(data.message))
      .catch(() => setStatus("❌ Backend unreachable"))
  }, [])

  return (
    <div className="min-h-screen bg-green-800 flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-white">⚽ PitchPulse AI</h1>
      <p className="text-green-200 text-xl">{status}</p>
    </div>
  )
}