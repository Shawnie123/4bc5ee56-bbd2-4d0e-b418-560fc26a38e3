
import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  createdAt: Date;
  updatedAt: Date;
}

const subjects = [
  "Mathematics", "Science", "History", "Literature", "Language", 
  "Computer Science", "Art", "Music", "Philosophy", "Other"
];

const subjectColors = {
  "Mathematics": "bg-blue-100 text-blue-800",
  "Science": "bg-green-100 text-green-800",
  "History": "bg-orange-100 text-orange-800",
  "Literature": "bg-purple-100 text-purple-800",
  "Language": "bg-pink-100 text-pink-800",
  "Computer Science": "bg-indigo-100 text-indigo-800",
  "Art": "bg-yellow-100 text-yellow-800",
  "Music": "bg-teal-100 text-teal-800",
  "Philosophy": "bg-gray-100 text-gray-800",
  "Other": "bg-slate-100 text-slate-800",
};

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteSubject, setNoteSubject] = useState("");

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = () => {
    const storedNotes = localStorage.getItem("focusforge_notes");
    if (storedNotes) {
      const parsedNotes = JSON.parse(storedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));
      setNotes(parsedNotes);
    }
  };

  const saveNotes = (updatedNotes: Note[]) => {
    localStorage.setItem("focusforge_notes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const createNote = () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      toast({
        title: "Please fill in title and content",
        variant: "destructive",
      });
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title: noteTitle,
      content: noteContent,
      subject: noteSubject || "Other",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedNotes = [newNote, ...notes];
    saveNotes(updatedNotes);
    resetForm();
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Note created successfully!",
      description: `"${noteTitle}" has been saved.`,
    });
  };

  const editNote = () => {
    if (!editingNote || !noteTitle.trim() || !noteContent.trim()) {
      toast({
        title: "Please fill in title and content",
        variant: "destructive",
      });
      return;
    }

    const updatedNotes = notes.map(note => 
      note.id === editingNote.id 
        ? { 
            ...note, 
            title: noteTitle, 
            content: noteContent, 
            subject: noteSubject || note.subject,
            updatedAt: new Date()
          }
        : note
    );

    saveNotes(updatedNotes);
    resetForm();
    setEditingNote(null);
    
    toast({
      title: "Note updated successfully!",
    });
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    saveNotes(updatedNotes);
    
    toast({
      title: "Note deleted",
    });
  };

  const openEditDialog = (note: Note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteSubject(note.subject);
  };

  const resetForm = () => {
    setNoteTitle("");
    setNoteContent("");
    setNoteSubject("");
    setEditingNote(null);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "all" || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="p-6 pb-24 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quick Notes</h1>
          <p className="text-slate-600">Capture your thoughts and ideas</p>
        </div>
        <Dialog 
          open={isCreateDialogOpen || !!editingNote} 
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateDialogOpen(false);
              resetForm();
            } else if (!editingNote) {
              setIsCreateDialogOpen(true);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="focus-button">
              <Plus size={16} className="mr-2" />
              New Note
            </Button>
          </DialogTrigger>
          <DialogContent className="mx-4 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingNote ? "Edit Note" : "Create New Note"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Note title..."
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="focus-input"
              />
              <Select value={noteSubject} onValueChange={setNoteSubject}>
                <SelectTrigger className="focus-input">
                  <SelectValue placeholder="Select subject (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Write your note here..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="focus-input min-h-32"
              />
              <div className="flex space-x-3">
                <Button 
                  onClick={editingNote ? editNote : createNote} 
                  className="focus-button flex-1"
                >
                  {editingNote ? "Update Note" : "Create Note"}
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

      {/* Search and Filter */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <Input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="focus-input pl-10"
          />
        </div>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="focus-input">
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <div className="focus-card text-center py-12">
          {notes.length === 0 ? (
            <>
              <BookOpen className="mx-auto mb-4 text-slate-400" size={48} />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No notes yet</h3>
              <p className="text-slate-600 mb-6">Start capturing your thoughts and ideas</p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="focus-button"
              >
                <Plus size={16} className="mr-2" />
                Create your first note
              </Button>
            </>
          ) : (
            <>
              <Search className="mx-auto mb-4 text-slate-400" size={48} />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No matching notes</h3>
              <p className="text-slate-600">Try adjusting your search or filter criteria</p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map((note) => (
            <div key={note.id} className="focus-card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
                    subjectColors[note.subject as keyof typeof subjectColors] || subjectColors.Other
                  }`}>
                    {note.subject}
                  </span>
                  <span className="text-xs text-slate-500">
                    {note.updatedAt.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => openEditDialog(note)}
                    size="sm"
                    variant="ghost"
                    className="text-slate-600 hover:bg-slate-100"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    onClick={() => deleteNote(note.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">{note.title}</h3>
              <p className="text-slate-600 text-sm line-clamp-3">{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;
