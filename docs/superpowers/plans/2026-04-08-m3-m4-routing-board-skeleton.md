# M3+M4 — Routing & Board Skeleton Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Commit policy:** Do NOT run `git commit` or `git add`. After each task's tests pass, output a commit block telling the user the files to stage and the exact commit message to use.

**Goal:** Wire up URL-based week routing and render a navigable board skeleton with 7 empty day columns.

**Architecture:** `app/page.tsx` redirects to the current week. `app/week/[date]/page.tsx` is a Server Component that computes week dates and passes them to `WeekBoard`. WeekNav receives `prevHref`/`nextHref` as props and uses `<Link>` for navigation — no client-side router logic.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, Tailwind v4, next/link, Vitest + Testing Library

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `components/ui/WeekNav.tsx` | Modify | Change interface from callbacks to hrefs, buttons → Links |
| `components/ui/WeekNav.test.tsx` | Modify | Test href attributes instead of callback invocation |
| `lib/utils/dates.ts` | Modify | Add `formatWeekLabel` utility |
| `lib/utils/dates.test.ts` | Modify | Tests for `formatWeekLabel` |
| `components/board/WeekBoard.tsx` | Create | Renders 7 DayColumns from dates + tasks props |
| `components/board/WeekBoard.test.tsx` | Create | Tests WeekBoard renders all 7 day names |
| `components/board/DayColumn.tsx` | Create | Renders DayHeader + sorted task list for one day |
| `components/board/DayColumn.test.tsx` | Create | Tests DayColumn renders header and sorts tasks |
| `app/page.tsx` | Modify | Replace boilerplate with redirect to current week |
| `app/week/[date]/page.tsx` | Create | Server Component: validate date, render WeekNav + WeekBoard |
| `app/week/[date]/loading.tsx` | Create | Loading skeleton for the week page |

---

## Task 1: Update WeekNav — callbacks → Link hrefs

**Files:**
- Modify: `components/ui/WeekNav.tsx`
- Modify: `components/ui/WeekNav.test.tsx`

- [ ] **Step 1: Write the failing test**

Replace the entire content of `components/ui/WeekNav.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { WeekNav } from './WeekNav'

test('renders week label', () => {
  render(<WeekNav label="Apr 6–12, 2026" prevHref="/week/2026-03-30" nextHref="/week/2026-04-13" />)
  expect(screen.getByText('Apr 6–12, 2026')).toBeInTheDocument()
})

test('prev link points to previous week', () => {
  render(<WeekNav label="Apr 6–12, 2026" prevHref="/week/2026-03-30" nextHref="/week/2026-04-13" />)
  const link = screen.getByRole('link', { name: /previous week/i })
  expect(link).toHaveAttribute('href', '/week/2026-03-30')
})

test('next link points to next week', () => {
  render(<WeekNav label="Apr 6–12, 2026" prevHref="/week/2026-03-30" nextHref="/week/2026-04-13" />)
  const link = screen.getByRole('link', { name: /next week/i })
  expect(link).toHaveAttribute('href', '/week/2026-04-13')
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run components/ui/WeekNav.test.tsx
```

Expected: 3 failures — `prevHref`/`nextHref` not in interface, no link roles.

- [ ] **Step 3: Update WeekNav component**

Replace the entire content of `components/ui/WeekNav.tsx`:

```tsx
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface WeekNavProps {
  label: string
  prevHref: string
  nextHref: string
}

export function WeekNav({ label, prevHref, nextHref }: WeekNavProps) {
  return (
    <div className="flex items-center gap-3">
      <Link
        href={prevHref}
        aria-label="Previous week"
        className="p-1 rounded hover:bg-muted transition-colors duration-[var(--duration-default)]"
      >
        <ChevronLeft size={20} />
      </Link>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <Link
        href={nextHref}
        aria-label="Next week"
        className="p-1 rounded hover:bg-muted transition-colors duration-[var(--duration-default)]"
      >
        <ChevronRight size={20} />
      </Link>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run components/ui/WeekNav.test.tsx
```

