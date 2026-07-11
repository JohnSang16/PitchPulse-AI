import { motion, AnimatePresence } from "framer-motion"

const UI   = "'Inter', -apple-system, sans-serif"
const MONO = "'JetBrains Mono', 'Courier New', monospace"
const DISPLAY = "'Space Grotesk', 'Inter', sans-serif"

const SECTION_META = [
  { label: "Tactical Overview", color: "#a8c97f" },
  { label: "Key Battle",        color: "#d9a441" },
  { label: "Home Advice",       color: "#a8c97f" },
  { label: "Away Advice",       color: "#7eb6d9" },
]

function RichText({ text, style }) {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return (
    <p style={style}>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**")
          ? <strong key={i} style={{ color: "#edf2fa", fontWeight: "600" }}>{part.slice(2, -2)}</strong>
          : part
      )}
    </p>
  )
}

function CoachHeader() {
  return (
    <p style={{
      display: "flex", alignItems: "center", gap: "8px",
      fontFamily: MONO, fontSize: "10px", fontWeight: "500",
      letterSpacing: "0.16em", textTransform: "uppercase",
      color: "#566179", margin: "0 0 12px 0",
    }}>
      <span style={{
        width: "7px", height: "7px", borderRadius: "50%",
        background: "#a8c97f", boxShadow: "0 0 6px rgba(168,201,127,0.4)",
      }} />
      AI Coach
    </p>
  )
}

export default function AICoach({ insight, loading }) {
  const sections = insight
    ? insight.split(/\n\n+/).map(s => s.trim()).filter(Boolean)
    : []

  return (
    <AnimatePresence mode="wait">
      {loading && !insight && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <CoachHeader />
          <div style={{
            background: "#0b101c", border: "1px solid #1b2436",
            borderRadius: "12px", padding: "18px",
          }}>
            <p style={{ fontFamily: UI, fontSize: "13.5px", color: "#94a3bd", margin: "0 0 12px 0" }}>
              Analyzing matchup…
            </p>
            <div style={{ display: "flex", gap: "5px" }}>
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.22, ease: "easeInOut" }}
                  style={{ width: "5px", height: "5px", background: "#a8c97f", borderRadius: "50%" }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {insight && !loading && (
        <motion.div
          key="insight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CoachHeader />
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {sections.map((section, i) => {
              const meta = SECTION_META[i] ?? { label: `Point ${i + 1}`, color: "#94a3bd" }
              const body = section.replace(/^\*?\*?\d+[\.\)]\*?\*?\s*/m, "").trim()

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.07, ease: "easeOut" }}
                  whileHover={{ backgroundColor: "#121a2b" }}
                  style={{
                    backgroundColor: "#0b101c",
                    border: "1px solid #1b2436",
                    borderLeft: `3px solid ${meta.color}`,
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div style={{
                    padding: "10px 14px 8px",
                    borderBottom: "1px solid #131b2b",
                  }}>
                    <span style={{
                      fontFamily: DISPLAY, fontSize: "12.5px", fontWeight: "600",
                      letterSpacing: "0.02em",
                      color: "#edf2fa",
                    }}>
                      {meta.label}
                    </span>
                  </div>
                  <div style={{ padding: "10px 14px 12px" }}>
                    <RichText
                      text={body}
                      style={{
                        fontFamily: UI, fontSize: "13px", color: "#94a3bd",
                        lineHeight: 1.7, whiteSpace: "pre-line", margin: 0,
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
