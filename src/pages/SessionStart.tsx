import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Users, Play, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Quiz {
  id: string;
  title: string;
  description: string | null;
}

interface Participant {
  id: string;
  nickname: string;
  joined_at: string;
}

const SessionStart = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [sessionCode, setSessionCode] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (quizId) {
      initializeSession();
    }
  }, [quizId]);

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const initializeSession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: quizData, error: quizError } = await supabase
        .from("quizzes")
        .select("*")
        .eq("id", quizId)
        .single();

      if (quizError) throw quizError;
      setQuiz(quizData);

      const code = generateCode();
      const { data: session, error: sessionError } = await supabase
        .from("sessions")
        .insert({
          quiz_id: quizId,
          host_id: user.id,
          code,
          status: "waiting",
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      setSessionCode(code);
      setSessionId(session.id);

      // Subscribe to participant changes
      const channel = supabase
        .channel(`session-${session.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "participants",
            filter: `session_id=eq.${session.id}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setParticipants((prev) => [...prev, payload.new as Participant]);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error: any) {
      toast.error(error.message || "Failed to initialize session");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(sessionCode);
    setCopied(true);
    toast.success("Code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const startQuiz = async () => {
    try {
      const { error } = await supabase
        .from("sessions")
        .update({ status: "active", started_at: new Date().toISOString() })
        .eq("id", sessionId);

      if (error) throw error;

      navigate(`/session/host/${sessionId}`);
    } catch (error: any) {
      toast.error("Failed to start quiz");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 text-center shadow-glow mb-8">
            <h1 className="text-4xl font-bold mb-2">{quiz?.title}</h1>
            <p className="text-muted-foreground mb-8">{quiz?.description}</p>

            <div className="bg-gradient-primary p-8 rounded-2xl mb-8">
              <p className="text-primary-foreground text-sm mb-2">Quiz Code</p>
              <div className="flex items-center justify-center gap-4">
                <div className="text-6xl font-bold text-primary-foreground tracking-widest">
                  {sessionCode}
                </div>
                <Button
                  onClick={copyCode}
                  variant="secondary"
                  size="lg"
                >
                  {copied ? <Check className="h-6 w-6" /> : <Copy className="h-6 w-6" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-8">
              <Users className="h-5 w-5" />
              <span className="text-2xl font-bold">{participants.length}</span>
              <span>Participants Joined</span>
            </div>

            <Button
              size="lg"
              className="bg-gradient-primary hover:shadow-glow transition-all"
              onClick={startQuiz}
              disabled={participants.length === 0}
            >
              <Play className="mr-2 h-6 w-6" />
              Start Quiz
            </Button>
          </Card>

          {participants.length > 0 && (
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Participants</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="bg-muted p-4 rounded-lg text-center font-semibold"
                  >
                    {participant.nickname}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionStart;
