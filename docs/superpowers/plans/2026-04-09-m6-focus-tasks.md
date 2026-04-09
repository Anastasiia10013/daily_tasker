# M6 — Focus Tasks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Crosshair icon button to TaskCard for quick focus toggling, with a disabled state when the 3-per-day limit is reached and an inline error message in DayColumn.

**Architecture:** `DayColumn` owns the toggle logic — it checks the focus count, shows an inline error when blocked, and calls the store's `toggleFocus` only when allowed. `TaskCard` is a pure presentational component that receives `onToggleFocus` and `focusLimitReached` props. No store changes needed.

**Tech Stack:** React 19, TypeScript, Tailwind v4, Zustand, Vitest + Testing Library

---

## File Map

| File | Change |
|---|---|
| `components/tasks/TaskCard.tsx` | Add `Crosshair` button, two new props |
| `components/tasks/TaskCard.test.tsx` | Update existing renders + add crosshair tests |
| `components/board/DayColumn.tsx` | Add `focusError` state, `handleToggleFocus`, pass new props |
| `components/board/DayColumn.test.tsx` | Add focus toggle tests |

---

## Task 1: Update TaskCard tests (failing first)

**Files:**
- Modify: `components/tasks/TaskCard.test.tsx`

- [ ] **Step 1: Update all existing test renders to pass the two new required props**

Replace the entire file with this content:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { TaskCard } from './TaskCard'
import type { Task } from '@/types'

const BASE_TASK: Task = {
  id: 'test-id-abc',
  title: 'Test task',
  status: 'todo',
  isFocus: false,
  date: '2026-04-07',
  order: 0,
  createdAt: '2026-04-07T00:00:00.000Z',
}

const DEFAULT_PROPS = {
  onEdit: () => {},
  onDelete: () => {},
  onStatusChange: () => {},
  onToggleFocus: () => {},
  focusLimitReached: false,
}

test('renders task title', () => {
  render(<TaskCard task={BASE_TASK} {...DEFAULT_PROPS} />)
  expect(screen.getByText('Test task')).toBeInTheDocument()
})

test('renders description when provided', () => {
  render(<TaskCard task={{ ...BASE_TASK, description: 'My description' }} {...DEFAULT_PROPS} />)
  expect(screen.getByText('My description')).toBeInTheDocument()
})

test('does not render description when not provided', () => {
  render(<TaskCard task={BASE_TASK} {...DEFAULT_PROPS} />)
  expect(screen.queryByTestId('task-description')).not.toBeInTheDocument()
})

test('renders Focus badge for focus tasks', () => {
  render(<TaskCard task={{ ...BASE_TASK, isFocus: true }} {...DEFAULT_PROPS} />)
  expect(screen.getByText('Focus')).toBeInTheDocument()
})

test('does not render Focus badge for non-focus tasks', () => {
  render(<TaskCard task={BASE_TASK} {...DEFAULT_PROPS} />)
  expect(screen.queryByText('Focus')).not.toBeInTheDocument()
})

test('title has line-through class for done tasks', () => {
  render(<TaskCard task={{ ...BASE_TASK, status: 'done' }} {...DEFAULT_PROPS} />)
  expect(screen.getByText('Test task')).toHaveClass('line-through')
})

test('title does not have line-through for todo tasks', () => {
  render(<TaskCard task={BASE_TASK} {...DEFAULT_PROPS} />)
  expect(screen.getByText('Test task')).not.toHaveClass('line-through')
})

test('clicking card body calls onEdit with the task', () => {
  const onEdit = vi.fn()
  render(<TaskCard task={BASE_TASK} {...DEFAULT_PROPS} onEdit={onEdit} />)
  fireEvent.click(screen.getByTestId('task-card'))
  expect(onEdit).toHaveBeenCalledWith(BASE_TASK)
})

test('clicking trash icon calls onDelete with task id', () => {
  const onDelete = vi.fn()
  render(<TaskCard task={BASE_TASK} {...DEFAULT_PROPS} onDelete={onDelete} />)
  fireEvent.click(screen.getByLabelText('Delete task'))
  expect(onDelete).toHaveBeenCalledWith('test-id-abc')
})

