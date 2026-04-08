# M1 Style Guide — Design Spec

**Date:** 2026-04-07
**Milestone:** M1

---

## Overview

A single scrolling page at `/style-guide` that documents every design token and renders every component used in the Daily Tasker app. Serves as a dev reference during development and a portfolio showcase.

Scope: static display + hover states. Dark mode is out of scope (M8). No interactivity beyond CSS hover.

---

## Architecture

`app/style-guide/page.tsx` is a plain Next.js App Router page (no `'use client'` needed). It imports and renders all style guide sections as a single scrolling layout.

All color tokens and typography settings live in `app/globals.css` under `@theme inline`. The style guide reads those CSS variables directly — if a token changes, the page reflects it automatically.

---

## Page Structure

```
<main>                          ← bg: --color-off-white, padding, max-width centered
  <h1>Style Guide</h1>
  <Section id="colors">
  <Section id="typography">
  <Section id="spacing">
  <Section id="task-cards">
  <Section id="day-header">
  <Section id="week-nav">
  <Section id="theme-toggle">
  <Section id="task-form">
  <Section id="primitives">
</main>
```

`Section` is a lightweight wrapper with a sticky section heading + content slot.

---

## Component Inventory

| Section | What's shown |
|---|---|
| **Colors** | Grid of swatches — colored square + token name + hex value for every `--color-*` token |
| **Typography** | H1–H4, body, small, mono — live text samples with size/weight labels |
| **Spacing & Radius** | Row of boxes showing all four border-radius values (small/default/large/xlarge) |
| **TaskCard variants** | 4 cards side by side: focus (yellow border), todo, in-progress (blue left border), done (muted + strikethrough). Hover tilt via CSS `transition-transform duration-[250ms]`, each card gets a distinct hardcoded angle (1deg, -2deg, 2deg, -1deg) to simulate id-seeded variation |
| **DayHeader** | Static example: "Monday · Apr 7" + "+ Add task" button |
| **WeekNav** | "← Apr 7–13, 2026 →" with prev/next arrows |
| **ThemeToggle** | Two instances side by side, labeled "Light" and "Dark" — visually distinct, no click handler |
| **TaskForm** | Form card rendered flat (no modal overlay): title input, description textarea, status select, focus checkbox, Save/Cancel buttons |
| **Shadcn primitives** | Button (default, destructive, outline, ghost), Input, Textarea |

---

## File Structure

### New files

```
app/
  style-guide/
    page.tsx                    ← main page

components/
  style-guide/
    Section.tsx                 ← sticky heading + content wrapper
    ColorSwatch.tsx             ← single swatch: square + name + hex
    TaskCardPreview.tsx         ← static card with hardcoded variant + hover tilt
    TaskFormPreview.tsx         ← flat form layout, no modal overlay
    PrimitivesPreview.tsx       ← Button/Input/Textarea samples
```

### Reusable app components (built here, used in later milestones)

```
components/
  board/
    DayHeader.tsx
  ui/
    ThemeToggle.tsx
    WeekNav.tsx
```

---

## Styling

- Tailwind v4 + Shadcn (already installed, no new dependencies)
- All tokens defined in `app/globals.css` under `@theme inline`
- Hover tilt: pure CSS, no JS
- Light mode only (dark mode is M8)

---

## Out of Scope

- Interactivity beyond CSS hover (no click handlers, no state)
- Dark mode
- Mobile responsiveness (portfolio is desktop-first)
- Navigation link to `/style-guide` from the main app
