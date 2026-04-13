import { test, expect } from '@playwright/test'

test.describe('Demo Mode', () => {
  test('enters demo mode, shows banner, board is populated, exit restores real board', async ({ page }) => {
    // Navigate to current week
    const today = new Date()
    const day = today.getDay()
    const diff = day === 0 ? -6 : 1 - day
    today.setDate(today.getDate() + diff)
    const monday = today.toISOString().split('T')[0]

    await page.goto(`/week/${monday}`)

    // Try Demo button visible before entering demo mode
    await expect(page.getByRole('button', { name: 'Try Demo' })).toBeVisible()

    // Enter demo mode
    await page.getByRole('button', { name: 'Try Demo' }).click()

    // Banner appears
    await expect(page.getByText('Demo Mode')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Exit Demo' })).toBeVisible()

    // Try Demo button is hidden in demo mode
    await expect(page.getByRole('button', { name: 'Try Demo' })).not.toBeVisible()

    // Board shows task cards
    const cards = page.getByTestId('task-card')
    await expect(cards.first()).toBeVisible()

    // Add task buttons are hidden
    await expect(page.getByRole('button', { name: 'Add task' })).not.toBeVisible()

    // Exit demo mode
    await page.getByRole('button', { name: 'Exit Demo' }).click()

    // Banner is gone
    await expect(page.getByText('Demo Mode')).not.toBeVisible()

    // Try Demo button is visible again
    await expect(page.getByRole('button', { name: 'Try Demo' })).toBeVisible()
  })
})