test('clicking trash icon does not call onEdit', () => {
  const onEdit = vi.fn()
  render(<TaskCard task={BASE_TASK} {...DEFAULT_PROPS} onEdit={onEdit} />)
  fireEvent.click(screen.getByLabelText('Delete task'))
  expect(onEdit).not.toHaveBeenCalled()
})

test('renders trash icon', () => {
  render(<TaskCard task={BASE_TASK} {...DEFAULT_PROPS} />)
  expect(screen.getByLabelText('Delete task')).toBeInTheDocument()
})

// ─── Crosshair toggle ─────────────────────────────────────────────────────

test('renders crosshair toggle button', () => {
  render(<TaskCard task={BASE_TASK} {...DEFAULT_PROPS} />)
  expect(screen.getByLabelText('Toggle focus')).toBeInTheDocument()
})

test('clicking crosshair calls onToggleFocus with task id', () => {
  const onToggleFocus = vi.fn()
  render(<TaskCard task={BASE_TASK} {...DEFAULT_PROPS} onToggleFocus={onToggleFocus} />)
  fireEvent.click(screen.getByLabelText('Toggle focus'))
  expect(onToggleFocus).toHaveBeenCalledWith('test-id-abc')
})

test('clicking crosshair does not call onEdit', () => {
  const onEdit = vi.fn()
  render(<TaskCard task={BASE_TASK} {...DEFAULT_PROPS} onEdit={onEdit} />)
  fireEvent.click(screen.getByLabelText('Toggle focus'))
  expect(onEdit).not.toHaveBeenCalled()
})

test('crosshair button is disabled when focusLimitReached and task is not focus', () => {
  render(<TaskCard task={BASE_TASK} {...DEFAULT_PROPS} focusLimitReached={true} />)
  expect(screen.getByLabelText('Toggle focus')).toBeDisabled()
})

test('crosshair button is not disabled when task is already a focus task, even at limit', () => {
  render(<TaskCard task={{ ...BASE_TASK, isFocus: true }} {...DEFAULT_PROPS} focusLimitReached={true} />)
  expect(screen.getByLabelText('Toggle focus')).not.toBeDisabled()
})

test('crosshair button is not disabled when limit not reached', () => {
  render(<TaskCard task={BASE_TASK} {...DEFAULT_PROPS} focusLimitReached={false} />)
  expect(screen.getByLabelText('Toggle focus')).not.toBeDisabled()
})
```

- [ ] **Step 2: Run tests and confirm they fail**

```bash
npx vitest run components/tasks/TaskCard.test.tsx
```

Expected: failures on the new crosshair tests (the button doesn't exist yet). The existing tests may also fail due to missing props — that's expected.

---

## Task 2: Implement TaskCard crosshair button

**Files:**
- Modify: `components/tasks/TaskCard.tsx`

- [ ] **Step 1: Replace the entire file with the updated implementation**

```tsx
"use client"

