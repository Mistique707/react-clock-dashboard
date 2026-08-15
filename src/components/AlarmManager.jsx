import { useState } from 'react'
import { LOCAL_ZONE, zoneLabel } from '../utils/time'

/** Create / list / toggle / delete alarms. Alarms fire in local time. */
export default function AlarmManager({ alarms, onAdd, onToggle, onRemove }) {
  const [time, setTime] = useState('')
  const [label, setLabel] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!time) return
    onAdd({ time, label: label.trim() })
    setTime('')
    setLabel('')
  }

  return (
    <section className="alarm-panel">
      <h2>
        Alarms <span className="muted">({zoneLabel(LOCAL_ZONE)} time)</span>
      </h2>

      <form className="alarm-form" onSubmit={submit}>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          aria-label="Alarm time"
        />
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label (optional)"
          maxLength={40}
          aria-label="Alarm label"
        />
        <button className="chip chip-primary" type="submit">
          Set alarm
        </button>
      </form>

      {alarms.length === 0 ? (
        <p className="muted">No alarms set.</p>
      ) : (
        <ul className="alarm-list">
          {alarms.map((a) => (
            <li key={a.id} className={a.enabled ? 'alarm' : 'alarm alarm-off'}>
              <span className="alarm-time">{a.time}</span>
              <span className="alarm-label">{a.label || 'Alarm'}</span>
              <label className="switch" title="Enable / disable">
                <input
                  type="checkbox"
                  checked={a.enabled}
                  onChange={() => onToggle(a.id)}
                />
                <span className="slider" />
              </label>
              <button
                className="btn-remove"
                onClick={() => onRemove(a.id)}
                aria-label="Delete alarm"
                title="Delete"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
