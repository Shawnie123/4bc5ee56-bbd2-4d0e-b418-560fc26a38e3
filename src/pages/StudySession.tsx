
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  nextReview: Date;
}

interface FlashcardDeck {
  id: string;
  name: string;
  cards: Flashcard[];
  createdAt: Date;
  color: string;
}

const StudySession = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState<FlashcardDeck | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studiedCards, setStudiedCards] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    loadDeck();
  }, [deckId]);

  const loadDeck = () => {
    const storedDecks = localStorage.getItem("focusforge_decks");
    if (storedDecks && deckId) {
      const decks: FlashcardDeck[] = JSON.parse(storedDecks);
      const foundDeck = decks.find(d => d.id === deckId);
      setDeck(foundDeck || null);
    }
  };

  const updateCardDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    if (!deck) return;

    const currentCard = deck.cards[currentCardIndex];
    const updatedCard = {
      ...currentCard,
      difficulty,
      nextReview: getNextReviewDate(difficulty),
    };

    const updatedCards = deck.cards.map(card => 
      card.id === currentCard.id ? updatedCard : card
    );

    const updatedDeck = {
      ...deck,
      cards: updatedCards,
    };

    // Save to localStorage
    const storedDecks = localStorage.getItem("focusforge_decks");
    if (storedDecks) {
      const decks: FlashcardDeck[] = JSON.parse(storedDecks);
      const updatedDecks = decks.map(d => d.id === updatedDeck.id ? updatedDeck : d);
      localStorage.setItem("focusforge_decks", JSON.stringify(updatedDecks));
    }

    setDeck(updatedDeck);
    nextCard();
  };

  const getNextReviewDate = (difficulty: 'easy' | 'medium' | 'hard'): Date => {
    const now = new Date();
    const daysToAdd = difficulty === 'easy' ? 7 : difficulty === 'medium' ? 3 : 1;
    const nextReview = new Date(now);
    nextReview.setDate(now.getDate() + daysToAdd);
    return nextReview;
  };

  const nextCard = () => {
    setStudiedCards(prev => prev + 1);
    
    if (currentCardIndex + 1 >= (deck?.cards.length || 0)) {
      setSessionComplete(true);
      toast({
        title: "Study session complete! 🎉",
        description: `You reviewed ${studiedCards + 1} cards.`,
      });
    } else {
      setCurrentCardIndex(prev => prev + 1);
      setShowAnswer(false);
    }
  };

  const resetSession = () => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setStudiedCards(0);
    setSessionComplete(false);
  };

  if (!deck || deck.cards.length === 0) {
    return (
      <div className="p-6 animate-slide-up">
        <div className="flex items-center space-x-4 mb-6">
          <Button
            onClick={() => navigate("/flashcards")}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">Study Session</h1>
        </div>
        <div className="text-center py-12">
          <p className="text-slate-600 mb-4">No cards available to study</p>
          <Button
            onClick={() => navigate("/flashcards")}
            className="focus-button"
          >
            Back to Flashcards
          </Button>
        </div>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="p-6 animate-slide-up">
        <div className="flex items-center space-x-4 mb-6">
          <Button
            onClick={() => navigate("/flashcards")}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">Session Complete</h1>
        </div>
        
        <div className="focus-card text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
            <Check className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Great job! 🎉</h2>
          <p className="text-slate-600 mb-6">
            You studied {studiedCards} cards from "{deck.name}"
          </p>
          <div className="space-y-3">
            <Button
              onClick={resetSession}
              className="w-full focus-button"
            >
              <RotateCcw size={16} className="mr-2" />
              Study Again
            </Button>
            <Button
              onClick={() => navigate("/flashcards")}
              variant="outline"
              className="w-full"
            >
              Back to Decks
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = deck.cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / deck.cards.length) * 100;

  return (
    <div className="p-6 pb-24 animate-slide-up">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          onClick={() => navigate(`/flashcards/${deckId}`)}
          variant="ghost"
          size="sm"
          className="p-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-800">{deck.name}</h1>
          <p className="text-sm text-slate-600">
            Card {currentCardIndex + 1} of {deck.cards.length}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="mb-8">
        <div 
          className="focus-card min-h-64 flex items-center justify-center cursor-pointer transform transition-all duration-300 hover:scale-[1.02]"
          onClick={() => !showAnswer && setShowAnswer(true)}
        >
          <div className="text-center">
            {!showAnswer ? (
              <>
                <p className="text-sm font-medium text-indigo-600 mb-4">QUESTION</p>
                <p className="text-lg text-slate-800 leading-relaxed">{currentCard.front}</p>
                <p className="text-sm text-slate-500 mt-6">Tap to reveal answer</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-purple-600 mb-4">ANSWER</p>
                <p className="text-lg text-slate-800 leading-relaxed">{currentCard.back}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      {!showAnswer ? (
        <Button
          onClick={() => setShowAnswer(true)}
          className="w-full focus-button h-14 text-lg"
        >
          Show Answer
        </Button>
      ) : (
        <div className="space-y-4">
          <p className="text-center text-slate-600 font-medium">How did you do?</p>
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={() => updateCardDifficulty('hard')}
              className="h-16 bg-red-500 hover:bg-red-600 text-white flex flex-col space-y-1"
            >
              <X size={20} />
              <span className="text-sm">Hard</span>
            </Button>
            <Button
              onClick={() => updateCardDifficulty('medium')}
              className="h-16 bg-orange-500 hover:bg-orange-600 text-white flex flex-col space-y-1"
            >
              <RotateCcw size={20} />
              <span className="text-sm">Good</span>
            </Button>
            <Button
              onClick={() => updateCardDifficulty('easy')}
              className="h-16 bg-green-500 hover:bg-green-600 text-white flex flex-col space-y-1"
            >
              <Check size={20} />
              <span className="text-sm">Easy</span>
            </Button>
          </div>
          <p className="text-xs text-center text-slate-500">
            Hard: Review tomorrow • Good: Review in 3 days • Easy: Review in a week
          </p>
        </div>
      )}
    </div>
  );
};

export default StudySession;
