import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'
import { ThemeToggle } from './ThemeToggle'

function renderWithTheme(defaultTheme = 'light') {
  return render(
    <ThemeProvider attribute="class" defaultTheme={defaultTheme} enableSystem={false}>
      <ThemeToggle />
    </ThemeProvider>
  )
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

test('renders with aria-pressed false by default', () => {
  renderWithTheme()
  expect(screen.getByRole('button', { name: /switch to (dark|light) theme/i })).toHaveAttribute('aria-pressed', 'false')
})

test('sets aria-pressed true and saves dark to localStorage on click', () => {
  renderWithTheme()
  const button = screen.getByRole('button', { name: /switch to (dark|light) theme/i })
  fireEvent.click(button)
  expect(button).toHaveAttribute('aria-pressed', 'true')
  expect(localStorage.getItem('theme')).toBe('dark')
})

test('toggles back to light and saves light to localStorage on second click', () => {
  renderWithTheme()
  const button = screen.getByRole('button', { name: /switch to (dark|light) theme/i })
  fireEvent.click(button)
  fireEvent.click(button)
  expect(button).toHaveAttribute('aria-pressed', 'false')
  expect(localStorage.getItem('theme')).toBe('light')
})
