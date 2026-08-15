# React Clock Dashboard

An advanced real-time **world-clock dashboard** built with React + Vite. It combines
analog and digital clocks, multi-region time-zone management, alarms, and dynamic UI
controls into a single responsive interface with smooth, performance-friendly animation.

## Features

- **Analog + digital clocks** rendered from one shared time source.
- **Smooth sweep** second hand (SVG + `requestAnimationFrame`, throttled to 30 fps and
  auto-paused when the tab is hidden). Toggle it off for a classic tick.
- **Time-zone management** — add any IANA zone from the picker, remove zones, and see a
  live UTC offset per card. Your local zone is highlighted.
- **Alarms** — set alarms in local time with optional labels, enable/disable each one,
  and get a pulsing banner plus a Web Audio beep when they fire. No audio files needed.
- **Dynamic UI controls** — dark/light theme, 12/24-hour format, show/hide seconds,
  smooth-vs-tick animation.
- **Persistence** — settings, zones, and alarms are saved to `localStorage`.
- **Responsive** layout via CSS grid; respects `prefers-reduced-motion`.

## Tech

- React 18, Vite 6
- `Intl.DateTimeFormat` for zone-accurate time — no date library.

## Build

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  App.jsx                 # dashboard state, alarm engine, layout
  main.jsx
  index.css               # theme tokens + responsive styles
  components/
    AnalogClock.jsx        # SVG analog clock
    DigitalClock.jsx       # digital readout
    WorldClock.jsx         # per-zone card
    Controls.jsx           # theme / format / add-zone controls
    AlarmManager.jsx       # alarm create / list / toggle
  hooks/
    useNow.js              # shared rAF clock
    useLocalStorage.js     # persisted state
  utils/
    time.js                # Intl-based time helpers
    beep.js                # Web Audio alarm tone
```
