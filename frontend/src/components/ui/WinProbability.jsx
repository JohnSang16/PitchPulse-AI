export default function WinProbability({ result, homeTeam, awayTeam }) {
  if (!result) return null

  return (
    <div className="bg-green-900 border border-green-600 rounded-xl p-6 w-full max-w-lg">
      <h2 className="text-white text-center text-xl font-bold mb-6">
        Match Prediction
      </h2>

      <div className="flex justify-between items-center mb-6">
        <div className="text-center">
          <p className="text-green-300 text-sm uppercase tracking-widest mb-1">{homeTeam}</p>
          <p className="text-white text-5xl font-bold">{result.home_win_pct}%</p>
          <p className="text-green-400 text-xs mt-1">Win</p>
        </div>

        <div className="text-center">
          <p className="text-green-300 text-sm uppercase tracking-widest mb-1">Draw</p>
          <p className="text-white text-5xl font-bold">{result.draw_pct}%</p>
        </div>

        <div className="text-center">
          <p className="text-green-300 text-sm uppercase tracking-widest mb-1">{awayTeam}</p>
          <p className="text-white text-5xl font-bold">{result.away_win_pct}%</p>
          <p className="text-green-400 text-xs mt-1">Win</p>
        </div>
      </div>

      {/* Probability Bar */}
      <div className="flex rounded-full overflow-hidden h-4">
        <div
          className="bg-blue-500 transition-all duration-700"
          style={{ width: `${result.home_win_pct}%` }}
        />
        <div
          className="bg-gray-500 transition-all duration-700"
          style={{ width: `${result.draw_pct}%` }}
        />
        <div
          className="bg-red-500 transition-all duration-700"
          style={{ width: `${result.away_win_pct}%` }}
        />
      </div>

      <div className="flex justify-between mt-2 text-xs text-green-400">
        <span>⚽ {result.home_expected_goals} xG</span>
        <span>{result.simulations} simulations</span>
        <span>⚽ {result.away_expected_goals} xG</span>
      </div>
    </div>
  )
}