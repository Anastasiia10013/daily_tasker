"use client"

import React, { useState } from 'react'
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

  const { deleteTask, updateTask } = useTaskStore()

  const handleAdd = () => { setEditTask(null); setOpen(true) }
  const handleEdit = (task: Task) => { setEditTask(task); setOpen(true) }
  const handleDelete = (id: string) => deleteTask(id)
  const handleStatusChange = (id: string, status: TaskStatus) => updateTask(id, { status })

  const sorted = sortTasks(tasks)

  return (
    <div className="flex flex-col min-w-[200px]">
      <DayHeader dayName={dayName} date={shortDate} onAdd={handleAdd} />
      <div className="flex flex-col gap-2 pt-2">
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
            />
          </React.Fragment>
        ))}
      </div>
      <TaskForm
        open={open}
        onClose={() => setOpen(false)}
        date={date}
        editTask={editTask ?? undefined}
      />
    </div>
  )
}
