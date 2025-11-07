import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Timer, Zap } from "lucide-react";

interface Question {
  id: string;
  prompt: string;
  options: string[];
  time_limit: number;
}

const PlayQuiz = () => {
  const { sessionId, participantId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (sessionId) {
      subscribeToSession();
    }
  }, [sessionId]);

  const subscribeToSession = () => {
    const channel = supabase
      .channel(`session-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "sessions",
          filter: `id=eq.${sessionId}`,
        },
        async (payload: any) => {
          if (payload.new.status === "active") {
            await loadCurrentQuestion(payload.new.current_question_index);
          }
        }
      )
      .subscribe();
  };

  const loadCurrentQuestion = async (index: number) => {
    const { data: session } = await supabase
      .from("sessions")
      .select("quiz_id")
      .eq("id", sessionId)
      .single();

    const { data: questions } = await supabase
      .from("questions")
      .select("*")
      .eq("quiz_id", session?.quiz_id)
      .order("order_index");

    if (questions && questions[index]) {
      const q = questions[index];
      setCurrentQuestion({
        id: q.id,
        prompt: q.prompt,
        options: Array.isArray(q.options) ? q.options : [],
        time_limit: q.time_limit
      });
      setTimeLeft(q.time_limit);
      setSubmitted(false);
      setSelectedAnswer("");
    }
  };

  const handleSubmit = async () => {
    if (!selectedAnswer || !currentQuestion) return;

    const startTime = currentQuestion.time_limit;
    const timeTaken = startTime - timeLeft;

    await supabase.from("responses").insert({
      session_id: sessionId,
      participant_id: participantId,
      question_id: currentQuestion.id,
      answer: selectedAnswer,
      time_taken: timeTaken,
    });

    setSubmitted(true);
    toast.success("Answer submitted!");
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full p-12 shadow-glow">
        {currentQuestion ? (
          <>
            <div className="flex justify-between mb-8">
              <div className="flex items-center gap-2 bg-gradient-accent text-accent-foreground px-4 py-2 rounded-lg">
                <Timer className="h-5 w-5" />
                <span className="text-2xl font-bold">{timeLeft}s</span>
              </div>
            </div>

            <h2 className="text-4xl font-bold text-center mb-12">{currentQuestion.prompt}</h2>

            <div className="grid grid-cols-2 gap-6">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => !submitted && setSelectedAnswer(option)}
                  disabled={submitted}
                  className={`h-24 text-xl ${
                    selectedAnswer === option
                      ? "bg-gradient-primary"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>

            {!submitted && selectedAnswer && (
              <Button
                onClick={handleSubmit}
                size="lg"
                className="w-full mt-8 bg-gradient-accent"
              >
                <Zap className="mr-2" />
                Submit Answer
              </Button>
            )}

            {submitted && (
              <div className="text-center mt-8 text-2xl font-bold text-success">
                Answer Submitted! Wait for next question...
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <p className="text-2xl">Waiting for host to start...</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PlayQuiz;
