# M5 — Task CRUD Design Spec

## Overview

Wire the existing Zustand store into the board UI. Deliver real `TaskCard` and `TaskForm` components so users can add, view, edit, delete, and change the status of tasks. No drag-and-drop (M7). No focus-task toggle (M6).

---

## Architecture

`WeekBoard` becomes a Client Component (`"use client"`) and calls `useTaskStore` directly. `WeekPage` (Server Component) drops the `tasks` prop and instead passes `monday` (the current week's Monday date string).

```
WeekPage (Server Component)
  └── WeekBoard (Client Component)
        ├── useTaskStore(s => s.getTasksForWeek(monday))
        └── DayColumn × 7
              ├── holds { open: boolean, editTask: Task | null } state
              ├── DayHeader — onAdd opens modal in add mode
              ├── TaskCard × n
              │     └── StatusDropdown (inline status change)
              └── TaskForm (Shadcn Dialog — add or edit mode)
```

---

## Components

### `components/tasks/TaskCard.tsx`

Renders one task card.

**Interactions:**
- Click card body → calls `onEdit(task)` (opens edit modal in parent)
- Trash icon (always visible, top-right) → calls `onDelete(task.id)` instantly, no confirm
- Status tag (below title) → opens `StatusDropdown`
- All interactive sub-elements use `e.stopPropagation()` to prevent bubbling to card body click

**Hover tilt:** 1–3° rotation seeded from `task.id` (stable per task, `transition-transform duration-[250ms]`)

**Visual variants:**

| Variant | Border | Badge | Title | Status tag |
|---|---|---|---|---|
| `focus` | 2px yellow | "Focus" badge above title | normal | visible |
| `todo` | 1px black-10 | — | normal | muted (black-40) |
| `in-progress` | 1px black-10 + left 4px sage-green | — | normal | sage-green |
| `done` | 1px black-10, opacity-60 | — | strikethrough | muted |

**Trash icon:** `lucide-react` `Trash2`, `--color-black-40`, turns `--color-red` on hover.

**Props:**
```typescript
interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: TaskStatus) => void
}
```

---

### `components/tasks/StatusDropdown.tsx`

Inline Shadcn `DropdownMenu` triggered by clicking the status tag on the card.

- 3 items: `Todo`, `In progress`, `Done`
- Selecting calls `onStatusChange(id, status)` immediately
- Click on tag uses `e.stopPropagation()` to prevent card body click
- Tag colors: `todo` → black-40, `in-progress` → sage-green, `done` → black-40 muted

**Props:**
```typescript
interface StatusDropdownProps {
  taskId: string
  status: TaskStatus
  onStatusChange: (id: string, status: TaskStatus) => void
}
```

---

### `components/tasks/TaskForm.tsx`

Shadcn `Dialog`. Two modes controlled by whether `editTask` is provided.

**Fields:**
- Title — required text input
- Description — optional textarea
- Status — Select (`todo` / `in-progress` / `done`)
- Focus — Checkbox (note: M6 enforces the 3-task limit; M5 just wires the field)

**Add mode** (editTask is null):
- Title: "Add task"
- Footer: Save · Cancel

**Edit mode** (editTask is a Task):
- Title: "Edit task"
- Fields pre-filled from task
- Footer: Delete (red, left-aligned) · Save · Cancel

**Actions:**
- Save (add mode) → `addTask({ title, description, status, isFocus, date })`
- Save (edit mode) → `updateTask(id, { title, description, status, isFocus })`
- Delete → `deleteTask(id)`, close modal
- Cancel → close modal, no action

**Props:**
```typescript
interface TaskFormProps {
  open: boolean
  onClose: () => void
  date: string           // for add mode — the day column's date
  editTask?: Task        // if provided, form is in edit mode
}
```

The form calls store actions directly (not via callbacks) to keep parent state minimal.

---

### `components/board/DayColumn.tsx` (updated)

Replaces the placeholder `div` with `TaskCard`. Owns modal state.

```typescript
const [open, setOpen] = useState(false)
const [editTask, setEditTask] = useState<Task | null>(null)

const handleAdd = () => { setEditTask(null); setOpen(true) }
const handleEdit = (task: Task) => { setEditTask(task); setOpen(true) }
const handleDelete = (id: string) => deleteTask(id)
const handleStatusChange = (id: string, status: TaskStatus) => updateTask(id, { status })
```

---

### `components/board/WeekBoard.tsx` (updated)

```typescript
"use client"

interface WeekBoardProps {
  dates: string[]
  monday: string   // replaces tasks[]
}
```

Calls `useTaskStore(s => s.getTasksForWeek(monday))` and filters per date before passing to each `DayColumn`.

---

### `app/week/[date]/page.tsx` (updated)

Passes `monday` instead of `tasks` to `WeekBoard`:

```tsx
<WeekBoard dates={weekDates} monday={monday} />
```

---

## Tests

| File | What to test |
|---|---|
| `components/tasks/TaskCard.test.tsx` | Renders focus/todo/in-progress/done variants correctly; trash click calls `onDelete`; card body click calls `onEdit`; status tag click does not call `onEdit` |
| `components/tasks/TaskForm.test.tsx` | Add mode: no delete button, save calls `addTask`; Edit mode: delete button present, save calls `updateTask`, delete calls `deleteTask` |
| `components/tasks/StatusDropdown.test.tsx` | Selecting an option calls `onStatusChange` with correct status |

---

## Out of Scope

- Focus task 3-limit enforcement → M6
- Drag-and-drop reordering → M7
- Theme toggle → M8
