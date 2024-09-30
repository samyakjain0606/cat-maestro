'use client'

import React, { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { getUserIdFromToken, getCookie } from '@/utils/auth'
import { motion } from 'framer-motion'
import { Calendar as CalendarIcon } from 'lucide-react'

type Score = {
  date: string
  score: number
}

type DayStatus = {
  date: string
  status: 'gold' | 'silver' | 'bronze' | 'none'
}

const Calendar: React.FC = () => {
  const [dayStatuses, setDayStatuses] = useState<DayStatus[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchScores = async () => {
      const token = getCookie('token')
      const userId = getUserIdFromToken(token)

    //   console.log('User ID:', userId)

      if (!userId) return

      const tables = ['quant_scores', 'lrdi_scores', 'varc_scores']
      const allScores: Record<string, Score[]> = {}

      for (const table of tables) {
        const { data, error } = await supabase
          .from(table)
          .select('date, score')
          .eq('user_id', userId)

        if (error) {
          console.error(`Error fetching ${table}:`, error)
        } else {
          allScores[table] = data as Score[]
        //   console.log(`Fetched scores for ${table}:`, data)
        }
      }

    //   console.log('All scores:', allScores)

      const today = new Date()
      const startDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1))
      const endDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 0))

      const statuses: DayStatus[] = []

      while (startDate <= endDate) {
        const dateString = startDate.toISOString().split('T')[0]
        const completedSections = tables.filter(table => 
          allScores[table]?.some(score => score.date === dateString)
        ).length

        let status: DayStatus['status'] = 'none'
        if (completedSections === 3) status = 'gold'
        else if (completedSections === 2) status = 'silver'
        else if (completedSections === 1) status = 'bronze'

        statuses.push({ date: dateString, status })
        startDate.setUTCDate(startDate.getUTCDate() + 1)
      }

    //   console.log('Processed day statuses:', statuses)

      setDayStatuses(statuses)
    }

    fetchScores()
  }, [])

  const getDayClass = (status: DayStatus['status'], isToday: boolean) => {
    let baseClass = ''
    switch (status) {
      case 'gold': baseClass = 'bg-green-400 text-purple-900'; break
      case 'silver': baseClass = 'bg-yellow-400 text-purple-900'; break
      case 'bronze': baseClass = 'bg-blue-400 text-purple-900'; break
      default: baseClass = 'bg-purple-900 text-purple-100'
    }
    return isToday ? `${baseClass} ring-2 ring-white` : baseClass
  }

  const currentDate = new Date()
  const currentMonth = currentDate.getUTCMonth()
  const currentYear = currentDate.getUTCFullYear()
  const firstDayOfMonth = new Date(Date.UTC(currentYear, currentMonth, 1)).getUTCDay()
  const daysInMonth = new Date(Date.UTC(currentYear, currentMonth + 1, 0)).getUTCDate()
  const today = new Date().toISOString().split('T')[0]

//   console.log('Today:', today) // Log today's date

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="bg-purple-800 bg-opacity-30 border border-purple-600 rounded-lg shadow-xl max-w-md mx-auto backdrop-blur-sm p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold flex items-center justify-between text-purple-100">
          <span className="flex items-center">
            <CalendarIcon className="w-6 h-6 mr-2 text-purple-300" />
            Progress Calendar
          </span>
          <span className="text-lg font-normal">
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
        </h2>
      </div>
      <div className="grid grid-cols-7 gap-1 text-sm mb-4">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="text-center font-semibold p-1 text-purple-300">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="p-1"></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1
          const date = new Date(Date.UTC(currentYear, currentMonth, day))
          const dateString = date.toISOString().split('T')[0]
          const dayStatus = dayStatuses.find(status => status.date === dateString) || { date: dateString, status: 'none' }
          const isToday = dateString === today
        //   console.log(`Day ${day}:`, { date: dateString, isToday, status: dayStatus.status }) // Log each day's info
          return (
            <motion.div
              key={dateString}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.01 }}
              className={`aspect-square flex items-center justify-center rounded-full ${getDayClass(dayStatus.status, isToday)} text-sm font-medium`}
            >
              {day}
            </motion.div>
          )
        })}
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <span className="px-2 py-1 rounded bg-green-400 text-purple-900 text-xs font-semibold">All Done!</span>
        <span className="px-2 py-1 rounded bg-yellow-400 text-purple-900 text-xs font-semibold">2 Challenges Done!</span>
        <span className="px-2 py-1 rounded bg-blue-400 text-purple-900 text-xs font-semibold">1 Challenge done!</span>
      </div>
    </div>
  )
}

export default Calendar