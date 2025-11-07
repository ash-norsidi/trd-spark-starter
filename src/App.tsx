import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import QuizCreate from "./pages/QuizCreate";
import JoinQuiz from "./pages/JoinQuiz";
import SessionStart from "./pages/SessionStart";
import SessionHost from "./pages/SessionHost";
import PlayQuiz from "./pages/PlayQuiz";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz/create" element={<QuizCreate />} />
          <Route path="/join" element={<JoinQuiz />} />
          <Route path="/session/start/:quizId" element={<SessionStart />} />
          <Route path="/session/host/:sessionId" element={<SessionHost />} />
          <Route path="/play/:sessionId/:participantId" element={<PlayQuiz />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
