import { render, screen } from '@testing-library/react'
import { DayHeader } from './DayHeader'

test('renders day name, date, and add task button', () => {
  render(<DayHeader dayName="Monday" date="Apr 7" />)
  expect(screen.getByText('Monday')).toBeInTheDocument()
  expect(screen.getByText('Apr 7')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument()
})