Expected: 3 passed.

- [ ] **Step 5: Commit**

Stage: `components/ui/WeekNav.tsx`, `components/ui/WeekNav.test.tsx`
Message: `feat: update WeekNav to use Link hrefs instead of callbacks`

---

## Task 2: Add formatWeekLabel utility

**Files:**
- Modify: `lib/utils/dates.ts`
- Modify: `lib/utils/dates.test.ts`

- [ ] **Step 1: Write the failing tests**

Open `lib/utils/dates.test.ts` and add at the bottom:

```ts
import { formatWeekLabel } from './dates'

describe('formatWeekLabel', () => {
  test('same-month week', () => {
    // 2026-04-06 is Monday Apr 6; week ends Apr 12
    expect(formatWeekLabel('2026-04-06')).toBe('Apr 6–12, 2026')
  })

  test('cross-month week', () => {
    // 2026-03-30 is Monday Mar 30; week ends Apr 5
    expect(formatWeekLabel('2026-03-30')).toBe('Mar 30 – Apr 5, 2026')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run lib/utils/dates.test.ts
```

Expected: 2 failures — `formatWeekLabel` not exported.

- [ ] **Step 3: Add formatWeekLabel to dates.ts**

Open `lib/utils/dates.ts` and add this export after `formatDate`:

```ts
export function formatWeekLabel(monday: string): string {
  const dates = getWeekDates(monday)
  const [, fm, fd] = dates[0].split('-').map(Number)
  const [ly, lm, ld] = dates[6].split('-').map(Number)
  const firstMonthName = MONTHS[fm - 1]
  const lastMonthName = MONTHS[lm - 1]
  if (fm === lm) {
    return `${firstMonthName} ${fd}–${ld}, ${ly}`
  }
  return `${firstMonthName} ${fd} – ${lastMonthName} ${ld}, ${ly}`
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run lib/utils/dates.test.ts
```

Expected: all passed (new tests + existing).

- [ ] **Step 5: Commit**

Stage: `lib/utils/dates.ts`, `lib/utils/dates.test.ts`
Message: `feat: add formatWeekLabel utility`

---

## Task 3: Create DayColumn component

**Files:**
- Create: `components/board/DayColumn.tsx`
- Create: `components/board/DayColumn.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `components/board/DayColumn.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { DayColumn } from './DayColumn'
import type { Task } from '@/types'

const BASE: Omit<Task, 'id' | 'title' | 'order'> = {
  description: undefined,
  status: 'todo',
  isFocus: false,
  date: '2026-04-07',
  createdAt: '2026-04-07T00:00:00.000Z',
}

test('renders day name and formatted date', () => {
  render(<DayColumn date="2026-04-07" tasks={[]} />)
  expect(screen.getByText('Tuesday')).toBeInTheDocument()
  expect(screen.getByText('Apr 7')).toBeInTheDocument()
})

test('renders tasks sorted: focus → active → done', () => {
  const tasks: Task[] = [
    { ...BASE, id: '1', title: 'Done task', order: 0, status: 'done' },
    { ...BASE, id: '2', title: 'Focus task', order: 1, isFocus: true },
    { ...BASE, id: '3', title: 'Active task', order: 2 },
  ]
  render(<DayColumn date="2026-04-07" tasks={tasks} />)
  const items = screen.getAllByTestId('task-placeholder')
  expect(items[0]).toHaveTextContent('Focus task')
  expect(items[1]).toHaveTextContent('Active task')
  expect(items[2]).toHaveTextContent('Done task')
})

