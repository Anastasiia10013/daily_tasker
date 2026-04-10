# M7 — Drag and Drop Design

## Scope

Enable drag-and-drop for the Daily Tasker weekly board:
- **Within-column reorder**: tasks can be freely reordered within a day column, with one constraint: done tasks cannot be dragged above non-done tasks, and non-done tasks cannot be dragged into the done zone.
- **Cross-day move**: tasks can be dragged from one day column to another. They append to the end of the destination column. If a focus task is dragged to a day that already has 3 focus tasks, `isFocus` is stripped automatically.

Cross-group drag (focus ↔ active) is **allowed** — only the done boundary is enforced.

---

## Architecture

```
WeekBoard         ← DndContext + DragOverlay + onDragEnd
  DayColumn × 7  ← useDroppable (id = date string) + SortableContext (items = [task ids])
    TaskCard × n  ← useSortable (id = task.id, data = { date, status })
```

One global `DndContext` in `WeekBoard` is required for cross-day drag to work. `DragOverlay` renders a floating copy of the dragged card while dragging.

---

## `onDragEnd` Logic

```ts
onDragEnd(event):
  activeId = event.active.id
  overId   = event.over?.id
  if !overId → return (dropped outside)

  activeTask = find task by activeId
  if !activeTask → return

  overTask = find task by overId (may be undefined if overId is a date string)
  overDate = overTask ? overTask.date : overId

  if activeTask.date === overDate:
    // Same-day reorder
    if !overTask → return (dropped on empty column, no position change)
    crossDoneBoundary = (activeTask.status === 'done') !== (overTask.status === 'done')
    if crossDoneBoundary → return (snap back)
    reorderTask(activeTask.date, activeId, overId)
  else:
    // Cross-day move
    moveTask(activeId, overDate)
```

---

## `sortTasks` Change

**Before (3 groups):** focus → active (todo/in-progress) → done, each group sorted by `order`.

**After (2 zones):** (focus + active, sorted by `order`) → (done, sorted by `order`).

```ts
export function sortTasks(tasks: Task[]): Task[] {
  const active = tasks.filter(t => t.status !== 'done').sort((a, b) => a.order - b.order)
  const done   = tasks.filter(t => t.status === 'done').sort((a, b) => a.order - b.order)
  return [...active, ...done]
}
```

Focus tasks retain their yellow styling and badge — they just no longer auto-float above active tasks.

---

## Store Changes

### `moveTask` — add focus-stripping

```ts
moveTask: (id, newDate) => {
  const task = tasks[id]
  const tasksForNewDate = Object.values(tasks).filter(t => t.date === newDate && t.id !== id)
  const maxOrder = tasksForNewDate.length > 0
    ? Math.max(...tasksForNewDate.map(t => t.order))
    : -1
  const focusCount = tasksForNewDate.filter(t => t.isFocus).length
  const isFocus = task.isFocus && focusCount < 3

  set: { ...task, date: newDate, order: maxOrder + 1, isFocus }
}
```

### `reorderTask` — no change needed

The existing implementation reorders the flat day-level array by index, which is correct for the two-zone model.

---

## Component Changes

### `WeekBoard`
- Import `DndContext`, `DragOverlay`, `closestCenter` from `@dnd-kit/core`
- Add `onDragEnd` handler (logic above)
- Add `activeTask` state for `DragOverlay`
- Wrap board content in `DndContext`

### `DayColumn`
- Import `useDroppable` from `@dnd-kit/core`
- Import `SortableContext`, `verticalListSortingStrategy` from `@dnd-kit/sortable`
- Wrap task list in `SortableContext` with `items={sorted.map(t => t.id)}`
- Use `useDroppable({ id: date })` on the column container

### `TaskCard`
- Import `useSortable` from `@dnd-kit/sortable`
- Apply `attributes`, `listeners`, `setNodeRef`, `transform`, `transition` from `useSortable`
- Pass `data={{ date: task.date, status: task.status }}` to `useSortable`
- Apply `transform` via `CSS.Transform.toString` as inline style
- Drag `listeners` are applied to the card root element, making the whole card a drag handle
- Interactive sub-elements (focus toggle, delete button, status dropdown) must call `e.stopPropagation()` on `onPointerDown` to prevent drag from starting when the user intends to click them

---

## Visual Feedback

- **Dragging card**: `opacity-50` on original, full-opacity floating clone via `DragOverlay`
- **Drop target**: dnd-kit default gap animation (sortable strategy handles this)
- **Blocked drop (done boundary)**: card snaps back — no explicit error needed, the snap is sufficient feedback

---

## Files Changed

| File | Change |
|---|---|
| `components/board/WeekBoard.tsx` | DndContext, DragOverlay, onDragEnd |
| `components/board/DayColumn.tsx` | useDroppable, SortableContext |
| `components/tasks/TaskCard.tsx` | useSortable |
| `lib/store/taskStore.ts` | moveTask focus-strip |
| `lib/utils/tasks.ts` | sortTasks two-zone |
| `lib/utils/tasks.test.ts` | Update tests for new sortTasks |
| `docs/daily-tasker-design.md` | Update M7 row |

---

## Out of Scope

- Keyboard drag-and-drop accessibility (deferred)
- Drag between weeks (tasks have fixed `date`, no cross-week drag)
- Reorder done tasks relative to each other (allowed by this design — done tasks can reorder among themselves)
