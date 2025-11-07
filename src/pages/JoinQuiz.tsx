import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const JoinQuiz = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim() || !nickname.trim()) {
      toast.error("Please enter both code and nickname");
      return;
    }

    setLoading(true);
    try {
      // Check if session exists and is active
      const { data: session, error: sessionError } = await supabase
        .from("sessions")
        .select("*")
        .eq("code", code.toUpperCase())
        .in("status", ["waiting", "active"])
        .single();

      if (sessionError || !session) {
        toast.error("Invalid or expired quiz code");
        return;
      }

      // Add participant
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: participant, error: participantError } = await supabase
        .from("participants")
        .insert({
          session_id: session.id,
          user_id: user?.id || null,
          nickname: nickname.trim(),
        })
        .select()
        .single();

      if (participantError) throw participantError;

      toast.success(`Welcome ${nickname}!`);
      navigate(`/play/${session.id}/${participant.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to join quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-md mx-auto">
          <Card className="p-8 shadow-glow">
            <div className="text-center mb-8">
              <div className="bg-gradient-accent p-3 rounded-lg w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-accent-foreground" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Join Quiz</h1>
              <p className="text-muted-foreground">
                Enter the quiz code to participate
              </p>
            </div>

            <form onSubmit={handleJoin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Quiz Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="text-center text-2xl font-bold tracking-widest"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname">Your Nickname</Label>
                <Input
                  id="nickname"
                  type="text"
                  placeholder="Enter your name"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={20}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-accent hover:shadow-accent transition-all"
                disabled={loading}
              >
                {loading ? "Joining..." : "Join Quiz"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JoinQuiz;
