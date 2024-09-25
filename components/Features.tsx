'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Rocket, Lightbulb } from 'lucide-react'

export default function Features() {
  return (
    <section className="container mx-auto px-4 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold mb-12 text-center"
      >
        More Features to Boost Your Preparation
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: <Brain className="w-12 h-12 mb-4 text-pink-400" />,
            title: 'Adaptive Learning',
            description: 'Our AI-powered system adapts to your performance, focusing on areas that need improvement.',
          },
          {
            icon: <Rocket className="w-12 h-12 mb-4 text-blue-400" />,
            title: 'Performance Analytics',
            description: 'Get detailed insights into your progress with comprehensive performance reports and analytics.',
          },
          {
            icon: <Lightbulb className="w-12 h-12 mb-4 text-yellow-400" />,
            title: 'Expert Tips',
            description: 'Access valuable tips and strategies from CAT toppers and expert mentors.',
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 * index }}
            className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {feature.icon}
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-300">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}