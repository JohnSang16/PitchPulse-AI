export default function AICoach({ insight, loading }) {
  if (loading) {
    return (
      <div className="w-full max-w-2xl bg-green-900 border border-green-600 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className="animate-spin text-2xl">⚽</div>
          <p className="text-green-300">AI Coach is analyzing the matchup...</p>
        </div>
      </div>
    )
  }

  if (!insight) return null

  // Split insight into sections by numbered points
  const sections = insight.split(/\n\n/).filter(s => s.trim())

  return (
    <div className="w-full max-w-2xl bg-green-900 border border-green-600 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🧠</span>
        <h2 className="text-white font-bold text-xl">AI Coach Analysis</h2>
      </div>

      <div className="flex flex-col gap-3">
        {sections.map((section, i) => (
          <div key={i} className="bg-green-950 rounded-lg p-4">
            <p className="text-green-100 text-sm leading-relaxed whitespace-pre-line">
              {section.replace(/\*\*(.*?)\*\*/g, '$1')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}