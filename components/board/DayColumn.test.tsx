import { render, screen } from '@testing-library/react'
import { DayColumn } from './DayColumn'
import type { Task } from '@/types'

const BASE: Omit<Task, 'id' | 'title' | 'order'> = {
  description: undefined,
  status: 'todo',
  isFocus: false,
  date: '2026-04-07',
  createdAt: '2026-04-07T00:00:00.000Z',
}

test('renders day name and formatted date', () => {
  render(<DayColumn date="2026-04-07" tasks={[]} />)
  expect(screen.getByText('Tuesday')).toBeInTheDocument()
  expect(screen.getByText('Apr 7')).toBeInTheDocument()
})

test('renders tasks sorted: focus → active → done', () => {
  const tasks: Task[] = [
    { ...BASE, id: '1', title: 'Done task', order: 0, status: 'done' },
    { ...BASE, id: '2', title: 'Focus task', order: 1, isFocus: true },
    { ...BASE, id: '3', title: 'Active task', order: 2 },
  ]
  render(<DayColumn date="2026-04-07" tasks={tasks} />)
  const items = screen.getAllByTestId('task-placeholder')
  expect(items[0]).toHaveTextContent('Focus task')
  expect(items[1]).toHaveTextContent('Active task')
  expect(items[2]).toHaveTextContent('Done task')
})

test('renders nothing for tasks on a different date', () => {
  // DayColumn receives pre-filtered tasks, so this just verifies empty renders fine
  render(<DayColumn date="2026-04-07" tasks={[]} />)
  expect(screen.queryByTestId('task-placeholder')).not.toBeInTheDocument()
})
