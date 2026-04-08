# M1 Style Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `/style-guide` page that documents every design token and renders every reusable component used in the Daily Tasker app.

**Architecture:** Single scrolling page (`app/style-guide/page.tsx`) composed of isolated preview components in `components/style-guide/`. Three components (`DayHeader`, `WeekNav`, `ThemeToggle`) are built as real app components and imported by the style guide — they ship here and get reused in later milestones.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, Shadcn (radix-vega style), lucide-react, Vitest + React Testing Library

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `app/style-guide/page.tsx` | Create | Main style guide page — assembles all sections |
| `components/style-guide/Section.tsx` | Create | Sticky-heading + content wrapper |
| `components/style-guide/ColorSwatch.tsx` | Create | Single color swatch: square + token name + hex |
| `components/style-guide/TaskCardPreview.tsx` | Create | 4 card variants with CSS hover tilt |
| `components/style-guide/TaskFormPreview.tsx` | Create | Flat form layout (no modal overlay) |
| `components/style-guide/PrimitivesPreview.tsx` | Create | Button / Input / Textarea samples |
| `components/board/DayHeader.tsx` | Create | Reusable day column header |
| `components/ui/WeekNav.tsx` | Create | Reusable week prev/next navigation |
| `components/ui/ThemeToggle.tsx` | Create | Reusable toggle (receives `active` prop) |
| `components/ui/input.tsx` | Create (via Shadcn) | Shadcn Input |
| `components/ui/textarea.tsx` | Create (via Shadcn) | Shadcn Textarea |
| `components/ui/select.tsx` | Create (via Shadcn) | Shadcn Select |
| `components/ui/checkbox.tsx` | Create (via Shadcn) | Shadcn Checkbox |
| `components/ui/label.tsx` | Create (via Shadcn) | Shadcn Label |
| `vitest.config.ts` | Create | Vitest configuration |
| `vitest.setup.ts` | Create | Jest-DOM matchers |

---

## Task 1: Set up Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`

- [ ] **Step 1: Install dependencies**

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

Expected: packages added to `devDependencies` in `package.json`.

- [ ] **Step 2: Create vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

- [ ] **Step 3: Create setup file**

Create `vitest.setup.ts`:

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Verify Vitest runs**

```bash
npx vitest run
```

Expected: "No test files found" (exit 0 or vitest exits cleanly — no config errors).

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts vitest.setup.ts package.json package-lock.json
git commit -m "chore: set up Vitest with React Testing Library"
```

---

## Task 2: Install missing Shadcn components

**Files:**
- Create: `components/ui/input.tsx`, `components/ui/textarea.tsx`, `components/ui/select.tsx`, `components/ui/checkbox.tsx`, `components/ui/label.tsx`

- [ ] **Step 1: Add components via Shadcn CLI**

```bash
npx shadcn@latest add input textarea select checkbox label
```

Expected: 5 new files created in `components/ui/`.

- [ ] **Step 2: Verify files exist**

```bash
ls components/ui/
```

Expected output includes: `button.tsx  checkbox.tsx  input.tsx  label.tsx  select.tsx  textarea.tsx`

- [ ] **Step 3: Commit**

```bash
git add components/ui/
git commit -m "chore: add Shadcn input, textarea, select, checkbox, label"
```

---

## Task 3: Section component

**Files:**
- Create: `components/style-guide/Section.tsx`
- Create: `components/style-guide/Section.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/style-guide/Section.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { Section } from './Section'

test('renders the section title', () => {
  render(<Section id="test" title="Colors"><p>content</p></Section>)
  expect(screen.getByText('Colors')).toBeInTheDocument()
})

