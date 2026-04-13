import { render, screen } from '@testing-library/react'
import { DayHeader } from './DayHeader'

test('renders day name and date', () => {
  render(<DayHeader dayName="Monday" date="Apr 7" />)
  expect(screen.getByText('Monday')).toBeInTheDocument()
  expect(screen.getByText('Apr 7')).toBeInTheDocument()
})

test('renders add task button when onAdd is provided', () => {
  render(<DayHeader dayName="Monday" date="Apr 7" onAdd={() => {}} />)
  expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument()
})

test('does not render add task button when onAdd is not provided', () => {
  render(<DayHeader dayName="Monday" date="Apr 7" />)
  expect(screen.queryByRole('button', { name: /add task/i })).not.toBeInTheDocument()
})
