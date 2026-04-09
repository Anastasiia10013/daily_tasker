import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { TaskCard } from './TaskCard'
import type { Task } from '@/types'

const BASE_TASK: Task = {
  id: 'test-id-abc',
  title: 'Test task',
  status: 'todo',
  isFocus: false,
  date: '2026-04-07',
  order: 0,
  createdAt: '2026-04-07T00:00:00.000Z',
}

test('renders task title', () => {
  render(<TaskCard task={BASE_TASK} onEdit={() => {}} onDelete={() => {}} onStatusChange={() => {}} />)
  expect(screen.getByText('Test task')).toBeInTheDocument()
})

test('renders description when provided', () => {
  render(<TaskCard task={{ ...BASE_TASK, description: 'My description' }} onEdit={() => {}} onDelete={() => {}} onStatusChange={() => {}} />)
  expect(screen.getByText('My description')).toBeInTheDocument()
})

test('does not render description when not provided', () => {
  render(<TaskCard task={BASE_TASK} onEdit={() => {}} onDelete={() => {}} onStatusChange={() => {}} />)
  expect(screen.queryByTestId('task-description')).not.toBeInTheDocument()
})

test('renders Focus badge for focus tasks', () => {
  render(<TaskCard task={{ ...BASE_TASK, isFocus: true }} onEdit={() => {}} onDelete={() => {}} onStatusChange={() => {}} />)
  expect(screen.getByText('Focus')).toBeInTheDocument()
})

test('does not render Focus badge for non-focus tasks', () => {
  render(<TaskCard task={BASE_TASK} onEdit={() => {}} onDelete={() => {}} onStatusChange={() => {}} />)
  expect(screen.queryByText('Focus')).not.toBeInTheDocument()
})

test('title has line-through class for done tasks', () => {
  render(<TaskCard task={{ ...BASE_TASK, status: 'done' }} onEdit={() => {}} onDelete={() => {}} onStatusChange={() => {}} />)
  expect(screen.getByText('Test task')).toHaveClass('line-through')
})

test('title does not have line-through for todo tasks', () => {
  render(<TaskCard task={BASE_TASK} onEdit={() => {}} onDelete={() => {}} onStatusChange={() => {}} />)
  expect(screen.getByText('Test task')).not.toHaveClass('line-through')
})

test('clicking card body calls onEdit with the task', () => {
  const onEdit = vi.fn()
  render(<TaskCard task={BASE_TASK} onEdit={onEdit} onDelete={() => {}} onStatusChange={() => {}} />)
  fireEvent.click(screen.getByTestId('task-card'))
  expect(onEdit).toHaveBeenCalledWith(BASE_TASK)
})

test('clicking trash icon calls onDelete with task id', () => {
  const onDelete = vi.fn()
  render(<TaskCard task={BASE_TASK} onEdit={() => {}} onDelete={onDelete} onStatusChange={() => {}} />)
  fireEvent.click(screen.getByLabelText('Delete task'))
  expect(onDelete).toHaveBeenCalledWith('test-id-abc')
})

test('clicking trash icon does not call onEdit', () => {
  const onEdit = vi.fn()
  render(<TaskCard task={BASE_TASK} onEdit={onEdit} onDelete={() => {}} onStatusChange={() => {}} />)
  fireEvent.click(screen.getByLabelText('Delete task'))
  expect(onEdit).not.toHaveBeenCalled()
})

test('renders trash icon', () => {
  render(<TaskCard task={BASE_TASK} onEdit={() => {}} onDelete={() => {}} onStatusChange={() => {}} />)
  expect(screen.getByLabelText('Delete task')).toBeInTheDocument()
})
