import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Zap } from "lucide-react";
import { toast } from "sonner";
import { QuizChallenge as QuizChallengeType, completeChallenge } from "@/utils/challengeSystem";
import { completeSkill } from "@/utils/progressSystem";

interface QuizChallengeProps {
  challenge: QuizChallengeType;
  onComplete: () => void;
}

export const QuizChallenge = ({ challenge, onComplete }: QuizChallengeProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const question = challenge.questions[currentQuestion];
  const isLastQuestion = currentQuestion === challenge.questions.length - 1;

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === question.correctAnswer;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      toast.success("Correct! ⭐");
    } else {
      toast.error("Not quite right");
    }
    
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Quiz complete
      const passed = correctAnswers >= challenge.questions.length * 0.7; // 70% to pass
      
      if (passed) {
        completeChallenge(challenge.id);
        const progress = completeSkill(challenge.skillId);
        toast.success("Quiz Completed! 🎉", {
          description: `Score: ${correctAnswers}/${challenge.questions.length} | +${challenge.xpReward} XP | Level ${progress.level}`
        });
        onComplete();
      } else {
        toast.error("Quiz Failed", {
          description: `Score: ${correctAnswers}/${challenge.questions.length}. Try again!`
        });
        setCurrentQuestion(0);
        setCorrectAnswers(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
      }
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  return (
    <Card className="glass-panel border-border/40">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {challenge.completed && <CheckCircle2 className="w-5 h-5 text-primary" />}
              {challenge.title}
            </CardTitle>
            <CardDescription className="mt-2">{challenge.description}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Reward</div>
            <div className="text-lg font-bold text-primary">+{challenge.xpReward} XP</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Question {currentQuestion + 1} of {challenge.questions.length}</span>
          <span>Score: {correctAnswers}/{currentQuestion + (showExplanation ? 1 : 0)}</span>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{question.question}</h3>
          
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correctAnswer;
              const showResult = showExplanation;

              let buttonClass = "justify-start h-auto py-4 px-6 text-left";
              if (showResult) {
                if (isCorrect) {
                  buttonClass += " bg-primary/20 border-primary/40 text-primary";
                } else if (isSelected) {
                  buttonClass += " bg-destructive/20 border-destructive/40 text-destructive";
                }
              } else if (isSelected) {
                buttonClass += " bg-primary/20 border-primary/40";
              }

              return (
                <Button
                  key={index}
                  variant="outline"
                  className={buttonClass}
                  onClick={() => !showExplanation && setSelectedAnswer(index)}
                  disabled={showExplanation}
                >
                  <span className="flex-1">{option}</span>
                  {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 ml-2" />}
                  {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 ml-2" />}
                </Button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg animate-fade-in">
              <div className="flex items-start gap-2">
                <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground/90">{question.explanation}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {!showExplanation ? (
            <Button onClick={handleSubmit} disabled={selectedAnswer === null} className="flex-1">
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNext} className="flex-1">
              {isLastQuestion ? "Finish Quiz" : "Next Question"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
