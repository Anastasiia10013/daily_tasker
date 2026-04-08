import { render, screen } from '@testing-library/react'
import { ColorSwatch } from './ColorSwatch'

test('renders token variable name and hex value', () => {
  render(<ColorSwatch name="blue" hex="#3051a8" variable="--color-blue" />)
  expect(screen.getByText('--color-blue')).toBeInTheDocument()
  expect(screen.getByText('#3051a8')).toBeInTheDocument()
})
