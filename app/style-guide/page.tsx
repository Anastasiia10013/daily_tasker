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
