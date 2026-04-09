"use client"

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { StatusDropdown } from './StatusDropdown'
import type { Task, TaskStatus } from '@/types'

function getTilt(id: string): string {
  const sum = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const degrees = (sum % 3) + 1
  const sign = sum % 2 === 0 ? 1 : -1
  return `${sign * degrees}deg`
}

const BORDER_CLASS: Record<string, string> = {
  focus: 'border-2 border-[var(--color-yellow)]',
  todo: 'border border-[var(--color-black-10)]',
  'in-progress': 'border border-[var(--color-black-10)] border-l-4 border-l-[var(--color-sage-green)]',
  done: 'border border-[var(--color-black-10)]',
}

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: TaskStatus) => void
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const [hovered, setHovered] = useState(false)
  const variant = task.isFocus ? 'focus' : task.status

  return (
    <div
      data-testid="task-card"
      className={`relative bg-white rounded-[var(--border-radius)] p-4 cursor-pointer ${BORDER_CLASS[variant]} ${task.status === 'done' ? 'opacity-50' : ''}`}
      style={{
        transform: hovered ? `rotate(${getTilt(task.id)})` : 'rotate(0deg)',
        transition: 'transform 250ms ease',
      }}
      onClick={() => onEdit(task)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        aria-label="Delete task"
        className="absolute top-3 right-3 text-[var(--color-black-40)] hover:text-[var(--color-red)] transition-colors"
        onClick={e => { e.stopPropagation(); onDelete(task.id) }}
      >
        <Trash2 size={14} />
      </button>

      {task.isFocus && (
        <span className="inline-block bg-[var(--color-yellow)] text-[var(--color-black)] text-xs font-bold px-2 py-0.5 rounded mb-2">
          Focus
        </span>
      )}

      <p className={`font-medium text-[var(--color-black)] pr-6 ${task.status === 'done' ? 'line-through' : ''}`}>
        {task.title}
      </p>

      {task.description && (
        <p data-testid="task-description" className="text-sm text-[var(--color-black-60)] mt-1 truncate">
          {task.description}
        </p>
      )}

      <div className="mt-2" onClick={e => e.stopPropagation()}>
        <StatusDropdown taskId={task.id} status={task.status} onStatusChange={onStatusChange} />
      </div>
    </div>
  )
}
