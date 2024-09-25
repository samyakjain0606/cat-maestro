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

        <Element name="cta" className="w-full">
          <CallToAction />
        </Element>

        <div className="text-center py-8">
          <ScrollLink to="daily" smooth={true} duration={500}>
            <Button className="bg-purple-500 text-white font-bold py-2 px-4 rounded-full hover:bg-purple-600 transition-colors">
              Go to Daily Questions
            </Button>
          </ScrollLink>
        </div>
      </main>

      <Footer />

      <ScrollToTopButton />
    </div>
  )
}