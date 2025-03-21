import  { QuizFeedback } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"


export function QuizFeedbackItem({ feedback, index }) {
  return (
    <Card className={`mb-4 ${feedback.isCorrect ? "border-green-500" : "border-primary"}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {feedback.isCorrect ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-primary" />
          )}
          Question {index + 1}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-medium mb-2">{feedback.questionText}</p>

        <div className="space-y-2 mt-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Your answer:</span>
            <span className={`font-medium ${feedback.isCorrect ? "text-green-600" : "text-primary"}`}>
              {feedback.userAnswer}
            </span>
          </div>

          {!feedback.isCorrect && (
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Correct answer:</span>
              <span className="font-medium text-green-600">{feedback.correctAnswer}</span>
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-secondary-warm">
            <span className="text-sm font-medium">Explanation:</span>
            <p className="mt-1 text-muted-foreground">{feedback.explanation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

