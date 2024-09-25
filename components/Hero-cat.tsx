'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Link as ScrollLink } from 'react-scroll'

export default function Hero() {
  return (
    <section className="w-full px-4 md:px-8 py-20 text-center">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
        >
          Master the CAT Exam with Personalized Tests
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl mb-8 text-gray-300"
        >
          Create custom tests tailored to your needs, track your progress, and conquer the CAT with confidence.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <ScrollLink to="customized-tests" smooth={true}>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Explore Customized Tests
            </button>
          </ScrollLink>
        </motion.div>
      </div>
    </section>
  )
}