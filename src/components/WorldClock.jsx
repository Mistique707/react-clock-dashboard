import { memo } from 'react'
import AnalogClock from './AnalogClock'
import DigitalClock from './DigitalClock'
import { getOffsetLabel, zoneLabel } from '../utils/time'

/** A card in the world-clock grid: small analog + digital for one zone. */
function WorldClock({ zone, date, hour12, showSeconds, smooth, isLocal, onRemove }) {
  return (
    <div className={isLocal ? 'zone-card zone-card-local' : 'zone-card'}>
      <div className="zone-card-head">
        <div>
          <span className="zone-name">{zone.label || zoneLabel(zone.timeZone)}</span>
          {isLocal && <span className="zone-badge">Local</span>}
        </div>
        <span className="zone-offset">{getOffsetLabel(date, zone.timeZone)}</span>
      </div>

      <AnalogClock
        date={date}
        timeZone={zone.timeZone}
        size={140}
        showSeconds={showSeconds}
        smooth={smooth}
      />

      <DigitalClock
        date={date}
        timeZone={zone.timeZone}
        hour12={hour12}
        showSeconds={showSeconds}
      />

      {!isLocal && (
        <button
          className="btn-remove"
          onClick={() => onRemove(zone.id)}
          aria-label={`Remove ${zone.timeZone}`}
          title="Remove"
        >
          ✕
        </button>
      )}
    </div>
  )
}

export default memo(WorldClock)
