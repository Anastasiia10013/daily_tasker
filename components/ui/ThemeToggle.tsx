'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  // next-themes hydration guard: render placeholder on server, real toggle after mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'

  if (!mounted) {
    return <div className="h-7 w-[52px]" aria-hidden />
  }

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-pressed={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className="-m-1 cursor-pointer rounded-full p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
    >
      <span className="relative inline-flex h-7 w-[52px] items-center rounded-full bg-[var(--color-black-10)] transition-colors duration-[var(--duration-default)] dark:bg-[var(--color-black-60)]">
        <span
          className="absolute top-[3px] left-0 h-[22px] w-[22px] rounded-full bg-[var(--card)] shadow-sm transition-transform duration-[var(--duration-default)]"
          style={{ transform: `translateX(${isDark ? 27 : 3}px)` }}
          aria-hidden
        />
        <Sun
          size={14}
          aria-hidden
          className={`pointer-events-none absolute left-[7px] top-1/2 -translate-y-1/2 text-[var(--color-foreground)] transition-opacity duration-[var(--duration-default)] ${
            isDark ? 'opacity-50' : 'opacity-100'
          }`}
        />
        <Moon
          size={14}
          aria-hidden
          className={`pointer-events-none absolute right-[7px] top-1/2 -translate-y-1/2 text-[var(--color-foreground)] transition-opacity duration-[var(--duration-default)] ${
            isDark ? 'opacity-100' : 'opacity-50'
          }`}
        />
      </span>
    </button>
  )
}