test('renders children', () => {
  render(<Section id="test" title="Colors"><p>child content</p></Section>)
  expect(screen.getByText('child content')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run components/style-guide/Section.test.tsx
```

Expected: FAIL — "Cannot find module './Section'"

- [ ] **Step 3: Implement Section**

Create `components/style-guide/Section.tsx`:

```tsx
interface SectionProps {
  id: string
  title: string
  children: React.ReactNode
}

export function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="mb-16">
      <h2 className="sticky top-0 bg-[var(--color-off-white)] py-3 mb-6 text-xl font-bold text-[var(--color-black)] border-b border-[var(--color-black-10)] z-10">
        {title}
      </h2>
      <div>{children}</div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run components/style-guide/Section.test.tsx
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/style-guide/
git commit -m "feat: add Section style guide wrapper"
```

---

## Task 4: ColorSwatch component

**Files:**
- Create: `components/style-guide/ColorSwatch.tsx`
- Create: `components/style-guide/ColorSwatch.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/style-guide/ColorSwatch.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { ColorSwatch } from './ColorSwatch'

test('renders token variable name and hex value', () => {
  render(<ColorSwatch name="blue" hex="#3051a8" variable="--color-blue" />)
  expect(screen.getByText('--color-blue')).toBeInTheDocument()
  expect(screen.getByText('#3051a8')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run components/style-guide/ColorSwatch.test.tsx
```

Expected: FAIL — "Cannot find module './ColorSwatch'"

- [ ] **Step 3: Implement ColorSwatch**

Create `components/style-guide/ColorSwatch.tsx`:

```tsx
interface ColorSwatchProps {
  name: string
  hex: string
  variable: string
}

export function ColorSwatch({ hex, variable }: ColorSwatchProps) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="w-16 h-16 rounded-[var(--border-radius)] border border-[var(--color-black-10)]"
        style={{ backgroundColor: hex }}
      />
      <p className="text-xs font-mono text-[var(--color-black)]">{variable}</p>
      <p className="text-xs text-[var(--color-black-60)]">{hex}</p>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run components/style-guide/ColorSwatch.test.tsx
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/style-guide/ColorSwatch.tsx components/style-guide/ColorSwatch.test.tsx
git commit -m "feat: add ColorSwatch component"
```

---

## Task 5: ThemeToggle component

**Files:**
- Create: `components/ui/ThemeToggle.tsx`
- Create: `components/ui/ThemeToggle.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/ui/ThemeToggle.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { ThemeToggle } from './ThemeToggle'

test('renders with aria-pressed false when inactive', () => {
  render(<ThemeToggle active={false} />)
  expect(screen.getByRole('button', { name: /toggle theme/i })).toHaveAttribute('aria-pressed', 'false')
})

test('renders with aria-pressed true when active', () => {
  render(<ThemeToggle active={true} />)
  expect(screen.getByRole('button', { name: /toggle theme/i })).toHaveAttribute('aria-pressed', 'true')
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run components/ui/ThemeToggle.test.tsx
```

Expected: FAIL — "Cannot find module './ThemeToggle'"

- [ ] **Step 3: Implement ThemeToggle**

Create `components/ui/ThemeToggle.tsx`:

```tsx
interface ThemeToggleProps {
  active?: boolean
}

export function ThemeToggle({ active = false }: ThemeToggleProps) {
  return (
    <button
      aria-pressed={active}
      aria-label="Toggle theme"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-[var(--duration-default)] ${
        active ? 'bg-[var(--color-blue)]' : 'bg-[var(--color-black-10)]'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-[var(--duration-default)] ${
          active ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run components/ui/ThemeToggle.test.tsx
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/ui/ThemeToggle.tsx components/ui/ThemeToggle.test.tsx
git commit -m "feat: add ThemeToggle component"
```

---

## Task 6: WeekNav component

**Files:**
- Create: `components/ui/WeekNav.tsx`
- Create: `components/ui/WeekNav.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/ui/WeekNav.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { WeekNav } from './WeekNav'

test('renders week label and navigation buttons', () => {
  render(<WeekNav label="Apr 7–13, 2026" />)
  expect(screen.getByText('Apr 7–13, 2026')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /previous week/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /next week/i })).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run components/ui/WeekNav.test.tsx
```

Expected: FAIL — "Cannot find module './WeekNav'"

- [ ] **Step 3: Implement WeekNav**

Create `components/ui/WeekNav.tsx`:

```tsx
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface WeekNavProps {
  label: string
  onPrev?: () => void
  onNext?: () => void
}

export function WeekNav({ label, onPrev, onNext }: WeekNavProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onPrev}
        aria-label="Previous week"
        className="p-1 rounded hover:bg-[var(--color-black-10)] transition-colors duration-[var(--duration-default)]"
      >
        <ChevronLeft size={20} />
      </button>
      <span className="text-sm font-medium text-[var(--color-black)]">{label}</span>
      <button
        onClick={onNext}
        aria-label="Next week"
        className="p-1 rounded hover:bg-[var(--color-black-10)] transition-colors duration-[var(--duration-default)]"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run components/ui/WeekNav.test.tsx
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/ui/WeekNav.tsx components/ui/WeekNav.test.tsx
git commit -m "feat: add WeekNav component"
```

---

## Task 7: DayHeader component

**Files:**
- Create: `components/board/DayHeader.tsx`
- Create: `components/board/DayHeader.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/board/DayHeader.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { DayHeader } from './DayHeader'

test('renders day name, date, and add task button', () => {
  render(<DayHeader dayName="Monday" date="Apr 7" />)
  expect(screen.getByText('Monday')).toBeInTheDocument()
  expect(screen.getByText('Apr 7')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run components/board/DayHeader.test.tsx
```

Expected: FAIL — "Cannot find module './DayHeader'"

- [ ] **Step 3: Implement DayHeader**

Create `components/board/DayHeader.tsx`:

```tsx
import { Plus } from 'lucide-react'

interface DayHeaderProps {
  dayName: string
  date: string
  onAdd?: () => void
}

export function DayHeader({ dayName, date, onAdd }: DayHeaderProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <span className="font-bold text-[var(--color-black)]">{dayName}</span>
        <span className="text-sm text-[var(--color-black-60)] ml-2">{date}</span>
      </div>
      <button
        onClick={onAdd}
        aria-label="Add task"
        className="flex items-center gap-1 text-sm text-[var(--color-black-60)] hover:text-[var(--color-black)] transition-colors duration-[var(--duration-default)]"
      >
        <Plus size={16} />
        Add task
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run components/board/DayHeader.test.tsx
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/board/DayHeader.tsx components/board/DayHeader.test.tsx
git commit -m "feat: add DayHeader component"
```

---

## Task 8: TaskCardPreview component

**Files:**
- Create: `components/style-guide/TaskCardPreview.tsx`
- Create: `components/style-guide/TaskCardPreview.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/style-guide/TaskCardPreview.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { TaskCardPreview } from './TaskCardPreview'

test('renders all four card variants', () => {
  render(<TaskCardPreview />)
  expect(screen.getByText('Focus task')).toBeInTheDocument()
  expect(screen.getByText('Todo task')).toBeInTheDocument()
  expect(screen.getByText('In progress task')).toBeInTheDocument()
  expect(screen.getByText('Done task')).toBeInTheDocument()
})

test('renders Focus badge on focus card', () => {
  render(<TaskCardPreview />)
  expect(screen.getByText('Focus')).toBeInTheDocument()
})

test('done card title has line-through class', () => {
  render(<TaskCardPreview />)
  const doneTitle = screen.getByText('Done task')
  expect(doneTitle).toHaveClass('line-through')
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run components/style-guide/TaskCardPreview.test.tsx
```

Expected: FAIL — "Cannot find module './TaskCardPreview'"

- [ ] **Step 3: Implement TaskCardPreview**

Create `components/style-guide/TaskCardPreview.tsx`:

```tsx
type CardVariant = 'focus' | 'todo' | 'in-progress' | 'done'

interface CardData {
  variant: CardVariant
  title: string
  description: string
  rotation: string
}

const CARDS: CardData[] = [
  {
    variant: 'focus',
    title: 'Focus task',
    description: 'Pinned to top, max 3 per day',
    rotation: 'hover:rotate-[1deg]',
  },
  {
    variant: 'todo',
    title: 'Todo task',
    description: 'Not started yet',
    rotation: 'hover:rotate-[-2deg]',
  },
  {
    variant: 'in-progress',
    title: 'In progress task',
    description: 'Currently being worked on',
    rotation: 'hover:rotate-[2deg]',
  },
  {
    variant: 'done',
    title: 'Done task',
    description: 'Completed',
    rotation: 'hover:rotate-[-1deg]',
  },
]

const borderClass: Record<CardVariant, string> = {
  focus: 'border-2 border-[var(--color-yellow)]',
  todo: 'border border-[var(--color-black-10)]',
  'in-progress': 'border border-[var(--color-black-10)] border-l-4 border-l-[var(--color-blue)]',
  done: 'border border-[var(--color-black-10)] opacity-60',
}

function TaskCard({ variant, title, description, rotation }: CardData) {
  return (
    <div
      className={`bg-white rounded-[var(--border-radius)] p-4 cursor-pointer transition-transform duration-[250ms] ${borderClass[variant]} ${rotation}`}
    >
      {variant === 'focus' && (
        <span className="inline-block bg-[var(--color-yellow)] text-[var(--color-black)] text-xs font-bold px-2 py-0.5 rounded mb-2">
          Focus
        </span>
      )}
      <p className={`font-medium text-[var(--color-black)] ${variant === 'done' ? 'line-through' : ''}`}>
        {title}
      </p>
      <p className="text-sm text-[var(--color-black-60)] mt-1">{description}</p>
      <div className="mt-2 text-xs">
        {variant === 'in-progress' && (
          <span className="text-[var(--color-blue)] font-medium">In progress</span>
        )}
        {variant === 'done' && <span className="text-[var(--color-black-40)]">Done</span>}
        {variant === 'todo' && <span className="text-[var(--color-black-40)]">Todo</span>}
        {variant === 'focus' && <span className="text-[var(--color-yellow)]">●</span>}
      </div>
    </div>
  )
}

export function TaskCardPreview() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {CARDS.map((card) => (
        <TaskCard key={card.variant} {...card} />
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run components/style-guide/TaskCardPreview.test.tsx
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/style-guide/TaskCardPreview.tsx components/style-guide/TaskCardPreview.test.tsx
git commit -m "feat: add TaskCardPreview component"
```

---

## Task 9: TaskFormPreview component

**Files:**
- Create: `components/style-guide/TaskFormPreview.tsx`
- Create: `components/style-guide/TaskFormPreview.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/style-guide/TaskFormPreview.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { TaskFormPreview } from './TaskFormPreview'

test('renders all form fields', () => {
  render(<TaskFormPreview />)
  expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/focus task/i)).toBeInTheDocument()
})

test('renders Save and Cancel buttons', () => {
  render(<TaskFormPreview />)
  expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run components/style-guide/TaskFormPreview.test.tsx
```

Expected: FAIL — "Cannot find module './TaskFormPreview'"

- [ ] **Step 3: Implement TaskFormPreview**

Create `components/style-guide/TaskFormPreview.tsx`:

```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

export function TaskFormPreview() {
  return (
    <div className="bg-white rounded-[var(--border-radius-large)] p-6 max-w-md border border-[var(--color-black-10)]">
      <h3 className="text-lg font-bold text-[var(--color-black)] mb-4">Add task</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="sg-title">Title</Label>
          <Input id="sg-title" placeholder="Task title" className="mt-1" readOnly />
        </div>
        <div>
          <Label htmlFor="sg-description">Description</Label>
          <Textarea id="sg-description" placeholder="Optional description" className="mt-1" readOnly />
        </div>
        <div>
          <Label>Status</Label>
          <Select disabled>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Todo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">Todo</SelectItem>
              <SelectItem value="in-progress">In progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="sg-focus" disabled />
          <Label htmlFor="sg-focus">Focus task</Label>
        </div>
        <div className="flex gap-2 pt-2">
          <Button>Save</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run components/style-guide/TaskFormPreview.test.tsx
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/style-guide/TaskFormPreview.tsx components/style-guide/TaskFormPreview.test.tsx
git commit -m "feat: add TaskFormPreview component"
```

---

## Task 10: PrimitivesPreview component

**Files:**
- Create: `components/style-guide/PrimitivesPreview.tsx`
- Create: `components/style-guide/PrimitivesPreview.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/style-guide/PrimitivesPreview.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { PrimitivesPreview } from './PrimitivesPreview'

test('renders all four button variants', () => {
  render(<PrimitivesPreview />)
  expect(screen.getByRole('button', { name: 'Default' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Destructive' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Outline' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Ghost' })).toBeInTheDocument()
})

test('renders input and textarea', () => {
  render(<PrimitivesPreview />)
  expect(screen.getByPlaceholderText('Input placeholder')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Textarea placeholder')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run components/style-guide/PrimitivesPreview.test.tsx
```

Expected: FAIL — "Cannot find module './PrimitivesPreview'"

- [ ] **Step 3: Implement PrimitivesPreview**

Create `components/style-guide/PrimitivesPreview.tsx`:

```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function PrimitivesPreview() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-[var(--color-black-60)] mb-3">Button variants</p>
        <div className="flex flex-wrap gap-3">
          <Button>Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--color-black-60)] mb-3">Input</p>
        <Input placeholder="Input placeholder" className="max-w-xs" readOnly />
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--color-black-60)] mb-3">Textarea</p>
        <Textarea placeholder="Textarea placeholder" className="max-w-xs" readOnly />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run components/style-guide/PrimitivesPreview.test.tsx
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/style-guide/PrimitivesPreview.tsx components/style-guide/PrimitivesPreview.test.tsx
git commit -m "feat: add PrimitivesPreview component"
```

---

## Task 11: Assemble style guide page

**Files:**
- Create: `app/style-guide/page.tsx`

> Before writing this file, read the App Router page guide: `node_modules/next/dist/docs/01-app/02-guides/` — specifically how default exports and Server Components work in Next.js 16.

- [ ] **Step 1: Create the page**

Create `app/style-guide/page.tsx`:

```tsx
import { Section } from '@/components/style-guide/Section'
import { ColorSwatch } from '@/components/style-guide/ColorSwatch'
import { TaskCardPreview } from '@/components/style-guide/TaskCardPreview'
import { TaskFormPreview } from '@/components/style-guide/TaskFormPreview'
import { PrimitivesPreview } from '@/components/style-guide/PrimitivesPreview'
import { DayHeader } from '@/components/board/DayHeader'
import { WeekNav } from '@/components/ui/WeekNav'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const COLOR_TOKENS = [
  { name: 'blue', hex: '#3051a8', variable: '--color-blue' },
  { name: 'green', hex: '#3f593d', variable: '--color-green' },
  { name: 'sky', hex: '#90c0e6', variable: '--color-sky' },
  { name: 'red', hex: '#d30423', variable: '--color-red' },
  { name: 'yellow', hex: '#f4c537', variable: '--color-yellow' },
  { name: 'sage-green', hex: '#d7d7c8', variable: '--color-sage-green' },
  { name: 'off-white', hex: '#f2f0e9', variable: '--color-off-white' },
  { name: 'black', hex: '#141212', variable: '--color-black' },
  { name: 'black-60', hex: '#5b5959', variable: '--color-black-60' },
  { name: 'black-40', hex: '#a1a0a0', variable: '--color-black-40' },
  { name: 'black-10', hex: '#d0d0d0', variable: '--color-black-10' },
  { name: 'white', hex: '#ffffff', variable: '--color-white' },
  { name: 'red-brick', hex: '#863a29', variable: '--color-red-brick' },
]

const RADIUS_TOKENS = [
  { label: 'small', value: '8px', variable: '--border-radius-small' },
  { label: 'default', value: '12px', variable: '--border-radius' },
  { label: 'large', value: '16px', variable: '--border-radius-large' },
  { label: 'xlarge', value: '24px', variable: '--border-radius-xlarge' },
]

export default function StyleGuidePage() {
  return (
    <main className="max-w-5xl mx-auto px-8 py-12 bg-[var(--color-off-white)] min-h-screen">
      <h1 className="text-4xl font-bold text-[var(--color-black)] mb-12">Style Guide</h1>

      <Section id="colors" title="Colors">
        <div className="flex flex-wrap gap-6">
          {COLOR_TOKENS.map((t) => (
            <ColorSwatch key={t.name} {...t} />
          ))}
        </div>
      </Section>

      <Section id="typography" title="Typography">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-[var(--color-black-40)] mb-1">H1 — text-4xl font-bold</p>
            <h1 className="text-4xl font-bold text-[var(--color-black)]">Heading 1</h1>
          </div>
          <div>
            <p className="text-xs text-[var(--color-black-40)] mb-1">H2 — text-3xl font-bold</p>
            <h2 className="text-3xl font-bold text-[var(--color-black)]">Heading 2</h2>
          </div>
          <div>
            <p className="text-xs text-[var(--color-black-40)] mb-1">H3 — text-2xl font-semibold</p>
            <h3 className="text-2xl font-semibold text-[var(--color-black)]">Heading 3</h3>
          </div>
          <div>
            <p className="text-xs text-[var(--color-black-40)] mb-1">H4 — text-xl font-semibold</p>
            <h4 className="text-xl font-semibold text-[var(--color-black)]">Heading 4</h4>
          </div>
          <div>
            <p className="text-xs text-[var(--color-black-40)] mb-1">Body — text-base</p>
            <p className="text-base text-[var(--color-black)]">
              Body text — the quick brown fox jumps over the lazy dog
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-black-40)] mb-1">Small — text-sm</p>
            <p className="text-sm text-[var(--color-black-60)]">Small text — secondary information</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-black-40)] mb-1">Mono — font-mono text-sm</p>
            <code className="font-mono text-sm text-[var(--color-black)]">monospace — 2026-04-07</code>
          </div>
        </div>
      </Section>

      <Section id="spacing" title="Spacing & Radius">
        <div className="flex flex-wrap gap-6 items-end">
          {RADIUS_TOKENS.map((r) => (
            <div key={r.label} className="flex flex-col items-center gap-2">
              <div
                className="w-16 h-16 bg-[var(--color-black-10)] border border-[var(--color-black-40)]"
                style={{ borderRadius: r.value }}
              />
              <p className="text-xs font-mono text-[var(--color-black)]">{r.variable}</p>
              <p className="text-xs text-[var(--color-black-60)]">{r.value}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="task-cards" title="Task Cards">
        <TaskCardPreview />
      </Section>

      <Section id="day-header" title="Day Header">
        <div className="max-w-sm border border-[var(--color-black-10)] rounded-[var(--border-radius)] p-2">
          <DayHeader dayName="Monday" date="Apr 7" />
        </div>
      </Section>

      <Section id="week-nav" title="Week Navigation">
        <WeekNav label="Apr 7–13, 2026" />
      </Section>

      <Section id="theme-toggle" title="Theme Toggle">
        <div className="flex gap-8">
          <div className="flex flex-col items-center gap-2">
            <ThemeToggle active={false} />
            <p className="text-xs text-[var(--color-black-60)]">Light</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ThemeToggle active={true} />
            <p className="text-xs text-[var(--color-black-60)]">Dark</p>
          </div>
        </div>
      </Section>

      <Section id="task-form" title="Task Form">
        <TaskFormPreview />
      </Section>

      <Section id="primitives" title="Primitives">
        <PrimitivesPreview />
      </Section>
    </main>
  )
}
```

- [ ] **Step 2: Run all tests**

```bash
npx vitest run
```

Expected: All tests PASS

- [ ] **Step 3: Build check**

```bash
npm run build
```

Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 4: Smoke check in browser**

```bash
npm run dev
```

Open `http://localhost:3000/style-guide` and verify:
- All 9 sections render
- Color swatches show correct colors
- Card hover tilt animates on hover
- ThemeToggle shows two distinct visual states (left/right knob)