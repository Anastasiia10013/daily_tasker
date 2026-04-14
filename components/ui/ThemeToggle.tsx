'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  const isDark = theme === 'dark'

  if (!mounted) {
    return <div className="h-6 w-11" aria-hidden />
  }

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-pressed={isDark}
      aria-label="Toggle theme"
      className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors duration-[var(--duration-default)] ${
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
