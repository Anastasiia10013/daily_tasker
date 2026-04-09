// types/index.ts
export type TaskStatus = 'todo' | 'in-progress' | 'done'

export type Task = {
  id: string           // uuid
  title: string
  description?: string
  status: TaskStatus
  isFocus: boolean     // max 3 per day, enforced in store
  date: string         // YYYY-MM-DD — the specific calendar day
  order: number        // position within the day column
  createdAt: string    // ISO string
}
