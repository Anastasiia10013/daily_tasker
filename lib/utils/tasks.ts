import type { Task } from '@/types'

function groupRank(task: Task): number {
  if (task.status === 'done') return task.isFocus ? 3 : 4
  if (task.isFocus) return 0
  if (task.status === 'in-progress') return 1
  return 2 // todo
}

export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const rankDiff = groupRank(a) - groupRank(b)
    if (rankDiff !== 0) return rankDiff
    return a.order - b.order
  })
}
