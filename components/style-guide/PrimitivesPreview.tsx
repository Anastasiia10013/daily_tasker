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
