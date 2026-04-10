import { describe, it, expect } from 'vitest'
import { sortTasks } from '@/lib/utils/tasks'
import type { Task } from '@/types'

const makeTask = (overrides: Partial<Task>): Task => ({
  id: 'test-id',
  title: 'Test',
  status: 'todo',
  isFocus: false,
  date: '2026-04-06',
  order: 0,
  createdAt: '2026-04-06T00:00:00Z',
  ...overrides,
})

describe('sortTasks', () => {
  it('returns an empty array for empty input', () => {
    expect(sortTasks([])).toEqual([])
  })

  it('sorts non-done tasks by order, regardless of isFocus', () => {
    const tasks = [
      makeTask({ id: 'a', order: 0, isFocus: false }),
      makeTask({ id: 'b', order: 1, isFocus: true }),
    ]
    const sorted = sortTasks(tasks)
    expect(sorted[0].id).toBe('a')
    expect(sorted[1].id).toBe('b')
  })

  it('puts done tasks after active tasks', () => {
    const tasks = [
      makeTask({ id: 'a', order: 0, status: 'done' }),
      makeTask({ id: 'b', order: 1, status: 'todo' }),
    ]
    const sorted = sortTasks(tasks)
    expect(sorted[0].id).toBe('b')
    expect(sorted[1].id).toBe('a')
  })

  it('puts all non-done tasks before done tasks, sorted by order within each zone', () => {
    const tasks = [
      makeTask({ id: 'done', order: 0, status: 'done' }),
      makeTask({ id: 'focus-done', order: 1, status: 'done', isFocus: true }),
      makeTask({ id: 'todo', order: 2, status: 'todo' }),
      makeTask({ id: 'in-progress', order: 3, status: 'in-progress' }),
      makeTask({ id: 'focus', order: 4, isFocus: true }),
    ]
    expect(sortTasks(tasks).map(t => t.id)).toEqual(['todo', 'in-progress', 'focus', 'done', 'focus-done'])
  })

  it('preserves order within each group', () => {
    const tasks = [
      makeTask({ id: 'a', order: 0, status: 'todo' }),
      makeTask({ id: 'b', order: 1, status: 'todo' }),
      makeTask({ id: 'c', order: 2, status: 'todo' }),
    ]
    expect(sortTasks(tasks).map(t => t.id)).toEqual(['a', 'b', 'c'])
  })

  it('does not mutate the input array', () => {
    const tasks = [
      makeTask({ id: 'a', order: 0, status: 'done' }),
      makeTask({ id: 'b', order: 1, status: 'todo' }),
    ]
    const copy = [...tasks]
    sortTasks(tasks)
    expect(tasks[0].id).toBe(copy[0].id)
    expect(tasks[1].id).toBe(copy[1].id)
  })
})
