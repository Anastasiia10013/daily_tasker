import { describe, it, expect } from 'vitest'
import { getDemoTasks } from '@/lib/demo/demoData'

describe('getDemoTasks', () => {
  it('returns exactly 7 tasks', () => {
    expect(getDemoTasks('2026-04-14')).toHaveLength(7)
  })

  it('all tasks fall on Mon–Fri of the given week', () => {
    const tasks = getDemoTasks('2026-04-14')
    const valid = new Set(['2026-04-14', '2026-04-15', '2026-04-16', '2026-04-17', '2026-04-18'])
    tasks.forEach(t => expect(valid.has(t.date)).toBe(true))
  })

  it('covers all three statuses', () => {
    const statuses = new Set(getDemoTasks('2026-04-14').map(t => t.status))
    expect(statuses.has('todo')).toBe(true)
    expect(statuses.has('in-progress')).toBe(true)
    expect(statuses.has('done')).toBe(true)
  })

  it('has at least one focus task', () => {
    expect(getDemoTasks('2026-04-14').some(t => t.isFocus)).toBe(true)
  })

  it('uses stable demo- prefixed ids', () => {
    getDemoTasks('2026-04-14').forEach(t => expect(t.id).toMatch(/^demo-/))
  })

  it('generates different dates for a different Monday', () => {
    const a = getDemoTasks('2026-04-14').map(t => t.date)
    const b = getDemoTasks('2026-04-21').map(t => t.date)
    expect(a).not.toEqual(b)
  })
})