import { Crosshair, Trash2 } from 'lucide-react'
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
  onToggleFocus: (id: string) => void
  focusLimitReached: boolean
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange, onToggleFocus, focusLimitReached }: TaskCardProps) {
  const variant = task.isFocus ? 'focus' : task.status
  const crosshairDisabled = !task.isFocus && focusLimitReached

  return (
    <div
      data-testid="task-card"
      className={`group relative bg-white rounded-[var(--border-radius)] p-4 cursor-pointer task-card ${BORDER_CLASS[variant]} ${task.status === 'done' ? 'opacity-50' : ''}`}
      style={{ '--tilt': getTilt(task.id) } as React.CSSProperties}
      onClick={() => onEdit(task)}
    >
      <button
        aria-label="Toggle focus"
        disabled={crosshairDisabled}
        className={`absolute top-3 left-3 transition-colors ${
          task.isFocus
            ? 'text-[var(--color-yellow)]'
            : crosshairDisabled
              ? 'text-[var(--color-black-10)] cursor-not-allowed'
              : 'text-[var(--color-black-40)] opacity-0 group-hover:opacity-100'
        }`}
        onClick={e => { e.stopPropagation(); onToggleFocus(task.id) }}
      >
        <Crosshair size={14} />
      </button>

      <button
        aria-label="Delete task"
        className="absolute top-3 right-3 text-[var(--color-black-40)] hover:text-[var(--color-red)] transition-colors"
        onClick={e => { e.stopPropagation(); onDelete(task.id) }}
      >
        <Trash2 size={14} />
      </button>

      {task.isFocus && (
        <span className="inline-block bg-[var(--color-yellow)] text-[var(--color-black)] text-xs font-bold px-2 py-0.5 rounded mb-2 ml-5">
          Focus
        </span>
      )}

      <p className={`font-medium text-[var(--color-black)] pr-6 ${task.isFocus ? 'pl-5' : ''} ${task.status === 'done' ? 'line-through' : ''}`}>
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
```

- [ ] **Step 2: Run TaskCard tests and confirm they pass**

```bash
npx vitest run components/tasks/TaskCard.test.tsx
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```
git add components/tasks/TaskCard.tsx components/tasks/TaskCard.test.tsx
```

Commit message: `M6 - add crosshair focus toggle to TaskCard`

---

## Task 3: Add failing DayColumn tests for focus toggle

**Files:**
- Modify: `components/board/DayColumn.test.tsx`

- [ ] **Step 1: Update imports at the top of the file**

The current imports line is:
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { DayColumn } from './DayColumn'
import { useTaskStore } from '@/lib/store/taskStore'
import type { Task } from '@/types'
```

Replace with:
```tsx
import { render, screen, fireEvent, act } from '@testing-library/react'
import { vi } from 'vitest'
import { DayColumn } from './DayColumn'
import { useTaskStore } from '@/lib/store/taskStore'
import type { Task } from '@/types'
```

- [ ] **Step 2: Append focus toggle tests to the end of the file**

```tsx
// ─── Focus toggle ──────────────────────────────────────────────────────────

test('clicking crosshair on a non-focus task calls store toggleFocus', () => {
  const task: Task = { ...BASE, id: 'task-1', title: 'My task', order: 0 }
  useTaskStore.setState({
    tasks: { 'task-1': task },
  })
  const spy = vi.spyOn(useTaskStore.getState(), 'toggleFocus')
  render(<DayColumn date="2026-04-07" tasks={[task]} />)
  fireEvent.click(screen.getByLabelText('Toggle focus'))
  expect(spy).toHaveBeenCalledWith('task-1')
})

test('when 3 focus tasks exist, clicking crosshair on a non-focus task shows error message', () => {
  const makeFocus = (id: string, order: number): Task => ({
    ...BASE, id, title: `Focus ${id}`, order, isFocus: true,
  })
  const nonFocus: Task = { ...BASE, id: 'nf', title: 'Not focus', order: 3 }
  const tasks = [makeFocus('f1', 0), makeFocus('f2', 1), makeFocus('f3', 2), nonFocus]
  render(<DayColumn date="2026-04-07" tasks={tasks} />)
  const buttons = screen.getAllByLabelText('Toggle focus')
  // last card is the non-focus one
  fireEvent.click(buttons[buttons.length - 1])
  expect(screen.getByText('Focus limit reached — max 3 per day')).toBeInTheDocument()
})

test('error message is not shown when focus count is below limit', () => {
  const task: Task = { ...BASE, id: 'task-1', title: 'My task', order: 0 }
  render(<DayColumn date="2026-04-07" tasks={[task]} />)
  expect(screen.queryByText('Focus limit reached — max 3 per day')).not.toBeInTheDocument()
})

test('error message disappears after 2 seconds', async () => {
  vi.useFakeTimers()
  const makeFocus = (id: string, order: number): Task => ({
    ...BASE, id, title: `Focus ${id}`, order, isFocus: true,
  })
  const nonFocus: Task = { ...BASE, id: 'nf', title: 'Not focus', order: 3 }
  const tasks = [makeFocus('f1', 0), makeFocus('f2', 1), makeFocus('f3', 2), nonFocus]
  render(<DayColumn date="2026-04-07" tasks={tasks} />)
  const buttons = screen.getAllByLabelText('Toggle focus')
  fireEvent.click(buttons[buttons.length - 1])
  expect(screen.getByText('Focus limit reached — max 3 per day')).toBeInTheDocument()
  await act(async () => { vi.advanceTimersByTime(2000) })
  expect(screen.queryByText('Focus limit reached — max 3 per day')).not.toBeInTheDocument()
  vi.useRealTimers()
})
```

- [ ] **Step 3: Run tests and confirm new ones fail**

```bash
npx vitest run components/board/DayColumn.test.tsx
```

Expected: the 4 new tests fail (DayColumn doesn't pass `onToggleFocus` or `focusLimitReached` to TaskCard yet, and has no error state).

---

## Task 4: Implement DayColumn focus toggle logic

**Files:**
- Modify: `components/board/DayColumn.tsx`

- [ ] **Step 1: Replace the entire file with the updated implementation**

```tsx
"use client"

import React, { useState } from 'react'
import { DayHeader } from './DayHeader'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskForm } from '@/components/tasks/TaskForm'
import { useTaskStore } from '@/lib/store/taskStore'
import { sortTasks } from '@/lib/utils/tasks'
import type { Task, TaskStatus } from '@/types'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

interface DayColumnProps {
  date: string
  tasks: Task[]
}

export function DayColumn({ date, tasks }: DayColumnProps) {
  const [y, m, d] = date.split('-').map(Number)
  const dateObj = new Date(y, m - 1, d)
  const dayName = DAY_NAMES[dateObj.getDay()]
  const shortDate = `${MONTHS[m - 1]} ${d}`

  const [open, setOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [focusError, setFocusError] = useState(false)

  const { deleteTask, updateTask, toggleFocus } = useTaskStore()

  const focusCount = tasks.filter(t => t.isFocus).length
  const focusLimitReached = focusCount >= 3

  const handleAdd = () => { setEditTask(null); setOpen(true) }
  const handleEdit = (task: Task) => { setEditTask(task); setOpen(true) }
  const handleDelete = (id: string) => deleteTask(id)
  const handleStatusChange = (id: string, status: TaskStatus) => updateTask(id, { status })

  const handleToggleFocus = (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    if (!task.isFocus && focusLimitReached) {
      setFocusError(true)
      setTimeout(() => setFocusError(false), 2000)
      return
    }
    toggleFocus(id)
  }

  const sorted = sortTasks(tasks)

  return (
    <div className="flex flex-col min-w-[200px]">
      <DayHeader dayName={dayName} date={shortDate} onAdd={handleAdd} />
      {focusError && (
        <p className="text-xs text-[var(--color-red)] mt-1">Focus limit reached — max 3 per day</p>
      )}
      <div className="flex flex-col gap-2 pt-2">
        {sorted.map((task, i) => (
          <React.Fragment key={task.id}>
            {i > 0 && task.status === 'done' && sorted[i - 1].status !== 'done' && (
              <hr className="border-[var(--color-black-10)] my-2" />
            )}
            <TaskCard
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onToggleFocus={handleToggleFocus}
              focusLimitReached={focusLimitReached}
            />
          </React.Fragment>
        ))}
      </div>
      <TaskForm
        open={open}
        onClose={() => setOpen(false)}
        date={date}
        editTask={editTask ?? undefined}
      />
    </div>
  )
}
```

- [ ] **Step 2: Run DayColumn tests and confirm they pass**

```bash
npx vitest run components/board/DayColumn.test.tsx
```

Expected: all tests pass.

- [ ] **Step 3: Run the full test suite to confirm nothing is broken**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```
git add components/board/DayColumn.tsx components/board/DayColumn.test.tsx
```

Commit message: `M6 - wire focus toggle and error feedback in DayColumn`
