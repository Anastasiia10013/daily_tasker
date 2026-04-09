import { render, screen } from '@testing-library/react'
import { WeekBoard } from './WeekBoard'

const DATES = [
  '2026-04-06', // Monday
  '2026-04-07', // Tuesday
  '2026-04-08', // Wednesday
  '2026-04-09', // Thursday
  '2026-04-10', // Friday
  '2026-04-11', // Saturday
  '2026-04-12', // Sunday
]

test('renders all 7 day names', () => {
  render(<WeekBoard dates={DATES} tasks={[]} />)
  expect(screen.getByText('Monday')).toBeInTheDocument()
  expect(screen.getByText('Tuesday')).toBeInTheDocument()
  expect(screen.getByText('Wednesday')).toBeInTheDocument()
  expect(screen.getByText('Thursday')).toBeInTheDocument()
  expect(screen.getByText('Friday')).toBeInTheDocument()
  expect(screen.getByText('Saturday')).toBeInTheDocument()
  expect(screen.getByText('Sunday')).toBeInTheDocument()
})

test('passes only matching tasks to each column', () => {
  const tasks = [
    { id: '1', title: 'Monday task', status: 'todo' as const, isFocus: false, date: '2026-04-06', order: 0, createdAt: '' },
    { id: '2', title: 'Wednesday task', status: 'todo' as const, isFocus: false, date: '2026-04-08', order: 0, createdAt: '' },
  ]
  render(<WeekBoard dates={DATES} tasks={tasks} />)
  expect(screen.getByText('Monday task')).toBeInTheDocument()
  expect(screen.getByText('Wednesday task')).toBeInTheDocument()
})
