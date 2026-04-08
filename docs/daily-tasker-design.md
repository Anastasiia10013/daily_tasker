# Daily Tasker — Design Spec

## Overview

Weekly Kanban-style task management app. Personal use + portfolio showcase. 7 columns (Mon–Sun), URL-based week navigation, localStorage persistence with a clean abstraction layer for future backend swap.

---

## Decisions

| Concern | Decision |
|---|---|
| Storage | localStorage via Zustand `persist` middleware |
| Data layer | `useTaskStore` hook — UI never touches localStorage directly |
| Week navigation | URL-based `/week/YYYY-MM-DD` (Monday of the week) |
| State management | Zustand |
| Drag-and-drop | `@dnd-kit/core` |
| Focus tasks | Regular tasks pinned to top, max 3 per day |
| UI library | Tailwind v4 + Shadcn |
| Theme | Dark/light toggle, persisted in localStorage |
| Unit testing | Vitest |
| E2E testing | Playwright |

---

## Data Model

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
  createdAt: string
}
```

`date` is a real calendar date (not "Monday") — this is what makes week navigation work. Each task lives on a specific date, and the board groups tasks by the 7 dates of the visible week.

---

## Project Structure

```
app/
  page.tsx                    → redirect to /week/[current monday]
  week/
    [date]/
      page.tsx                → WeekBoard page
      loading.tsx             → loading skeleton
  style-guide/
    page.tsx                  → design system reference
  layout.tsx                  → root layout (theme provider)
  globals.css                 → design tokens, typography

components/
  board/
    WeekBoard.tsx             → DnD context wrapper, renders 7 DayColumns
    DayColumn.tsx             → single day column with sorted task list
    DayHeader.tsx             → day name + date + "add task" button
  tasks/
    TaskCard.tsx              → draggable card, hover tilt, focus/done variants
    TaskForm.tsx              → add/edit modal (Shadcn Dialog)
  ui/
    ThemeToggle.tsx
    WeekNav.tsx               → prev/next week arrows + current week label

lib/
  store/
    taskStore.ts              → Zustand store (useTaskStore)
  utils/
    dates.ts                  → getWeekDates(), getMonday(), formatDate()
    tasks.ts                  → sortTasks() — focus → active → done

types/
  index.ts                    → Task, TaskStatus, shared types
```

---

## Component Data Flow

```
WeekBoard
  ├── reads all tasks for the week from useTaskStore
  ├── wraps everything in @dnd-kit DndContext
  └── DayColumn × 7
        ├── receives tasks[] filtered by date, sorted by sortTasks()
        ├── DayHeader (day name, date, + add button)
        ├── TaskCard (focus) × 0–3   ← highlighted at top
        ├── TaskCard (active) × n    ← middle
        └── TaskCard (done) × n      ← auto-sorted to bottom

TaskCard → click → TaskForm modal → calls store actions
WeekNav → prev/next → router.push(/week/[new-date])
```

---

## Core Logic

### `sortTasks(tasks: Task[])`
1. Focus tasks (`isFocus: true`) — top
2. Active tasks (`status: 'todo' | 'in-progress'`) — middle
3. Done tasks (`status: 'done'`) — always sink to bottom

### Focus task enforcement
In `toggleFocus` store action — count focus tasks for that date, block if already 3.

### Week date helpers
- `getMonday(date)` — normalize any date to its week's Monday
- `getWeekDates(monday)` — returns 7 dates Mon–Sun as YYYY-MM-DD strings
- Invalid URL dates redirect to current week

---

## Design System

### Inspiration
Cards Against Humanity — minimal, bold, typographic. White cards that always pop against the background.

### Color Tokens
```css
--color-blue: #3051a8;
--color-green: #3f593d;
--color-sky: #90c0e6;
--color-red: #d30423;
--color-yellow: #f4c537;
--color-sage-green: #d7d7c8;
--color-off-white: #f2f0e9;
--color-black: #141212;
--color-black-60: #5b5959;
--color-black-40: #a1a0a0;
--color-black-10: #d0d0d0;
--color-white: #ffffff;
--color-red-brick: #863a29;
--border-radius: 12px;
--border-radius-small: 8px;
--border-radius-large: 16px;
--border-radius-xlarge: 24px;
```

### Theme Mapping
| Token | Light mode | Dark mode |
|---|---|---|
| Background | `--color-off-white` (#f2f0e9) | `--color-black` (#141212) |
| Card background | `--color-white` (#ffffff) | `--color-white` (#ffffff) |
| Primary text | `--color-black` (#141212) | `--color-black` (#141212) |
| Secondary text | `--color-black-60` (#5b5959) | `--color-black-60` (#5b5959) |
| Borders | `--color-black-10` (#d0d0d0) | `--color-black-10` (#d0d0d0) |

Cards are always white — the background creates the contrast.

### Status Colors
- Focus — `--color-yellow` (#f4c537) border/badge
- Done — `--color-black-40` (#a1a0a0) muted + strikethrough
- In-progress — `--color-blue` (#3051a8) left border

### Typography
```
font-family: ui-sans-serif, system-ui, sans-serif
font-feature-settings: "ss02" on
-webkit-font-smoothing: antialiased
```

### Card Interaction
- Default: straight and structured in grid
- Hover: 1–3° tilt, seeded from task `id` (stable, not random per render)
- Transition: 0.25s ease

---

## Milestones

| # | Milestone | Key output |
|---|---|---|
| M0 | Setup | CLAUDE.md, README, design tokens, Shadcn, Zustand, dnd-kit |
| M1 | Style Guide | `/style-guide` page — all tokens, components, card variants |
| M2 | Data Layer | types, Zustand store, utils, Vitest unit tests |
| M3 | Routing | `/` redirect, `/week/[date]`, WeekNav |
| M4 | Board Skeleton | WeekBoard + 7 DayColumns, static tasks |
| M5 | Task CRUD | TaskCard, TaskForm, store wired, localStorage working |
| M6 | Focus Tasks | toggleFocus, 3-task limit, yellow accent |
| M7 | Drag & Drop | dnd-kit, reorder within day, move between days |
| M8 | Theme | dark/light toggle, persisted |
| M9 | E2E Tests | Playwright, 6 key user flows |

---

## Edge Cases

- Empty week — empty state with "Add task" prompt per column
- Long task titles — truncate on card, full text in modal
- Week boundary drag — updates `date` field, not just `order`
- Focus limit UX — clear error when 4th focus attempted
- Invalid URL dates — silent redirect to current week
- Past weeks — fully editable
