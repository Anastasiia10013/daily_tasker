"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useTaskStore } from '@/lib/store/taskStore'
import { MarkdownViewer } from '@/components/tasks/MarkdownViewer'
import type { Task, TaskStatus } from '@/types'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDateDisplay(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  return `${MONTHS[month - 1]} ${day}, ${year}`
}

interface TaskFormProps {
  open: boolean
  onClose: () => void
  date: string
  editTask?: Task
  focusLimitReached?: boolean
}

export function TaskForm({ open, onClose, date, editTask, focusLimitReached = false }: TaskFormProps) {
  const { addTask, updateTask, deleteTask, moveTask } = useTaskStore()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [descriptionTab, setDescriptionTab] = useState<'edit' | 'preview'>('edit')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [isFocus, setIsFocus] = useState(false)
  const [focusFormError, setFocusFormError] = useState(false)
  const [selectedDate, setSelectedDate] = useState(date)

  // Checkbox is blocked when limit is reached and this task isn't already a focus task
  const focusCheckboxBlocked = focusLimitReached && !(editTask?.isFocus === true)

  // Resets form fields when the editTask prop changes (open dialog, switch task).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title)
      setDescription(editTask.description ?? '')
      setStatus(editTask.status)
      setIsFocus(editTask.isFocus)
      setSelectedDate(editTask.date)
    } else {
      setTitle('')
      setDescription('')
      setStatus('todo')
      setIsFocus(false)
      setSelectedDate(date)
    }
    setFocusFormError(false)
    setDescriptionTab('edit')
  }, [editTask, open, date])
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleFocusChange = (checked: boolean) => {
    if (checked && focusCheckboxBlocked) {
      setFocusFormError(true)
      setTimeout(() => setFocusFormError(false), 2000)
      return
    }
    setFocusFormError(false)
    setIsFocus(checked === true)
  }

  const handleSave = () => {
    if (!title.trim()) return
    if (editTask) {
      updateTask(editTask.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        isFocus,
      })
      if (selectedDate !== editTask.date) moveTask(editTask.id, selectedDate)
    } else {
      addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        isFocus,
        date: selectedDate,
      })
    }
    onClose()
  }

  const handleDelete = () => {
    if (editTask) {
      deleteTask(editTask.id)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={open => { if (!open) onClose() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editTask ? 'Edit task' : 'Add task'}</DialogTitle>
          <DialogDescription className="sr-only">
            {editTask ? 'Edit the details of an existing task.' : 'Create a new task with a title, date, and optional description.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="task-date">Date</Label>
            <div className="flex items-center gap-2 mt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const d = new Date(selectedDate)
                  d.setDate(d.getDate() - 7)
                  setSelectedDate(d.toISOString().slice(0, 10))
                }}
              >
                <span className="sm:hidden">←</span>
                <span className="hidden sm:inline">← Prev week</span>
              </Button>
              <div className="relative flex-1">
                <div className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm flex items-center justify-between pointer-events-none">
                  <span>{formatDateDisplay(selectedDate)}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                </div>
                <input
                  id="task-date"
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const d = new Date(selectedDate)
                  d.setDate(d.getDate() + 7)
                  setSelectedDate(d.toISOString().slice(0, 10))
                }}
              >
                <span className="sm:hidden">→</span>
                <span className="hidden sm:inline">Next week →</span>
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Task title"
              className="mt-1"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="task-description">Description</Label>
              <div className="flex text-xs rounded-md border border-input overflow-hidden">
                <button
                  type="button"
                  onClick={() => setDescriptionTab('edit')}
                  className={`px-2.5 py-1 transition-colors cursor-pointer ${
                    descriptionTab === 'edit'
                      ? 'bg-[var(--color-black)] text-white'
                      : 'text-[var(--color-black-60)] hover:text-[var(--color-black)]'
                  }`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDescriptionTab('preview')}
                  className={`px-2.5 py-1 transition-colors cursor-pointer border-l border-input ${
                    descriptionTab === 'preview'
                      ? 'bg-[var(--color-black)] text-white'
                      : 'text-[var(--color-black-60)] hover:text-[var(--color-black)]'
                  }`}
                >
                  Preview
                </button>
              </div>
            </div>
            {descriptionTab === 'edit' ? (
              <>
                <Textarea
                  id="task-description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Optional description"
                  className="mt-1 min-h-24 font-mono text-sm"
                />
                <p className="mt-1 text-[11px] text-[var(--color-black-40)] font-mono leading-relaxed">
                  {'- [ ] todo  - [x] done  **bold**  _italic_  `code`'}
                </p>
              </>
            ) : (
              <div className="mt-1 min-h-24 rounded-md border border-input px-3 py-2">
                {description.trim() ? (
                  <MarkdownViewer content={description} />
                ) : (
                  <p className="text-sm text-[var(--color-black-40)]">Nothing to preview</p>
                )}
              </div>
            )}
          </div>

          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={v => setStatus(v as TaskStatus)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in-progress">In progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="task-focus"
                checked={isFocus}
                onCheckedChange={handleFocusChange}
                className={focusCheckboxBlocked ? 'opacity-40 cursor-not-allowed' : ''}
              />
              <Label
                htmlFor="task-focus"
                className={focusCheckboxBlocked ? 'opacity-40 cursor-not-allowed' : ''}
              >
                Focus task
              </Label>
            </div>
            {focusFormError && (
              <p className="text-xs text-[var(--color-red)] mt-1">
                Focus limit reached — unfocus another task first
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          {editTask && (
            <Button variant="destructive" onClick={handleDelete} className="mr-auto">
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!title.trim()}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
