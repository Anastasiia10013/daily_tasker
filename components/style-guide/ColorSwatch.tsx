interface ColorSwatchProps {
  name: string
  variable: string
}

export function ColorSwatch({ variable }: ColorSwatchProps) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="w-16 h-16 rounded-[var(--border-radius)] border border-[var(--color-black-10)]"
        style={{ backgroundColor: `var(${variable})` }}
      />
      <p className="text-xs font-mono text-foreground">{variable}</p>
    </div>
  )
}
