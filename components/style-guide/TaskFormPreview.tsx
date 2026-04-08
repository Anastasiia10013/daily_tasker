import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

export function TaskFormPreview() {
  return (
    <div className="bg-white rounded-[var(--border-radius-large)] p-6 max-w-md border border-[var(--color-black-10)]">
      <h3 className="text-lg font-bold text-[var(--color-black)] mb-4">Add task</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="sg-title">Title</Label>
          <Input id="sg-title" placeholder="Task title" className="mt-1" readOnly />
        </div>
        <div>
          <Label htmlFor="sg-description">Description</Label>
          <Textarea id="sg-description" placeholder="Optional description" className="mt-1" readOnly />
        </div>
        <div>
          <Label>Status</Label>
          <Select disabled>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Todo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">Todo</SelectItem>
              <SelectItem value="in-progress">In progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="sg-focus" disabled />
          <Label htmlFor="sg-focus">Focus task</Label>
        </div>
        <div className="flex gap-2 pt-2">
          <Button>Save</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
    </div>
  )
}
