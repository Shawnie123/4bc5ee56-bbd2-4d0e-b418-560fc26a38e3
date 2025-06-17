
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, BookOpen, FileText, Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FlashcardDeck {
  id: string;
  name: string;
  cards: any[];
  lastStudied?: Date;
  color: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  createdAt: Date;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [todayReviews, setTodayReviews] = useState(0);

  useEffect(() => {
    // Load data from localStorage
    const storedDecks = localStorage.getItem("focusforge_decks");
    const storedNotes = localStorage.getItem("focusforge_notes");
    
    if (storedDecks) {
      const parsedDecks = JSON.parse(storedDecks);
      setDecks(parsedDecks);
      
      // Calculate today's reviews
      const totalReviews = parsedDecks.reduce((acc: number, deck: FlashcardDeck) => 
        acc + deck.cards.length, 0
      );
      setTodayReviews(totalReviews);
    }
    
    if (storedNotes) {
      const parsedNotes = JSON.parse(storedNotes);
      setRecentNotes(parsedNotes.slice(0, 3));
    }
  }, []);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-6 pb-24 animate-slide-up">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 rounded-2xl focus-gradient flex items-center justify-center">
            <span className="text-xl font-bold text-white">FF</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">FocusForge</h1>
            <p className="text-slate-600 text-sm">{greeting}! Ready to learn?</p>
          </div>
        </div>
      </div>

      {/* Today's Review Stats */}
      <div className="focus-card mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-1">Today's Reviews</h2>
            <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {todayReviews}
            </p>
            <p className="text-slate-600 text-sm">cards to review</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
            <Zap className="text-indigo-600" size={24} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button
          onClick={() => navigate("/flashcards")}
          className="focus-button h-20 flex flex-col space-y-2"
        >
          <BookOpen size={24} />
          <span>Flashcards</span>
        </Button>
        <Button
          onClick={() => navigate("/notes")}
          className="focus-button h-20 flex flex-col space-y-2"
        >
          <FileText size={24} />
          <span>Quick Notes</span>
        </Button>
      </div>

      {/* Recent Flashcard Decks */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Your Decks</h3>
          <Button
            onClick={() => navigate("/flashcards")}
            variant="ghost"
            size="sm"
            className="text-indigo-600"
          >
            View all
          </Button>
        </div>
        
        {decks.length === 0 ? (
          <div className="focus-card text-center py-8">
            <BookOpen className="mx-auto mb-3 text-slate-400" size={32} />
            <p className="text-slate-600 mb-4">No flashcard decks yet</p>
            <Button
              onClick={() => navigate("/flashcards")}
              className="focus-button"
            >
              <Plus size={16} className="mr-2" />
              Create your first deck
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {decks.slice(0, 3).map((deck) => (
              <div
                key={deck.id}
                onClick={() => navigate(`/flashcards/${deck.id}`)}
                className="focus-card cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl ${deck.color} flex items-center justify-center`}>
                      <BookOpen className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">{deck.name}</h4>
                      <p className="text-sm text-slate-600">{deck.cards.length} cards</p>
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/study/${deck.id}`);
                    }}
                    size="sm"
                    className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                  >
                    Study
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Notes */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Recent Notes</h3>
          <Button
            onClick={() => navigate("/notes")}
            variant="ghost"
            size="sm"
            className="text-indigo-600"
          >
            View all
          </Button>
        </div>
        
        {recentNotes.length === 0 ? (
          <div className="focus-card text-center py-8">
            <FileText className="mx-auto mb-3 text-slate-400" size={32} />
            <p className="text-slate-600 mb-4">No notes yet</p>
            <Button
              onClick={() => navigate("/notes")}
              className="focus-button"
            >
              <Plus size={16} className="mr-2" />
              Write your first note
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentNotes.map((note) => (
              <div key={note.id} className="focus-card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 mb-1">{note.title}</h4>
                    <p className="text-sm text-slate-600 line-clamp-2">{note.content}</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg">
                        {note.subject}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
