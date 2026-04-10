import { renderHook, act } from '@testing-library/react'
import { useTheme } from './useTheme'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

test('defaults to light theme', () => {
  const { result } = renderHook(() => useTheme())
  expect(result.current.theme).toBe('light')
})

test('reads dark theme from classList on init', () => {
  document.documentElement.classList.add('dark')
  const { result } = renderHook(() => useTheme())
  expect(result.current.theme).toBe('dark')
})

test('setTheme persists to localStorage', () => {
  const { result } = renderHook(() => useTheme())
  act(() => { result.current.setTheme('dark') })
  expect(localStorage.getItem('theme')).toBe('dark')
})

test('setTheme adds dark class to html element', () => {
  const { result } = renderHook(() => useTheme())
  act(() => { result.current.setTheme('dark') })
  expect(document.documentElement.classList.contains('dark')).toBe(true)
})

test('setTheme removes dark class when switching to light', () => {
  document.documentElement.classList.add('dark')
  const { result } = renderHook(() => useTheme())
  act(() => { result.current.setTheme('light') })
  expect(document.documentElement.classList.contains('dark')).toBe(false)
  expect(localStorage.getItem('theme')).toBe('light')
})
