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

const sectionVariants = {
  hidden: { opacity: 0, y: 14 },
  show: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function AICoach({ insight, loading }) {
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
            >
              ⚽
            </motion.div>
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
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
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

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {insight.split(/\n\n/).filter(s => s.trim()).map((section, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={sectionVariants}
                initial="hidden"
                animate="show"
                whileHover={{
                  backgroundColor: "rgba(255,255,255,0.055)",
                  borderColor: "rgba(139,92,246,0.2)",
                  transition: { duration: 0.15 },
                }}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  cursor: "default",
                }}
              >
                <p style={{ color: "#cbd5e1", fontSize: "13px", lineHeight: "1.75", whiteSpace: "pre-line", margin: 0 }}>
                  {section.replace(/\*\*(.*?)\*\*/g, '$1')}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
