'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Target, Cog, Clock, BarChart2 } from 'lucide-react'

export default function CustomizedTests() {
  return (
    <section className="container mx-auto px-4 py-20 bg-gray-800 bg-opacity-50 rounded-lg">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold mb-12 text-center"
      >
        Customized Tests: Your Path to CAT Success
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl font-semibold mb-4">Tailor Your Preparation</h3>
          <ul className="space-y-4">
            {[
              { icon: <Target className="w-6 h-6 text-purple-400" />, text: "Focus on specific topics or sections" },
              { icon: <Cog className="w-6 h-6 text-pink-400" />, text: "Adjust difficulty levels to match your progress" },
              { icon: <Clock className="w-6 h-6 text-blue-400" />, text: "Set custom time limits for real exam simulation" },
              { icon: <BarChart2 className="w-6 h-6 text-green-400" />, text: "Get detailed performance analytics after each test" },
            ].map((item, index) => (
              <li key={index} className="flex items-center">
                {item.icon}
                <span className="ml-2">{item.text}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gray-700 bg-opacity-50 p-6 rounded-lg shadow-lg"
        >
          <h3 className="text-2xl font-semibold mb-4">Create Your Custom Test</h3>
          <form className="space-y-4">
            <div>
              <label htmlFor="test-type" className="block text-sm font-medium text-gray-300 mb-1">Test Type</label>
              <select id="test-type" className="w-full bg-gray-600 text-white rounded-md px-3 py-2">
                <option>Full Length CAT</option>
                <option>Section Wise</option>
                <option>Topic Wise</option>
              </select>
            </div>
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300 mb-1">Difficulty</label>
              <select id="difficulty" className="w-full bg-gray-600 text-white rounded-md px-3 py-2">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
                <option>Mixed</option>
              </select>
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">Duration (minutes)</label>
              <input type="number" id="duration" className="w-full bg-gray-600 text-white rounded-md px-3 py-2" placeholder="180" />
            </div>
            <button
              disabled
              className="w-full bg-gray-500 text-white font-bold py-2 px-4 rounded-full opacity-50 cursor-not-allowed"
            >
              Coming Soon
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}