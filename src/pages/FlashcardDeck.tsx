
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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

const FlashcardDeck = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState<FlashcardDeck | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [cardFront, setCardFront] = useState("");
  const [cardBack, setCardBack] = useState("");

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

  const saveDeck = (updatedDeck: FlashcardDeck) => {
    const storedDecks = localStorage.getItem("focusforge_decks");
    if (storedDecks) {
      const decks: FlashcardDeck[] = JSON.parse(storedDecks);
      const updatedDecks = decks.map(d => d.id === updatedDeck.id ? updatedDeck : d);
      localStorage.setItem("focusforge_decks", JSON.stringify(updatedDecks));
      setDeck(updatedDeck);
    }
  };

  const createCard = () => {
    if (!cardFront.trim() || !cardBack.trim()) {
      toast({
        title: "Please fill in both sides of the card",
        variant: "destructive",
      });
      return;
    }

    if (!deck) return;

    const newCard: Flashcard = {
      id: Date.now().toString(),
      front: cardFront,
      back: cardBack,
      difficulty: 'medium',
      nextReview: new Date(),
    };

    const updatedDeck = {
      ...deck,
      cards: [...deck.cards, newCard],
    };

    saveDeck(updatedDeck);
    setCardFront("");
    setCardBack("");
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Card created successfully!",
      description: "New flashcard added to your deck.",
    });
  };

  const editCard = () => {
    if (!cardFront.trim() || !cardBack.trim() || !editingCard || !deck) {
      toast({
        title: "Please fill in both sides of the card",
        variant: "destructive",
      });
      return;
    }

    const updatedCards = deck.cards.map(card => 
      card.id === editingCard.id 
        ? { ...card, front: cardFront, back: cardBack }
        : card
    );

    const updatedDeck = {
      ...deck,
      cards: updatedCards,
    };

    saveDeck(updatedDeck);
    setEditingCard(null);
    setCardFront("");
    setCardBack("");
    
    toast({
      title: "Card updated successfully!",
    });
  };

  const deleteCard = (cardId: string) => {
    if (!deck) return;

    const updatedCards = deck.cards.filter(card => card.id !== cardId);
    const updatedDeck = {
      ...deck,
      cards: updatedCards,
    };

    saveDeck(updatedDeck);
    
    toast({
      title: "Card deleted",
    });
  };

  const openEditDialog = (card: Flashcard) => {
    setEditingCard(card);
    setCardFront(card.front);
    setCardBack(card.back);
  };

  const resetForm = () => {
    setCardFront("");
    setCardBack("");
    setEditingCard(null);
  };

  if (!deck) {
    return (
      <div className="p-6 animate-slide-up">
        <div className="text-center py-12">
          <p className="text-slate-600">Deck not found</p>
          <Button
            onClick={() => navigate("/flashcards")}
            className="mt-4 focus-button"
          >
            Back to Flashcards
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 animate-slide-up">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          onClick={() => navigate("/flashcards")}
          variant="ghost"
          size="sm"
          className="p-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800">{deck.name}</h1>
          <p className="text-slate-600">{deck.cards.length}  {deck.cards.length === 1 ? 'card' : 'cards'}</p>
        </div>
        {deck.cards.length > 0 && (
          <Button
            onClick={() => navigate(`/study/${deck.id}`)}
            className="focus-button"
          >
            <Play size={16} className="mr-2" />
            Study
          </Button>
        )}
      </div>

      {/* Add Card Button */}
      <div className="mb-6">
        <Dialog 
          open={isCreateDialogOpen || !!editingCard} 
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateDialogOpen(false);
              resetForm();
            } else if (!editingCard) {
              setIsCreateDialogOpen(true);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="w-full focus-button h-14">
              <Plus size={20} className="mr-2" />
              Add New Card
            </Button>
          </DialogTrigger>
          <DialogContent className="mx-4">
            <DialogHeader>
              <DialogTitle>
                {editingCard ? "Edit Card" : "Create New Card"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Front (Question)
                </label>
                <Textarea
                  placeholder="Enter the question or term..."
                  value={cardFront}
                  onChange={(e) => setCardFront(e.target.value)}
                  className="focus-input min-h-20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Back (Answer)
                </label>
                <Textarea
                  placeholder="Enter the answer or definition..."
                  value={cardBack}
                  onChange={(e) => setCardBack(e.target.value)}
                  className="focus-input min-h-20"
                />
              </div>
              <div className="flex space-x-3">
                <Button 
                  onClick={editingCard ? editCard : createCard} 
                  className="focus-button flex-1"
                >
                  {editingCard ? "Update Card" : "Create Card"}
                </Button>
                <Button
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards List */}
      {deck.cards.length === 0 ? (
        <div className="focus-card text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
            <Plus className="text-indigo-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No cards yet</h3>
          <p className="text-slate-600">Add your first flashcard to start studying</p>
        </div>
      ) : (
        <div className="space-y-4">
          {deck.cards.map((card, index) => (
            <div key={card.id} className="focus-card">
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-lg">
                  Card {index + 1}
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => openEditDialog(card)}
                    size="sm"
                    variant="ghost"
                    className="text-slate-600 hover:bg-slate-100"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    onClick={() => deleteCard(card.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-1">Front:</p>
                  <p className="text-slate-800">{card.front}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-1">Back:</p>
                  <p className="text-slate-800">{card.back}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlashcardDeck;
