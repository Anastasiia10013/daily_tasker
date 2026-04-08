import { render, screen } from '@testing-library/react'
import { PrimitivesPreview } from './PrimitivesPreview'

test('renders all four button variants', () => {
  render(<PrimitivesPreview />)
  expect(screen.getByRole('button', { name: 'Default' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Destructive' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Outline' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Ghost' })).toBeInTheDocument()
})

test('renders input and textarea', () => {
  render(<PrimitivesPreview />)
  expect(screen.getByPlaceholderText('Input placeholder')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Textarea placeholder')).toBeInTheDocument()
})
