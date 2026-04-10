"use client"

import { useState, useEffect } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  pointerWithin,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  type CollisionDetection,
} from '@dnd-kit/core'
import { DayColumn } from './DayColumn'
import { useTaskStore } from '@/lib/store/taskStore'
import { useShallow } from 'zustand/react/shallow'
import { BORDER_CLASS } from '@/components/tasks/TaskCard'
import type { Task } from '@/types'

interface WeekBoardProps {
  dates: string[]
  monday: string
}

export function WeekBoard({ dates, monday }: WeekBoardProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const tasks = useTaskStore(useShallow(s => s.getTasksForWeek(monday)))
  const reorderTask = useTaskStore(s => s.reorderTask)
  const moveTask = useTaskStore(s => s.moveTask)

  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)

  const collisionDetection: CollisionDetection = (args) => {
    const pointer = pointerWithin(args)
    return pointer.length > 0 ? pointer : closestCenter(args)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTask(tasks.find(t => t.id === active.id) ?? null)
  }

  const handleDragOver = ({ over }: DragOverEvent) => {
    if (!over) { setHoveredDate(null); return }
    const overId = over.id as string
    const overTask = tasks.find(t => t.id === overId)
    setHoveredDate(overTask ? overTask.date : overId)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null)
    setHoveredDate(null)
    if (!over || active.id === over.id) return

    const activeId = active.id as string
    const overId = over.id as string

    const draggedTask = tasks.find(t => t.id === activeId)
    if (!draggedTask) return

    const overTask = tasks.find(t => t.id === overId)
    const overDate = overTask ? overTask.date : overId

    if (draggedTask.date === overDate) {
      if (!overTask) return
      const crossDone = (draggedTask.status === 'done') !== (overTask.status === 'done')
      if (crossDone) return
      reorderTask(draggedTask.date, activeId, overId)
    } else {
      moveTask(activeId, overDate)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 px-4 pb-4 mx-auto max-w-[1680px] min-w-fit h-full">
          {dates.map(date => (
            <DayColumn
              key={date}
              date={date}
              tasks={mounted ? tasks.filter(t => t.date === date) : []}
              isDropTarget={hoveredDate === date}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeTask && (
          <div
            className={`bg-white rounded-[var(--border-radius)] p-4 task-card ${BORDER_CLASS[activeTask.isFocus ? 'focus' : activeTask.status]} ${activeTask.status === 'done' ? 'opacity-50' : ''} shadow-lg`}
            style={{ transform: 'rotate(1deg)' }}
          >
            <p className={`font-medium text-[var(--color-black)] break-words ${activeTask.status === 'done' ? 'line-through' : ''}`}>
              {activeTask.title}
            </p>
            {activeTask.description && (
              <p className="text-sm text-[var(--color-black-60)] mt-1 truncate">
                {activeTask.description}
              </p>
            )}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

