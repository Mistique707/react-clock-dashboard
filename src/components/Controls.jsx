import { useMemo, useState } from 'react'
import { listTimeZones, zoneLabel } from '../utils/time'

/** Top-bar dynamic UI controls + add-zone picker. */
export default function Controls({ settings, onChange, onAddZone, activeZones }) {
  const [picker, setPicker] = useState('')
  const allZones = useMemo(() => listTimeZones(), [])
  const activeSet = useMemo(
    () => new Set(activeZones.map((z) => z.timeZone)),
    [activeZones],
  )

  const toggle = (key) => onChange({ ...settings, [key]: !settings[key] })

  const handleAdd = () => {
    if (picker) {
      onAddZone(picker)
      setPicker('')
    }
  }

  return (
    <div className="controls">
      <div className="control-group">
        <button
          className="chip"
          onClick={() => toggle('dark')}
          aria-pressed={settings.dark}
        >
          {settings.dark ? '🌙 Dark' : '☀️ Light'}
        </button>
        <button
          className={settings.hour12 ? 'chip' : 'chip chip-on'}
          onClick={() => toggle('hour12')}
          aria-pressed={!settings.hour12}
        >
          {settings.hour12 ? '12-hour' : '24-hour'}
        </button>
        <button
          className={settings.showSeconds ? 'chip chip-on' : 'chip'}
          onClick={() => toggle('showSeconds')}
          aria-pressed={settings.showSeconds}
        >
          Seconds
        </button>
        <button
          className={settings.smooth ? 'chip chip-on' : 'chip'}
          onClick={() => toggle('smooth')}
          aria-pressed={settings.smooth}
        >
          Smooth sweep
        </button>
      </div>

      <div className="control-group">
        <select
          className="zone-select"
          value={picker}
          onChange={(e) => setPicker(e.target.value)}
          aria-label="Choose a time zone to add"
        >
          <option value="">Add a time zone…</option>
          {allZones.map((tz) => (
            <option key={tz} value={tz} disabled={activeSet.has(tz)}>
              {zoneLabel(tz)} — {tz}
            </option>
          ))}
        </select>
        <button className="chip chip-primary" onClick={handleAdd} disabled={!picker}>
          + Add
        </button>
      </div>
    </div>
  )
}
