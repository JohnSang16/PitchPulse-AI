const glassCard = {
  background: "rgba(255, 255, 255, 0.04)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "20px",
  padding: "28px",
  width: "100%",
  maxWidth: "640px",
  fontFamily: "'Inter', sans-serif",
}

export default function AICoach({ insight, loading }) {
  if (loading) {
    return (
      <div style={glassCard}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            animation: "spin 1.2s linear infinite",
            flexShrink: 0,
          }}>
            ⚽
          </div>
          <div>
            <p style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "500", margin: 0 }}>
              AI Coach is analyzing the matchup...
            </p>
            <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "rgba(139, 92, 246, 0.6)",
                  animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        </div>
        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes pulse { 0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1); } }
        `}</style>
      </div>
    )
  }

  if (!insight) return null

  const sections = insight.split(/\n\n/).filter(s => s.trim())

  return (
    <div style={glassCard}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <div style={{
          width: "32px",
          height: "32px",
          borderRadius: "8px",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
          boxShadow: "0 0 12px rgba(139, 92, 246, 0.4)",
          flexShrink: 0,
        }}>
          🧠
        </div>
        <h2 style={{ color: "#f1f5f9", fontWeight: "700", fontSize: "15px", margin: 0 }}>
          AI Coach Analysis
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {sections.map((section, i) => (
          <div key={i} style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "12px",
            padding: "14px 16px",
          }}>
            <p style={{
              color: "#cbd5e1",
              fontSize: "13px",
              lineHeight: "1.75",
              whiteSpace: "pre-line",
              margin: 0,
            }}>
              {section.replace(/\*\*(.*?)\*\*/g, '$1')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
