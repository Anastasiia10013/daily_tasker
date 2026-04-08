import { ChevronLeft, ChevronRight } from 'lucide-react'

interface WeekNavProps {
  label: string
  onPrev?: () => void
  onNext?: () => void
}

export function WeekNav({ label, onPrev, onNext }: WeekNavProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onPrev}
        aria-label="Previous week"
        className="p-1 rounded hover:bg-muted transition-colors duration-[var(--duration-default)]"
      >
        <ChevronLeft size={20} />
      </button>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <button
        onClick={onNext}
        aria-label="Next week"
        className="p-1 rounded hover:bg-muted transition-colors duration-[var(--duration-default)]"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
