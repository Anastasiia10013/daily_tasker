import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface WeekNavProps {
  label: string
  prevHref: string
  nextHref: string
}

export function WeekNav({ label, prevHref, nextHref }: WeekNavProps) {
  return (
    <div className="flex items-center gap-3">
      <Link
        href={prevHref}
        aria-label="Previous week"
        className="p-1 rounded hover:bg-muted transition-colors duration-[var(--duration-default)]"
      >
        <ChevronLeft size={20} />
      </Link>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <Link
        href={nextHref}
        aria-label="Next week"
        className="p-1 rounded hover:bg-muted transition-colors duration-[var(--duration-default)]"
      >
        <ChevronRight size={20} />
      </Link>
    </div>
  )
}
