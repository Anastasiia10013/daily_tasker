'use client'

import { cn } from '@/lib/utils'
import { useTaskStore } from '@/lib/store/taskStore'

export function TryDemoButton({ className }: { className?: string }) {
  const isDemoMode = useTaskStore(s => s.isDemoMode)
  const enterDemoMode = useTaskStore(s => s.enterDemoMode)

  if (isDemoMode) return null

  return (
    <button
      onClick={enterDemoMode}
      className={cn('text-sm text-muted-foreground hover:text-foreground border border-[var(--color-black-10)] hover:border-[var(--color-black-40)] px-3 py-1 rounded transition-colors cursor-pointer', className)}
    >
      Try Demo
    </button>
  )
}
