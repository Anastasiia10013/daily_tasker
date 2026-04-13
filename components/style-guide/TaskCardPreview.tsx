import { Crosshair, Trash2 } from 'lucide-react'

type CardVariant = 'focus' | 'todo' | 'in-progress' | 'done'

interface CardData {
  variant: CardVariant
  title: string
  description: string
  tilt: string
}

const CARDS: CardData[] = [
  {
    variant: 'focus',
    title: 'Focus task',
    description: 'Pinned to top, max 3 per day',
    tilt: '1deg',
  },
  {
    variant: 'todo',
    title: 'Todo task',
    description: 'Not started yet',
    tilt: '-2deg',
  },
  {
    variant: 'in-progress',
    title: 'In progress task',
    description: 'Currently being worked on',
    tilt: '2deg',
  },
  {
    variant: 'done',
    title: 'Done task',
    description: 'Completed',
    tilt: '-1deg',
  },
]

const BORDER_CLASS: Record<CardVariant, string> = {
  focus: 'border-2 border-[var(--color-yellow)]',
  todo: 'border border-[var(--color-black-10)]',
  'in-progress': 'border border-[var(--color-black-10)] border-l-4 border-l-[var(--color-sage-green)]',
  done: 'border border-[var(--color-black-10)]',
}

const STATUS_DOT_CLASS: Record<CardVariant, string> = {
  focus: 'bg-[var(--color-black-40)]',
  todo: 'bg-[var(--color-black-40)]',
  'in-progress': 'bg-[var(--color-sage-green)]',
  done: 'bg-[var(--color-black-40)]',
}

const STATUS_TEXT_CLASS: Record<CardVariant, string> = {
  focus: 'text-[var(--color-black-40)]',
  todo: 'text-[var(--color-black-40)]',
  'in-progress': 'text-[var(--color-sage-green)]',
  done: 'text-[var(--color-black-40)]',
}

const STATUS_LABEL: Record<CardVariant, string> = {
  focus: 'Todo',
  todo: 'Todo',
  'in-progress': 'In progress',
  done: 'Done',
}

function TaskCard({ variant, title, description, tilt }: CardData) {
  const isDone = variant === 'done'
  const isFocus = variant === 'focus'

  return (
    <div
      className={`bg-white rounded-[var(--border-radius)] p-4 cursor-grab task-card ${BORDER_CLASS[variant]} ${isDone ? 'opacity-50' : ''}`}
      style={{ '--tilt': tilt } as React.CSSProperties}
    >
      {/* Top row: crosshair + focus badge | delete */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-h-6 min-w-6">
          <Crosshair
            size={14}
            className={`flex-shrink-0 ${isFocus ? 'text-[var(--color-yellow)]' : 'text-[var(--color-black-40)]'}`}
          />
          {isFocus && (
            <span className="bg-[var(--color-yellow)] text-[var(--color-black)] text-xs font-bold px-2 py-0.5 rounded">
              Focus
            </span>
          )}
        </div>
        <div className="ml-auto flex-shrink-0 flex items-center justify-center size-6 text-[var(--color-black-40)]">
          <Trash2 size={14} />
        </div>
      </div>

      <p className={`font-medium text-[var(--color-black)] ${isDone ? 'line-through' : ''}`}>
        {title}
      </p>

      <p className="text-sm text-[var(--color-black-60)] mt-1 truncate">{description}</p>

      <div className="mt-2">
        <span className={`flex items-center gap-1.5 text-xs font-medium ${STATUS_TEXT_CLASS[variant]}`}>
          <span className={`inline-block size-1.5 rounded-full ${STATUS_DOT_CLASS[variant]}`} />
          {STATUS_LABEL[variant]}
        </span>
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
