import { Plus } from 'lucide-react'

interface DayHeaderProps {
  dayName: string
  date: string
  onAdd?: () => void
}

export function DayHeader({ dayName, date, onAdd }: DayHeaderProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <span className="font-bold text-foreground">{dayName}</span>
        <span className="text-sm text-muted-foreground ml-2">{date}</span>
      </div>
      <button
        onClick={onAdd}
        aria-label="Add task"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-[var(--duration-default)]"
      >
        <Plus size={16} />
        Add task
      </button>
    </div>
  )
}
