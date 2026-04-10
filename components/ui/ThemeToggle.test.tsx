import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from './ThemeToggle'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

test('renders with aria-pressed false by default', () => {
  render(<ThemeToggle />)
  expect(screen.getByRole('button', { name: /toggle theme/i })).toHaveAttribute('aria-pressed', 'false')
})

test('sets aria-pressed true and saves dark to localStorage on click', () => {
  render(<ThemeToggle />)
  const button = screen.getByRole('button', { name: /toggle theme/i })
  fireEvent.click(button)
  expect(button).toHaveAttribute('aria-pressed', 'true')
  expect(localStorage.getItem('theme')).toBe('dark')
})

test('toggles back to light and saves light to localStorage on second click', () => {
  render(<ThemeToggle />)
  const button = screen.getByRole('button', { name: /toggle theme/i })
  fireEvent.click(button)
  fireEvent.click(button)
  expect(button).toHaveAttribute('aria-pressed', 'false')
  expect(localStorage.getItem('theme')).toBe('light')
})
