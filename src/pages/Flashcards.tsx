
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, BookOpen, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface FlashcardDeck {
  id: string;
  name: string;
  cards: Flashcard[];
  createdAt: Date;
  color: string;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  nextReview: Date;
}

const colors = [
  'bg-gradient-to-br from-blue-500 to-blue-600',
  'bg-gradient-to-br from-purple-500 to-purple-600',
  'bg-gradient-to-br from-green-500 to-green-600',
  'bg-gradient-to-br from-orange-500 to-orange-600',
  'bg-gradient-to-br from-pink-500 to-pink-600',
  'bg-gradient-to-br from-indigo-500 to-indigo-600',
];

const Flashcards = () => {
  const navigate = useNavigate();
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = () => {
    const storedDecks = localStorage.getItem("focusforge_decks");
    if (storedDecks) {
      setDecks(JSON.parse(storedDecks));
    }
  };

  const saveDecks = (updatedDecks: FlashcardDeck[]) => {
    localStorage.setItem("focusforge_decks", JSON.stringify(updatedDecks));
    setDecks(updatedDecks);
  };

  const createDeck = () => {
    if (!newDeckName.trim()) {
      toast({
        title: "Please enter a deck name",
        variant: "destructive",
      });
      return;
    }

    const newDeck: FlashcardDeck = {
      id: Date.now().toString(),
      name: newDeckName,
      cards: [],
      createdAt: new Date(),
      color: colors[Math.floor(Math.random() * colors.length)],
    };

    const updatedDecks = [...decks, newDeck];
    saveDecks(updatedDecks);
    setNewDeckName("");
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Deck created successfully!",
      description: `"${newDeckName}" is ready for flashcards.`,
    });
  };

  const deleteDeck = (deckId: string) => {
    const updatedDecks = decks.filter(deck => deck.id !== deckId);
    saveDecks(updatedDecks);
    
    toast({
      title: "Deck deleted",
      description: "The deck and all its cards have been removed.",
    });
  };

  return (
    <div className="p-6 pb-24 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Flashcards</h1>
          <p className="text-slate-600">Manage your study decks</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="focus-button">
              <Plus size={16} className="mr-2" />
              New Deck
            </Button>
          </DialogTrigger>
          <DialogContent className="mx-4">
            <DialogHeader>
              <DialogTitle>Create New Deck</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter deck name..."
                value={newDeckName}
                onChange={(e) => setNewDeckName(e.target.value)}
                className="focus-input"
                onKeyDown={(e) => e.key === 'Enter' && createDeck()}
              />
              <div className="flex space-x-3">
                <Button onClick={createDeck} className="focus-button flex-1">
                  Create Deck
                </Button>
                <Button
                  onClick={() => setIsCreateDialogOpen(false)}
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

      {/* Decks Grid */}
      {decks.length === 0 ? (
        <div className="focus-card text-center py-12">
          <BookOpen className="mx-auto mb-4 text-slate-400" size={48} />
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No decks yet</h3>
          <p className="text-slate-600 mb-6">Create your first flashcard deck to start studying</p>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="focus-button"
          >
            <Plus size={16} className="mr-2" />
            Create your first deck
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {decks.map((deck) => (
            <div key={deck.id} className="focus-card">
              <div className="flex items-center justify-between">
                <div 
                  className="flex items-center space-x-4 flex-1 cursor-pointer"
                  onClick={() => navigate(`/flashcards/${deck.id}`)}
                >
                  <div className={`w-12 h-12 rounded-2xl ${deck.color} flex items-center justify-center`}>
                    <BookOpen className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">{deck.name}</h3>
                    <p className="text-sm text-slate-600">
                      {deck.cards.length} {deck.cards.length === 1 ? 'card' : 'cards'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => navigate(`/study/${deck.id}`)}
                    size="sm"
                    className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    disabled={deck.cards.length === 0}
                  >
                    Study
                  </Button>
                  <Button
                    onClick={() => deleteDeck(deck.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Flashcards;
