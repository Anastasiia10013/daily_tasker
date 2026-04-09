import { render, screen, fireEvent } from '@testing-library/react'
import { DayColumn } from './DayColumn'
import { useTaskStore } from '@/lib/store/taskStore'
import type { Task } from '@/types'

beforeEach(() => {
  useTaskStore.setState({ tasks: {} })
})

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

test('renders tasks sorted: focus → in-progress → todo → done', () => {
  const tasks: Task[] = [
    { ...BASE, id: '1', title: 'Done task', order: 0, status: 'done' },
    { ...BASE, id: '2', title: 'Focus task', order: 1, isFocus: true },
    { ...BASE, id: '3', title: 'Todo task', order: 2, status: 'todo' },
    { ...BASE, id: '4', title: 'In progress task', order: 3, status: 'in-progress' },
  ]
  render(<DayColumn date="2026-04-07" tasks={tasks} />)
  const cards = screen.getAllByTestId('task-card')
  expect(cards[0]).toHaveTextContent('Focus task')
  expect(cards[1]).toHaveTextContent('In progress task')
  expect(cards[2]).toHaveTextContent('Todo task')
  expect(cards[3]).toHaveTextContent('Done task')
})

test('renders nothing when tasks array is empty', () => {
  render(<DayColumn date="2026-04-07" tasks={[]} />)
  expect(screen.queryByTestId('task-card')).not.toBeInTheDocument()
})

test('clicking Add task button opens the task form dialog', () => {
  render(<DayColumn date="2026-04-07" tasks={[]} />)
  fireEvent.click(screen.getByRole('button', { name: /add task/i }))
  expect(screen.getByRole('dialog')).toBeInTheDocument()
})
