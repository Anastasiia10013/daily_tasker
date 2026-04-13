'use client'

import { useTaskStore } from '@/lib/store/taskStore'

export function TryDemoButton() {
  const isDemoMode = useTaskStore(s => s.isDemoMode)
  const enterDemoMode = useTaskStore(s => s.enterDemoMode)

  if (isDemoMode) return null

  return (
    <button
      onClick={enterDemoMode}
      className="text-sm text-muted-foreground hover:text-foreground border border-[var(--color-black-10)] hover:border-[var(--color-black-40)] px-3 py-1 rounded transition-colors cursor-pointer"
    >
      Try Demo
    </button>
  )
}
