const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function toLocalDate(date: string | Date): Date {
  if (typeof date === 'string') {
    const [year, month, day] = date.split('-').map(Number)
    return new Date(year, month - 1, day)
  }
  return new Date(date)
}

function toDateString(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function getMonday(date: string | Date): string {
  const d = toLocalDate(date)
  const day = d.getDay() // 0 = Sun, 1 = Mon, ...
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return toDateString(d)
}

export function getWeekDates(monday: string): string[] {
  const [year, month, day] = monday.split('-').map(Number)
  const start = new Date(year, month - 1, day)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return toDateString(d)
  })
}

export function formatWeekLabel(monday: string): string {
  const dates = getWeekDates(monday)
  const [, fm, fd] = dates[0].split('-').map(Number)
  const [ly, lm, ld] = dates[6].split('-').map(Number)
  const firstMonthName = MONTHS[fm - 1]
  const lastMonthName = MONTHS[lm - 1]
  if (fm === lm) {
    return `${firstMonthName} ${fd}–${ld}, ${ly}`
  }
  return `${firstMonthName} ${fd} – ${lastMonthName} ${ld}, ${ly}`
}

export function formatDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return `${WEEKDAYS[d.getDay()]} ${MONTHS[d.getMonth()]} ${day}`
}
