export default function SoccerPitch() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <svg
        viewBox="0 0 600 400"
        className="w-full rounded-xl border-2 border-green-600"
        style={{ background: "#1a5c2a" }}
      >
        {/* Pitch outline */}
        <rect x="20" y="20" width="560" height="360" fill="none" stroke="white" strokeWidth="2" />

        {/* Center circle */}
        <circle cx="300" cy="200" r="50" fill="none" stroke="white" strokeWidth="2" />
        
        {/* Center spot */}
        <circle cx="300" cy="200" r="3" fill="white" />

        {/* Halfway line */}
        <line x1="300" y1="20" x2="300" y2="380" stroke="white" strokeWidth="2" />

        {/* Left penalty box */}
        <rect x="20" y="120" width="100" height="160" fill="none" stroke="white" strokeWidth="2" />
        
        {/* Left 6 yard box */}
        <rect x="20" y="160" width="40" height="80" fill="none" stroke="white" strokeWidth="2" />
        
        {/* Left penalty spot */}
        <circle cx="90" cy="200" r="3" fill="white" />

        {/* Right penalty box */}
        <rect x="480" y="120" width="100" height="160" fill="none" stroke="white" strokeWidth="2" />
        
        {/* Right 6 yard box */}
        <rect x="540" y="160" width="40" height="80" fill="none" stroke="white" strokeWidth="2" />
        
        {/* Right penalty spot */}
        <circle cx="510" cy="200" r="3" fill="white" />

        {/* Left goal */}
        <rect x="8" y="170" width="12" height="60" fill="none" stroke="white" strokeWidth="2" />

        {/* Right goal */}
        <rect x="580" y="170" width="12" height="60" fill="none" stroke="white" strokeWidth="2" />

        {/* Pitch stripes for realism */}
        {[...Array(7)].map((_, i) => (
          <rect
            key={i}
            x={20 + i * 80}
            y="20"
            width="80"
            height="360"
            fill={i % 2 === 0 ? "rgba(255,255,255,0.03)" : "transparent"}
          />
        ))}
      </svg>
    </div>
  )
}