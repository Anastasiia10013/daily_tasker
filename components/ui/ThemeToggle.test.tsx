import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from './ThemeToggle'

test('renders with aria-pressed false by default', () => {
  render(<ThemeToggle />)
  expect(screen.getByRole('button', { name: /toggle theme/i })).toHaveAttribute('aria-pressed', 'false')
})

test('toggles aria-pressed on click', () => {
  render(<ThemeToggle />)
  const button = screen.getByRole('button', { name: /toggle theme/i })
  fireEvent.click(button)
  expect(button).toHaveAttribute('aria-pressed', 'true')
  fireEvent.click(button)
  expect(button).toHaveAttribute('aria-pressed', 'false')
})
