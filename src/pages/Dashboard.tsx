import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Plus, Play, Edit, Trash2, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  is_active: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteQuizId, setDeleteQuizId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    fetchQuizzes();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQuizzes(data || []);
    } catch (error: any) {
      toast.error("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteQuizId) return;

    try {
      const { error } = await supabase
        .from("quizzes")
        .delete()
        .eq("id", deleteQuizId);

      if (error) throw error;
      
      toast.success("Quiz deleted successfully");
      setQuizzes(quizzes.filter(q => q.id !== deleteQuizId));
      setDeleteQuizId(null);
    } catch (error: any) {
      toast.error("Failed to delete quiz");
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Quizzes</h1>
            <p className="text-muted-foreground">Create and manage your interactive quizzes</p>
          </div>
          <Button 
            className="bg-gradient-primary hover:shadow-glow transition-all"
            onClick={() => navigate("/quiz/create")}
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Quiz
          </Button>
        </div>

        {quizzes.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold mb-2">No quizzes yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first quiz and start engaging your audience
              </p>
              <Button 
                className="bg-gradient-primary hover:shadow-glow transition-all"
                onClick={() => navigate("/quiz/create")}
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Quiz
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="p-6 hover:shadow-glow transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{quiz.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {quiz.description || "No description"}
                    </p>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground mb-4">
                  Created {new Date(quiz.created_at).toLocaleDateString()}
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-gradient-primary"
                    onClick={() => navigate(`/session/start/${quiz.id}`)}
                  >
                    <Play className="mr-1 h-4 w-4" />
                    Start
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => navigate(`/quiz/edit/${quiz.id}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setDeleteQuizId(quiz.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteQuizId} onOpenChange={() => setDeleteQuizId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the quiz and all its questions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
