"use client"

import { Crosshair, Trash2 } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { StatusDropdown } from './StatusDropdown'
import type { Task, TaskStatus } from '@/types'

function getTilt(id: string): string {
  const sum = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const degrees = (sum % 3) + 1
  const sign = sum % 2 === 0 ? 1 : -1
  return `${sign * degrees}deg`
}

export const BORDER_CLASS: Record<string, string> = {
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
  onToggleFocus: (id: string) => void
  focusLimitReached: boolean
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange, onToggleFocus, focusLimitReached }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const variant = task.isFocus ? 'focus' : task.status
  const focusMuted = !task.isFocus && focusLimitReached

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    '--tilt': getTilt(task.id),
  } as React.CSSProperties

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      data-testid="task-card"
      className={`bg-white rounded-[var(--border-radius)] p-4 cursor-grab active:cursor-grabbing task-card ${BORDER_CLASS[variant]} ${task.status === 'done' ? 'opacity-50' : ''} ${isDragging ? 'opacity-30' : ''}`}
      style={style}
      onClick={() => onEdit(task)}
    >
      {/* Top row: [crosshair + badge] [delete] */}
      <div className="flex items-center gap-2 mb-2">
        <div
          role="button"
          aria-label="Toggle focus"
          className={`flex items-center gap-1.5 ${focusMuted ? 'cursor-default' : 'cursor-pointer'}`}
          onClick={e => { e.stopPropagation(); onToggleFocus(task.id) }}
          onPointerDown={e => e.stopPropagation()}
        >
          <Crosshair
            size={14}
            className={`flex-shrink-0 transition-colors ${
              task.isFocus
                ? 'text-[var(--color-yellow)]'
                : focusMuted
                  ? 'text-[var(--color-black-10)]'
                  : 'text-[var(--color-black-40)]'
            }`}
          />
          {task.isFocus && (
            <span className="bg-[var(--color-yellow)] text-[var(--color-black)] text-xs font-bold px-2 py-0.5 rounded">
              Focus
            </span>
          )}
        </div>

        <button
          aria-label="Delete task"
          className="ml-auto flex-shrink-0 text-[var(--color-black-40)] hover:text-[var(--color-red)] transition-colors"
          onClick={e => { e.stopPropagation(); onDelete(task.id) }}
          onPointerDown={e => e.stopPropagation()}
        >
          <Trash2 size={14} />
        </button>
      </div>

      <p className={`font-medium text-[var(--color-black)] break-words ${task.status === 'done' ? 'line-through' : ''}`}>
        {task.title}
      </p>

      {task.description && (
        <p data-testid="task-description" className="text-sm text-[var(--color-black-60)] mt-1 truncate">
          {task.description}
        </p>
      )}

      <div className="mt-2" onClick={e => e.stopPropagation()} onPointerDown={e => e.stopPropagation()}>
        <StatusDropdown taskId={task.id} status={task.status} onStatusChange={onStatusChange} />
      </div>
    </div>
  )
}
