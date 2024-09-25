'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Link as ScrollLink } from 'react-scroll'
// import { Auth } from './Auth'

export default function Header() {
  return (
    <header className="w-full px-4 md:px-8 py-6">
      <nav className="flex justify-between items-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold"
        >
          CAT Maestro
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-x-6 flex items-center"
        >
          <ScrollLink to="customized-tests" smooth={true} className="cursor-pointer hover:text-purple-300 transition-colors">
            Customized Tests
          </ScrollLink>
          <ScrollLink to="features" smooth={true} className="cursor-pointer hover:text-purple-300 transition-colors">
            Features
          </ScrollLink>
          <ScrollLink to="daily" smooth={true} className="cursor-pointer hover:text-purple-300 transition-colors">
            Daily Questions
          </ScrollLink>
          <ScrollLink to="cta" smooth={true} className="cursor-pointer hover:text-purple-300 transition-colors">
            Get Started
          </ScrollLink>
        </motion.div>
      </nav>
    </header>
  )
}