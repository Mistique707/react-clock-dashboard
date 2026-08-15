import { memo } from 'react'
import { getZonedParts } from '../utils/time'

/**
 * SVG analog clock. Rendering as SVG keeps the hands crisp at any size and
 * lets us rotate them with cheap transforms instead of re-layout.
 */
function AnalogClock({ date, timeZone, size = 220, showSeconds = true, smooth = true }) {
  const { hour, minute, second, ms } = getZonedParts(date, timeZone)

  const sec = smooth ? second + ms / 1000 : second
  const secondAngle = sec * 6 // 360 / 60
  const minuteAngle = (minute + sec / 60) * 6
  const hourAngle = ((hour % 12) + minute / 60) * 30 // 360 / 12

  const ticks = Array.from({ length: 60 }, (_, i) => i)
  const numbers = Array.from({ length: 12 }, (_, i) => i + 1)

  return (
    <svg
      className="analog"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      role="img"
      aria-label="Analog clock"
    >
      <circle className="clock-face" cx="100" cy="100" r="96" />

      {ticks.map((i) => {
        const isHour = i % 5 === 0
        const angle = (i * 6 * Math.PI) / 180
        const outer = 92
        const inner = isHour ? 82 : 87
        return (
          <line
            key={i}
            className={isHour ? 'tick tick-hour' : 'tick'}
            x1={100 + inner * Math.sin(angle)}
            y1={100 - inner * Math.cos(angle)}
            x2={100 + outer * Math.sin(angle)}
            y2={100 - outer * Math.cos(angle)}
          />
        )
      })}

      {numbers.map((n) => {
        const angle = ((n * 30 - 90) * Math.PI) / 180
        return (
          <text
            key={n}
            className="clock-number"
            x={100 + 70 * Math.cos(angle)}
            y={100 + 70 * Math.sin(angle)}
            dominantBaseline="central"
            textAnchor="middle"
          >
            {n}
          </text>
        )
      })}

      {/* Hour hand */}
      <line
        className="hand hand-hour"
        x1="100"
        y1="100"
        x2="100"
        y2="52"
        transform={`rotate(${hourAngle} 100 100)`}
      />
      {/* Minute hand */}
      <line
        className="hand hand-minute"
        x1="100"
        y1="100"
        x2="100"
        y2="30"
        transform={`rotate(${minuteAngle} 100 100)`}
      />
      {/* Second hand */}
      {showSeconds && (
        <line
          className="hand hand-second"
          x1="100"
          y1="112"
          x2="100"
          y2="22"
          transform={`rotate(${secondAngle} 100 100)`}
        />
      )}

      <circle className="hand-cap" cx="100" cy="100" r="4" />
    </svg>
  )
}

export default memo(AnalogClock)
