import { render, screen } from '@testing-library/react'
import { ThemeToggle } from './ThemeToggle'

test('renders with aria-pressed false when inactive', () => {
  render(<ThemeToggle active={false} />)
  expect(screen.getByRole('button', { name: /toggle theme/i })).toHaveAttribute('aria-pressed', 'false')
})

test('renders with aria-pressed true when active', () => {
  render(<ThemeToggle active={true} />)
  expect(screen.getByRole('button', { name: /toggle theme/i })).toHaveAttribute('aria-pressed', 'true')
})
