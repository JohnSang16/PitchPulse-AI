import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"

export default function AnimatedNumber({ value, duration = 1200, suffix = "" }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const target = parseFloat(value) || 0

  useEffect(() => {
    if (!inView) return
    let start = null
    const from = 0

    const step = (timestamp) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(+(from + (target - from) * eased).toFixed(1))
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [inView, target, duration])

  return (
    <span ref={ref}>
      {Number.isInteger(target) ? Math.round(display) : display}{suffix}
    </span>
  )
}
