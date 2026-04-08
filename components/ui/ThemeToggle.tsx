'use client'

import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggle() {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={isDark}
      aria-label="Toggle theme"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-[var(--duration-default)] ${
        isDark ? 'bg-[var(--color-black-60)]' : 'bg-[var(--color-black-10)]'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-[var(--duration-default)] ${
          isDark ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}
