import { render, screen } from '@testing-library/react'
import { WeekBoard } from './WeekBoard'
import { useTaskStore } from '@/lib/store/taskStore'

const DATES = [
  '2026-04-06', '2026-04-07', '2026-04-08', '2026-04-09',
  '2026-04-10', '2026-04-11', '2026-04-12',
]
const MONDAY = '2026-04-06'

beforeEach(() => {
  useTaskStore.setState({ tasks: {} })
})

test('renders all 7 day names', () => {
  render(<WeekBoard dates={DATES} monday={MONDAY} />)
  expect(screen.getByText('Monday')).toBeInTheDocument()
  expect(screen.getByText('Tuesday')).toBeInTheDocument()
  expect(screen.getByText('Wednesday')).toBeInTheDocument()
  expect(screen.getByText('Thursday')).toBeInTheDocument()
  expect(screen.getByText('Friday')).toBeInTheDocument()
  expect(screen.getByText('Saturday')).toBeInTheDocument()
  expect(screen.getByText('Sunday')).toBeInTheDocument()
})

test('renders tasks from the store for the current week', () => {
  useTaskStore.getState().addTask({ title: 'Monday task', status: 'todo', isFocus: false, date: '2026-04-06' })
  useTaskStore.getState().addTask({ title: 'Wednesday task', status: 'todo', isFocus: false, date: '2026-04-08' })
  render(<WeekBoard dates={DATES} monday={MONDAY} />)
  expect(screen.getByText('Monday task')).toBeInTheDocument()
  expect(screen.getByText('Wednesday task')).toBeInTheDocument()
})

test('does not render tasks from a different week', () => {
  useTaskStore.getState().addTask({ title: 'Last week task', status: 'todo', isFocus: false, date: '2026-03-30' })
  render(<WeekBoard dates={DATES} monday={MONDAY} />)
  expect(screen.queryByText('Last week task')).not.toBeInTheDocument()
})
