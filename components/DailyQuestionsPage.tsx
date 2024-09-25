'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useSearchParams, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'
import { saveDailyChallengeScore } from '@/lib/db'

// Update the Question type to match the new table structure
type Question = {
  id: string;
  category: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  image_url: string | null;
}

// Update the component props types
type QuestionContentProps = {
  question: Question;
  onAnswerSelect: (questionId: string, answer: string) => void;
  selectedAnswer: string | undefined;
}

function QuestionContent({ question, onAnswerSelect, selectedAnswer }: QuestionContentProps) {
  const options = [question.option_a, question.option_b, question.option_c, question.option_d]
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:space-x-6">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4">{question.question}</h2>
          <RadioGroup
            value={selectedAnswer}
            onValueChange={(value) => onAnswerSelect(question.id, value)}
            className="space-y-2"
          >
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        {question.image_url && (
          <div className="mt-4 md:mt-0 md:w-1/3">
            <img src={question.image_url} alt="Question visual" className="w-full h-auto rounded-lg shadow-md" />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function DailyQuestionsPage() {
  const searchParams = useSearchParams()
  const initialSection = searchParams?.get('section')?.toUpperCase() || 'LRDI'
  
  const [activeSection, setActiveSection] = useState(initialSection)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(10 * 60) // 10 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // Add this new state
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [questions, setQuestions] = useState<Record<string, Question[]>>({})

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    setIsLoading(true) // Set loading to true when starting to fetch
    const { data, error } = await supabase
      .from('questions')
      .select('*')
    
    if (error) {
      console.error('Error fetching questions:', error)
      setIsLoading(false) // Set loading to false even if there's an error
      return
    }

    const groupedQuestions = (data as Question[]).reduce((acc, question) => {
      if (!acc[question.category]) {
        acc[question.category] = []
      }
      acc[question.category].push(question)
      return acc
    }, {} as Record<string, Question[]>)

    setQuestions(groupedQuestions)
    setIsLoading(false) // Set loading to false after questions are fetched and processed
  }

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions[activeSection].length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  // Replace the existing check for currentQuestion with this:
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-lg font-semibold">Loading questions...</p>
      </div>
    )
  }

  if (!questions[activeSection] || questions[activeSection].length === 0) {
    return <div className="text-center text-lg font-semibold">No questions available for this section.</div>
  }

  const currentQuestion = questions[activeSection][currentQuestionIndex];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  const calculateScore = (section: string) => {
    return questions[section]?.reduce((score, question) => {
      if (selectedAnswers[question.id] === question.correct_answer) {
        return score + 1
      }
      return score
    }, 0) || 0
  }

  const calculateResults = (section: string) => {
    const sectionQuestions = questions[section] || []
    let correct = 0
    let unattempted = 0
    let wrong = 0

    sectionQuestions.forEach(question => {
      if (!selectedAnswers[question.id]) {
        unattempted++
      } else if (selectedAnswers[question.id] === question.correct_answer) {
        correct++
      } else {
        wrong++
      }
    })

    return { correct, unattempted, wrong }
  }

  const handleSubmit = async () => {
    const quantScore = calculateScore('QUANT')
    const lrdiScore = calculateScore('LRDI')
    const varcScore = calculateScore('VARC')

    try {
      await saveDailyChallengeScore(
        "abc",
        new Date().toISOString().split('T')[0],
        quantScore,
        lrdiScore,
        varcScore,
        selectedAnswers,
        selectedAnswers,
        selectedAnswers
      )
      console.log("Scores saved successfully")
    } catch (error) {
      console.error("Error saving score:", error)
      // Instead of showing an alert, we'll log the error and continue
    }

    // Move this outside of the try-catch block to ensure it always executes
    setIsSubmitted(true)
  }

  const handleReviewAnswers = () => {
    setShowReview(true)
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
          <h1 className="text-2xl font-bold">{activeSection} Questions</h1>
          <div className="text-lg font-semibold text-gray-700">
            Time Left: {formatTime(timeLeft)}
          </div>
        </div>

        <div className="p-6">
          {!isSubmitted ? (
            <>
              <QuestionContent
                question={currentQuestion}
                onAnswerSelect={handleAnswerSelect}
                selectedAnswer={selectedAnswers[currentQuestion.id]}
              />
              <div className="mt-4">
                <Button onClick={handleSubmit}>Submit All Answers</Button>
              </div>
            </>
          ) : showReview ? (
            <ReviewAnswers
              questions={questions[activeSection]}
              selectedAnswers={selectedAnswers}
              onGoHome={handleGoHome}
            />
          ) : (
            <ResultsSummary 
              results={calculateResults(activeSection)} 
              onGoHome={handleGoHome}
            />
          )}
        </div>

        <div className="flex justify-between p-4 bg-gray-50 border-t">
          {!isSubmitted ? (
            <>
              <Button 
                onClick={handlePreviousQuestion} 
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              {currentQuestionIndex === questions[activeSection].length - 1 ? (
                <Button onClick={handleSubmit}>
                  Submit Answers
                </Button>
              ) : (
                <Button 
                  onClick={handleNextQuestion} 
                  disabled={currentQuestionIndex === questions[activeSection].length - 1}
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </>
          ) : (
            <Button onClick={handleReviewAnswers} disabled={showReview}>
              Review Answers
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

type ResultsSummaryProps = {
  results: { correct: number; unattempted: number; wrong: number };
  onGoHome: () => void;
}

function ResultsSummary({ results, onGoHome }: ResultsSummaryProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Results Summary</h2>
      <ul className="list-disc list-inside">
        <li>Correct: {results.correct}</li>
        <li>Unattempted: {results.unattempted}</li>
        <li>Wrong: {results.wrong}</li>
      </ul>
      <Button onClick={onGoHome}>Go to Home Page</Button>
    </div>
  )
}

type ReviewAnswersProps = {
  questions: Question[];
  selectedAnswers: Record<string, string>;
  onGoHome: () => void;
}

function ReviewAnswers({ questions, selectedAnswers, onGoHome }: ReviewAnswersProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Answer Review</h2>
      {questions.map((question, index) => (
        <div key={question.id} className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-2">Question {index + 1}: {question.question}</h3>
          <ul className="list-disc list-inside">
            {[question.option_a, question.option_b, question.option_c, question.option_d].map((option, optionIndex) => (
              <li key={optionIndex} className={`
                ${option === question.correct_answer ? 'text-green-600 font-bold' : ''}
                ${selectedAnswers[question.id] === option && option !== question.correct_answer ? 'text-red-600 line-through' : ''}
              `}>
                {option}
                {option === question.correct_answer && ' (Correct)'}
                {selectedAnswers[question.id] === option && option !== question.correct_answer && ' (Your answer)'}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <Button onClick={onGoHome}>Go to Home Page</Button>
    </div>
  )
}