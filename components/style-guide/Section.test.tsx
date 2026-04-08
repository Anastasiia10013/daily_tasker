import { render, screen } from '@testing-library/react'
import { Section } from './Section'

test('renders the section title', () => {
  render(<Section id="test" title="Colors"><p>content</p></Section>)
  expect(screen.getByText('Colors')).toBeInTheDocument()
})

test('renders children', () => {
  render(<Section id="test" title="Colors"><p>child content</p></Section>)
  expect(screen.getByText('child content')).toBeInTheDocument()
})
