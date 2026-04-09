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

const DEFAULT_PROPS = {
  onEdit: () => {},
  onDelete: () => {},
  onStatusChange: () => {},
  onToggleFocus: () => {},
  focusLimitReached: false,
}

test('renders task title', () => {
  render(<TaskCard task={BASE_TASK} {...DEFAULT_PROPS} />)
  expect(screen.getByText('Test task')).toBeInTheDocument()
})

test('renders description when provided', () => {
  render(<TaskCard task={{ ...BASE_TASK, description: 'My description' }} {...DEFAULT_PROPS} />)
  expect(screen.getByText('My description')).toBeInTheDocument()
})

test('does not render description when not provided', () => {
  render(<TaskCard task={BASE_TASK} {...DEFAULT_PROPS} />)
  expect(screen.queryByTestId('task-description')).not.toBeInTheDocument()
})

test('renders Focus badge for focus tasks', () => {
  render(<TaskCard task={{ ...BASE_TASK, isFocus: true }} {...DEFAULT_PROPS} />)
  expect(screen.getByText('Focus')).toBeInTheDocument()
})

test('does not render Focus badge for non-focus tasks', () => {
  render(<TaskCard task={BASE_TASK} {...DEFAULT_PROPS} />)
  expect(screen.queryByText('Focus')).not.toBeInTheDocument()
})

test('title has line-through class for done tasks', () => {
  render(<TaskCard task={{ ...BASE_TASK, status: 'done' }} {...DEFAULT_PROPS} />)
  expect(screen.getByText('Test task')).toHaveClass('line-through')
})

test('title does not have line-through for todo tasks', () => {
  render(<TaskCard task={BASE_TASK} {...DEFAULT_PROPS} />)
  expect(screen.getByText('Test task')).not.toHaveClass('line-through')
})

test('clicking card body calls onEdit with the task', () => {
  const onEdit = vi.fn()
  render(<TaskCard task={BASE_TASK} {...DEFAULT_PROPS} onEdit={onEdit} />)
  fireEvent.click(screen.getByTestId('task-card'))
  expect(onEdit).toHaveBeenCalledWith(BASE_TASK)
})

test('clicking trash icon calls onDelete with task id', () => {
  const onDelete = vi.fn()
  render(<TaskCard task={BASE_TASK} {...DEFAULT_PROPS} onDelete={onDelete} />)
  fireEvent.click(screen.getByLabelText('Delete task'))
  expect(onDelete).toHaveBeenCalledWith('test-id-abc')
})

test('clicking trash icon does not call onEdit', () => {
  const onEdit = vi.fn()
  render(<TaskCard task={BASE_TASK} {...DEFAULT_PROPS} onEdit={onEdit} />)
  fireEvent.click(screen.getByLabelText('Delete task'))
  expect(onEdit).not.toHaveBeenCalled()
})

test('renders trash icon', () => {
  render(<TaskCard task={BASE_TASK} {...DEFAULT_PROPS} />)
  expect(screen.getByLabelText('Delete task')).toBeInTheDocument()
})

// ─── Focus toggle area ────────────────────────────────────────────────────

test('renders focus toggle area', () => {
  render(<TaskCard task={BASE_TASK} {...DEFAULT_PROPS} />)
  expect(screen.getByLabelText('Toggle focus')).toBeInTheDocument()
})

test('clicking focus toggle area calls onToggleFocus with task id', () => {
  const onToggleFocus = vi.fn()
  render(<TaskCard task={BASE_TASK} {...DEFAULT_PROPS} onToggleFocus={onToggleFocus} />)
  fireEvent.click(screen.getByLabelText('Toggle focus'))
  expect(onToggleFocus).toHaveBeenCalledWith('test-id-abc')
})

test('clicking Focus badge calls onToggleFocus', () => {
  const onToggleFocus = vi.fn()
  render(<TaskCard task={{ ...BASE_TASK, isFocus: true }} {...DEFAULT_PROPS} onToggleFocus={onToggleFocus} />)
  fireEvent.click(screen.getByText('Focus'))
  expect(onToggleFocus).toHaveBeenCalledWith('test-id-abc')
})

test('clicking focus toggle area does not call onEdit', () => {
  const onEdit = vi.fn()
  render(<TaskCard task={BASE_TASK} {...DEFAULT_PROPS} onEdit={onEdit} />)
  fireEvent.click(screen.getByLabelText('Toggle focus'))
  expect(onEdit).not.toHaveBeenCalled()
})

test('focus toggle area has cursor-default when focusLimitReached and task is not focus', () => {
  render(<TaskCard task={BASE_TASK} {...DEFAULT_PROPS} focusLimitReached={true} />)
  expect(screen.getByLabelText('Toggle focus')).toHaveClass('cursor-default')
})

test('focus toggle area has cursor-pointer for focus task even at limit', () => {
  render(<TaskCard task={{ ...BASE_TASK, isFocus: true }} {...DEFAULT_PROPS} focusLimitReached={true} />)
  expect(screen.getByLabelText('Toggle focus')).toHaveClass('cursor-pointer')
})

test('focus toggle area has cursor-pointer when limit not reached', () => {
  render(<TaskCard task={BASE_TASK} {...DEFAULT_PROPS} focusLimitReached={false} />)
  expect(screen.getByLabelText('Toggle focus')).toHaveClass('cursor-pointer')
})
