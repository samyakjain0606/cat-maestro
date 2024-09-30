'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Calculator, Brain, Book, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isLoggedIn } from '@/utils/auth';

export default function DailyQuestions() {
  // const router = useRouter();
  // useEffect(() => {
  //   // Check if the user is logged in when the component mounts
  //   if (!isLoggedIn()) {
  //     // You must wait for the router to be ready before navigating
  //     if (router.isReady) {
  //       router.push('/login');
  //     }
  //   }
  // }, [router]);
  return (
    <section className="w-full px-4 md:px-8 py-20 bg-gray-800 bg-opacity-50 rounded-lg">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold mb-12 text-center"
      >
        Daily Questions to Sharpen Your Skills
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { subject: 'QUANT', icon: <Calculator className="w-8 h-8 mb-2 text-yellow-400" /> },
          { subject: 'LRDI', icon: <Brain className="w-8 h-8 mb-2 text-green-400" /> },
          { subject: 'VARC', icon: <Book className="w-8 h-8 mb-2 text-blue-400" /> },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 * index }}
            className="bg-gray-700 bg-opacity-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {item.icon}
            <h3 className="text-xl font-semibold mb-2">{item.subject}</h3>
            <p className="text-gray-300 mb-4">Daily question to challenge your {item.subject} skills.</p>
            <Link href={`/daily-questions?section=${item.subject}`}>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center">
                Solve Today's Question <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}