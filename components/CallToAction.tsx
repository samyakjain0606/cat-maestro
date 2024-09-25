'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function CallToAction() {
  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold mb-6"
      >
        Ready to Excel in Your CAT Preparation?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-xl mb-8 text-gray-300"
      >
        Join thousands of successful aspirants who have transformed their CAT journey with CAT Maestro's customized tests.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
          Start Your Free Trial
        </button>
      </motion.div>
    </section>
  )
}