import { motion, AnimatePresence } from "framer-motion"

const MONO = "'DM Mono', 'Courier New', monospace"

const SECTION_META = [
  { label: "Tactical Overview" },
  { label: "Key Battle"        },
  { label: "Home Advice"       },
  { label: "Away Advice"       },
]

function RichText({ text, style }) {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return (
    <p style={style}>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**")
          ? <strong key={i} style={{ color: "#f0ead6", fontWeight: "400" }}>{part.slice(2, -2)}</strong>
          : part
      )}
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
          <p style={{ fontFamily: MONO, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#3d3520", margin: "0 0 12px 0" }}>
            AI Coach
          </p>
          <div style={{
            background: "#0d0d0d", border: "0.5px solid #1e1a12",
            borderRadius: "2px", padding: "18px",
          }}>
            <p style={{ fontFamily: MONO, fontSize: "13px", color: "#3d3520", margin: "0 0 10px 0" }}>
              Analyzing matchup...
            </p>
            <div style={{ display: "flex", gap: "4px" }}>
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.22, ease: "easeInOut" }}
                  style={{ width: "4px", height: "4px", background: "#3d3520", borderRadius: "50%" }}
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
          <p style={{ fontFamily: MONO, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#3d3520", margin: "0 0 12px 0" }}>
            AI Coach
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {sections.map((section, i) => {
              const meta = SECTION_META[i] ?? { label: `Point ${i + 1}` }
              const body = section.replace(/^\*?\*?\d+[\.\)]\*?\*?\s*/m, "").trim()

              return (
                <motion.div
                  key={i}
                  whileHover={{ background: "#111111", borderColor: "#8a7a52" }}
                  transition={{ duration: 0.15 }}
                  style={{
                    background: "#0d0d0d",
                    border: "0.5px solid #1e1a12",
                    borderLeft: "2px solid #c9a84c",
                    borderRadius: "0 2px 2px 0",
                    overflow: "hidden",
                  }}
                >
                  <div style={{
                    padding: "10px 14px 8px",
                    borderBottom: "0.5px solid #141210",
                  }}>
                    <span style={{
                      fontFamily: MONO, fontSize: "10px", fontWeight: "400",
                      letterSpacing: "0.14em", textTransform: "uppercase",
                      color: "#8a7a52",
                    }}>
                      {meta.label}
                    </span>
                  </div>
                  <div style={{ padding: "10px 14px 12px" }}>
                    <RichText
                      text={body}
                      style={{
                        fontFamily: MONO, fontSize: "13px", color: "#8a7a52",
                        lineHeight: 1.8, whiteSpace: "pre-line", margin: 0,
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
