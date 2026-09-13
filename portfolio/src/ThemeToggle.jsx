import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  // index.html chooses the initial palette before the app is displayed.
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme)
  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  useEffect(() => {
    const deviceTheme = window.matchMedia('(prefers-color-scheme: dark)')
    function updateSystemTheme(event) {
      const root = document.documentElement
      if (root.dataset.themePreference !== 'system') return
      const updatedTheme = event.matches ? 'dark' : 'light'
      root.dataset.theme = updatedTheme
      setTheme(updatedTheme)
    }
    deviceTheme.addEventListener('change', updateSystemTheme)
    // The device may have changed since index.html chose the initial palette.
    updateSystemTheme(deviceTheme)
    return () => deviceTheme.removeEventListener('change', updateSystemTheme)
  }, [])

  function toggleTheme() {
    document.documentElement.dataset.theme = nextTheme
    document.documentElement.dataset.themePreference = nextTheme
    setTheme(nextTheme)
    try {
      // Keep this key in step with the early theme setup in index.html.
      localStorage.setItem('portfolio-theme', nextTheme)
    } catch {
      // The switch still works for this visit when storage is blocked or full.
    }
  }

  return (
    <div className="theme-controls">
      <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${nextTheme} mode`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          {theme === 'dark' ? (
            <>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
            </>
          ) : (
            <path d="M20 14A8.5 8.5 0 0 1 10 4a8.5 8.5 0 1 0 10 10Z" />
          )}
        </svg>
        <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
      </button>
    </div>
  )
}
