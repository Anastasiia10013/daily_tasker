# M8 — Theme: Dark/Light Toggle

## Overview

Add a dark/light theme toggle to the app with localStorage persistence and no flash on reload. The implementation uses a `useTheme` hook as the single source of truth — designed to extend to multiple predefined color themes in the future.

---

## Goals

- Dark/light toggle visible in the week page header
- Preference persisted in localStorage across sessions
- No flash of wrong theme on reload (anti-FOUC)
- Theme logic centralized so swapping the toggle for a theme picker is a UI-only change

---

## Architecture

### `lib/hooks/useTheme.ts`

```ts
type Theme = 'light' | 'dark'

function useTheme(): { theme: Theme; setTheme: (t: Theme) => void }
```

- Reads initial value from `localStorage.getItem('theme')`, falls back to `'light'`
- `setTheme(t)`: writes to localStorage, applies/removes `dark` class on `document.documentElement`
- Initialization runs in a single `useEffect` to avoid SSR mismatch
- Type is `'light' | 'dark'` now — easy to extend to `'warm' | 'solarized'` etc. later

### Anti-FOUC script (`app/layout.tsx`)

Inline `<script>` in `<head>`, runs synchronously before first paint:

```js
try {
  const t = localStorage.getItem('theme');
  if (t === 'dark') document.documentElement.classList.add('dark');
} catch (_) {}
```

Without this, users with a saved dark preference see a light flash before React hydrates.

### ThemeToggle (`components/ui/ThemeToggle.tsx`)

Replaced its own `useState`/`useEffect` with `useTheme()`. Becomes a thin UI wrapper — all logic delegated to the hook.

---

## Component Placement

Week page header (`app/week/[date]/page.tsx`):

```tsx
<header className="flex items-center justify-between ...">
  <h1>Daily Tasker</h1>
  <div className="flex items-center gap-4">
    <WeekNav ... />
    <ThemeToggle />
  </div>
</header>
```

ThemeToggle is already rendered in the style-guide page — no change needed there.

---

## CSS

Dark mode is fully set up in `globals.css` via `.dark` class on `<html>`. No CSS changes required for M8.

Cards use hardcoded `bg-white` and `text-[var(--color-black)]` by design — they stay white in both themes (contrast comes from the background).

---

## Testing

Update `ThemeToggle.test.tsx`:
- Mock `localStorage` (`getItem`/`setItem`)
- Verify `setItem('theme', 'dark')` is called when toggling to dark
- Verify `setItem('theme', 'light')` is called when toggling back

---

## Future extensibility

To add predefined color themes:
1. Extend `Theme` type in `useTheme.ts`
2. Replace `dark` class toggle logic with multi-class logic (e.g., `theme-warm`, `theme-solarized`)
3. Replace `ThemeToggle` UI with a `ThemePicker` — hook interface unchanged

---

## Files changed

| File | Change |
|---|---|
| `lib/hooks/useTheme.ts` | New — theme hook |
| `app/layout.tsx` | Add `<head>` with anti-FOUC script |
| `components/ui/ThemeToggle.tsx` | Use `useTheme()` instead of local state |
| `app/week/[date]/page.tsx` | Add `ThemeToggle` to header |
| `components/ui/ThemeToggle.test.tsx` | Update tests for localStorage behavior |
