import { Section } from '@/components/style-guide/Section'
import { ColorSwatch } from '@/components/style-guide/ColorSwatch'
import { TaskCardPreview } from '@/components/style-guide/TaskCardPreview'
import { TaskFormPreview } from '@/components/style-guide/TaskFormPreview'
import { PrimitivesPreview } from '@/components/style-guide/PrimitivesPreview'
import { DayHeader } from '@/components/board/DayHeader'
import { WeekNav } from '@/components/ui/WeekNav'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const COLOR_TOKENS = [
  { name: 'green', variable: '--color-green' },
  { name: 'sage-green', variable: '--color-sage-green' },
  { name: 'tan', variable: '--color-tan' },
  { name: 'brown', variable: '--color-brown' },
  { name: 'dusty-rose', variable: '--color-dusty-rose' },
  { name: 'yellow', variable: '--color-yellow' },
  { name: 'red', variable: '--color-red' },
  { name: 'off-white', variable: '--color-off-white' },
  { name: 'black', variable: '--color-black' },
  { name: 'black-60', variable: '--color-black-60' },
  { name: 'black-40', variable: '--color-black-40' },
  { name: 'black-10', variable: '--color-black-10' },
  { name: 'white', variable: '--color-white' },
]

const RADIUS_TOKENS = [
  { label: 'small', value: '8px', variable: '--border-radius-small' },
  { label: 'default', value: '12px', variable: '--border-radius' },
  { label: 'large', value: '16px', variable: '--border-radius-large' },
  { label: 'xlarge', value: '24px', variable: '--border-radius-xlarge' },
]

export default function StyleGuidePage() {
  return (
    <main className="max-w-5xl mx-auto px-8 py-12 bg-background min-h-screen">
      <h1 className="text-4xl font-bold text-foreground mb-12">Style Guide</h1>

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
            <p className="text-xs text-muted-foreground mb-1">H1 — text-4xl font-bold</p>
            <h1 className="text-4xl font-bold text-foreground">Heading 1</h1>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">H2 — text-3xl font-bold</p>
            <h2 className="text-3xl font-bold text-foreground">Heading 2</h2>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">H3 — text-2xl font-semibold</p>
            <h3 className="text-2xl font-semibold text-foreground">Heading 3</h3>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">H4 — text-xl font-semibold</p>
            <h4 className="text-xl font-semibold text-foreground">Heading 4</h4>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Body — text-base</p>
            <p className="text-base text-foreground">
              Body text — the quick brown fox jumps over the lazy dog
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Small — text-sm</p>
            <p className="text-sm text-muted-foreground">Small text — secondary information</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Mono — font-mono text-sm</p>
            <code className="font-mono text-sm text-foreground">monospace — 2026-04-07</code>
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
        <div className="flex items-center justify-between px-4 py-3 border border-[var(--color-black-10)] rounded-[var(--border-radius)] max-w-xl">
          <span className="text-lg font-bold text-foreground">Daily Tasker</span>
          <div className="flex items-center gap-4">
            <WeekNav label="Apr 7–13, 2026" prevHref="/week/2026-03-30" nextHref="/week/2026-04-13" />
            <ThemeToggle />
          </div>
        </div>
      </Section>

      <Section id="theme-toggle" title="Theme Toggle">
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <p className="text-xs text-muted-foreground">
            Click to switch themes — the highlighted icon shows the active theme.
          </p>
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
