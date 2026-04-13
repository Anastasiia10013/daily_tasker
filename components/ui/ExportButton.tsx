'use client'

import { Download } from 'lucide-react'
import { useTaskStore } from '@/lib/store/taskStore'

export function ExportButton() {
  const tasks = useTaskStore(state => state.tasks)

  function handleExport() {
    const data = JSON.stringify(Object.values(tasks), null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const date = new Date().toISOString().slice(0, 10)
    a.href = url
    a.download = `daily-tasker-${date}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      aria-label="Export tasks to JSON"
      title="Export tasks to JSON"
      className="p-2 rounded hover:bg-black/5 transition-colors duration-[var(--duration-default)] cursor-pointer"
    >
      <Download size={20} />
    </button>
  )
}
