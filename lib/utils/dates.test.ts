import { describe, it, expect } from 'vitest'
import { getMonday, getWeekDates, formatDate } from '@/lib/utils/dates'

describe('getMonday', () => {
  it('returns Monday when given a Wednesday', () => {
    expect(getMonday('2026-04-08')).toBe('2026-04-06')
  })

  it('returns the same date when given a Monday', () => {
    expect(getMonday('2026-04-06')).toBe('2026-04-06')
  })

  it('returns Monday when given a Sunday', () => {
    expect(getMonday('2026-04-12')).toBe('2026-04-06')
  })

  it('accepts a Date object', () => {
    expect(getMonday(new Date(2026, 3, 8))).toBe('2026-04-06') // April 8 = Wednesday
  })
})

describe('getWeekDates', () => {
  it('returns exactly 7 dates', () => {
    expect(getWeekDates('2026-04-06')).toHaveLength(7)
  })

  it('starts on the given Monday', () => {
    expect(getWeekDates('2026-04-06')[0]).toBe('2026-04-06')
  })

  it('ends on Sunday', () => {
    expect(getWeekDates('2026-04-06')[6]).toBe('2026-04-12')
  })

  it('returns all 7 sequential dates Mon–Sun', () => {
    expect(getWeekDates('2026-04-06')).toEqual([
      '2026-04-06', '2026-04-07', '2026-04-08', '2026-04-09',
      '2026-04-10', '2026-04-11', '2026-04-12',
    ])
  })
})

describe('formatDate', () => {
  it('formats a date as "Mon Apr 6"', () => {
    expect(formatDate('2026-04-06')).toBe('Mon Apr 6')
  })

  it('formats a date at month end correctly', () => {
    expect(formatDate('2026-04-12')).toBe('Sun Apr 12')
  })
})
