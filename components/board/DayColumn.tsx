"use client"

import React, { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { DayHeader } from './DayHeader'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskForm } from '@/components/tasks/TaskForm'
import { useTaskStore } from '@/lib/store/taskStore'
import { sortTasks } from '@/lib/utils/tasks'
import type { Task, TaskStatus } from '@/types'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

interface DayColumnProps {
  date: string
  tasks: Task[]
}

export function DayColumn({ date, tasks }: DayColumnProps) {
  const [y, m, d] = date.split('-').map(Number)
  const dateObj = new Date(y, m - 1, d)
  const dayName = DAY_NAMES[dateObj.getDay()]
  const shortDate = `${MONTHS[m - 1]} ${d}`

  const [open, setOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [focusErrorTaskId, setFocusErrorTaskId] = useState<string | null>(null)

  const { deleteTask, updateTask, toggleFocus } = useTaskStore()
  const { setNodeRef } = useDroppable({ id: date })

  const focusCount = tasks.filter(t => t.isFocus).length
  const focusLimitReached = focusCount >= 3

  const handleAdd = () => { setEditTask(null); setOpen(true) }
  const handleEdit = (task: Task) => { setEditTask(task); setOpen(true) }
  const handleDelete = (id: string) => deleteTask(id)
  const handleStatusChange = (id: string, status: TaskStatus) => updateTask(id, { status })

  const handleToggleFocus = (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    if (!task.isFocus && focusLimitReached) {
      setFocusErrorTaskId(id)
      setTimeout(() => setFocusErrorTaskId(null), 2000)
      return
    }
    toggleFocus(id)
  }

  const sorted = sortTasks(tasks)

  return (
    <div className="flex flex-col flex-1 min-w-[180px] max-w-[240px]">
      <DayHeader dayName={dayName} date={shortDate} onAdd={handleAdd} />
      <SortableContext items={sorted.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="flex flex-col gap-2 pt-2 flex-1">
          {sorted.map((task, i) => (
            <React.Fragment key={task.id}>
              {i > 0 && task.status === 'done' && sorted[i - 1].status !== 'done' && (
                <hr className="border-[var(--color-black-10)] my-2" />
              )}
              <TaskCard
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onToggleFocus={handleToggleFocus}
                focusLimitReached={focusLimitReached}
              />
              {focusErrorTaskId === task.id && (
                <p className="text-xs text-[var(--color-red)] px-1 -mt-1">
                  Focus limit reached — max 3 per day
                </p>
              )}
            </React.Fragment>
          ))}
        </div>
      </SortableContext>
      <TaskForm
        open={open}
        onClose={() => setOpen(false)}
        date={date}
        editTask={editTask ?? undefined}
        focusLimitReached={focusLimitReached}
      />
    </div>
  )
}
