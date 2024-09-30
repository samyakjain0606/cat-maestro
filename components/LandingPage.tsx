'use client'

import React from 'react'
import { Element, Link as ScrollLink } from 'react-scroll'
import Header from './Header'
import Hero from './Hero-cat'
import CustomizedTests from './CustomizedTests'
import Features from './Features'
import DailyQuestions from './DailyQuestions'
import CallToAction from './CallToAction'
import Footer from './Footer'
import ScrollToTopButton from './ScrollToTopButton'
import { Button } from "@/components/ui/button"
import Calendar from './Calendar'

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
      <Header />

      <main className="w-full">
        <Hero />

        <Element name="customized-tests" className="w-full">
          <CustomizedTests />
        </Element>

        <Element name="features" className="w-full">
          <Features />
        </Element>

        <Element name="daily" className="w-full">
          <DailyQuestions />
        </Element>

        <Element name="calendar" className="w-full">
          <div className="container mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Your Progress Calendar</h2>
            <div className="max-w-md mx-auto"> {/* Added this wrapper */}
              <Calendar />
            </div>
          </div>
        </Element>

        {/* <Element name="cta" className="w-full">
          <CallToAction />
        </Element> */}
      </main>

      <Footer />

      <ScrollToTopButton />
    </div>
  )
}