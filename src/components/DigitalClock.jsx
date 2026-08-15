import { memo } from 'react'
import { formatTime, formatDate } from '../utils/time'

/** Text time + date readout for a given time zone. */
function DigitalClock({ date, timeZone, hour12, showSeconds, big = false }) {
  return (
    <div className={big ? 'digital digital-big' : 'digital'}>
      <div className="digital-time">
        {formatTime(date, { timeZone, hour12, showSeconds })}
      </div>
      <div className="digital-date">{formatDate(date, timeZone)}</div>
    </div>
  )
}

export default memo(DigitalClock)
