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
  'in-progress': 'border border-[var(--color-black-10)] border-l-4 border-l-[var(--color-sage-green)]',
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
          <span className="text-[var(--color-sage-green)] font-medium">In progress</span>
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
