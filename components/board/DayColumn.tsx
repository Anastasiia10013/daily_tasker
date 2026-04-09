import { DayHeader } from './DayHeader'
import { sortTasks } from '@/lib/utils/tasks'
import type { Task } from '@/types'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

interface DayColumnProps {
  date: string   // YYYY-MM-DD
  tasks: Task[]  // pre-filtered for this date
}

export function DayColumn({ date, tasks }: DayColumnProps) {
  const [y, m, d] = date.split('-').map(Number)
  const dateObj = new Date(y, m - 1, d)
  const dayName = DAY_NAMES[dateObj.getDay()]
  const shortDate = `${MONTHS[m - 1]} ${d}`

  const sorted = sortTasks(tasks)

  return (
    <div className="flex flex-col min-w-[200px]">
      <DayHeader dayName={dayName} date={shortDate} />
      <div className="flex flex-col gap-2 pt-2">
        {sorted.map(task => (
          <div key={task.id} data-testid="task-placeholder" className="p-2 bg-white rounded border border-[var(--color-black-10)] text-sm">
            {task.title}
          </div>
        ))}
      </div>
    </div>
  )
}
