# Demo Mode

Demo Mode lets visitors explore Daily Tasker with pre-populated sample data — no sign-up, no risk. Real user data stays untouched in localStorage the entire time.

---

## How to Enter and Exit

1. Click **"Try Demo"** — the small button next to the "Daily Tasker" logo in the header
2. A sage-green banner appears: _"Demo Mode — You're viewing sample data. Your tasks are untouched."_
3. Click **"Exit Demo"** in the banner to return to your real board

> Demo mode resets on page reload — it is not persisted. This is intentional.

---

## What's Included

7 sample tasks spread across Mon–Fri of the current week. The dates always anchor to whichever Monday you navigate to.

| Day       | Task                           | Status      | Focus |
|-----------|--------------------------------|-------------|-------|
| Monday    | Review project requirements    | Done        | —     |
| Monday    | Set up development environment | Done        | —     |
| Tuesday   | Design database schema         | In Progress | ★     |
| Tuesday   | Write API endpoints            | In Progress | —     |
| Wednesday | Build task card component      | Todo        | ★     |
| Thursday  | Write unit tests               | Todo        | —     |
| Friday    | Deploy to staging              | Todo        | —     |

The sample data is deliberate:
- All three statuses are represented (todo, in-progress, done)
- Two focus tasks are included (out of the 3-per-day maximum)
- Some tasks have descriptions, some don't — both card layouts are visible
- Done tasks are on Monday so the sort-to-bottom behavior is immediately visible

---

## What You Can Do

| Action                                | Available                                |
|---------------------------------------|------------------------------------------|
| Browse the board (Mon–Fri columns)    | Yes                                      |
| Navigate between weeks (← / → arrows) | Yes — demo data shifts to match any week |
| Switch dark / light theme             | Yes                                      |
| Read task titles and descriptions     | Yes                                      |

---

## What's Blocked

Demo mode is fully read-only. The UI hides or disables all mutation actions:

| Action             | How it's blocked                         |
|--------------------|------------------------------------------|
| Add a task         | "+" button hidden from all day columns   |
| Edit a task        | Card click does nothing                  |
| Delete a task      | Trash icon removed from all cards        |
| Change task status | Status dropdown unresponsive             |
| Toggle focus       | Focus icon click does nothing            |
| Drag & drop        | Listeners disabled; cursor stays default |

**Note on export:** The export button remains visible. Clicking it exports your _real_ tasks (from localStorage), not the demo tasks. If you have no real tasks, the export will be an empty array.

---

## Technical Implementation

Demo mode is a boolean flag (`isDemoMode`) in the Zustand task store ([`lib/store/taskStore.ts`](../lib/store/taskStore.ts)). It is not persisted — only `tasks` is included in the `partialize` config, so the flag resets on page reload.

**Data layer** — `getTasksForWeek(monday)` checks `isDemoMode` first. If true, it calls `getDemoTasks(monday)` from [`lib/demo/demoData.ts`](../lib/demo/demoData.ts) and returns those instead of user tasks. The two datasets never mix. `getDemoTasks` generates 7 tasks relative to the given Monday using `getWeekDates()`, then caches the result per Monday key.

**UI layer** — each interactive element checks `isDemoMode` individually before wiring up its handler:
- Drag listeners: `disabled: isDemoMode` passed to `useSortable`
- Card click / focus toggle / status change: handler replaced with `undefined`
- Delete button / add task button: conditionally rendered out of the DOM entirely
