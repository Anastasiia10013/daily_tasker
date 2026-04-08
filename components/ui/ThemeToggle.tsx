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
