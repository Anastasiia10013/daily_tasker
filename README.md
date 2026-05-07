# Daily Tasker

A weekly Kanban-style task board for planning your week. Built as a personal-use.

## Features

- 7-column board (Mon–Sun) with URL-based week navigation
- Tasks with title, description, and status (To Do / In Progress / Done)
- Done tasks automatically sink to the bottom of the day
- Up to 3 focus tasks per day
- Drag-and-drop to reorder and move tasks between days
- Dark and light theme
- Data persisted in localStorage

## Stack

|-------------|------------------------------------|
| Framework   | Next.js 16 (App Router)            |
| Language    | TypeScript                         |
| Styling     | Tailwind CSS v4 + Shadcn           |
| State       | Zustand (localStorage persistence) |
| Drag & Drop | @dnd-kit/core                      |
| Unit tests  | Vitest                             |
| E2E tests   | Playwright                         |

## Getting Started

```bash
npm install
npm run dev
```