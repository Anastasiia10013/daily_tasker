import { getWeekDates } from '@/lib/utils/dates'
import type { Task } from '@/types'

const cache = new Map<string, Task[]>()

export function getDemoTasks(monday: string): Task[] {
  if (cache.has(monday)) return cache.get(monday)!
  const d = getWeekDates(monday)
  const tasks: Task[] = [
    {
      id: 'demo-1',
      title: 'Review project requirements',
      description: 'Go through the brief and identify key deliverables',
      status: 'done',
      isFocus: false,
      date: d[0],
      order: 0,
      createdAt: `${d[0]}T08:00:00.000Z`,
    },
    {
      id: 'demo-2',
      title: 'Set up development environment',
      status: 'done',
      isFocus: false,
      date: d[0],
      order: 1,
      createdAt: `${d[0]}T09:00:00.000Z`,
    },
    {
      id: 'demo-3',
      title: 'Design database schema',
      description: 'Map out entities and relationships',
      status: 'in-progress',
      isFocus: true,
      date: d[1],
      order: 0,
      createdAt: `${d[1]}T08:00:00.000Z`,
    },
    {
      id: 'demo-4',
      title: 'Write API endpoints',
      status: 'in-progress',
      isFocus: false,
      date: d[1],
      order: 1,
      createdAt: `${d[1]}T09:00:00.000Z`,
    },
    {
      id: 'demo-5',
      title: 'Build task card component',
      description: 'Includes drag handle and status badge',
      status: 'todo',
      isFocus: true,
      date: d[2],
      order: 0,
      createdAt: `${d[2]}T08:00:00.000Z`,
    },
    {
      id: 'demo-6',
      title: 'Write unit tests',
      status: 'todo',
      isFocus: false,
      date: d[3],
      order: 0,
      createdAt: `${d[3]}T08:00:00.000Z`,
    },
    {
      id: 'demo-7',
      title: 'Deploy to staging',
      description: 'Run smoke tests after deploy',
      status: 'todo',
      isFocus: false,
      date: d[4],
      order: 0,
      createdAt: `${d[4]}T08:00:00.000Z`,
    },
  ]
  cache.set(monday, tasks)
  return tasks
}
