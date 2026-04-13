import { test, expect } from '@playwright/test'

// Clear localStorage BEFORE the app loads so Zustand hydrates from a clean slate
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.removeItem('daily-tasker-tasks')
  })
  await page.goto('/')
  await page.waitForURL(/\/week\//)
})

// ─── Flow 1: Root redirect ──────────────────────────────────────────────────

test('redirects / to /week/YYYY-MM-DD (current Monday)', async ({ page }) => {
  await page.goto('/')
  await page.waitForURL(/\/week\/\d{4}-\d{2}-\d{2}/)

  const url = new URL(page.url())
  const datePart = url.pathname.split('/week/')[1]
  const date = new Date(datePart)

  // Playwright runs in UTC; getDay() on a YYYY-MM-DD parsed as UTC date gives correct day
  expect(date.getUTCDay()).toBe(1) // 1 = Monday
})

// ─── Flow 2: Create a task ──────────────────────────────────────────────────

test('creates a task and it appears on the board', async ({ page }) => {
  await page.goto('/')
  await page.waitForURL(/\/week\//)

  // Click "Add task" in the first day column (Monday)
  await page.getByRole('button', { name: 'Add task' }).first().click()

  // Dialog opens
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Add task' })).toBeVisible()

  // Fill in the title
  await page.getByLabel('Title').fill('Buy groceries')

  // Save
  await page.getByRole('button', { name: 'Save' }).click()

  // Dialog closes
  await expect(page.getByRole('dialog')).not.toBeVisible()

  // Task card is visible
  await expect(page.getByTestId('task-card')).toContainText('Buy groceries')
})

// ─── Flow 3: Edit a task ────────────────────────────────────────────────────

test('edits an existing task title', async ({ page }) => {
  await page.goto('/')
  await page.waitForURL(/\/week\//)

  // Create a task first
  await page.getByRole('button', { name: 'Add task' }).first().click()
  await page.getByLabel('Title').fill('Original title')
  await page.getByRole('button', { name: 'Save' }).click()

  // Click the card to open edit dialog
  await page.getByTestId('task-card').click()
  await expect(page.getByRole('heading', { name: 'Edit task' })).toBeVisible()

  // Change the title
  const titleInput = page.getByLabel('Title')
  await titleInput.clear()
  await titleInput.fill('Updated title')
  await page.getByRole('button', { name: 'Save' }).click()

  // Updated title is shown on the board
  await expect(page.getByTestId('task-card')).toContainText('Updated title')
  await expect(page.getByTestId('task-card')).not.toContainText('Original title')
})

// ─── Flow 4: Delete a task ──────────────────────────────────────────────────

test('deletes a task from the edit dialog', async ({ page }) => {
  await page.goto('/')
  await page.waitForURL(/\/week\//)

  // Create a task
  await page.getByRole('button', { name: 'Add task' }).first().click()
  await page.getByLabel('Title').fill('Task to delete')
  await page.getByRole('button', { name: 'Save' }).click()

  // Verify it exists
  await expect(page.getByTestId('task-card')).toContainText('Task to delete')

  // Open the task and delete it
  await page.getByTestId('task-card').click()
  await page.getByRole('button', { name: 'Delete' }).click()

  // Task is gone
  await expect(page.getByTestId('task-card')).not.toBeVisible()
})

// ─── Flow 5: Focus task — toggle and 3-task limit ───────────────────────────

test('marks a task as focus and enforces the 3-task limit', async ({ page }) => {
  await page.goto('/')
  await page.waitForURL(/\/week\//)

  // Create 4 tasks on the same day column
  for (let i = 1; i <= 4; i++) {
    await page.getByRole('button', { name: 'Add task' }).first().click()
    await page.getByLabel('Title').fill(`Task ${i}`)
    await page.getByRole('button', { name: 'Save' }).click()
  }

  const cards = page.getByTestId('task-card')
  await expect(cards).toHaveCount(4)

  // Toggle focus on first 3 tasks — all should succeed
  for (let i = 0; i < 3; i++) {
    await cards.nth(i).getByRole('button', { name: 'Toggle focus' }).click()
  }

  // All 3 should show the Focus badge
  await expect(page.getByText('Focus')).toHaveCount(3)

  // Attempting to focus the 4th task should be blocked by the store (max 3 per day)
  // Click the 4th card's toggle and verify the badge count stays at 3
  await cards.nth(3).getByRole('button', { name: 'Toggle focus' }).click()
  await expect(page.getByText('Focus')).toHaveCount(3)
})

// ─── Flow 6: Week navigation ────────────────────────────────────────────────

test('navigates to previous and next week via header arrows', async ({ page }) => {
  await page.goto('/')
  await page.waitForURL(/\/week\/(\d{4}-\d{2}-\d{2})/)

  const initialUrl = page.url()
  const initialDate = initialUrl.match(/\/week\/(\d{4}-\d{2}-\d{2})/)?.[1]!

  // Navigate to next week — wait for URL to actually change
  await page.getByRole('link', { name: 'Next week' }).click()
  await page.waitForURL(url => url.href.includes('/week/') && !url.href.includes(initialDate))

  const nextUrl = page.url()
  const nextDate = nextUrl.match(/\/week\/(\d{4}-\d{2}-\d{2})/)?.[1]!

  // nextDate should be 7 days after initialDate
  const diff =
    (new Date(nextDate).getTime() - new Date(initialDate).getTime()) / (1000 * 60 * 60 * 24)
  expect(diff).toBe(7)

  // Navigate back — wait for URL to change back
  await page.getByRole('link', { name: 'Previous week' }).click()
  await page.waitForURL(url => url.href.includes(initialDate))

  expect(page.url()).toContain(initialDate)
})
