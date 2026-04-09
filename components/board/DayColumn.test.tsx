import { render, screen, fireEvent, act } from '@testing-library/react'
import { vi } from 'vitest'
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

// ─── Focus toggle ──────────────────────────────────────────────────────────

test('clicking focus toggle on a non-focus task calls store toggleFocus', () => {
  const task: Task = { ...BASE, id: 'task-1', title: 'My task', order: 0 }
  useTaskStore.setState({ tasks: { 'task-1': task } })
  const spy = vi.spyOn(useTaskStore.getState(), 'toggleFocus')
  render(<DayColumn date="2026-04-07" tasks={[task]} />)
  fireEvent.click(screen.getByLabelText('Toggle focus'))
  expect(spy).toHaveBeenCalledWith('task-1')
})

test('when 3 focus tasks exist, clicking focus toggle on non-focus task shows error under that card', () => {
  const makeFocus = (id: string, order: number): Task => ({
    ...BASE, id, title: `Focus ${id}`, order, isFocus: true,
  })
  const nonFocus: Task = { ...BASE, id: 'nf', title: 'Not focus', order: 3 }
  const tasks = [makeFocus('f1', 0), makeFocus('f2', 1), makeFocus('f3', 2), nonFocus]
  render(<DayColumn date="2026-04-07" tasks={tasks} />)
  // The non-focus card's toggle area is the last one (focus tasks sort first)
  const toggles = screen.getAllByLabelText('Toggle focus')
  fireEvent.click(toggles[toggles.length - 1])
  expect(screen.getByText('Focus limit reached — max 3 per day')).toBeInTheDocument()
})

test('error under card is not shown when focus count is below limit', () => {
  const task: Task = { ...BASE, id: 'task-1', title: 'My task', order: 0 }
  render(<DayColumn date="2026-04-07" tasks={[task]} />)
  expect(screen.queryByText('Focus limit reached — max 3 per day')).not.toBeInTheDocument()
})

test('error under card disappears after 2 seconds', async () => {
  vi.useFakeTimers()
  const makeFocus = (id: string, order: number): Task => ({
    ...BASE, id, title: `Focus ${id}`, order, isFocus: true,
  })
  const nonFocus: Task = { ...BASE, id: 'nf', title: 'Not focus', order: 3 }
  const tasks = [makeFocus('f1', 0), makeFocus('f2', 1), makeFocus('f3', 2), nonFocus]
  render(<DayColumn date="2026-04-07" tasks={tasks} />)
  const toggles = screen.getAllByLabelText('Toggle focus')
  fireEvent.click(toggles[toggles.length - 1])
  expect(screen.getByText('Focus limit reached — max 3 per day')).toBeInTheDocument()
  await act(async () => { vi.advanceTimersByTime(2000) })
  expect(screen.queryByText('Focus limit reached — max 3 per day')).not.toBeInTheDocument()
  vi.useRealTimers()
})
