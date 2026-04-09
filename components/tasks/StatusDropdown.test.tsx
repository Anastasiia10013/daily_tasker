import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { StatusDropdown } from './StatusDropdown'

function openDropdown(triggerText: string) {
  const trigger = screen.getByText(triggerText)
  fireEvent.pointerDown(trigger)
  fireEvent.click(trigger)
}

test('renders the current status label for todo', () => {
  render(<StatusDropdown taskId="t1" status="todo" onStatusChange={() => {}} />)
  expect(screen.getByText('Todo')).toBeInTheDocument()
})

test('renders the current status label for in-progress', () => {
  render(<StatusDropdown taskId="t1" status="in-progress" onStatusChange={() => {}} />)
  expect(screen.getByText('In progress')).toBeInTheDocument()
})

test('renders the current status label for done', () => {
  render(<StatusDropdown taskId="t1" status="done" onStatusChange={() => {}} />)
  expect(screen.getByText('Done')).toBeInTheDocument()
})

test('calls onStatusChange with correct args when an item is selected', () => {
  const onStatusChange = vi.fn()
  render(<StatusDropdown taskId="t1" status="todo" onStatusChange={onStatusChange} />)
  openDropdown('Todo')
  fireEvent.click(screen.getByRole('menuitem', { name: /in progress/i }))
  expect(onStatusChange).toHaveBeenCalledWith('t1', 'in-progress')
})

test('calls onStatusChange with done when done item is selected', () => {
  const onStatusChange = vi.fn()
  render(<StatusDropdown taskId="t1" status="todo" onStatusChange={onStatusChange} />)
  openDropdown('Todo')
  fireEvent.click(screen.getByRole('menuitem', { name: /done/i }))
  expect(onStatusChange).toHaveBeenCalledWith('t1', 'done')
})
