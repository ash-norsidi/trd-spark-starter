import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Zap, Users, Trophy, BarChart3, Sparkles, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-quiz.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="bg-gradient-accent px-4 py-2 rounded-full text-sm font-semibold text-accent-foreground animate-pulse-slow">
                  ✨ Interactive Live Quizzing
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Make Learning
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  Incredibly Fun
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Create engaging quizzes, host live sessions, and watch your audience compete in real-time. 
                Perfect for education, training, and events.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all" asChild>
                  <Link to="/auth">
                    <Zap className="mr-2 h-5 w-5" />
                    Start Creating Free
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/join">Join a Quiz</Link>
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-primary">100K+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">5M+</div>
                  <div className="text-sm text-muted-foreground">Quizzes Created</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">50M+</div>
                  <div className="text-sm text-muted-foreground">Participants</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
              <img 
                src={heroImage} 
                alt="Interactive quiz platform with live leaderboards" 
                className="relative rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need for
              <span className="block bg-gradient-primary bg-clip-text text-transparent">
                Amazing Quizzes
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features that make creating and hosting live quizzes effortless
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-glow transition-all border-2">
              <div className="bg-gradient-primary p-3 rounded-lg w-fit mb-4">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-Time Gameplay</h3>
              <p className="text-muted-foreground">
                Host live quiz sessions with instant responses, live leaderboards, and synchronized gameplay
              </p>
            </Card>

            <Card className="p-6 hover:shadow-glow transition-all border-2">
              <div className="bg-gradient-accent p-3 rounded-lg w-fit mb-4">
                <Users className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">Unlimited Participants</h3>
              <p className="text-muted-foreground">
                Scale from classroom sizes to massive audiences. Join with a simple room code
              </p>
            </Card>

            <Card className="p-6 hover:shadow-glow transition-all border-2">
              <div className="bg-gradient-primary p-3 rounded-lg w-fit mb-4">
                <Trophy className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">Gamification</h3>
              <p className="text-muted-foreground">
                Points, streaks, and live leaderboards that keep participants engaged and competitive
              </p>
            </Card>

            <Card className="p-6 hover:shadow-glow transition-all border-2">
              <div className="bg-gradient-accent p-3 rounded-lg w-fit mb-4">
                <Sparkles className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Quiz Builder</h3>
              <p className="text-muted-foreground">
                Create quizzes in minutes with multiple question types, media support, and templates
              </p>
            </Card>

            <Card className="p-6 hover:shadow-glow transition-all border-2">
              <div className="bg-gradient-primary p-3 rounded-lg w-fit mb-4">
                <BarChart3 className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">Detailed Analytics</h3>
              <p className="text-muted-foreground">
                Track performance, identify knowledge gaps, and measure engagement with rich insights
              </p>
            </Card>

            <Card className="p-6 hover:shadow-glow transition-all border-2">
              <div className="bg-gradient-accent p-3 rounded-lg w-fit mb-4">
                <Timer className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">Flexible Timing</h3>
              <p className="text-muted-foreground">
                Set custom time limits, pause sessions, and control the pace of your quiz
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-hero opacity-10" />
            <div className="relative p-12 text-center">
              <h2 className="text-4xl font-bold mb-4">
                Ready to Transform Your Quizzes?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of educators, trainers, and event organizers who create unforgettable experiences
              </p>
              <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all" asChild>
                <Link to="/auth">
                  <Zap className="mr-2 h-5 w-5" />
                  Get Started Free
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <span className="font-bold">QuizMaster</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 QuizMaster. Built for engaging learning experiences.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
