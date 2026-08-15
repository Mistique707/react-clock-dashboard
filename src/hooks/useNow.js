import { useState, useEffect, useRef } from 'react'

/**
 * A single shared clock source for the whole app.
 *
 * Uses requestAnimationFrame (throttled to `fps`) instead of one interval per
 * clock, so dozens of world clocks stay in sync and the animation loop pauses
 * automatically when the tab is backgrounded.
 */
export function useNow(fps = 30) {
  const [now, setNow] = useState(() => new Date())
  const rafId = useRef(0)
  const last = useRef(0)

  useEffect(() => {
    const minGap = 1000 / fps
    const loop = (t) => {
      if (t - last.current >= minGap) {
        last.current = t
        setNow(new Date())
      }
      rafId.current = requestAnimationFrame(loop)
    }
    rafId.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId.current)
  }, [fps])

  return now
}
