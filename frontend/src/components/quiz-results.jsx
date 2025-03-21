"use client"

import  { QuizResult } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { QuizFeedbackItem } from "./quiz-feedback"
export function QuizResults({ result, onRetry }){
  const { score, feedback, comprehensionScore } = result
  const totalQuestions = feedback.length
  const percentage = Math.round((score / totalQuestions) * 100)

  let message = ""
  let messageClass = ""

  if (percentage >= 80) {
    message = "Excellent work! You've mastered this content."
    messageClass = "text-green-600"
  } else if (percentage >= 60) {
    message = "Good job! You're on the right track."
    messageClass = "text-green-500"
  } else if (percentage >= 40) {
    message = "Keep practicing! You're making progress."
    messageClass = "text-amber-500"
  } else {
    message = "Let's review this material again."
    messageClass = "text-primary"
  }

  return (
    <div className="space-y-6">
      <Card className="border-secondary-warm shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl text-primary-deeper">Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Your Score</span>
                <span className="font-bold">
                  {score}/{totalQuestions}
                </span>
              </div>
              <Progress value={percentage} className="h-3 bg-secondary" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Overall Comprehension</span>
                <span className="font-bold">{comprehensionScore}%</span>
              </div>
              <Progress value={comprehensionScore} className="h-3 bg-secondary" />
            </div>

            <p className={`text-center font-medium text-lg ${messageClass}`}>{message}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={onRetry} className="w-full bg-primary hover:bg-primary-dark">
            Try Another Quiz
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 text-primary-deeper">Detailed Feedback</h3>
        {feedback.map((item, index) => (
          <QuizFeedbackItem key={index} feedback={item} index={index} />
        ))}
      </div>
    </div>
  )
}

