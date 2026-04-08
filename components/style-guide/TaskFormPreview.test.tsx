import { render, screen } from '@testing-library/react'
import { TaskFormPreview } from './TaskFormPreview'

test('renders all form fields', () => {
  render(<TaskFormPreview />)
  expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/focus task/i)).toBeInTheDocument()
})

test('renders Save and Cancel buttons', () => {
  render(<TaskFormPreview />)
  expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
})
