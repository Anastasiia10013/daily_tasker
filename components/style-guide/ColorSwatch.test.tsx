import { render, screen } from '@testing-library/react'
import { ColorSwatch } from './ColorSwatch'

test('renders token variable name', () => {
  render(<ColorSwatch name="blue" variable="--color-blue" />)
  expect(screen.getByText('--color-blue')).toBeInTheDocument()
})
