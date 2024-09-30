'use client'

import DailyQuestionsPage from '../../components/DailyQuestionsPage'
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export default function DailyQuestionsRoute() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DailyQuestionsPage />
    </Suspense>
  )
}