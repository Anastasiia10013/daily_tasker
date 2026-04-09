"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useTaskStore } from '@/lib/store/taskStore'
import type { Task, TaskStatus } from '@/types'

interface TaskFormProps {
  open: boolean
  onClose: () => void
  date: string
  editTask?: Task
  focusLimitReached?: boolean
}

export function TaskForm({ open, onClose, date, editTask, focusLimitReached = false }: TaskFormProps) {
  const { addTask, updateTask, deleteTask } = useTaskStore()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [isFocus, setIsFocus] = useState(false)
  const [focusFormError, setFocusFormError] = useState(false)

  // Checkbox is blocked when limit is reached and this task isn't already a focus task
  const focusCheckboxBlocked = focusLimitReached && !(editTask?.isFocus === true)

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title)
      setDescription(editTask.description ?? '')
      setStatus(editTask.status)
      setIsFocus(editTask.isFocus)
    } else {
      setTitle('')
      setDescription('')
      setStatus('todo')
      setIsFocus(false)
    }
    setFocusFormError(false)
  }, [editTask, open])

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
    } else {
      addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        isFocus,
        date,
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
        </DialogHeader>

        <div className="space-y-4">
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
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Optional description"
              className="mt-1"
            />
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
