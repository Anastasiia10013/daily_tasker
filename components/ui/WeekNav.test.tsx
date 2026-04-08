import { render, screen } from '@testing-library/react'
import { WeekNav } from './WeekNav'

test('renders week label and navigation buttons', () => {
  render(<WeekNav label="Apr 7–13, 2026" />)
  expect(screen.getByText('Apr 7–13, 2026')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /previous week/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /next week/i })).toBeInTheDocument()
})
