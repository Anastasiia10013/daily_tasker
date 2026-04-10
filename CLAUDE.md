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
npx vitest run     # unit tests
npx playwright test  # e2e tests
```

## Architecture

**Routing:** App Router only — routes are directories under `app/`. Each route can export a default Server Component plus optional `layout.tsx`, `loading.tsx`, `error.tsx`.

**Fonts:** Loaded via `next/font/google` in `app/layout.tsx` and exposed as CSS variables (`--font-geist-sans`, `--font-geist-mono`).

**Styling:** Tailwind v4 config lives entirely in `app/globals.css` under `@theme inline` — there is no `tailwind.config.*` file.

**Before writing any Next.js code**, read the relevant guide in `node_modules/next/dist/docs/` (App Router guides are under `01-app/`). APIs differ significantly from earlier versions.

**Next.js 16 breaking changes to remember:**
- `params` in page/layout components is now a `Promise` — always `await params`
- Use `PageProps<'/week/[date]'>` and `LayoutProps<'/dashboard'>` as global type helpers (no import needed)
- `redirect()` from `next/navigation` works directly in Server Components
- Add `loading.tsx` to dynamic routes for instant navigation feel

---

## Project: Daily Tasker

Weekly Kanban task board — personal use + portfolio. Full spec: `docs/daily-tasker-design.md`.

### Decisions

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
1. Focus tasks (`isFocus: true`) — top, yellow accent
2. Active tasks (`todo` | `in-progress`) — middle
3. Done tasks — always sink to bottom

### Additional rulles
1. After implementing each milestone group changes by logic to 2-3 commits, write commit title and concise structured description with bullets
2. Implement milestones in inline session, do not suggest and use subagents and worktrees for implementing milestones
