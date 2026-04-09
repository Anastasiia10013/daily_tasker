# M6 — Focus Tasks Design Spec

## Overview

Add a quick-toggle focus button directly on TaskCard using the `Crosshair` icon from lucide-react. Enforce the 3-focus-per-day limit with a visual disabled state on the icon and an inline error message in the column. No new dependencies.

---

## Scope

- Quick-toggle focus from TaskCard (no need to open edit modal)
- Visual disabled state on crosshair when limit is reached
- Inline error message in DayColumn when limit is hit
- Unit tests for new interactions

The store's `toggleFocus` action and its existing tests are complete and unchanged.

---

## Data Flow

`DayColumn` owns the toggle logic:

1. Derive `focusCount = tasks.filter(t => t.isFocus).length`
2. Derive `focusLimitReached = focusCount >= 3`
3. `handleToggleFocus(id)`:
   - If the task is already a focus task → call `toggleFocus(id)` (always allowed)
   - If not focus and `focusLimitReached` → set `focusError: true`, auto-clear after 2s
   - Otherwise → call `toggleFocus(id)`
4. Pass `onToggleFocus` and `focusLimitReached` to each `TaskCard`

---

## TaskCard Changes

New props:
```typescript
onToggleFocus: (id: string) => void
focusLimitReached: boolean
```

**Crosshair button** — top-left corner of the card (delete icon stays top-right):

| State | Condition | Style |
|---|---|---|
| Active | `task.isFocus` | `--color-yellow`, always visible |
| Inactive | `!task.isFocus && !focusLimitReached` | `--color-black-40`, visible on card hover |
| Disabled | `!task.isFocus && focusLimitReached` | `--color-black-10`, `cursor-not-allowed`, always visible |

The button calls `e.stopPropagation()` to prevent opening the edit modal.

---

## DayColumn Changes

New state:
```typescript
const [focusError, setFocusError] = useState(false)
```

Error message renders between `DayHeader` and the task list when `focusError` is true:
```
"Focus limit reached — max 3 per day"
```
Styled as `text-xs text-[var(--color-red)]`. Auto-clears after 2000ms via `setTimeout`.

---

## Tests

### TaskCard.test.tsx
- Crosshair button renders
- Clicking crosshair calls `onToggleFocus` with the task id
- Button has `cursor-not-allowed` class when `focusLimitReached && !task.isFocus`
- Clicking crosshair does not call `onEdit` (stops propagation)

### DayColumn.test.tsx
- Clicking the crosshair on a non-focus task calls store `toggleFocus`
- When `focusCount >= 3`, clicking crosshair on a non-focus task shows the error message
- Error message is not shown when `focusCount < 3`

---

## Out of Scope

- Store changes (toggleFocus logic is complete)
- TaskForm focus checkbox (stays as-is — still works for toggling focus in the modal)
- Animation on the error message
