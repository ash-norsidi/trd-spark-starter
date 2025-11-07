import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Timer, Users, Trophy, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface Question {
  id: string;
  prompt: string;
  options: string[];
  correct_answer: string;
  time_limit: number;
  points: number;
  order_index: number;
}

interface Response {
  id: string;
  participant_id: string;
  answer: string;
  is_correct: boolean;
  score: number;
}

const SessionHost = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [responses, setResponses] = useState<Response[]>([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (sessionId) {
      loadQuestions();
      subscribeToResponses();
    }
  }, [sessionId]);

  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults && questions.length > 0) {
      handleTimeUp();
    }
  }, [timeLeft, showResults]);

  const loadQuestions = async () => {
    try {
      const { data: session } = await supabase
        .from("sessions")
        .select("quiz_id")
        .eq("id", sessionId)
        .single();

      const { data: questionsData } = await supabase
        .from("questions")
        .select("*")
        .eq("quiz_id", session?.quiz_id)
        .order("order_index");

      const { data: participants } = await supabase
        .from("participants")
        .select("id")
        .eq("session_id", sessionId);

      setQuestions((questionsData || []).map(q => ({
        ...q,
        options: Array.isArray(q.options) ? q.options : []
      })));
      setParticipantCount(participants?.length || 0);
      
      if (questionsData && questionsData.length > 0) {
        setTimeLeft(questionsData[0].time_limit);
      }
    } catch (error: any) {
      toast.error("Failed to load questions");
    }
  };

  const subscribeToResponses = () => {
    const channel = supabase
      .channel(`responses-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "responses",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const newResponse = payload.new as Response;
          if (questions[currentIndex]?.id === newResponse.participant_id) {
            setResponses((prev) => [...prev, newResponse]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleTimeUp = () => {
    setShowResults(true);
  };

  const nextQuestion = async () => {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setTimeLeft(questions[nextIndex].time_limit);
      setResponses([]);
      setShowResults(false);

      await supabase
        .from("sessions")
        .update({ current_question_index: nextIndex })
        .eq("id", sessionId);
    } else {
      await supabase
        .from("sessions")
        .update({ status: "ended", ended_at: new Date().toISOString() })
        .eq("id", sessionId);
      
      navigate(`/session/results/${sessionId}`);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const correctResponses = responses.filter((r) => r.is_correct).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Question Display */}
          <Card className="p-12 mb-8 shadow-glow">
            <div className="flex justify-between items-center mb-8">
              <div className="text-sm text-muted-foreground">
                Question {currentIndex + 1} of {questions.length}
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">{responses.length}/{participantCount}</span>
                </div>
                <div className="flex items-center gap-2 bg-gradient-accent text-accent-foreground px-4 py-2 rounded-lg">
                  <Timer className="h-5 w-5" />
                  <span className="text-2xl font-bold">{timeLeft}s</span>
                </div>
              </div>
            </div>

            <Progress 
              value={((questions.length - currentIndex - 1) / questions.length) * 100} 
              className="mb-8"
            />

            <h2 className="text-4xl font-bold text-center mb-12">
              {currentQuestion.prompt}
            </h2>

            {!showResults ? (
              <div className="grid grid-cols-2 gap-6">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className="bg-muted p-8 rounded-xl text-center text-xl font-semibold"
                  >
                    {option}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-8 rounded-xl text-center text-xl font-semibold transition-all ${
                        option === currentQuestion.correct_answer
                          ? "bg-success text-success-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>

                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold">
                    <Trophy className="inline h-10 w-10 mr-2 text-accent" />
                    {correctResponses} / {responses.length} correct
                  </div>
                  
                  <Button
                    size="lg"
                    className="bg-gradient-primary hover:shadow-glow transition-all"
                    onClick={nextQuestion}
                  >
                    {currentIndex < questions.length - 1 ? (
                      <>
                        Next Question
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    ) : (
                      "Show Final Results"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SessionHost;
