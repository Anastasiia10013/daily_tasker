import { redirect } from 'next/navigation'
import { getMonday } from '@/lib/utils/dates'

export default function Home() {
  redirect(`/week/${getMonday(new Date())}`)
}
