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
