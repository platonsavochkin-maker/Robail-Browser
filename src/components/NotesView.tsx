import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Download, Eye, Edit3, Check } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export const NotesView: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem('robail_notes');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: '1',
        title: 'Welcome to Robail Notes',
        content: `# Robail In-Browser Scratchpad

Save quick snippets, thoughts, and research notes while exploring the web.

### Features
- Auto-saves locally to your browser storage
- Markdown support
- Instant export to text file
- Distraction-free writing`,
        updatedAt: Date.now(),
      },
    ];
  });

  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || '1');
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('robail_notes', JSON.stringify(notes));
    } catch {}
  }, [notes]);

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const handleCreateNote = () => {
    const newNote: Note = {
      id: 'note-' + Date.now(),
      title: 'Untitled Note',
      content: '',
      updatedAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const handleDeleteNote = (id: string) => {
    if (notes.length <= 1) return;
    const remaining = notes.filter((n) => n.id !== id);
    setNotes(remaining);
    setActiveNoteId(remaining[0].id);
  };

  const handleUpdateContent = (content: string) => {
    if (!activeNote) return;
    const firstLine = content.split('\n')[0].replace(/^[#\s]+/, '').trim();
    const title = firstLine || 'Untitled Note';
    setNotes(
      notes.map((n) =>
        n.id === activeNote.id ? { ...n, content, title, updatedAt: Date.now() } : n
      )
    );
  };

  const handleExport = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeNote.title.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 h-full flex bg-slate-950 select-none overflow-hidden">
      {/* Sidebar Note List */}
      <div className="w-64 border-r border-slate-800 flex flex-col bg-slate-900/40">
        <div className="p-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <FileText className="w-4 h-4 text-pink-400" />
            <span>Robail Notes</span>
          </div>
          <button
            onClick={handleCreateNote}
            className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={`p-2.5 rounded-xl cursor-pointer text-xs transition-colors flex items-center justify-between group ${
                note.id === activeNoteId
                  ? 'bg-slate-800 text-white font-medium shadow-xs'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="truncate flex-1 pr-2">
                <div className="truncate">{note.title}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {notes.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(note.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {activeNote ? (
          <>
            <div className="h-10 border-b border-slate-800 px-4 flex items-center justify-between bg-slate-900/30">
              <span className="text-xs font-semibold text-slate-200 truncate max-w-sm">
                {activeNote.title}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPreview(!isPreview)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  {isPreview ? <Edit3 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{isPreview ? 'Edit' : 'Preview'}</span>
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              {isPreview ? (
                <div className="max-w-2xl mx-auto prose prose-invert text-xs leading-relaxed select-text whitespace-pre-wrap font-sans text-slate-200">
                  {activeNote.content || 'Empty note...'}
                </div>
              ) : (
                <textarea
                  value={activeNote.content}
                  onChange={(e) => handleUpdateContent(e.target.value)}
                  placeholder="Start typing your thoughts in markdown..."
                  className="w-full h-full bg-transparent text-sm font-mono text-slate-100 outline-none resize-none select-text placeholder-slate-600"
                  autoFocus
                />
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
