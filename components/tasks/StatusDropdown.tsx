"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { TaskStatus } from '@/types'

const STATUS_LABELS: Record<TaskStatus, string> = {
  'todo': 'Todo',
  'in-progress': 'In progress',
  'done': 'Done',
}

const STATUS_DOT_CLASS: Record<TaskStatus, string> = {
  'todo': 'bg-[var(--color-black-40)]',
  'in-progress': 'bg-[var(--color-sage-green)]',
  'done': 'bg-[var(--color-black-40)]',
}

const STATUS_TEXT_CLASS: Record<TaskStatus, string> = {
  'todo': 'text-[var(--color-black-40)]',
  'in-progress': 'text-[var(--color-sage-green)]',
  'done': 'text-[var(--color-black-40)]',
}

interface StatusDropdownProps {
  taskId: string
  status: TaskStatus
  onStatusChange: (id: string, status: TaskStatus) => void
}

export function StatusDropdown({ taskId, status, onStatusChange }: StatusDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        onClick={e => e.stopPropagation()}
        className={`flex cursor-pointer items-center gap-1.5 text-xs font-medium outline-none min-h-6 ${STATUS_TEXT_CLASS[status]}`}
      >
        <span className={`inline-block size-1.5 rounded-full ${STATUS_DOT_CLASS[status]}`} />
        {STATUS_LABELS[status]}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {(Object.keys(STATUS_LABELS) as TaskStatus[]).map(s => (
          <DropdownMenuItem
            key={s}
            onSelect={() => {
              onStatusChange(taskId, s)
            }}
            onClick={e => e.stopPropagation()}
          >
            <span className={`inline-block size-1.5 rounded-full ${STATUS_DOT_CLASS[s]}`} />
            {STATUS_LABELS[s]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
