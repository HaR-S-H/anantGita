
// import type React from "react"
import { useState, useEffect } from "react"
import { getQuizez, submitQuiz, getQuizHistory } from "@/services/api/quiz"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Eye,
  Trophy,
  BookOpen,
  ArrowLeft,
  Timer,
  AlertCircle,
  Sparkles,
} from "lucide-react"
import { useProgress } from "@/context/ProgressContext"
import { useStudy } from "@/context/StudyContext"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import colors from "@/constants/colors"
import LoadingIndicator from "@/components/LoadingIndicator"
const QuizPage = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quizzes, setQuizzes] = useState([])
  const [chapters, setChapters] = useState([])
  const [quizHistory, setQuizHistory] = useState([])
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizReview, setQuizReview] = useState(false)
  const [quizResult, setQuizResult] = useState(null)
  const [timeLeft, setTimeLeft] = useState(null)
  const [timerActive, setTimerActive] = useState(false)
  const progress = useProgress()
  const study = useStudy()

  // Fetch quizzes and quiz history when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const allChapterIds = progress.chapters

        // Fetch quizzes data
        const quizResponse = await getQuizez(allChapterIds)

        setQuizzes(quizResponse?.quizzes)
        setChapters(quizResponse?.chapters)

        // Fetch quiz history data
        const historyResponse = await getQuizHistory()

        setQuizHistory(historyResponse?.quizHistory?.quizHistory || [])

        setLoading(false)
      } catch (err) {
        setError("Failed to load quiz data. Please try again later.")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Check if a quiz has been completed before
  const isQuizCompleted = (quizId) => {
    return quizHistory.some((historyItem) => historyItem.quizId == quizId)
  }

  // Get user's answers for a completed quiz
  const getCompletedQuizAnswers = (quizId) => {
    const completedQuiz = quizHistory.find((historyItem) => historyItem.quizId == quizId)
    return completedQuiz ? completedQuiz.answers : []
  }

  // Get user's score for a completed quiz
  const getCompletedQuizScore = (quizId) => {
    const completedQuiz = quizHistory.find((historyItem) => historyItem.quizId == quizId)
    return completedQuiz ? completedQuiz.score : 0
  }

  const allQuestionsAnswered = userAnswers.every((answer) => answer !== "")

  // Set up timer when a quiz is selected
  useEffect(() => {
    let timer
    if (timerActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleSubmitQuiz()
    }

    return () => clearTimeout(timer)
  }, [timerActive, timeLeft])

  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz)
    setCurrentQuestion(0)

    const completed = isQuizCompleted(quiz._id)

    if (completed) {
      // If quiz is already completed, load previous answers for review
      const previousAnswers = getCompletedQuizAnswers(quiz._id)
      setUserAnswers(previousAnswers)
      setQuizReview(true)

      // Create result object for review
      const reviewResult = {
        score: getCompletedQuizScore(quiz._id),
        comprehensionScore: progress.comprehensionScore || 0,
        feedback: quiz.questions.map((question, index) => ({
          questionText: question.questionText,
          userAnswer: previousAnswers[index] || "No answer",
          correctAnswer: question.correctAnswer,
          isCorrect: previousAnswers[index] === question.correctAnswer,
          explanation: question.explanation,
        })),
      }

      setQuizResult(reviewResult)
    } else {
      // If quiz is new, set up for taking the quiz
      setUserAnswers(Array(quiz.questions.length).fill(""))
      setQuizReview(false)
      setQuizSubmitted(false)
      setQuizResult(null)

      // Set timer for 20 minutes per quiz
      setTimeLeft(20 * 60)
      setTimerActive(true)
    }
  }

  const handleBackToList = () => {
    setSelectedQuiz(null)
    setTimerActive(false)
    setQuizReview(false)
    setQuizSubmitted(false)
  }

  const handleAnswerSelect = (answer) => {
    if (quizReview) return // Prevent changing answers in review mode

    const newAnswers = [...userAnswers]
    newAnswers[currentQuestion] = answer
    setUserAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < selectedQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitQuiz = async () => {
    try {
      setTimerActive(false)

      const result = await submitQuiz(userAnswers, selectedQuiz._id)
      setQuizResult(result)
      setQuizSubmitted(true)

      // Update local quiz history after successful submission
      setQuizHistory([
        ...quizHistory,
        {
          _id: selectedQuiz._id,
          answers: userAnswers,
          score: result.score,
        },
      ])
    } catch (err) {
      setError("Failed to submit quiz. Please try again.")
    }
  }

  // Format time from seconds to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Get chapter name by chapter number
  const getChapterName = (chapterNumber) => {
    const chapter = chapters.find((ch) => ch.number === chapterNumber)
    return chapter ? `Chapter ${chapter.name.english}` : `Chapter ${chapterNumber}`
  }

  // Calculate percentage score
  const calculatePercentage = (score, total) => {
    return Math.round((score / total) * 100)
  }

  // Get appropriate feedback based on score percentage
  const getScoreFeedback = (percentage) => {
    if (percentage >= 90) return "Excellent! You've mastered this chapter."
    if (percentage >= 75) return "Great job! You have a strong understanding."
    if (percentage >= 60) return "Good work! Keep studying to improve further."
    if (percentage >= 40) return "You're making progress. Review the chapter again."
    return "Keep studying. You'll improve with practice."
  }

  if (loading) {
    <LoadingIndicator/>
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: colors.offWhite }}>
        <Alert className="max-w-md border-0 shadow-lg" style={{ backgroundColor: colors.paleBeige }}>
          <AlertCircle className="h-5 w-5" style={{ color: colors.primaryRed }} />
          <AlertTitle className="font-bold" style={{ color: colors.deeperRed }}>
            Error
          </AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>  
    )
  }
  if (!quizHistory ||!quizzes) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: colors.offWhite }}>
        <Alert className="max-w-md border-0 shadow-lg" style={{ backgroundColor: colors.paleBeige }}>
          {/* <AlertCircle className="h-5 w-5" style={{ color: colors.primaryRed }} /> */}
          <AlertTitle className="font-bold text-center" style={{ color: colors.deeperRed }}>
            Coming soon
          </AlertTitle>
        </Alert>
      </div>
    )
  }

  if (!selectedQuiz) {
    // Quiz List View
    return (
      <div className="min-h-screen py-10 px-4" style={{ backgroundColor: colors.paleBeige }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-2 montserrat" style={{ color: colors.deeperRed }}>
              Knowledge Assessment
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.darkRed }}>
              Test your understanding of the chapters you've studied with these comprehensive quizzes
            </p>
          </div>

          {quizzes.length === 0 ? (
            <Card className="text-center p-6 border-0 shadow-md" style={{ backgroundColor: colors.paleBeige }}>
              <CardContent className="pt-6">
                <BookOpen className="h-12 w-12 mx-auto mb-4" style={{ color: colors.softRed }} />
                <p className="py-4 text-lg" style={{ color: colors.deeperRed }}>
                  No quizzes available at the moment. Continue your studies to unlock quizzes.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold montserrat" style={{ color: colors.darkRed }}>
                  Available Quizzes
                </h2>
                <Badge className="px-3 py-1 text-sm" style={{ backgroundColor: colors.primaryRed, color: "white" }}>
                  {quizzes.length} {quizzes.length === 1 ? "Quiz" : "Quizzes"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz) => {
                  const completed = isQuizCompleted(quiz._id)
                  const score = completed ? getCompletedQuizScore(quiz._id) : null
                  const scorePercentage = completed ? calculatePercentage(score, quiz.questions.length) : null

                  return (
                    <Card
                      key={quiz._id}
                      className="overflow-hidden transition-all duration-300 hover:shadow-xl border-0"
                      style={{
                        backgroundColor: colors.lightBeige,
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      {completed && (
                        <div
                          className="h-2"
                          style={{
                            backgroundColor:
                              scorePercentage >= 70 ? "#4CAF50" : scorePercentage >= 40 ? "#FF9800" : colors.primaryRed,
                          }}
                        />
                      )}

                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle style={{ color: colors.deeperRed }}>
                            {getChapterName(quiz.chapterNumber)}
                          </CardTitle>
                          {completed && (
                            <Badge
                              className="ml-2"
                              style={{
                                backgroundColor:
                                  scorePercentage >= 70
                                    ? "#4CAF50"
                                    : scorePercentage >= 40
                                      ? "#FF9800"
                                      : colors.primaryRed,
                                color: "white",
                              }}
                            >
                              {scorePercentage}%
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="flex items-center mt-1">
                          <span style={{ color: colors.darkRed }}>{quiz.questions.length} Questions</span>
                          <span className="mx-2">•</span>
                          <span style={{ color: colors.darkRed }}>20 Minutes</span>
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        {completed ? (
                          <div className="flex items-center" style={{ color: "#4CAF50" }}>
                            <CheckCircle className="h-5 w-5 mr-2" />
                            <span className="font-medium">Completed</span>
                          </div>
                        ) : (
                          <p style={{ color: colors.darkRed }}>Test your knowledge on this chapter's content</p>
                        )}
                      </CardContent>

                      <CardFooter className="pt-0">
                        <Button
                          className="w-full font-medium"
                          onClick={() => handleQuizSelect(quiz)}
                          style={{
                            backgroundColor: completed ? colors.warmBeige : colors.primaryRed,
                            color: completed ? colors.deeperRed : "white",
                            border: "none",
                          }}
                        >
                          {completed ? (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Review Quiz
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Start Quiz
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  if (quizSubmitted || quizReview) {
    // Quiz Results/Review View
    const scorePercentage = calculatePercentage(quizResult.score, selectedQuiz.questions.length)

    return (
      <div className="min-h-screen py-10 px-4" style={{ backgroundColor: colors.offWhite }}>
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={handleBackToList}
            className="mb-6 pl-0 flex items-center"
            style={{ color: colors.darkRed }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quiz List
          </Button>

          <Card className="border-0 shadow-lg overflow-hidden" style={{ backgroundColor: colors.paleBeige }}>
            <div
              className="h-2"
              style={{
                backgroundColor:
                  scorePercentage >= 70 ? "#4CAF50" : scorePercentage >= 40 ? "#FF9800" : colors.primaryRed,
              }}
            />

            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl" style={{ color: colors.deeperRed }}>
                    {quizReview ? "Quiz Review" : "Quiz Results"}
                  </CardTitle>
                  <CardDescription style={{ color: colors.darkRed }}>
                    {getChapterName(selectedQuiz.chapterNumber)}
                  </CardDescription>
                </div>
                <Trophy className="h-8 w-8" style={{ color: colors.primaryRed }} />
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="text-center mb-8 p-6 rounded-lg" style={{ backgroundColor: colors.lightBeige }}>
                <div className="mb-4">
                  <div className="inline-block rounded-full p-4 mb-2" style={{ backgroundColor: colors.warmBeige }}>
                    <Trophy className="h-8 w-8" style={{ color: colors.deeperRed }} />
                  </div>
                  <h3 className="text-3xl font-bold mb-1" style={{ color: colors.deeperRed }}>
                    {scorePercentage}%
                  </h3>
                  <p className="text-xl font-medium" style={{ color: colors.darkRed }}>
                    {quizResult.score} out of {selectedQuiz.questions.length} correct
                  </p>
                </div>

                <p className="text-lg" style={{ color: colors.darkRed }}>
                  {getScoreFeedback(scorePercentage)}
                </p>

                <div className="mt-4 pt-4 border-t" style={{ borderColor: colors.warmBeige }}>
                  <p className="text-sm" style={{ color: colors.darkRed }}>
                    Comprehension Level: {quizResult.comprehensionScore}%
                  </p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-4" style={{ color: colors.deeperRed }}>
                Question Feedback
              </h2>

              <div className="space-y-6">
                {quizResult.feedback.map((item, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden border-0 shadow-md"
                    style={{
                      backgroundColor: item.isCorrect ? "rgba(76, 175, 80, 0.05)" : "rgba(216, 64, 64, 0.05)",
                    }}
                  >
                    <div
                      className="h-1"
                      style={{
                        backgroundColor: item.isCorrect ? "#4CAF50" : colors.primaryRed,
                      }}
                    />
                    <CardHeader className="pb-2">
                      <div className="flex items-start gap-3">
                        <div
                          className="rounded-full p-2 flex-shrink-0 mt-0.5"
                          style={{
                            backgroundColor: item.isCorrect ? "rgba(76, 175, 80, 0.1)" : "rgba(216, 64, 64, 0.1)",
                          }}
                        >
                          {item.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5" style={{ color: colors.primaryRed }} />
                          )}
                        </div>
                        <CardTitle className="text-base font-medium" style={{ color: colors.deeperRed }}>
                          {item.questionText}
                        </CardTitle>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="ml-10 space-y-2">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium" style={{ color: colors.darkRed }}>
                            Your answer:
                          </span>
                          <span
                            className="font-medium"
                            style={{ color: item.isCorrect ? "#4CAF50" : colors.primaryRed }}
                          >
                            {item.userAnswer}
                          </span>
                        </div>

                        {!item.isCorrect && (
                          <div className="flex flex-col">
                            <span className="text-sm font-medium" style={{ color: colors.darkRed }}>
                              Correct answer:
                            </span>
                            <span className="font-medium text-green-600">{item.correctAnswer}</span>
                          </div>
                        )}

                        <div className="mt-3 p-3 rounded text-sm" style={{ backgroundColor: colors.warmBeige + "40" }}>
                          <p className="font-medium mb-1" style={{ color: colors.deeperRed }}>
                            Explanation:
                          </p>
                          <p style={{ color: colors.darkRed }}>{item.explanation}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>

            <CardFooter className="flex justify-center pb-6">
              <Button
                onClick={handleBackToList}
                className="px-8 font-medium"
                style={{ backgroundColor: colors.primaryRed, color: "white", border: "none" }}
              >
                Return to Quiz List
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  // Active Quiz View
  const timeWarning = timeLeft < 300 // Less than 5 minutes

  return (
    <div className="min-h-screen py-10 px-4" style={{ backgroundColor: colors.offWhite }}>
      <div className="max-w-4xl mx-auto">
        <Card className="border-0 shadow-lg" style={{ backgroundColor: colors.paleBeige }}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl" style={{ color: colors.deeperRed }}>
                  {getChapterName(selectedQuiz.chapterNumber)}
                </CardTitle>
                <CardDescription style={{ color: colors.darkRed }}>
                  Question {currentQuestion + 1} of {selectedQuiz.questions.length}
                </CardDescription>
              </div>

              <div
                className={cn("flex items-center gap-2 px-3 py-2 rounded-full", timeWarning ? "animate-pulse" : "")}
                style={{
                  backgroundColor: timeWarning ? "rgba(216, 64, 64, 0.1)" : colors.warmBeige + "40",
                }}
              >
                <Timer className="h-5 w-5" style={{ color: timeWarning ? colors.primaryRed : colors.darkRed }} />
                <span
                  className="font-mono font-medium"
                  style={{ color: timeWarning ? colors.primaryRed : colors.darkRed }}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs mb-2">
                <span style={{ color: colors.darkRed }}>Progress</span>
                <span style={{ color: colors.darkRed }}>
                  {Math.round(((currentQuestion + 1) / selectedQuiz.questions.length) * 100)}%
                </span>
              </div>
              <Progress
                value={((currentQuestion + 1) / selectedQuiz.questions.length) * 100}
                className="h-2"
                style={{
                  backgroundColor: colors.warmBeige,
                  "--progress-background": colors.primaryRed,
                }}
              />
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="mb-8">
              <h2
                className="text-xl font-medium mb-6 p-4 rounded-lg"
                style={{
                  backgroundColor: colors.lightBeige,
                  color: colors.deeperRed,
                }}
              >
                {selectedQuiz.questions[currentQuestion].questionText}
              </h2>

              <RadioGroup value={userAnswers[currentQuestion]} onValueChange={handleAnswerSelect} className="space-y-3">
                {selectedQuiz.questions[currentQuestion].options.map((option, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center p-4 rounded-lg border transition-all duration-200",
                      userAnswers[currentQuestion] === option.text ? "ring-2 ring-offset-1" : "hover:border-opacity-70",
                    )}
                    style={{
                      backgroundColor: userAnswers[currentQuestion] === option.text ? colors.warmBeige + "40" : "white",
                      borderColor: userAnswers[currentQuestion] === option.text ? colors.primaryRed : colors.warmBeige,
                      ringColor: colors.primaryRed,
                      ringOffsetColor: colors.paleBeige,
                    }}
                  >
                    <RadioGroupItem
                      value={option.text}
                      id={`option-${index}`}
                      className="mr-3"
                      style={{
                        borderColor: colors.darkRed,
                        color: colors.primaryRed,
                      }}
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-grow cursor-pointer"
                      style={{ color: colors.deeperRed }}
                    >
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 pb-6">
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
                variant="outline"
                className="flex-1 sm:flex-none"
                style={{
                  borderColor: colors.warmBeige,
                  color: colors.darkRed,
                }}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button
                onClick={handleNextQuestion}
                disabled={currentQuestion === selectedQuiz.questions.length - 1}
                variant="outline"
                className="flex-1 sm:flex-none"
                style={{
                  borderColor: colors.warmBeige,
                  color: colors.darkRed,
                }}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="w-full sm:w-auto">
              <Button
                onClick={handleSubmitQuiz}
                disabled={!allQuestionsAnswered}
                className="w-full sm:w-auto font-medium"
                style={{
                  backgroundColor: allQuestionsAnswered ? colors.primaryRed : colors.softRed,
                  opacity: allQuestionsAnswered ? 1 : 0.7,
                  color: "white",
                  border: "none",
                }}
              >
                Submit Quiz
              </Button>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-6 flex justify-center">
          <Button variant="ghost" onClick={handleBackToList} className="text-sm" style={{ color: colors.darkRed }}>
            Exit Quiz
          </Button>
        </div>
      </div>
    </div>
  )
}

export default QuizPage

