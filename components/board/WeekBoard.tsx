"use client"

import { useState, useEffect } from 'react'
import { DayColumn } from './DayColumn'
import { useTaskStore } from '@/lib/store/taskStore'
import { useShallow } from 'zustand/react/shallow'

interface WeekBoardProps {
  dates: string[]   // 7 YYYY-MM-DD strings, Mon–Sun
  monday: string    // YYYY-MM-DD — used to fetch tasks for this week
}

export function WeekBoard({ dates, monday }: WeekBoardProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const tasks = useTaskStore(useShallow(s => s.getTasksForWeek(monday)))

  return (
    <div className="flex gap-4 overflow-x-auto px-4 pb-4 flex-1">
      {mounted && dates.map(date => (
        <DayColumn
          key={date}
          date={date}
          tasks={tasks.filter(t => t.date === date)}
        />
      ))}
    </div>
  )
}
