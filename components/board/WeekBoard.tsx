import { DayColumn } from './DayColumn'
import type { Task } from '@/types'

interface WeekBoardProps {
  dates: string[]  // 7 YYYY-MM-DD strings, Mon–Sun
  tasks: Task[]
}

export function WeekBoard({ dates, tasks }: WeekBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto px-4 pb-4 flex-1">
      {dates.map(date => (
        <DayColumn
          key={date}
          date={date}
          tasks={tasks.filter(t => t.date === date)}
        />
      ))}
    </div>
  )
}
