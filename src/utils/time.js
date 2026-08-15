// Time helpers built on the Intl API so every clock can render any IANA time zone
// from a single shared `Date` instant.

/**
 * Break a Date down into wall-clock parts for a given time zone.
 * `ms` is zone-independent (same instant everywhere) and drives the smooth
 * sweep of the analog second hand.
 */
export function getZonedParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'short',
  }).formatToParts(date)

  const map = {}
  for (const p of parts) map[p.type] = p.value

  let hour = parseInt(map.hour, 10)
  if (hour === 24) hour = 0 // some engines emit "24" for midnight

  return {
    year: +map.year,
    month: +map.month,
    day: +map.day,
    hour,
    minute: +map.minute,
    second: +map.second,
    ms: date.getMilliseconds(),
    weekday: map.weekday,
  }
}

export function formatTime(date, { timeZone, hour12, showSeconds }) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12,
    hour: '2-digit',
    minute: '2-digit',
    ...(showSeconds ? { second: '2-digit' } : {}),
  }).format(date)
}

export function formatDate(date, timeZone) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/** Short UTC offset label, e.g. "GMT+5:30". */
export function getOffsetLabel(date, timeZone) {
  const part = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'shortOffset',
  })
    .formatToParts(date)
    .find((p) => p.type === 'timeZoneName')
  return part ? part.value : ''
}

export const LOCAL_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone

/** Full list of IANA zones when supported, otherwise a sensible fallback. */
export function listTimeZones() {
  try {
    if (typeof Intl.supportedValuesOf === 'function') {
      return Intl.supportedValuesOf('timeZone')
    }
  } catch {
    /* fall through */
  }
  return FALLBACK_ZONES
}

const FALLBACK_ZONES = [
  'UTC',
  'America/Los_Angeles',
  'America/Denver',
  'America/Chicago',
  'America/New_York',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
]

/** Turn "Asia/Kolkata" into a friendlier "Kolkata" label. */
export function zoneLabel(tz) {
  const city = tz.split('/').pop() || tz
  return city.replace(/_/g, ' ')
}
