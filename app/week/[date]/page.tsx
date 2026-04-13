import { redirect } from 'next/navigation'
import { getMonday, getWeekDates, formatWeekLabel } from '@/lib/utils/dates'
import { WeekNav } from '@/components/ui/WeekNav'
import { WeekBoard } from '@/components/board/WeekBoard'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { ExportButton } from '@/components/ui/ExportButton'
import { DemoBanner } from '@/components/ui/DemoBanner'
import { TryDemoButton } from '@/components/ui/TryDemoButton'

export default async function WeekPage(props: PageProps<'/week/[date]'>) {
  const { date } = await props.params
  const monday = getMonday(date)

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
        <div className="flex items-center gap-5">
          <h1 className="text-lg font-bold text-foreground">Daily Tasker</h1>
          <TryDemoButton />
        </div>
        <div className="flex items-center gap-4">
          <WeekNav
            label={label}
            prevHref={`/week/${prevMonday}`}
            nextHref={`/week/${nextMonday}`}
          />
          <ExportButton />
          <ThemeToggle />
        </div>
      </header>
      <DemoBanner />
      <WeekBoard dates={weekDates} monday={monday} />
    </div>
  )
}
