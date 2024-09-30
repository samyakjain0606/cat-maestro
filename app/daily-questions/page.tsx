'use client'

import { useSearchParams } from 'next/navigation'
import DailyQuestionsPage from '../../components/DailyQuestionsPage'

export default function DailyQuestionsRoute() {
  const searchParams = useSearchParams()
  const section = searchParams?.get('section') ?? 'QUANT'

  return <DailyQuestionsPage />
}