'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useSearchParams, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'
import { saveDailyChallengeScore } from '@/lib/db'
import { getCookie, getUserIdFromToken, isLoggedIn } from '@/utils/auth'
import Image from 'next/image';

// Update the Question type to include two image URLs
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
  image_url_2: string | null; // Add this line for the second image
}

// Update the component props types
type QuestionContentProps = {
  question: Question;
  onAnswerSelect: (questionId: string, answer: string) => void;
  selectedAnswer: string | undefined;
}

function QuestionContent({ question, onAnswerSelect, selectedAnswer }: QuestionContentProps) {
  const options = [question.option_a, question.option_b, question.option_c, question.option_d]
  
  // Format the Google Drive image URLs
  const formatImageUrl = (url: string | null) => 
    url ? `https://drive.google.com/uc?export=view&id=${url.split('/')[5]}` : null;

  const formattedImageUrl1 = formatImageUrl(question.image_url);
  const formattedImageUrl2 = formatImageUrl(question.image_url_2);

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className={`w-full mb-6 ${formattedImageUrl2 ? 'flex flex-col md:flex-row gap-4' : ''}`}>
        {formattedImageUrl1 && (
          <div className={formattedImageUrl2 ? 'w-full md:w-1/2' : 'w-full'}>
            <Image
              src={formattedImageUrl1}
              alt="Question visual 1"
              width={formattedImageUrl2 ? 1000 : 2000}
              height={formattedImageUrl2 ? 750 : 1500}
              layout="responsive"
              objectFit="contain"
              className="rounded-lg shadow-md"
            />
          </div>
        )}
        {formattedImageUrl2 && (
          <div className="w-full md:w-1/2">
            <Image
              src={formattedImageUrl2}
              alt="Question visual 2"
              width={1000}
              height={750}
              layout="responsive"
              objectFit="contain"
              className="rounded-lg shadow-md"
            />
          </div>
        )}
      </div>
      <div className="flex flex-col">
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
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClientComponentClient<Database>()
  const [questions, setQuestions] = useState<Record<string, Question[]>>({})
  const [previousScore, setPreviousScore] = useState<number | null>(null)

  const handleGoHome = () => {
    router.push('/')
  }

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Timer has reached zero, automatically submit
      handleSubmit();
    }
  }, [timeLeft]);

  useEffect(() => {
    fetchQuestions()
  }, [])

  useEffect(() => {
    console.log('Checking if user is logged in...');
    if (!isLoggedIn()) {
      console.log('User is not logged in, redirecting to login page...');
      window.location.href = '/login';
    } else {
      console.log('User is logged in, checking for previous attempt...');
      const token = getCookie('token');
      const id = getUserIdFromToken(token);
      console.log("HERE")
      console.log(id);
      if (id === null) {
        console.error('Error: Unable to retrieve user ID from token');
        router.push('/login');
        return;
      }
      setUserId(id); // Set the userId state
      checkPreviousAttempt(id);
      fetchQuestions();
    }
  }, []);

  const checkPreviousAttempt = async (userId : string) => {
    // const userId = "f4a61524-d89f-4eaa-b8e4-09021888f2a4";
    console.log(`Current user ID: ${userId}`);

    const today = new Date().toISOString().split('T')[0];
    console.log(`Today's date: ${today}`);

    setIsLoading(true);
    const { data, error } = await supabase
      .from(`${activeSection.toLowerCase()}_scores`)
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)  // Add this line to filter by today's date
      .single();

    setIsLoading(false);
    if (error) {
      console.error('Error fetching previous attempt:', error);
      return;
    }

    if (data) {
      console.log('User has already submitted today\'s questions:', data);
      setIsSubmitted(true);
      setPreviousScore(data.score);
    } else {
      console.log('No previous attempt found for today.');
    }
  };

  const fetchQuestions = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('category', initialSection)
    
    if (error) {
      console.error('Error fetching questions:', error)
      setIsLoading(false)
      return
    }

    const allQuestions = data as Question[]
    const categories = ['VARC', 'LRDI', 'QUANT']
    let groupedQuestions: Record<string, Question[]> = {}

    categories.forEach(category => {
      let categoryQuestions = allQuestions.filter(q => q.category === category)

      if (category === 'VARC' || category === 'LRDI') {
        const questionsWithImages = categoryQuestions.filter(q => q.image_url)
        if (questionsWithImages.length > 0) {
          const randomImageUrl = questionsWithImages[Math.floor(Math.random() * questionsWithImages.length)].image_url
          categoryQuestions = categoryQuestions.filter(q => q.image_url === randomImageUrl)
        }
      }

      // Shuffle all category questions
      for (let i = categoryQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [categoryQuestions[i], categoryQuestions[j]] = [categoryQuestions[j], categoryQuestions[i]];
      }

      // Select the first 5 questions (or all if less than 5)
      groupedQuestions[category] = categoryQuestions.slice(0, 5)
    })

    setQuestions(groupedQuestions)
    setIsLoading(false)
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

  if (isSubmitted && previousScore !== null) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">You've already attempted today's questions</h2>
            <p className="text-xl mb-6">Your score: {previousScore} / {questions[activeSection]?.length || 0}</p>
            <Button onClick={handleGoHome}>Go to Home Page</Button>
          </div>
        </div>
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
    const sectionScore = calculateScore(activeSection)
    // const lrdiScore = calculateScore('LRDI')
    // const varcScore = calculateScore('VARC')

    try {
        if (userId === null) {
            console.error('Error: Unable to retrieve user ID from token');
            router.push('/login');
            return;
        }
        const payload = {
            user_id: userId,
            score: sectionScore,
            date: new Date().toISOString().split('T')[0]  // Change this line
        };
        const { data, error } = await supabase
        .from(`${activeSection.toLowerCase()}_scores`)
        .insert([payload]);

        if (error) {
            console.error('Error saving score:', error);
        } else {
            console.log('Score saved successfully:', data);
        }

      setIsSubmitted(true);
    //   await saveDailyChallengeScore(
    //     "abc",
    //     new Date().toISOString().split('T')[0],
    //     quantScore,
    //     lrdiScore,
    //     varcScore,
    //     selectedAnswers,
    //     selectedAnswers,
    //     selectedAnswers
    //   )
      console.log("Scores saved successfully")
    } catch (error) {
      console.error("Error saving score:", error)
    }

    setIsSubmitted(true)
  }

  const handleReviewAnswers = () => {
    setShowReview(true)
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
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
    </Suspense>
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