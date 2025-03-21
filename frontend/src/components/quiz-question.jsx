"use client"

import { Question } from "@/lib/api"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"


export function QuizQuestion({ question, index, selectedAnswer, onAnswerSelect }) {
  return (
    <Card className="mb-6 border-secondary-warm shadow-md">
      <CardContent className="pt-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-primary-deeper">Question {index + 1}</h3>
          <p className="mt-2 text-lg">{question.questionText}</p>
        </div>

        <RadioGroup value={selectedAnswer} onValueChange={onAnswerSelect} className="space-y-3">
          {question.options.map((option, optionIndex) => (
            <div
              key={optionIndex}
              className={`flex items-center space-x-2 rounded-md border p-3 transition-colors ${
                selectedAnswer === option.text
                  ? "border-primary bg-primary/10"
                  : "border-secondary-warm hover:bg-secondary/20"
              }`}
            >
              <RadioGroupItem value={option.text} id={`option-${index}-${optionIndex}`} className="text-primary" />
              <Label htmlFor={`option-${index}-${optionIndex}`} className="flex-grow cursor-pointer font-medium">
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}

