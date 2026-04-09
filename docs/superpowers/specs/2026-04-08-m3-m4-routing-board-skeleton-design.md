# M3+M4 — Routing & Board Skeleton Design Spec

## Overview

Combined milestone: wire up URL-based week routing and render the board skeleton. Delivers a navigable weekly board with 7 empty day columns. No task CRUD, no store wiring — that is M5.

---

## Routing

### `app/page.tsx`
Server Component. Calls `getMonday(new Date())` and immediately `redirect`s to `/week/[monday]`. Replaces the Next.js boilerplate.

### `app/week/[date]/page.tsx`
Server Component.

1. `await params` to get `date`
2. Run through `getMonday(date)` — if result differs from `date` (invalid or non-Monday), `redirect` to `/week/[normalized]`
3. Compute `prevMonday` (−7 days) and `nextMonday` (+7 days) from the normalized monday
4. Compute `label` — e.g. `"Apr 6–12, 2026"` — from first and last of `getWeekDates(monday)`
5. Render `<WeekNav prevHref nextHref label />` and `<WeekBoard dates tasks={[]} />`

### `app/week/[date]/loading.tsx`
Minimal skeleton: nav bar placeholder + 7 column skeletons (header + empty body).

---

## WeekNav

### Interface change
```typescript
interface WeekNavProps {
  label: string
  prevHref: string
  nextHref: string
}
```

- `<button>` elements replaced with `<Link href={...}>` from `next/link`
- No `'use client'` needed
- `label` format: `"Apr 6–12, 2026"` — first date and last date of the week, formatted

### Tests
`WeekNav.test.tsx` updated: assert links render with correct `href` attributes instead of callback invocation.

---

## WeekBoard

### `components/board/WeekBoard.tsx`
```typescript
interface WeekBoardProps {
  dates: string[]   // 7 YYYY-MM-DD strings, Mon–Sun
  tasks: Task[]
}
```

- Renders a horizontally scrollable 7-column grid
- One `<DayColumn>` per date
- Passes filtered tasks per date down to each column

### `components/board/DayColumn.tsx`
```typescript
interface DayColumnProps {
  date: string
  tasks: Task[]     // pre-filtered for this date
}
```

- Runs `sortTasks(tasks)` internally
- Renders `<DayHeader dayName date />` (existing component)
- Renders sorted tasks as placeholder `<div>` elements (no TaskCard yet — M5)
- Empty state: just the header, no empty-state message (M5 concern)

---

## Data Flow

```
page.tsx (Server Component)
  ├── computes: monday, prevMonday, nextMonday, weekDates, label
  ├── <WeekNav prevHref={/week/prevMonday} nextHref={/week/nextMonday} label />
  └── <WeekBoard dates={weekDates} tasks={[]} />
        └── <DayColumn date tasks={[]} /> × 7
              └── <DayHeader dayName date />
```

---

## File Changes

| File | Action |
|---|---|
| `app/page.tsx` | Replace boilerplate with redirect |
| `app/week/[date]/page.tsx` | New — week board page |
| `app/week/[date]/loading.tsx` | New — skeleton |
| `components/ui/WeekNav.tsx` | Update interface: callbacks → hrefs, buttons → Links |
| `components/ui/WeekNav.test.tsx` | Update tests for href-based nav |
| `components/board/WeekBoard.tsx` | New |
| `components/board/DayColumn.tsx` | New |

---

## Out of Scope

- Store wiring — `tasks` is always `[]` in this milestone
- TaskCard — placeholder divs only
- Empty state UX
- Focus task logic
- Drag and drop
