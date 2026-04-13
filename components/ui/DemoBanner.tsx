'use client'

import { useTaskStore } from '@/lib/store/taskStore'

export function DemoBanner() {
  const isDemoMode = useTaskStore(s => s.isDemoMode)
  const exitDemoMode = useTaskStore(s => s.exitDemoMode)

  if (!isDemoMode) return null

  return (
    <div
      className="flex items-center justify-center gap-4 px-4 py-2 text-sm"
      style={{ backgroundColor: 'var(--color-sage-green)' }}
    >
      <span className="font-medium text-[var(--color-black)]">
        <strong>Demo Mode</strong> — You&apos;re viewing sample data. Your tasks are untouched.
      </span>
      <button
        onClick={exitDemoMode}
        className="px-3 py-1 rounded border border-[var(--color-black)]/30 text-[var(--color-black)] hover:bg-[var(--color-black)]/10 transition-colors cursor-pointer font-medium text-sm"
      >
        Exit Demo
      </button>
    </div>
  )
}
