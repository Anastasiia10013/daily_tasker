# M2 — Data Layer Design Spec

## Overview

Pure data layer for Daily Tasker: TypeScript types, Zustand store with localStorage persistence, date/task utility functions, and Vitest unit tests. No UI — this milestone exists to be consumed by M3–M9.

---

## Types (`types/index.ts`)

```typescript
type TaskStatus = 'todo' | 'in-progress' | 'done'

type Task = {
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

---

## Store (`lib/store/taskStore.ts`)

Normalized map keyed by task id, persisted to localStorage via Zustand `persist` middleware.

### Interface

```typescript
type TaskStore = {
  tasks: Record<string, Task>

  // CRUD
  addTask: (input: { title: string; description?: string; status: TaskStatus; isFocus: boolean; date: string }) => void
  updateTask: (id: string, changes: Partial<Pick<Task, 'title' | 'description' | 'status' | 'isFocus' | 'date'>>) => void
  deleteTask: (id: string) => void

  // Focus
  toggleFocus: (id: string) => void

  // Ordering
  reorderTask: (date: string, activeId: string, overId: string) => void
  moveTask: (id: string, newDate: string) => void

  // Selector
  getTasksForWeek: (monday: string) => Task[]
}
```

### Action Behaviors

**`addTask`**
- Auto-generates `id` (crypto.randomUUID), `createdAt` (ISO string), and `order` (max existing order for that date + 1, or 0 if empty)
- Writes to `tasks` map

**`updateTask`**
- Merges `changes` into the existing task by id
- No-ops if id not found

**`deleteTask`**
- Removes task from map by id

**`toggleFocus`**
- If toggling on: count tasks where `isFocus === true && date === task.date` — if already 3, silently no-ops
- If toggling off: always succeeds
- UI is responsible for surfacing the limit to users; store enforces it as a safety net

**`reorderTask(date, activeId, overId)`**
- Gets all tasks for `date`, sorted by `order`
- Finds indices of `activeId` and `overId` in that array
- Applies array-move logic (removes active, inserts at over's index)
- Writes new sequential `order` values (0, 1, 2, …) back to all affected tasks

**`moveTask(id, newDate)`**
- Sets `task.date = newDate`
- Sets `task.order` to max order for `newDate` + 1 (appends to end)

**`getTasksForWeek(monday)`**
- Derives the 7 dates Mon–Sun from `monday` using `getWeekDates`
- Returns all tasks whose `date` falls within those 7 dates
- Unsorted — callers apply `sortTasks` as needed

### Persistence
- Zustand `persist` middleware, key `daily-tasker-tasks`, storage `localStorage`
- Entire `tasks` map is persisted

---

## Utils

### `lib/utils/dates.ts`

```typescript
getMonday(date: string | Date): string
// Normalizes any date to its week's Monday
// Returns YYYY-MM-DD string

getWeekDates(monday: string): string[]
// Returns 7 YYYY-MM-DD strings for Mon–Sun of the given week

formatDate(date: string): string
// Human-readable label, e.g. "Mon Apr 7"
// Used in DayHeader
```

### `lib/utils/tasks.ts`

```typescript
sortTasks(tasks: Task[]): Task[]
// Sort order:
//   1. Focus tasks (isFocus === true)
//   2. Active tasks (status === 'todo' | 'in-progress')
//   3. Done tasks (status === 'done')
// Stable within each group (preserves original order)
// Pure function — no side effects
```

---

## Tests

### `lib/store/taskStore.test.ts`
- `addTask` — creates task with correct id, createdAt, order auto-assigned
- `updateTask` — merges changes, no-ops on unknown id
- `deleteTask` — removes task, no-ops on unknown id
- `toggleFocus` — toggles on/off; blocks when 3 focus tasks already exist for that date; allows toggling off when at limit
- `reorderTask` — correctly reorders tasks within a day, updates order values
- `moveTask` — updates date and appends to end of new date
- `getTasksForWeek` — returns only tasks in the week, excludes tasks outside

### `lib/utils/dates.test.ts`
- `getMonday` — mid-week date, already Monday, Sunday (boundary), Date object input
- `getWeekDates` — returns exactly 7 dates, starts on Monday, ends on Sunday, correct span
- `formatDate` — correct format string output

### `lib/utils/tasks.test.ts`
- `sortTasks` — focus tasks first, done tasks last, active in middle
- `sortTasks` — stable within each group
- `sortTasks` — handles empty array, single item, all same status

### Notes
- Tests use Zustand store directly (no React, no render)
- `persist` middleware excluded in test setup — tests operate on in-memory store only
- All utils are pure functions, no mocking needed

---

## File Structure

```
types/
  index.ts

lib/
  store/
    taskStore.ts
    taskStore.test.ts
  utils/
    dates.ts
    dates.test.ts
    tasks.ts
    tasks.test.ts
```

---

## Out of Scope

- No UI components
- No routing
- No seed/mock data
- `reorderTask` does not account for sort groups (focus/active/done) — that is display logic in `sortTasks`, not storage logic
