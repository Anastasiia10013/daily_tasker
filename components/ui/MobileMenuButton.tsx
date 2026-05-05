'use client'

import { SlidersHorizontal } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { ExportButton } from '@/components/ui/ExportButton'

export function MobileMenuButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open settings"
        className="p-2 rounded hover:bg-black/5 transition-colors duration-[var(--duration-default)] cursor-pointer"
      >
        <SlidersHorizontal size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background p-3 min-w-[160px] flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">Export</span>
          <ExportButton />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
