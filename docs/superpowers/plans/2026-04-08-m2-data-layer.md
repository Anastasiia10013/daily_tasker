# M2 — Data Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the full data layer — types, Zustand store, date/task utilities, and Vitest unit tests — with no UI.

**Architecture:** Normalized `Record<string, Task>` store persisted to localStorage via Zustand `persist`. Pure utility functions in `lib/utils/`. Types in `types/index.ts`. Every module is test-driven.

**Tech Stack:** TypeScript, Zustand v5, `zustand/middleware` (persist), Vitest

---

## File Map

| File | Responsibility |
|---|---|
| `types/index.ts` | `Task` type and `TaskStatus` union |
| `lib/utils/dates.ts` | `getMonday`, `getWeekDates`, `formatDate` |
| `lib/utils/dates.test.ts` | Unit tests for date utils |
| `lib/utils/tasks.ts` | `sortTasks` — pure sort function |
| `lib/utils/tasks.test.ts` | Unit tests for `sortTasks` |
| `lib/store/taskStore.ts` | `useTaskStore` — Zustand store with all actions |
| `lib/store/taskStore.test.ts` | Unit tests for every store action |

---

## Task 1: Types

**Files:**
- Create: `types/index.ts`

- [ ] **Step 1: Create the types file**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add types/index.ts
git commit -m "feat: add Task and TaskStatus types"
```

---

## Task 2: Date Utilities (TDD)

**Files:**
- Create: `lib/utils/dates.ts`
- Create: `lib/utils/dates.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// lib/utils/dates.test.ts
import { describe, it, expect } from 'vitest'
import { getMonday, getWeekDates, formatDate } from '@/lib/utils/dates'

describe('getMonday', () => {
  it('returns Monday when given a Wednesday', () => {
    expect(getMonday('2026-04-08')).toBe('2026-04-06')
  })

  it('returns the same date when given a Monday', () => {
    expect(getMonday('2026-04-06')).toBe('2026-04-06')
  })

  it('returns Monday when given a Sunday', () => {
    expect(getMonday('2026-04-12')).toBe('2026-04-06')
  })

  it('accepts a Date object', () => {
    expect(getMonday(new Date(2026, 3, 8))).toBe('2026-04-06') // April 8 = Wednesday
  })
})

describe('getWeekDates', () => {
  it('returns exactly 7 dates', () => {
    expect(getWeekDates('2026-04-06')).toHaveLength(7)
  })

  it('starts on the given Monday', () => {
    expect(getWeekDates('2026-04-06')[0]).toBe('2026-04-06')
  })

  it('ends on Sunday', () => {
    expect(getWeekDates('2026-04-06')[6]).toBe('2026-04-12')
  })

  it('returns all 7 sequential dates Mon–Sun', () => {
    expect(getWeekDates('2026-04-06')).toEqual([
      '2026-04-06', '2026-04-07', '2026-04-08', '2026-04-09',
      '2026-04-10', '2026-04-11', '2026-04-12',
    ])
  })
})

