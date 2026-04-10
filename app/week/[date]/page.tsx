import { redirect } from 'next/navigation'
import { getMonday, getWeekDates, formatWeekLabel } from '@/lib/utils/dates'
import { WeekNav } from '@/components/ui/WeekNav'
import { WeekBoard } from '@/components/board/WeekBoard'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default async function WeekPage(props: PageProps<'/week/[date]'>) {
  const { date } = await props.params
  const monday = getMonday(date)

  // Redirect if date is not a Monday (invalid or mid-week URL)
  if (monday !== date) {
    redirect(`/week/${monday}`)
  }

  const weekDates = getWeekDates(monday)
  const label = formatWeekLabel(monday)

  const [y, m, d] = monday.split('-').map(Number)
  const fmt = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  const prevMonday = fmt(new Date(y, m - 1, d - 7))
  const nextMonday = fmt(new Date(y, m - 1, d + 7))

  return (
    <div className="flex flex-col flex-1">
      <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-black-10)]">
        <h1 className="text-lg font-bold text-foreground">Daily Tasker</h1>
        <div className="flex items-center gap-4">
          <WeekNav
            label={label}
            prevHref={`/week/${prevMonday}`}
            nextHref={`/week/${nextMonday}`}
          />
          <ThemeToggle />
        </div>
      </header>
      <WeekBoard dates={weekDates} monday={monday} />
    </div>
  )
}
