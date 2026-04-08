import { render, screen } from '@testing-library/react'
import { TaskCardPreview } from './TaskCardPreview'

test('renders all four card variants', () => {
  render(<TaskCardPreview />)
  expect(screen.getByText('Focus task')).toBeInTheDocument()
  expect(screen.getByText('Todo task')).toBeInTheDocument()
  expect(screen.getByText('In progress task')).toBeInTheDocument()
  expect(screen.getByText('Done task')).toBeInTheDocument()
})

test('renders Focus badge on focus card', () => {
  render(<TaskCardPreview />)
  expect(screen.getByText('Focus')).toBeInTheDocument()
})

test('done card title has line-through class', () => {
  render(<TaskCardPreview />)
  const doneTitle = screen.getByText('Done task')
  expect(doneTitle).toHaveClass('line-through')
})
