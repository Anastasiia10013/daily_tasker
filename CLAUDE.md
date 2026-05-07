# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Stack

- **Next.js 16.2.2** — App Router (not Pages Router)
- **React 19.2.4**
- **TypeScript 5** — strict mode, path alias `@/*` maps to project root
- **Tailwind CSS v4** — uses `@tailwindcss/postcss` plugin and `@theme inline` directive in `globals.css`
- **ESLint 9** — flat config format (`eslint.config.mjs`)

## Commands

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # production server
npm run lint     # ESLint
```

```bash
npx vitest run                                         # unit tests (all)
npx vitest run components/board/DayColumn.test.tsx     # single unit test file
npx playwright test                                    # e2e tests (all, auto-starts dev server)
npx playwright test e2e/board.spec.ts                  # single e2e spec
```

## Architecture

**Directory layout:**
```
app/week/[date]/   — dynamic weekly board route (Monday of the week)
components/board/  — WeekBoard, DayColumn, DayHeader + co-located *.test.tsx files
components/tasks/  — TaskCard, TaskForm, StatusDropdown + co-located *.test.tsx files
components/ui/     — Shadcn-generated primitives (do not hand-edit)
lib/store/         — Zustand taskStore + tests
lib/hooks/         — useTheme
lib/utils/         — dates, tasks helpers
lib/demo/          — demo mode data generator
e2e/               — Playwright specs
```

Unit tests are co-located with source files (`*.test.ts/tsx` beside the file they test).

**Routing:** App Router only — routes are directories under `app/`. Each route can export a default Server Component plus optional `layout.tsx`, `loading.tsx`, `error.tsx`.

**Fonts:** Loaded via `next/font/google` in `app/layout.tsx` and exposed as CSS variables (`--font-geist-sans`, `--font-geist-mono`).

**Styling:** Tailwind v4 config lives entirely in `app/globals.css` under `@theme inline` — there is no `tailwind.config.*` file.

**Before writing any Next.js code**, read the relevant guide in `node_modules/next/dist/docs/` (App Router guides are under `01-app/`). APIs differ significantly from earlier versions.

**Next.js 16 breaking changes to remember:**
- `params` in page/layout components is now a `Promise` — always `await params`
- Use `PageProps<'/week/[date]'>` and `LayoutProps<'/dashboard'>` as global type helpers (no import needed)
- `redirect()` from `next/navigation` works directly in Server Components

---

## Project: Daily Tasker

Weekly Kanban task board — personal use + portfolio. Full spec: `docs/daily-tasker-design.md`.

### Decisions

| Concern          | Decision                                                     |
|------------------|--------------------------------------------------------------|
| Storage          | localStorage via Zustand `persist` middleware                |
| Data layer       | `useTaskStore` hook — UI never touches localStorage directly |
| Week navigation  | URL-based `/week/YYYY-MM-DD` (Monday of the week)            |
| State management | Zustand                                                      |
| Drag-and-drop    | `@dnd-kit/core`                                              |
| Focus tasks      | Visual flag with yellow accent, max 3 per day (not pinned)   |
| UI library       | Tailwind v4 + Shadcn                                         |
| Theme            | Dark/light toggle, persisted in localStorage                 |
| Unit testing     | Vitest                                                       |
| E2E testing      | Playwright                                                   |

### Data Model

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

### Sort Order (within each day column)
1. Active tasks (`todo` | `in-progress`) — top, sorted by `order`
2. Done tasks — always sink to bottom, sorted by `order`

Focus tasks (`isFocus: true`) sit at their `order` position **within the active zone** and are marked with a yellow accent — they are not auto-pinned. This keeps the visual position of every card aligned with its `order` value, so drag-and-drop reorders and cross-day moves stay unambiguous. `reorderTask` operates within a single zone (active or done) and `moveTask` strips `isFocus` if the destination day already has 3 focus tasks.

### Environment-coupled gotchas

- **`loading.tsx` is for routes that wait on server data.** This app's data lives in localStorage so there is no wait — `loading.tsx` would just flash a skeleton on every navigation. Re-introduce it if storage moves server-side.
- **`allowedDevOrigins` in `next.config.ts` is hard-coded to a specific LAN IP.** Update it when your dev machine's IP changes (new network, new device) or HMR will fail with a WebSocket error when accessing the dev server via LAN.

### Icon Sizes
- **14** — inline/compact: icons inside task cards (action buttons, indicators)
- **20** — standard: header controls, column-level buttons (add task, nav chevrons, etc.)

### Additional rules
1. After implementing each milestone group changes by logic to 2-3 commits, write commit title and concise structured description with bullets
2. Implement milestones in inline session, do not suggest and use subagents and worktrees for implementing milestones
3. Markdown tables must have columns padded to equal width — each cell padded with trailing spaces so all rows align as a grid in a monospace editor. Separator dashes equal `column_max_length + 2`.
