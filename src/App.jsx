import { useEffect, useRef, useState, useCallback } from 'react'
import AnalogClock from './components/AnalogClock'
import DigitalClock from './components/DigitalClock'
import WorldClock from './components/WorldClock'
import Controls from './components/Controls'
import AlarmManager from './components/AlarmManager'
import { useNow } from './hooks/useNow'
import { useLocalStorage } from './hooks/useLocalStorage'
import { getZonedParts, LOCAL_ZONE, zoneLabel } from './utils/time'
import { beep } from './utils/beep'

const pad = (n) => String(n).padStart(2, '0')
const uid = () => Math.random().toString(36).slice(2, 9)

const DEFAULT_ZONES = [
  { id: 'local', timeZone: LOCAL_ZONE, label: zoneLabel(LOCAL_ZONE) },
  { id: uid(), timeZone: 'America/New_York', label: 'New York' },
  { id: uid(), timeZone: 'Europe/London', label: 'London' },
  { id: uid(), timeZone: 'Asia/Tokyo', label: 'Tokyo' },
]

export default function App() {
  const [settings, setSettings] = useLocalStorage('clock.settings', {
    dark: true,
    hour12: false,
    showSeconds: true,
    smooth: true,
  })
  const [zones, setZones] = useLocalStorage('clock.zones', DEFAULT_ZONES)
  const [alarms, setAlarms] = useLocalStorage('clock.alarms', [])
  const [ringing, setRinging] = useState([]) // alarm ids currently sounding

  // 30fps shared clock drives every analog + digital readout.
  const now = useNow(30)

  // Track which alarm/minute combos already fired so each fires once per minute.
  const firedKeys = useRef(new Set())

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = settings.dark ? 'dark' : 'light'
    }
  }, [settings.dark])

  // Alarm evaluation — runs on each tick against local wall-clock time.
  useEffect(() => {
    const p = getZonedParts(now, LOCAL_ZONE)
    if (p.second > 1) return // only fire near the top of the matching minute
    const hhmm = `${pad(p.hour)}:${pad(p.minute)}`
    const minuteKey = `${p.year}-${p.month}-${p.day}-${hhmm}`

    for (const a of alarms) {
      if (!a.enabled || a.time !== hhmm) continue
      const key = `${a.id}|${minuteKey}`
      if (firedKeys.current.has(key)) continue
      firedKeys.current.add(key)
      setRinging((r) => (r.includes(a.id) ? r : [...r, a.id]))
    }
  }, [now, alarms])

  // Beep repeatedly while any alarm is ringing.
  useEffect(() => {
    if (ringing.length === 0) return
    beep()
    const id = setInterval(beep, 1500)
    return () => clearInterval(id)
  }, [ringing.length])

  const addZone = useCallback(
    (tz) => {
      setZones((zs) =>
        zs.some((z) => z.timeZone === tz)
          ? zs
          : [...zs, { id: uid(), timeZone: tz, label: zoneLabel(tz) }],
      )
    },
    [setZones],
  )

  const removeZone = useCallback(
    (id) => setZones((zs) => zs.filter((z) => z.id !== id)),
    [setZones],
  )

  const addAlarm = useCallback(
    ({ time, label }) =>
      setAlarms((as) => [...as, { id: uid(), time, label, enabled: true }]),
    [setAlarms],
  )

  const toggleAlarm = useCallback(
    (id) =>
      setAlarms((as) =>
        as.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)),
      ),
    [setAlarms],
  )

  const removeAlarm = useCallback(
    (id) => {
      setAlarms((as) => as.filter((a) => a.id !== id))
      setRinging((r) => r.filter((x) => x !== id))
    },
    [setAlarms],
  )

  const dismissRinging = useCallback(
    (id) => setRinging((r) => r.filter((x) => x !== id)),
    [],
  )

  const ringingAlarms = alarms.filter((a) => ringing.includes(a.id))
  const localZone = zones.find((z) => z.timeZone === LOCAL_ZONE) || zones[0]

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-dot" />
          <h1>World Clock Dashboard</h1>
        </div>
        <Controls
          settings={settings}
          onChange={setSettings}
          onAddZone={addZone}
          activeZones={zones}
        />
      </header>

      {ringingAlarms.length > 0 && (
        <div className="alarm-banner" role="alert">
          <span className="alarm-banner-icon">⏰</span>
          <div className="alarm-banner-text">
            {ringingAlarms.map((a) => (
              <div key={a.id}>
                <strong>{a.time}</strong> — {a.label || 'Alarm'}
                <button className="chip chip-dismiss" onClick={() => dismissRinging(a.id)}>
                  Dismiss
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {localZone && (
        <section className="feature">
          <AnalogClock
            date={now}
            timeZone={localZone.timeZone}
            size={260}
            showSeconds={settings.showSeconds}
            smooth={settings.smooth}
          />
          <div className="feature-text">
            <div className="feature-zone">{localZone.label} · Local time</div>
            <DigitalClock
              date={now}
              timeZone={localZone.timeZone}
              hour12={settings.hour12}
              showSeconds={settings.showSeconds}
              big
            />
          </div>
        </section>
      )}

      <h2 className="section-title">World Clocks</h2>
      <section className="zone-grid">
        {zones.map((z) => (
          <WorldClock
            key={z.id}
            zone={z}
            date={now}
            hour12={settings.hour12}
            showSeconds={settings.showSeconds}
            smooth={settings.smooth}
            isLocal={z.timeZone === LOCAL_ZONE}
            onRemove={removeZone}
          />
        ))}
      </section>

      <AlarmManager
        alarms={alarms}
        onAdd={addAlarm}
        onToggle={toggleAlarm}
        onRemove={removeAlarm}
      />

      <footer className="app-footer">
        Built with React · {zones.length} zones · updates live every frame
      </footer>
    </div>
  )
}
