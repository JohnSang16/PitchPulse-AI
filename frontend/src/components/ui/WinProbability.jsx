export default function WinProbability({ result, homeTeam, awayTeam }) {
  if (!result) return null

  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.04)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: "20px",
      padding: "28px",
      width: "100%",
      maxWidth: "520px",
      fontFamily: "'Inter', sans-serif",
    }}>
      <h2 style={{
        textAlign: "center",
        fontSize: "12px",
        fontWeight: "600",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "#475569",
        margin: "0 0 24px 0",
      }}>
        Match Prediction
      </h2>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
        {/* Home */}
        <div style={{ textAlign: "center", flex: 1 }}>
          <p style={{ fontSize: "10px", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "#3b82f6", margin: "0 0 6px 0" }}>
            {homeTeam}
          </p>
          <p style={{ fontSize: "44px", fontWeight: "800", letterSpacing: "-0.04em", color: "#f8fafc", margin: "0", lineHeight: 1 }}>
            {result.home_win_pct}%
          </p>
          <p style={{ fontSize: "10px", fontWeight: "500", color: "#475569", margin: "4px 0 0 0" }}>Win</p>
        </div>

        {/* Draw */}
        <div style={{ textAlign: "center", flex: 1 }}>
          <p style={{ fontSize: "10px", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "#64748b", margin: "0 0 6px 0" }}>
            Draw
          </p>
          <p style={{ fontSize: "44px", fontWeight: "800", letterSpacing: "-0.04em", color: "#94a3b8", margin: "0", lineHeight: 1 }}>
            {result.draw_pct}%
          </p>
        </div>

        {/* Away */}
        <div style={{ textAlign: "center", flex: 1 }}>
          <p style={{ fontSize: "10px", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "#ef4444", margin: "0 0 6px 0" }}>
            {awayTeam}
          </p>
          <p style={{ fontSize: "44px", fontWeight: "800", letterSpacing: "-0.04em", color: "#f8fafc", margin: "0", lineHeight: 1 }}>
            {result.away_win_pct}%
          </p>
          <p style={{ fontSize: "10px", fontWeight: "500", color: "#475569", margin: "4px 0 0 0" }}>Win</p>
        </div>
      </div>

      {/* Probability Bar */}
      <div style={{
        display: "flex",
        borderRadius: "100px",
        overflow: "hidden",
        height: "6px",
        background: "rgba(255,255,255,0.05)",
        gap: "2px",
      }}>
        <div style={{
          width: `${result.home_win_pct}%`,
          background: "linear-gradient(90deg, #2563eb, #3b82f6)",
          borderRadius: "100px 0 0 100px",
          transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
          boxShadow: "0 0 8px rgba(59, 130, 246, 0.6)",
        }} />
        <div style={{
          width: `${result.draw_pct}%`,
          background: "rgba(100, 116, 139, 0.6)",
          transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }} />
        <div style={{
          width: `${result.away_win_pct}%`,
          background: "linear-gradient(90deg, #ef4444, #dc2626)",
          borderRadius: "0 100px 100px 0",
          transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
          boxShadow: "0 0 8px rgba(239, 68, 68, 0.6)",
        }} />
      </div>

      {/* xG stats */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "14px" }}>
        <span style={{ fontSize: "11px", color: "#3b82f6", fontWeight: "500" }}>
          {result.home_expected_goals} xG
        </span>
        <span style={{ fontSize: "11px", color: "#334155", fontWeight: "500" }}>
          {result.simulations} simulations
        </span>
        <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: "500" }}>
          {result.away_expected_goals} xG
        </span>
      </div>
    </div>
  )
}
