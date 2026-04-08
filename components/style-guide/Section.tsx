interface SectionProps {
  id: string
  title: string
  children: React.ReactNode
}

export function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="mb-16">
      <h2 className="sticky top-0 bg-background py-3 mb-6 text-xl font-bold text-foreground border-b border-border z-10">
        {title}
      </h2>
      <div>{children}</div>
    </section>
  )
}