test('renders nothing for tasks on a different date', () => {
  // DayColumn receives pre-filtered tasks, so this just verifies empty renders fine
  render(<DayColumn date="2026-04-07" tasks={[]} />)
  expect(screen.queryByTestId('task-placeholder')).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run components/board/DayColumn.test.tsx
```

Expected: failures — module not found.

- [ ] **Step 3: Create DayColumn component**

Create `components/board/DayColumn.tsx`:

```tsx
import { DayHeader } from './DayHeader'
import { sortTasks } from '@/lib/utils/tasks'
import type { Task } from '@/types'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

interface DayColumnProps {
  date: string   // YYYY-MM-DD
  tasks: Task[]  // pre-filtered for this date
}

export function DayColumn({ date, tasks }: DayColumnProps) {
  const [y, m, d] = date.split('-').map(Number)
  const dateObj = new Date(y, m - 1, d)
  const dayName = DAY_NAMES[dateObj.getDay()]
  const shortDate = `${MONTHS[m - 1]} ${d}`

  const sorted = sortTasks(tasks)

  return (
    <div className="flex flex-col min-w-[200px]">
      <DayHeader dayName={dayName} date={shortDate} />
      <div className="flex flex-col gap-2 pt-2">
        {sorted.map(task => (
          <div key={task.id} data-testid="task-placeholder" className="p-2 bg-white rounded border border-[var(--color-black-10)] text-sm">
            {task.title}
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run components/board/DayColumn.test.tsx
```

Expected: 3 passed.

- [ ] **Step 5: Commit**

Stage: `components/board/DayColumn.tsx`, `components/board/DayColumn.test.tsx`
Message: `feat: add DayColumn component`

---

## Task 4: Create WeekBoard component

**Files:**
- Create: `components/board/WeekBoard.tsx`
- Create: `components/board/WeekBoard.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `components/board/WeekBoard.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { WeekBoard } from './WeekBoard'

const DATES = [
  '2026-04-06', // Monday
  '2026-04-07', // Tuesday
  '2026-04-08', // Wednesday
  '2026-04-09', // Thursday
  '2026-04-10', // Friday
  '2026-04-11', // Saturday
  '2026-04-12', // Sunday
]

test('renders all 7 day names', () => {
  render(<WeekBoard dates={DATES} tasks={[]} />)
  expect(screen.getByText('Monday')).toBeInTheDocument()
  expect(screen.getByText('Tuesday')).toBeInTheDocument()
  expect(screen.getByText('Wednesday')).toBeInTheDocument()
  expect(screen.getByText('Thursday')).toBeInTheDocument()
  expect(screen.getByText('Friday')).toBeInTheDocument()
  expect(screen.getByText('Saturday')).toBeInTheDocument()
  expect(screen.getByText('Sunday')).toBeInTheDocument()
})

test('passes only matching tasks to each column', () => {
  const tasks = [
    { id: '1', title: 'Monday task', status: 'todo' as const, isFocus: false, date: '2026-04-06', order: 0, createdAt: '' },
    { id: '2', title: 'Wednesday task', status: 'todo' as const, isFocus: false, date: '2026-04-08', order: 0, createdAt: '' },
  ]
  render(<WeekBoard dates={DATES} tasks={tasks} />)
  expect(screen.getByText('Monday task')).toBeInTheDocument()
  expect(screen.getByText('Wednesday task')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run components/board/WeekBoard.test.tsx
```

Expected: failures — module not found.

- [ ] **Step 3: Create WeekBoard component**

Create `components/board/WeekBoard.tsx`:

```tsx
import { DayColumn } from './DayColumn'
import type { Task } from '@/types'

interface WeekBoardProps {
  dates: string[]  // 7 YYYY-MM-DD strings, Mon–Sun
  tasks: Task[]
}

export function WeekBoard({ dates, tasks }: WeekBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto px-4 pb-4 flex-1">
      {dates.map(date => (
        <DayColumn
          key={date}
          date={date}
          tasks={tasks.filter(t => t.date === date)}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run components/board/WeekBoard.test.tsx
```

Expected: 2 passed.

- [ ] **Step 5: Run all tests to check for regressions**

```bash
npx vitest run
```

Expected: all passed.

- [ ] **Step 6: Commit**

Stage: `components/board/WeekBoard.tsx`, `components/board/WeekBoard.test.tsx`
Message: `feat: add WeekBoard component`

---

## Task 5: Update app/page.tsx — redirect to current week

**Files:**
- Modify: `app/page.tsx`

No unit test for this — redirect behavior is covered by E2E in M9.

- [ ] **Step 1: Replace app/page.tsx**

Replace the entire content of `app/page.tsx`:

```tsx
import { redirect } from 'next/navigation'
import { getMonday } from '@/lib/utils/dates'

export default function Home() {
  redirect(`/week/${getMonday(new Date())}`)
}
```

- [ ] **Step 2: Commit**

Stage: `app/page.tsx`
Message: `feat: redirect root to current week`

---

## Task 6: Create app/week/[date]/page.tsx

**Files:**
- Create: `app/week/[date]/page.tsx`

No unit test — Server Component with redirect logic is covered by E2E in M9.

- [ ] **Step 1: Create the directory and page file**

Create `app/week/[date]/page.tsx`:

```tsx
import { redirect } from 'next/navigation'
import { getMonday, getWeekDates, formatWeekLabel } from '@/lib/utils/dates'
import { WeekNav } from '@/components/ui/WeekNav'
import { WeekBoard } from '@/components/board/WeekBoard'

export default async function WeekPage(props: PageProps<'/week/[date]'>) {
  const { date } = await props.params
  const monday = getMonday(date)

  // Redirect if date is not a Monday (invalid or mid-week URL)
  if (monday !== date) {
    redirect(`/week/${monday}`)
  }

  const weekDates = getWeekDates(monday)
  const label = formatWeekLabel(monday)

  const [y, m, d] = monday.split('-').map(Number)
  const fmt = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  const prevMonday = fmt(new Date(y, m - 1, d - 7))
  const nextMonday = fmt(new Date(y, m - 1, d + 7))

  return (
    <div className="flex flex-col flex-1">
      <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-black-10)]">
        <h1 className="text-lg font-bold text-foreground">Daily Tasker</h1>
        <WeekNav
          label={label}
          prevHref={`/week/${prevMonday}`}
          nextHref={`/week/${nextMonday}`}
        />
      </header>
      <WeekBoard dates={weekDates} tasks={[]} />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

Stage: `app/week/[date]/page.tsx`
Message: `feat: add week page with WeekNav and WeekBoard`

---

## Task 7: Create app/week/[date]/loading.tsx

**Files:**
- Create: `app/week/[date]/loading.tsx`

- [ ] **Step 1: Create the loading skeleton**

Create `app/week/[date]/loading.tsx`:

```tsx
export default function WeekLoading() {
  return (
    <div className="flex flex-col flex-1 animate-pulse">
      <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-black-10)]">
        <div className="h-6 w-28 bg-[var(--color-black-10)] rounded" />
        <div className="h-6 w-40 bg-[var(--color-black-10)] rounded" />
      </header>
      <div className="flex gap-4 overflow-x-auto px-4 pb-4 flex-1 pt-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex flex-col min-w-[200px] gap-2">
            <div className="h-8 bg-[var(--color-black-10)] rounded" />
            <div className="h-16 bg-[var(--color-black-10)] rounded" />
            <div className="h-16 bg-[var(--color-black-10)] rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run all tests one final time**

```bash
npx vitest run
```

Expected: all passed.

- [ ] **Step 3: Commit**

Stage: `app/week/[date]/loading.tsx`
Message: `feat: add loading skeleton for week page`

---

## Task 8: Smoke test in browser

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Verify redirect**

Open `http://localhost:3000` — should redirect to `/week/[current monday]` (e.g. `/week/2026-04-06`).

- [ ] **Step 3: Verify week navigation**

- WeekNav shows the correct week label (e.g. "Apr 6–12, 2026")
- Clicking the left arrow navigates to the previous week
- Clicking the right arrow navigates to the next week
- URL updates correctly on each navigation

- [ ] **Step 4: Verify invalid date redirect**

Open `/week/2026-04-08` (a Wednesday) — should redirect to `/week/2026-04-06`.

- [ ] **Step 5: Verify 7 columns render**

Board shows Monday through Sunday with the correct date labels.
