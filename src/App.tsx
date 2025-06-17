
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Flashcards from "./pages/Flashcards";
import Notes from "./pages/Notes";
import Navigation from "./components/Navigation";
import FlashcardDeck from "./pages/FlashcardDeck";
import StudySession from "./pages/StudySession";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl focus-gradient flex items-center justify-center">
            <span className="text-2xl font-bold text-white">FF</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            FocusForge
          </h1>
          <p className="text-slate-600 mt-2">Loading your learning space...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="max-w-md mx-auto min-h-screen bg-white/30 backdrop-blur-sm shadow-2xl">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/flashcards" element={<Flashcards />} />
                <Route path="/flashcards/:deckId" element={<FlashcardDeck />} />
                <Route path="/study/:deckId" element={<StudySession />} />
                <Route path="/notes" element={<Notes />} />
              </Routes>
              <Navigation />
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
