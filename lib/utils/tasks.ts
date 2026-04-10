import type { Task } from '@/types'

export function sortTasks(tasks: Task[]): Task[] {
  const active = tasks.filter(t => t.status !== 'done').sort((a, b) => a.order - b.order)
  const done = tasks.filter(t => t.status === 'done').sort((a, b) => a.order - b.order)
  return [...active, ...done]
}
