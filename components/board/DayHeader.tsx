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
        <span className="font-bold text-[var(--color-black)]">{dayName}</span>
        <span className="text-sm text-[var(--color-black-60)] ml-2">{date}</span>
      </div>
      <button
        onClick={onAdd}
        aria-label="Add task"
        className="flex items-center gap-1 text-sm text-[var(--color-black-60)] hover:text-[var(--color-black)] transition-colors duration-[var(--duration-default)]"
      >
        <Plus size={16} />
        Add task
      </button>
    </div>
  )
}
