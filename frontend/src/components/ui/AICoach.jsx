import { motion, AnimatePresence } from "framer-motion"

const card = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "20px",
  padding: "28px",
  width: "100%",
  maxWidth: "640px",
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  margin: "0 auto",
}

// Section metadata — maps index to icon, label, accent color
const SECTION_META = [
  { icon: "⚔️", label: "Tactical Overview", color: "#3b82f6" },
  { icon: "🎯", label: "Key Battle",         color: "#f59e0b" },
  { icon: "🏠", label: "Home Team Advice",   color: "#22c55e" },
  { icon: "✈️", label: "Away Team Advice",   color: "#ef4444" },
]

// Render text with **bold** preserved
function RichText({ text, style }) {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return (
    <p style={style}>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**")
          ? <strong key={i} style={{ color: "#e2e8f0", fontWeight: "700" }}>{part.slice(2, -2)}</strong>
          : part
      )}
    </p>
  )
}

const sectionVariants = {
  hidden: { opacity: 0, y: 14 },
  show: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function AICoach({ insight, loading }) {
  // Parse sections — split on blank lines, drop empties
  const sections = insight
    ? insight.split(/\n\n+/).map(s => s.trim()).filter(Boolean)
    : []

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="loading"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          style={card}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
              style={{
                width: "32px", height: "32px", borderRadius: "8px",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px", flexShrink: 0,
                boxShadow: "0 0 14px rgba(139,92,246,0.5)",
              }}
            >⚽</motion.div>
            <div>
              <p style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "500", margin: 0 }}>
                AI Coach is analyzing the matchup...
              </p>
              <div style={{ display: "flex", gap: "5px", marginTop: "8px" }}>
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.2, ease: "easeInOut" }}
                    style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#8b5cf6" }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {insight && !loading && (
        <motion.div
          key="insight"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={card}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px", boxShadow: "0 0 14px rgba(139,92,246,0.4)", flexShrink: 0,
            }}>🧠</div>
            <h2 style={{ color: "#f1f5f9", fontWeight: "700", fontSize: "15px", margin: 0 }}>
              AI Coach Analysis
            </h2>
          </div>

          {/* Sections */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {sections.map((section, i) => {
              const meta = SECTION_META[i] ?? { icon: "📌", label: `Point ${i + 1}`, color: "#8b5cf6" }
              // Strip leading "1." / "**1.**" style prefixes from the section text
              const body = section.replace(/^\*?\*?\d+[\.\)]\*?\*?\s*/m, "").trim()

              return (
                <motion.div
                  key={i}
                  custom={i}
                  variants={sectionVariants}
                  initial="hidden"
                  animate="show"
                  style={{
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderLeft: `3px solid ${meta.color}`,
                    background: "rgba(255,255,255,0.03)",
                    overflow: "hidden",
                  }}
                >
                  {/* Section header */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "10px 14px 8px",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}>
                    <span style={{ fontSize: "13px" }}>{meta.icon}</span>
                    <span style={{
                      fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em",
                      textTransform: "uppercase", color: meta.color,
                    }}>
                      {meta.label}
                    </span>
                  </div>

                  {/* Section body */}
                  <div style={{ padding: "10px 14px 12px" }}>
                    <RichText
                      text={body}
                      style={{
                        color: "#94a3b8", fontSize: "13px",
                        lineHeight: "1.75", whiteSpace: "pre-line", margin: 0,
                      }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
