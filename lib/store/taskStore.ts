import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, TaskStatus } from '@/types'
import { getWeekDates } from '@/lib/utils/dates'
import { getDemoTasks } from '@/lib/demo/demoData'
import { uuid } from '@/lib/utils/uuid'

type AddTaskInput = {
  title: string
  description?: string
  status: TaskStatus
  isFocus: boolean
  date: string
}

type TaskStore = {
  tasks: Record<string, Task>
  isDemoMode: boolean
  addTask: (input: AddTaskInput) => void
  updateTask: (id: string, changes: Partial<Pick<Task, 'title' | 'description' | 'status' | 'isFocus' | 'date'>>) => void
  deleteTask: (id: string) => void
  toggleFocus: (id: string) => void
  reorderTask: (date: string, activeId: string, overId: string) => void
  moveTask: (id: string, newDate: string) => void
  getTasksForWeek: (monday: string) => Task[]
  enterDemoMode: () => void
  exitDemoMode: () => void
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: {},
      isDemoMode: false,

      addTask: (input) => {
        const tasksForDate = Object.values(get().tasks).filter(t => t.date === input.date)
        const maxOrder = tasksForDate.length > 0
          ? Math.max(...tasksForDate.map(t => t.order))
          : -1
        const task: Task = {
          id: uuid(),
          ...input,
          order: maxOrder + 1,
          createdAt: new Date().toISOString(),
        }
        set(state => ({ tasks: { ...state.tasks, [task.id]: task } }))
      },

      updateTask: (id, changes) => {
        set(state => {
          if (!state.tasks[id]) return state
          const task = state.tasks[id]
          const updatedStatus = changes.status ?? task.status
          const wasActive = task.status !== 'done'
          const becomesActive = updatedStatus !== 'done'
          let patch = { ...changes }
          if (!wasActive && becomesActive && task.isFocus) {
            const activeCount = Object.values(state.tasks).filter(
              t => t.id !== id && t.isFocus && t.date === task.date && t.status !== 'done'
            ).length
            if (activeCount >= 3) patch = { ...patch, isFocus: false }
          }
          return { tasks: { ...state.tasks, [id]: { ...task, ...patch } } }
        })
      },

      deleteTask: (id) => {
        set(state => {
          const { [id]: _, ...rest } = state.tasks
          return { tasks: rest }
        })
      },

      toggleFocus: (id) => {
        const { tasks } = get()
        const task = tasks[id]
        if (!task) return
        if (!task.isFocus) {
          const focusCount = Object.values(tasks).filter(
            t => t.isFocus && t.date === task.date && t.id !== id
          ).length
          if (focusCount >= 3) return
        }
        set(state => ({
          tasks: { ...state.tasks, [id]: { ...state.tasks[id], isFocus: !state.tasks[id].isFocus } },
        }))
      },

      reorderTask: (date, activeId, overId) => {
        const { tasks } = get()
        const activeTask = tasks[activeId]
        if (!activeTask) return
        const isDone = activeTask.status === 'done'
        const zoneTasks = Object.values(tasks)
          .filter(t => t.date === date && (isDone ? t.status === 'done' : t.status !== 'done'))
          .sort((a, b) => a.order - b.order)
        const activeIndex = zoneTasks.findIndex(t => t.id === activeId)
        const overIndex = zoneTasks.findIndex(t => t.id === overId)
        if (activeIndex === -1 || overIndex === -1) return
        const reordered = [...zoneTasks]
        const [removed] = reordered.splice(activeIndex, 1)
        reordered.splice(overIndex, 0, removed)
        const updates: Record<string, Task> = {}
        reordered.forEach((t, i) => { updates[t.id] = { ...t, order: i } })
        set(state => ({ tasks: { ...state.tasks, ...updates } }))
      },

      moveTask: (id, newDate) => {
        const { tasks } = get()
        const task = tasks[id]
        if (!task) return
        const tasksForNewDate = Object.values(tasks).filter(t => t.date === newDate && t.id !== id)
        const maxOrder = tasksForNewDate.length > 0
          ? Math.max(...tasksForNewDate.map(t => t.order))
          : -1
        const focusCount = tasksForNewDate.filter(t => t.isFocus).length
        const isFocus = task.isFocus && focusCount < 3
        set(state => ({
          tasks: { ...state.tasks, [id]: { ...state.tasks[id], date: newDate, order: maxOrder + 1, isFocus } }
        }))
      },

      getTasksForWeek: (monday) => {
        if (get().isDemoMode) return getDemoTasks(monday)
        const weekDates = new Set(getWeekDates(monday))
        return Object.values(get().tasks).filter(t => weekDates.has(t.date))
      },

      enterDemoMode: () => set({ isDemoMode: true }),
      exitDemoMode: () => set({ isDemoMode: false }),
    }),
    {
      name: 'daily-tasker-tasks',
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
)
