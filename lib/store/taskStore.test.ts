import { describe, it, expect, beforeEach } from 'vitest'
import { useTaskStore } from '@/lib/store/taskStore'

beforeEach(() => {
  useTaskStore.setState({ tasks: {} })
})

// ─── addTask ───────────────────────────────────────────────────────────────

describe('addTask', () => {
  it('creates a task with the given fields', () => {
    useTaskStore.getState().addTask({
      title: 'My Task',
      status: 'todo',
      isFocus: false,
      date: '2026-04-06',
    })
    const tasks = Object.values(useTaskStore.getState().tasks)
    expect(tasks).toHaveLength(1)
    expect(tasks[0].title).toBe('My Task')
    expect(tasks[0].status).toBe('todo')
    expect(tasks[0].isFocus).toBe(false)
    expect(tasks[0].date).toBe('2026-04-06')
  })

  it('auto-assigns a uuid id, createdAt, and order 0 for the first task', () => {
    useTaskStore.getState().addTask({ title: 'T', status: 'todo', isFocus: false, date: '2026-04-06' })
    const task = Object.values(useTaskStore.getState().tasks)[0]
    expect(task.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
    expect(task.createdAt).toBeTruthy()
    expect(task.order).toBe(0)
  })

  it('assigns incrementing order for tasks on the same date', () => {
    useTaskStore.getState().addTask({ title: 'A', status: 'todo', isFocus: false, date: '2026-04-06' })
    useTaskStore.getState().addTask({ title: 'B', status: 'todo', isFocus: false, date: '2026-04-06' })
    const tasks = Object.values(useTaskStore.getState().tasks).sort((a, b) => a.order - b.order)
    expect(tasks[0].order).toBe(0)
    expect(tasks[1].order).toBe(1)
  })

  it('assigns order 0 for the first task on a different date', () => {
    useTaskStore.getState().addTask({ title: 'A', status: 'todo', isFocus: false, date: '2026-04-06' })
    useTaskStore.getState().addTask({ title: 'B', status: 'todo', isFocus: false, date: '2026-04-07' })
    const taskB = Object.values(useTaskStore.getState().tasks).find(t => t.date === '2026-04-07')!
    expect(taskB.order).toBe(0)
  })
})

// ─── updateTask ────────────────────────────────────────────────────────────

describe('updateTask', () => {
  it('merges changes into the task', () => {
    useTaskStore.getState().addTask({ title: 'Old', status: 'todo', isFocus: false, date: '2026-04-06' })
    const id = Object.keys(useTaskStore.getState().tasks)[0]
    useTaskStore.getState().updateTask(id, { title: 'New', status: 'done' })
    const task = useTaskStore.getState().tasks[id]
    expect(task.title).toBe('New')
    expect(task.status).toBe('done')
  })

  it('no-ops when id is not found', () => {
    useTaskStore.getState().addTask({ title: 'T', status: 'todo', isFocus: false, date: '2026-04-06' })
    const before = { ...useTaskStore.getState().tasks }
    useTaskStore.getState().updateTask('nonexistent', { title: 'X' })
    expect(useTaskStore.getState().tasks).toEqual(before)
  })

  it('strips isFocus when a done focus task moves to todo and 3 active focus tasks already exist', () => {
    const store = useTaskStore.getState()
    store.addTask({ title: 'F1', status: 'todo',  isFocus: true,  date: '2026-04-06' })
    store.addTask({ title: 'F2', status: 'todo',  isFocus: true,  date: '2026-04-06' })
    store.addTask({ title: 'F3', status: 'todo',  isFocus: true,  date: '2026-04-06' })
    store.addTask({ title: 'F4', status: 'done',  isFocus: true,  date: '2026-04-06' })
    const f4 = Object.values(useTaskStore.getState().tasks).find(t => t.title === 'F4')!
    useTaskStore.getState().updateTask(f4.id, { status: 'todo' })
    expect(useTaskStore.getState().tasks[f4.id].status).toBe('todo')
    expect(useTaskStore.getState().tasks[f4.id].isFocus).toBe(false)
  })

  it('strips isFocus when a done focus task moves to in-progress and 3 active focus tasks already exist', () => {
    const store = useTaskStore.getState()
    store.addTask({ title: 'F1', status: 'in-progress', isFocus: true, date: '2026-04-06' })
    store.addTask({ title: 'F2', status: 'in-progress', isFocus: true, date: '2026-04-06' })
    store.addTask({ title: 'F3', status: 'todo',        isFocus: true, date: '2026-04-06' })
    store.addTask({ title: 'F4', status: 'done',        isFocus: true, date: '2026-04-06' })
    const f4 = Object.values(useTaskStore.getState().tasks).find(t => t.title === 'F4')!
    useTaskStore.getState().updateTask(f4.id, { status: 'in-progress' })
    expect(useTaskStore.getState().tasks[f4.id].status).toBe('in-progress')
    expect(useTaskStore.getState().tasks[f4.id].isFocus).toBe(false)
  })

  it('preserves isFocus when a done focus task moves to todo and fewer than 3 active focus tasks exist', () => {
    const store = useTaskStore.getState()
    store.addTask({ title: 'F1', status: 'todo', isFocus: true, date: '2026-04-06' })
    store.addTask({ title: 'F2', status: 'todo', isFocus: true, date: '2026-04-06' })
    store.addTask({ title: 'F4', status: 'done', isFocus: true, date: '2026-04-06' })
    const f4 = Object.values(useTaskStore.getState().tasks).find(t => t.title === 'F4')!
    useTaskStore.getState().updateTask(f4.id, { status: 'todo' })
    expect(useTaskStore.getState().tasks[f4.id].status).toBe('todo')
    expect(useTaskStore.getState().tasks[f4.id].isFocus).toBe(true)
  })
})

// ─── deleteTask ────────────────────────────────────────────────────────────

describe('deleteTask', () => {
  it('removes the task by id', () => {
    useTaskStore.getState().addTask({ title: 'T', status: 'todo', isFocus: false, date: '2026-04-06' })
    const id = Object.keys(useTaskStore.getState().tasks)[0]
    useTaskStore.getState().deleteTask(id)
    expect(useTaskStore.getState().tasks[id]).toBeUndefined()
  })

  it('no-ops when id is not found', () => {
    useTaskStore.getState().addTask({ title: 'T', status: 'todo', isFocus: false, date: '2026-04-06' })
    const before = { ...useTaskStore.getState().tasks }
    useTaskStore.getState().deleteTask('nonexistent')
    expect(useTaskStore.getState().tasks).toEqual(before)
  })
})

// ─── toggleFocus ───────────────────────────────────────────────────────────

describe('toggleFocus', () => {
  it('sets isFocus to true when toggling on', () => {
    useTaskStore.getState().addTask({ title: 'T', status: 'todo', isFocus: false, date: '2026-04-06' })
    const id = Object.keys(useTaskStore.getState().tasks)[0]
    useTaskStore.getState().toggleFocus(id)
    expect(useTaskStore.getState().tasks[id].isFocus).toBe(true)
  })

  it('sets isFocus to false when toggling off', () => {
    useTaskStore.getState().addTask({ title: 'T', status: 'todo', isFocus: true, date: '2026-04-06' })
    const id = Object.keys(useTaskStore.getState().tasks)[0]
    useTaskStore.getState().toggleFocus(id)
    expect(useTaskStore.getState().tasks[id].isFocus).toBe(false)
  })

  it('blocks toggling on when 3 focus tasks already exist for that date', () => {
    const store = useTaskStore.getState()
    store.addTask({ title: 'F1', status: 'todo', isFocus: true, date: '2026-04-06' })
    store.addTask({ title: 'F2', status: 'todo', isFocus: true, date: '2026-04-06' })
    store.addTask({ title: 'F3', status: 'todo', isFocus: true, date: '2026-04-06' })
    store.addTask({ title: 'F4', status: 'todo', isFocus: false, date: '2026-04-06' })
    const f4 = Object.values(useTaskStore.getState().tasks).find(t => t.title === 'F4')!
    useTaskStore.getState().toggleFocus(f4.id)
    expect(useTaskStore.getState().tasks[f4.id].isFocus).toBe(false)
  })

  it('allows toggling off when already at the 3-task limit', () => {
    const store = useTaskStore.getState()
    store.addTask({ title: 'F1', status: 'todo', isFocus: true, date: '2026-04-06' })
    store.addTask({ title: 'F2', status: 'todo', isFocus: true, date: '2026-04-06' })
    store.addTask({ title: 'F3', status: 'todo', isFocus: true, date: '2026-04-06' })
    const f1 = Object.values(useTaskStore.getState().tasks).find(t => t.title === 'F1')!
    useTaskStore.getState().toggleFocus(f1.id)
    expect(useTaskStore.getState().tasks[f1.id].isFocus).toBe(false)
  })

  it('does not block focus tasks on other dates', () => {
    const store = useTaskStore.getState()
    store.addTask({ title: 'F1', status: 'todo', isFocus: true, date: '2026-04-06' })
    store.addTask({ title: 'F2', status: 'todo', isFocus: true, date: '2026-04-06' })
    store.addTask({ title: 'F3', status: 'todo', isFocus: true, date: '2026-04-06' })
    store.addTask({ title: 'Other', status: 'todo', isFocus: false, date: '2026-04-07' })
    const other = Object.values(useTaskStore.getState().tasks).find(t => t.title === 'Other')!
    useTaskStore.getState().toggleFocus(other.id)
    expect(useTaskStore.getState().tasks[other.id].isFocus).toBe(true)
  })
})

// ─── reorderTask ───────────────────────────────────────────────────────────

describe('reorderTask', () => {
  it('moves a task from one position to another', () => {
    const store = useTaskStore.getState()
    store.addTask({ title: 'A', status: 'todo', isFocus: false, date: '2026-04-06' })
    store.addTask({ title: 'B', status: 'todo', isFocus: false, date: '2026-04-06' })
    store.addTask({ title: 'C', status: 'todo', isFocus: false, date: '2026-04-06' })
    const [a, b, c] = Object.values(useTaskStore.getState().tasks).sort((x, y) => x.order - y.order)
    useTaskStore.getState().reorderTask('2026-04-06', c.id, a.id) // move C before A
    const reordered = Object.values(useTaskStore.getState().tasks).sort((x, y) => x.order - y.order)
    expect(reordered.map(t => t.title)).toEqual(['C', 'A', 'B'])
  })

  it('writes sequential order values starting from 0', () => {
    const store = useTaskStore.getState()
    store.addTask({ title: 'A', status: 'todo', isFocus: false, date: '2026-04-06' })
    store.addTask({ title: 'B', status: 'todo', isFocus: false, date: '2026-04-06' })
    const [first, second] = Object.values(useTaskStore.getState().tasks).sort((a, b) => a.order - b.order)
    useTaskStore.getState().reorderTask('2026-04-06', second.id, first.id)
    const reordered = Object.values(useTaskStore.getState().tasks).sort((a, b) => a.order - b.order)
    expect(reordered[0].order).toBe(0)
    expect(reordered[1].order).toBe(1)
  })

  it('no-ops if activeId or overId is not found', () => {
    useTaskStore.getState().addTask({ title: 'A', status: 'todo', isFocus: false, date: '2026-04-06' })
    const before = { ...useTaskStore.getState().tasks }
    useTaskStore.getState().reorderTask('2026-04-06', 'bad-id', 'also-bad')
    expect(useTaskStore.getState().tasks).toEqual(before)
  })

  it('only reorders tasks within the same zone — done task orders are not affected', () => {
    const store = useTaskStore.getState()
    store.addTask({ title: 'A', status: 'todo', isFocus: false, date: '2026-04-06' })
    store.addTask({ title: 'B', status: 'todo', isFocus: false, date: '2026-04-06' })
    store.addTask({ title: 'Done', status: 'done', isFocus: false, date: '2026-04-06' })
    const all = Object.values(useTaskStore.getState().tasks)
    const a = all.find(t => t.title === 'A')!
    const b = all.find(t => t.title === 'B')!
    const done = all.find(t => t.title === 'Done')!
    const doneOrderBefore = done.order
    useTaskStore.getState().reorderTask('2026-04-06', b.id, a.id)
    expect(useTaskStore.getState().tasks[done.id].order).toBe(doneOrderBefore)
  })
})

// ─── moveTask ──────────────────────────────────────────────────────────────

describe('moveTask', () => {
  it('updates the task date', () => {
    useTaskStore.getState().addTask({ title: 'T', status: 'todo', isFocus: false, date: '2026-04-06' })
    const id = Object.keys(useTaskStore.getState().tasks)[0]
    useTaskStore.getState().moveTask(id, '2026-04-07')
    expect(useTaskStore.getState().tasks[id].date).toBe('2026-04-07')
  })

  it('appends to end of new date (max order + 1)', () => {
    const store = useTaskStore.getState()
    store.addTask({ title: 'Existing', status: 'todo', isFocus: false, date: '2026-04-07' })
    store.addTask({ title: 'Moving', status: 'todo', isFocus: false, date: '2026-04-06' })
    const existing = Object.values(useTaskStore.getState().tasks).find(t => t.title === 'Existing')!
    const moving = Object.values(useTaskStore.getState().tasks).find(t => t.title === 'Moving')!
    useTaskStore.getState().moveTask(moving.id, '2026-04-07')
    expect(useTaskStore.getState().tasks[moving.id].order).toBe(existing.order + 1)
  })

  it('no-ops if id is not found', () => {
    const before = { ...useTaskStore.getState().tasks }
    useTaskStore.getState().moveTask('nonexistent', '2026-04-07')
    expect(useTaskStore.getState().tasks).toEqual(before)
  })

  it('strips isFocus when the destination day already has 3 focus tasks', () => {
    const store = useTaskStore.getState()
    store.addTask({ title: 'F1', status: 'todo', isFocus: true, date: '2026-04-07' })
    store.addTask({ title: 'F2', status: 'todo', isFocus: true, date: '2026-04-07' })
    store.addTask({ title: 'F3', status: 'todo', isFocus: true, date: '2026-04-07' })
    store.addTask({ title: 'Moving', status: 'todo', isFocus: true, date: '2026-04-06' })
    const moving = Object.values(useTaskStore.getState().tasks).find(t => t.title === 'Moving')!
    useTaskStore.getState().moveTask(moving.id, '2026-04-07')
    expect(useTaskStore.getState().tasks[moving.id].isFocus).toBe(false)
  })

  it('preserves isFocus when the destination day has fewer than 3 focus tasks', () => {
    const store = useTaskStore.getState()
    store.addTask({ title: 'F1', status: 'todo', isFocus: true, date: '2026-04-07' })
    store.addTask({ title: 'F2', status: 'todo', isFocus: true, date: '2026-04-07' })
    store.addTask({ title: 'Moving', status: 'todo', isFocus: true, date: '2026-04-06' })
    const moving = Object.values(useTaskStore.getState().tasks).find(t => t.title === 'Moving')!
    useTaskStore.getState().moveTask(moving.id, '2026-04-07')
    expect(useTaskStore.getState().tasks[moving.id].isFocus).toBe(true)
  })
})

// ─── getTasksForWeek ───────────────────────────────────────────────────────

describe('getTasksForWeek', () => {
  it('returns tasks that fall within the week', () => {
    const store = useTaskStore.getState()
    store.addTask({ title: 'In week', status: 'todo', isFocus: false, date: '2026-04-08' })
    store.addTask({ title: 'Outside week', status: 'todo', isFocus: false, date: '2026-04-13' })
    const result = useTaskStore.getState().getTasksForWeek('2026-04-06')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('In week')
  })

  it('includes tasks on Monday and Sunday (boundaries)', () => {
    const store = useTaskStore.getState()
    store.addTask({ title: 'Mon', status: 'todo', isFocus: false, date: '2026-04-06' })
    store.addTask({ title: 'Sun', status: 'todo', isFocus: false, date: '2026-04-12' })
    const result = useTaskStore.getState().getTasksForWeek('2026-04-06')
    expect(result).toHaveLength(2)
  })

  it('returns empty array when no tasks exist for the week', () => {
    const result = useTaskStore.getState().getTasksForWeek('2026-04-06')
    expect(result).toHaveLength(0)
  })
})
