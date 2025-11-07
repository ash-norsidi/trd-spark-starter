import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/Navbar";
import { Plus, Trash2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Question {
  type: "multiple_choice" | "true_false";
  prompt: string;
  options: string[];
  correct_answer: string;
  time_limit: number;
  points: number;
}

const QuizCreate = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      type: "multiple_choice",
      prompt: "",
      options: ["", "", "", ""],
      correct_answer: "",
      time_limit: 30,
      points: 1000,
    },
  ]);
  const [saving, setSaving] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        type: "multiple_choice",
        prompt: "",
        options: ["", "", "", ""],
        correct_answer: "",
        time_limit: 30,
        points: 1000,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please enter a quiz title");
      return;
    }

    const validQuestions = questions.filter(q => 
      q.prompt.trim() && 
      q.options.some(o => o.trim()) &&
      q.correct_answer.trim()
    );

    if (validQuestions.length === 0) {
      toast.error("Please add at least one complete question");
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .insert({
          owner_id: user.id,
          title,
          description,
        })
        .select()
        .single();

      if (quizError) throw quizError;

      const questionsToInsert = validQuestions.map((q, index) => ({
        quiz_id: quiz.id,
        type: q.type,
        prompt: q.prompt,
        options: q.type === "true_false" ? ["True", "False"] : q.options.filter(o => o.trim()),
        correct_answer: q.correct_answer,
        time_limit: q.time_limit,
        points: q.points,
        order_index: index,
      }));

      const { error: questionsError } = await supabase
        .from("questions")
        .insert(questionsToInsert);

      if (questionsError) throw questionsError;

      toast.success("Quiz created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to create quiz");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Create Quiz</h1>
              <p className="text-muted-foreground">Build an engaging quiz for your audience</p>
            </div>
            <Button 
              className="bg-gradient-primary hover:shadow-glow transition-all"
              onClick={handleSave}
              disabled={saving}
            >
              <Save className="mr-2 h-5 w-5" />
              {saving ? "Saving..." : "Save Quiz"}
            </Button>
          </div>

          <Card className="p-8 mb-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Quiz Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., World Geography Challenge"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of your quiz"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            {questions.map((question, qIndex) => (
              <Card key={qIndex} className="p-6 hover:shadow-glow transition-all">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">Question {qIndex + 1}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeQuestion(qIndex)}
                    disabled={questions.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Question Type</Label>
                    <Select
                      value={question.type}
                      onValueChange={(value: any) => updateQuestion(qIndex, "type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                        <SelectItem value="true_false">True/False</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Question</Label>
                    <Input
                      placeholder="Enter your question"
                      value={question.prompt}
                      onChange={(e) => updateQuestion(qIndex, "prompt", e.target.value)}
                    />
                  </div>

                  {question.type === "multiple_choice" && (
                    <div>
                      <Label>Answer Options</Label>
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => (
                          <Input
                            key={oIndex}
                            placeholder={`Option ${oIndex + 1}`}
                            value={option}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label>Correct Answer</Label>
                    {question.type === "true_false" ? (
                      <Select
                        value={question.correct_answer}
                        onValueChange={(value) => updateQuestion(qIndex, "correct_answer", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="True">True</SelectItem>
                          <SelectItem value="False">False</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Select
                        value={question.correct_answer}
                        onValueChange={(value) => updateQuestion(qIndex, "correct_answer", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent>
                          {question.options.filter(o => o.trim()).map((option, i) => (
                            <SelectItem key={i} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Time Limit (seconds)</Label>
                      <Input
                        type="number"
                        min="5"
                        max="300"
                        value={question.time_limit}
                        onChange={(e) => updateQuestion(qIndex, "time_limit", parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Points</Label>
                      <Input
                        type="number"
                        min="100"
                        max="2000"
                        step="100"
                        value={question.points}
                        onChange={(e) => updateQuestion(qIndex, "points", parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button
            onClick={addQuestion}
            variant="outline"
            className="w-full mt-6"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Question
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizCreate;
