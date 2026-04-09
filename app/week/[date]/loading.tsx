export default function WeekLoading() {
  return (
    <div className="flex flex-col flex-1 animate-pulse">
      <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-black-10)]">
        <div className="h-6 w-28 bg-[var(--color-black-10)] rounded" />
        <div className="h-6 w-40 bg-[var(--color-black-10)] rounded" />
      </header>
      <div className="flex gap-4 overflow-x-auto px-4 pb-4 flex-1 pt-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex flex-col min-w-[200px] gap-2">
            <div className="h-8 bg-[var(--color-black-10)] rounded" />
            <div className="h-16 bg-[var(--color-black-10)] rounded" />
            <div className="h-16 bg-[var(--color-black-10)] rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
