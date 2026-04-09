import { render, screen } from '@testing-library/react'
import { WeekNav } from './WeekNav'

test('renders week label', () => {
  render(<WeekNav label="Apr 6–12, 2026" prevHref="/week/2026-03-30" nextHref="/week/2026-04-13" />)
  expect(screen.getByText('Apr 6–12, 2026')).toBeInTheDocument()
})

test('prev link points to previous week', () => {
  render(<WeekNav label="Apr 6–12, 2026" prevHref="/week/2026-03-30" nextHref="/week/2026-04-13" />)
  const link = screen.getByRole('link', { name: /previous week/i })
  expect(link).toHaveAttribute('href', '/week/2026-03-30')
})

test('next link points to next week', () => {
  render(<WeekNav label="Apr 6–12, 2026" prevHref="/week/2026-03-30" nextHref="/week/2026-04-13" />)
  const link = screen.getByRole('link', { name: /next week/i })
  expect(link).toHaveAttribute('href', '/week/2026-04-13')
})
