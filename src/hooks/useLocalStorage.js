import { useState, useEffect } from 'react'

/** useState that persists its value to localStorage under `key`. */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  }, [key, value])

  return [value, setValue]
}