describe('formatDate', () => {
  it('formats a date as "Mon Apr 6"', () => {
    expect(formatDate('2026-04-06')).toBe('Mon Apr 6')
  })

  it('formats a date at month end correctly', () => {
    expect(formatDate('2026-04-12')).toBe('Sun Apr 12')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run lib/utils/dates.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/utils/dates'`

- [ ] **Step 3: Implement date utils**

```typescript
// lib/utils/dates.ts
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function toLocalDate(date: string | Date): Date {
  if (typeof date === 'string') {
    const [year, month, day] = date.split('-').map(Number)
    return new Date(year, month - 1, day)
  }
  return new Date(date)
}

function toDateString(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function getMonday(date: string | Date): string {
  const d = toLocalDate(date)
  const day = d.getDay() // 0 = Sun, 1 = Mon, ...
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return toDateString(d)
}

export function getWeekDates(monday: string): string[] {
  const [year, month, day] = monday.split('-').map(Number)
  const start = new Date(year, month - 1, day)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return toDateString(d)
  })
}

export function formatDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return `${WEEKDAYS[d.getDay()]} ${MONTHS[d.getMonth()]} ${day}`
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run lib/utils/dates.test.ts
```

Expected: all tests PASS

- [ ] **Step 5: Commit**

```bash
git add lib/utils/dates.ts lib/utils/dates.test.ts
git commit -m "feat: add date utilities with unit tests"
```

---

## Task 3: Task Sort Utility (TDD)

**Files:**
- Create: `lib/utils/tasks.ts`
- Create: `lib/utils/tasks.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// lib/utils/tasks.test.ts
import { describe, it, expect } from 'vitest'
import { sortTasks } from '@/lib/utils/tasks'
import type { Task } from '@/types'

const makeTask = (overrides: Partial<Task>): Task => ({
  id: 'test-id',
  title: 'Test',
  status: 'todo',
  isFocus: false,
  date: '2026-04-06',
  order: 0,
  createdAt: '2026-04-06T00:00:00Z',
  ...overrides,
})

describe('sortTasks', () => {
  it('returns an empty array for empty input', () => {
    expect(sortTasks([])).toEqual([])
  })

  it('puts focus tasks before non-focus tasks', () => {
    const tasks = [
      makeTask({ id: 'a', order: 0, isFocus: false }),
      makeTask({ id: 'b', order: 1, isFocus: true }),
    ]
    const sorted = sortTasks(tasks)
    expect(sorted[0].id).toBe('b')
    expect(sorted[1].id).toBe('a')
  })

  it('puts done tasks after active tasks', () => {
    const tasks = [
      makeTask({ id: 'a', order: 0, status: 'done' }),
      makeTask({ id: 'b', order: 1, status: 'todo' }),
    ]
    const sorted = sortTasks(tasks)
    expect(sorted[0].id).toBe('b')
    expect(sorted[1].id).toBe('a')
  })

  it('orders: focus → active → done', () => {
    const tasks = [
      makeTask({ id: 'done', order: 0, status: 'done' }),
      makeTask({ id: 'active', order: 1, status: 'in-progress' }),
      makeTask({ id: 'focus', order: 2, isFocus: true }),
    ]
    expect(sortTasks(tasks).map(t => t.id)).toEqual(['focus', 'active', 'done'])
  })

  it('preserves order within each group', () => {
    const tasks = [
      makeTask({ id: 'a', order: 0, status: 'todo' }),
      makeTask({ id: 'b', order: 1, status: 'todo' }),
      makeTask({ id: 'c', order: 2, status: 'todo' }),
    ]
    expect(sortTasks(tasks).map(t => t.id)).toEqual(['a', 'b', 'c'])
  })

  it('does not mutate the input array', () => {
    const tasks = [
      makeTask({ id: 'a', order: 0, status: 'done' }),
      makeTask({ id: 'b', order: 1, status: 'todo' }),
    ]
    const copy = [...tasks]
    sortTasks(tasks)
    expect(tasks[0].id).toBe(copy[0].id)
    expect(tasks[1].id).toBe(copy[1].id)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run lib/utils/tasks.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/utils/tasks'`

- [ ] **Step 3: Implement sortTasks**

```typescript
// lib/utils/tasks.ts
import type { Task } from '@/types'

function groupRank(task: Task): number {
  if (task.isFocus) return 0
  if (task.status === 'done') return 2
  return 1
}

export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const rankDiff = groupRank(a) - groupRank(b)
    if (rankDiff !== 0) return rankDiff
    return a.order - b.order
  })
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run lib/utils/tasks.test.ts
```

Expected: all tests PASS

- [ ] **Step 5: Commit**

```bash
git add lib/utils/tasks.ts lib/utils/tasks.test.ts
git commit -m "feat: add sortTasks utility with unit tests"
```

---

## Task 4: Zustand Store (TDD)

**Files:**
- Create: `lib/store/taskStore.ts`
- Create: `lib/store/taskStore.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// lib/store/taskStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useTaskStore } from '@/lib/store/taskStore'

beforeEach(() => {
  useTaskStore.setState({ tasks: {} }, true)
})

// ─── addTask ───────────────────────────────────────────────────────────────

describe('addTask', () => {
  it('creates a task with the given fields', () => {
    useTaskStore.getState().addTask({
      title: 'My Task',
      status: 'todo',
      isFocus: false,
      date: '2026-04-06',
    })
    const tasks = Object.values(useTaskStore.getState().tasks)
    expect(tasks).toHaveLength(1)
    expect(tasks[0].title).toBe('My Task')
    expect(tasks[0].status).toBe('todo')
    expect(tasks[0].isFocus).toBe(false)
    expect(tasks[0].date).toBe('2026-04-06')
  })

  it('auto-assigns a uuid id, createdAt, and order 0 for the first task', () => {
    useTaskStore.getState().addTask({ title: 'T', status: 'todo', isFocus: false, date: '2026-04-06' })
    const task = Object.values(useTaskStore.getState().tasks)[0]
    expect(task.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
    expect(task.createdAt).toBeTruthy()
    expect(task.order).toBe(0)
  })

  it('assigns incrementing order for tasks on the same date', () => {
    useTaskStore.getState().addTask({ title: 'A', status: 'todo', isFocus: false, date: '2026-04-06' })
    useTaskStore.getState().addTask({ title: 'B', status: 'todo', isFocus: false, date: '2026-04-06' })
    const tasks = Object.values(useTaskStore.getState().tasks).sort((a, b) => a.order - b.order)
    expect(tasks[0].order).toBe(0)
    expect(tasks[1].order).toBe(1)
  })

  it('assigns order 0 for the first task on a different date', () => {
    useTaskStore.getState().addTask({ title: 'A', status: 'todo', isFocus: false, date: '2026-04-06' })
    useTaskStore.getState().addTask({ title: 'B', status: 'todo', isFocus: false, date: '2026-04-07' })
    const taskB = Object.values(useTaskStore.getState().tasks).find(t => t.date === '2026-04-07')!
    expect(taskB.order).toBe(0)
  })
})

// ─── updateTask ────────────────────────────────────────────────────────────

describe('updateTask', () => {
  it('merges changes into the task', () => {
    useTaskStore.getState().addTask({ title: 'Old', status: 'todo', isFocus: false, date: '2026-04-06' })
    const id = Object.keys(useTaskStore.getState().tasks)[0]
    useTaskStore.getState().updateTask(id, { title: 'New', status: 'done' })
    const task = useTaskStore.getState().tasks[id]
    expect(task.title).toBe('New')
    expect(task.status).toBe('done')
  })

  it('no-ops when id is not found', () => {
    useTaskStore.getState().addTask({ title: 'T', status: 'todo', isFocus: false, date: '2026-04-06' })
    const before = { ...useTaskStore.getState().tasks }
    useTaskStore.getState().updateTask('nonexistent', { title: 'X' })
    expect(useTaskStore.getState().tasks).toEqual(before)
  })
})

// ─── deleteTask ────────────────────────────────────────────────────────────

describe('deleteTask', () => {
  it('removes the task by id', () => {
    useTaskStore.getState().addTask({ title: 'T', status: 'todo', isFocus: false, date: '2026-04-06' })
    const id = Object.keys(useTaskStore.getState().tasks)[0]
    useTaskStore.getState().deleteTask(id)
    expect(useTaskStore.getState().tasks[id]).toBeUndefined()
  })

  it('no-ops when id is not found', () => {
    useTaskStore.getState().addTask({ title: 'T', status: 'todo', isFocus: false, date: '2026-04-06' })
    const before = { ...useTaskStore.getState().tasks }
    useTaskStore.getState().deleteTask('nonexistent')
    expect(useTaskStore.getState().tasks).toEqual(before)
  })
})

// ─── toggleFocus ───────────────────────────────────────────────────────────

describe('toggleFocus', () => {
  it('sets isFocus to true when toggling on', () => {
    useTaskStore.getState().addTask({ title: 'T', status: 'todo', isFocus: false, date: '2026-04-06' })
    const id = Object.keys(useTaskStore.getState().tasks)[0]
    useTaskStore.getState().toggleFocus(id)
    expect(useTaskStore.getState().tasks[id].isFocus).toBe(true)
  })

  it('sets isFocus to false when toggling off', () => {
    useTaskStore.getState().addTask({ title: 'T', status: 'todo', isFocus: true, date: '2026-04-06' })
    const id = Object.keys(useTaskStore.getState().tasks)[0]
    useTaskStore.getState().toggleFocus(id)
    expect(useTaskStore.getState().tasks[id].isFocus).toBe(false)
  })

  it('blocks toggling on when 3 focus tasks already exist for that date', () => {
    const store = useTaskStore.getState()
    store.addTask({ title: 'F1', status: 'todo', isFocus: true, date: '2026-04-06' })
    store.addTask({ title: 'F2', status: 'todo', isFocus: true, date: '2026-04-06' })
    store.addTask({ title: 'F3', status: 'todo', isFocus: true, date: '2026-04-06' })
    store.addTask({ title: 'F4', status: 'todo', isFocus: false, date: '2026-04-06' })
    const f4 = Object.values(useTaskStore.getState().tasks).find(t => t.title === 'F4')!
    useTaskStore.getState().toggleFocus(f4.id)
    expect(useTaskStore.getState().tasks[f4.id].isFocus).toBe(false)
  })

  it('allows toggling off when already at the 3-task limit', () => {
    const store = useTaskStore.getState()
    store.addTask({ title: 'F1', status: 'todo', isFocus: true, date: '2026-04-06' })
    store.addTask({ title: 'F2', status: 'todo', isFocus: true, date: '2026-04-06' })
    store.addTask({ title: 'F3', status: 'todo', isFocus: true, date: '2026-04-06' })
    const f1 = Object.values(useTaskStore.getState().tasks).find(t => t.title === 'F1')!
    useTaskStore.getState().toggleFocus(f1.id)
    expect(useTaskStore.getState().tasks[f1.id].isFocus).toBe(false)
  })

  it('does not block focus tasks on other dates', () => {
    const store = useTaskStore.getState()
    store.addTask({ title: 'F1', status: 'todo', isFocus: true, date: '2026-04-06' })
    store.addTask({ title: 'F2', status: 'todo', isFocus: true, date: '2026-04-06' })
    store.addTask({ title: 'F3', status: 'todo', isFocus: true, date: '2026-04-06' })
    store.addTask({ title: 'Other', status: 'todo', isFocus: false, date: '2026-04-07' })
    const other = Object.values(useTaskStore.getState().tasks).find(t => t.title === 'Other')!
    useTaskStore.getState().toggleFocus(other.id)
    expect(useTaskStore.getState().tasks[other.id].isFocus).toBe(true)
  })
})

// ─── reorderTask ───────────────────────────────────────────────────────────

describe('reorderTask', () => {
  it('moves a task from one position to another', () => {
    const store = useTaskStore.getState()
    store.addTask({ title: 'A', status: 'todo', isFocus: false, date: '2026-04-06' })
    store.addTask({ title: 'B', status: 'todo', isFocus: false, date: '2026-04-06' })
    store.addTask({ title: 'C', status: 'todo', isFocus: false, date: '2026-04-06' })
    const [a, b, c] = Object.values(useTaskStore.getState().tasks).sort((x, y) => x.order - y.order)
    useTaskStore.getState().reorderTask('2026-04-06', c.id, a.id) // move C before A
    const reordered = Object.values(useTaskStore.getState().tasks).sort((x, y) => x.order - y.order)
    expect(reordered.map(t => t.title)).toEqual(['C', 'A', 'B'])
  })

  it('writes sequential order values starting from 0', () => {
    const store = useTaskStore.getState()
    store.addTask({ title: 'A', status: 'todo', isFocus: false, date: '2026-04-06' })
    store.addTask({ title: 'B', status: 'todo', isFocus: false, date: '2026-04-06' })
    const [first, second] = Object.values(useTaskStore.getState().tasks).sort((a, b) => a.order - b.order)
    useTaskStore.getState().reorderTask('2026-04-06', second.id, first.id)
    const reordered = Object.values(useTaskStore.getState().tasks).sort((a, b) => a.order - b.order)
    expect(reordered[0].order).toBe(0)
    expect(reordered[1].order).toBe(1)
  })

  it('no-ops if activeId or overId is not found', () => {
    useTaskStore.getState().addTask({ title: 'A', status: 'todo', isFocus: false, date: '2026-04-06' })
    const before = { ...useTaskStore.getState().tasks }
    useTaskStore.getState().reorderTask('2026-04-06', 'bad-id', 'also-bad')
    expect(useTaskStore.getState().tasks).toEqual(before)
  })
})

// ─── moveTask ──────────────────────────────────────────────────────────────

describe('moveTask', () => {
  it('updates the task date', () => {
    useTaskStore.getState().addTask({ title: 'T', status: 'todo', isFocus: false, date: '2026-04-06' })
    const id = Object.keys(useTaskStore.getState().tasks)[0]
    useTaskStore.getState().moveTask(id, '2026-04-07')
    expect(useTaskStore.getState().tasks[id].date).toBe('2026-04-07')
  })

  it('appends to end of new date (max order + 1)', () => {
    const store = useTaskStore.getState()
    store.addTask({ title: 'Existing', status: 'todo', isFocus: false, date: '2026-04-07' })
    store.addTask({ title: 'Moving', status: 'todo', isFocus: false, date: '2026-04-06' })
    const existing = Object.values(useTaskStore.getState().tasks).find(t => t.title === 'Existing')!
    const moving = Object.values(useTaskStore.getState().tasks).find(t => t.title === 'Moving')!
    useTaskStore.getState().moveTask(moving.id, '2026-04-07')
    expect(useTaskStore.getState().tasks[moving.id].order).toBe(existing.order + 1)
  })

  it('no-ops if id is not found', () => {
    const before = { ...useTaskStore.getState().tasks }
    useTaskStore.getState().moveTask('nonexistent', '2026-04-07')
    expect(useTaskStore.getState().tasks).toEqual(before)
  })
})

// ─── getTasksForWeek ───────────────────────────────────────────────────────

describe('getTasksForWeek', () => {
  it('returns tasks that fall within the week', () => {
    const store = useTaskStore.getState()
    store.addTask({ title: 'In week', status: 'todo', isFocus: false, date: '2026-04-08' })
    store.addTask({ title: 'Outside week', status: 'todo', isFocus: false, date: '2026-04-13' })
    const result = useTaskStore.getState().getTasksForWeek('2026-04-06')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('In week')
  })

  it('includes tasks on Monday and Sunday (boundaries)', () => {
    const store = useTaskStore.getState()
    store.addTask({ title: 'Mon', status: 'todo', isFocus: false, date: '2026-04-06' })
    store.addTask({ title: 'Sun', status: 'todo', isFocus: false, date: '2026-04-12' })
    const result = useTaskStore.getState().getTasksForWeek('2026-04-06')
    expect(result).toHaveLength(2)
  })

  it('returns empty array when no tasks exist for the week', () => {
    const result = useTaskStore.getState().getTasksForWeek('2026-04-06')
    expect(result).toHaveLength(0)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run lib/store/taskStore.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/store/taskStore'`

- [ ] **Step 3: Implement the store**

```typescript
// lib/store/taskStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, TaskStatus } from '@/types'
import { getWeekDates } from '@/lib/utils/dates'

type AddTaskInput = {
  title: string
  description?: string
  status: TaskStatus
  isFocus: boolean
  date: string
}

type TaskStore = {
  tasks: Record<string, Task>
  addTask: (input: AddTaskInput) => void
  updateTask: (id: string, changes: Partial<Pick<Task, 'title' | 'description' | 'status' | 'isFocus' | 'date'>>) => void
  deleteTask: (id: string) => void
  toggleFocus: (id: string) => void
  reorderTask: (date: string, activeId: string, overId: string) => void
  moveTask: (id: string, newDate: string) => void
  getTasksForWeek: (monday: string) => Task[]
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: {},

      addTask: (input) => {
        const tasksForDate = Object.values(get().tasks).filter(t => t.date === input.date)
        const maxOrder = tasksForDate.length > 0
          ? Math.max(...tasksForDate.map(t => t.order))
          : -1
        const task: Task = {
          id: crypto.randomUUID(),
          ...input,
          order: maxOrder + 1,
          createdAt: new Date().toISOString(),
        }
        set(state => ({ tasks: { ...state.tasks, [task.id]: task } }))
      },

      updateTask: (id, changes) => {
        set(state => {
          if (!state.tasks[id]) return state
          return { tasks: { ...state.tasks, [id]: { ...state.tasks[id], ...changes } } }
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
        const dayTasks = Object.values(get().tasks)
          .filter(t => t.date === date)
          .sort((a, b) => a.order - b.order)

        const activeIndex = dayTasks.findIndex(t => t.id === activeId)
        const overIndex = dayTasks.findIndex(t => t.id === overId)
        if (activeIndex === -1 || overIndex === -1) return

        const reordered = [...dayTasks]
        const [removed] = reordered.splice(activeIndex, 1)
        reordered.splice(overIndex, 0, removed)

        const updates: Record<string, Task> = {}
        reordered.forEach((t, i) => {
          updates[t.id] = { ...t, order: i }
        })

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
        set(state => ({
          tasks: { ...state.tasks, [id]: { ...state.tasks[id], date: newDate, order: maxOrder + 1 } },
        }))
      },

      getTasksForWeek: (monday) => {
        const weekDates = new Set(getWeekDates(monday))
        return Object.values(get().tasks).filter(t => weekDates.has(t.date))
      },
    }),
    { name: 'daily-tasker-tasks' }
  )
)
```

- [ ] **Step 4: Run all tests to verify everything passes**

```bash
npx vitest run
```

Expected: all tests PASS across all 3 test files

- [ ] **Step 5: Commit**

```bash
git add lib/store/taskStore.ts lib/store/taskStore.test.ts
git commit -m "feat: add Zustand task store with unit tests"
```
