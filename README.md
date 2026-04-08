# Daily Tasker

A weekly Kanban-style task board for planning your week. Built as a personal-use and portfolio project.

## Features

- 7-column board (Mon–Sun) with URL-based week navigation
- Tasks with title, description, and status (To Do / In Progress / Done)
- Done tasks automatically sink to the bottom of the day
- Up to 3 focus tasks per day, highlighted at the top
- Drag-and-drop to reorder and move tasks between days
- Dark and light theme
- Data persisted in localStorage

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + Shadcn |
| State | Zustand (localStorage persistence) |
| Drag & Drop | @dnd-kit/core |
| Unit tests | Vitest |
| E2E tests | Playwright |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to the current week automatically.

## Routes

| Route | Description |
|---|---|
| `/week/YYYY-MM-DD` | Board for a specific week (Monday date) |
| `/style-guide` | Design system reference |

## Design

Inspired by the Cards Against Humanity aesthetic — minimal, typographic, white cards on off-white or black backgrounds. See [docs/daily-tasker-design.md](docs/daily-tasker-design.md) for the full spec.

## Demo

_Coming soon_
