import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { TaskForm } from './TaskForm'
import { useTaskStore } from '@/lib/store/taskStore'
import type { Task } from '@/types'

beforeEach(() => {
  useTaskStore.setState({ tasks: {} })
})

const EDIT_TASK: Task = {
  id: 'task-1',
  title: 'Existing task',
  description: 'Some description',
  status: 'todo',
  isFocus: false,
  date: '2026-04-07',
  order: 0,
  createdAt: '2026-04-07T00:00:00.000Z',
}

test('add mode: shows "Add task" title', () => {
  render(<TaskForm open={true} onClose={() => {}} date="2026-04-07" />)
  expect(screen.getByText('Add task')).toBeInTheDocument()
})

test('add mode: does not show Delete button', () => {
  render(<TaskForm open={true} onClose={() => {}} date="2026-04-07" />)
  expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
})

test('add mode: Save button is disabled when title is empty', () => {
  render(<TaskForm open={true} onClose={() => {}} date="2026-04-07" />)
  expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
})

test('add mode: saves new task with correct date and calls onClose', () => {
  const onClose = vi.fn()
  render(<TaskForm open={true} onClose={onClose} date="2026-04-07" />)
  fireEvent.change(screen.getByPlaceholderText('Task title'), { target: { value: 'New task' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  const tasks = Object.values(useTaskStore.getState().tasks)
  expect(tasks).toHaveLength(1)
  expect(tasks[0].title).toBe('New task')
  expect(tasks[0].date).toBe('2026-04-07')
  expect(onClose).toHaveBeenCalled()
})

test('edit mode: shows "Edit task" title', () => {
  render(<TaskForm open={true} onClose={() => {}} date="2026-04-07" editTask={EDIT_TASK} />)
  expect(screen.getByText('Edit task')).toBeInTheDocument()
})

test('edit mode: shows Delete button', () => {
  render(<TaskForm open={true} onClose={() => {}} date="2026-04-07" editTask={EDIT_TASK} />)
  expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
})

test('edit mode: pre-fills title field', () => {
  render(<TaskForm open={true} onClose={() => {}} date="2026-04-07" editTask={EDIT_TASK} />)
  expect(screen.getByDisplayValue('Existing task')).toBeInTheDocument()
})

test('edit mode: pre-fills description field', () => {
  render(<TaskForm open={true} onClose={() => {}} date="2026-04-07" editTask={EDIT_TASK} />)
  expect(screen.getByDisplayValue('Some description')).toBeInTheDocument()
})

test('edit mode: updates task on Save and calls onClose', () => {
  useTaskStore.setState({ tasks: { 'task-1': EDIT_TASK } })
  const onClose = vi.fn()
  render(<TaskForm open={true} onClose={onClose} date="2026-04-07" editTask={EDIT_TASK} />)
  const titleInput = screen.getByDisplayValue('Existing task')
  fireEvent.change(titleInput, { target: { value: 'Updated title' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  expect(useTaskStore.getState().tasks['task-1'].title).toBe('Updated title')
  expect(onClose).toHaveBeenCalled()
})

test('edit mode: deletes task on Delete and calls onClose', () => {
  useTaskStore.setState({ tasks: { 'task-1': EDIT_TASK } })
  const onClose = vi.fn()
  render(<TaskForm open={true} onClose={onClose} date="2026-04-07" editTask={EDIT_TASK} />)
  fireEvent.click(screen.getByRole('button', { name: /delete/i }))
  expect(useTaskStore.getState().tasks['task-1']).toBeUndefined()
  expect(onClose).toHaveBeenCalled()
})

test('Cancel button calls onClose without saving', () => {
  const onClose = vi.fn()
  render(<TaskForm open={true} onClose={onClose} date="2026-04-07" />)
  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
  expect(onClose).toHaveBeenCalled()
  expect(Object.values(useTaskStore.getState().tasks)).toHaveLength(0)
})
