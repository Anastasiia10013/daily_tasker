import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getMonday, getWeekDates, formatWeekLabel } from '@/lib/utils/dates'
import { WeekNav } from '@/components/ui/WeekNav'
import { WeekBoard } from '@/components/board/WeekBoard'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { ExportButton } from '@/components/ui/ExportButton'
import { DemoBanner } from '@/components/ui/DemoBanner'
import { TryDemoButton } from '@/components/ui/TryDemoButton'
import { MobileMenuButton } from '@/components/ui/MobileMenuButton'

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
  const prevHref = `/week/${fmt(new Date(y, m - 1, d - 7))}`
  const nextHref = `/week/${fmt(new Date(y, m - 1, d + 7))}`

  return (
    <div className="flex flex-col flex-1">
      <header className="grid grid-cols-[auto_1fr_auto] sm:flex sm:justify-between items-center px-4 py-3 border-b border-[var(--color-black-10)]">
        <div className="flex items-center gap-5">
          <h1 className="text-lg font-bold text-foreground">
            <span className="sm:hidden">DT</span>
            <span className="hidden sm:inline">Daily Tasker</span>
          </h1>
          <span className="hidden sm:block"><TryDemoButton /></span>
        </div>

        <div className="sm:hidden flex items-center justify-center gap-1">
          <Link href={prevHref} aria-label="Previous week" className="p-2 rounded hover:bg-black/5 transition-colors duration-[var(--duration-default)]">
            <ChevronLeft size={20} />
          </Link>
          <span className="text-sm font-medium text-foreground">{label}</span>
          <Link href={nextHref} aria-label="Next week" className="p-2 rounded hover:bg-black/5 transition-colors duration-[var(--duration-default)]">
            <ChevronRight size={20} />
          </Link>
        </div>

        <div className="flex items-center">
          <span className="sm:hidden"><MobileMenuButton /></span>
          <div className="hidden sm:flex items-center gap-4">
            <WeekNav
              label={label}
              prevHref={prevHref}
              nextHref={nextHref}
            />
            <ExportButton />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="sm:hidden empty:hidden px-4 pt-4 pb-2">
        <TryDemoButton className="w-full" />
      </div>
      <DemoBanner />
      <WeekBoard dates={weekDates} monday={monday} />
    </div>
  )
}
