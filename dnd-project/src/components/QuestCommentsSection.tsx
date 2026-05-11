import { useState, useEffect } from 'react';
import type { QuestNote } from '../types';
import { questCommentsAPI } from '../services/api';
import { useDM } from '../context/DMContext';
import '../styles/comments.css';

interface QuestNotesSectionProps {
  questId: string;
}

export function QuestCommentsSection({ questId }: QuestNotesSectionProps) {
  const [notes, setNotes] = useState<QuestNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const { isDM } = useDM();

  useEffect(() => {
    loadNotes();
  }, [questId]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await questCommentsAPI.getByQuestId(questId);
      setNotes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    try {
      setIsSubmitting(true);
      const newNote = await questCommentsAPI.create(questId, newNoteText);
      setNotes([newNote, ...notes]);
      setNewNoteText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add note');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateNote = async (noteId: string) => {
    if (!editingText.trim()) return;

    try {
      setIsSubmitting(true);
      const updatedNote = await questCommentsAPI.update(questId, noteId, editingText);
      setNotes(notes.map(n => n.id === noteId ? updatedNote : n));
      setEditingId(null);
      setEditingText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update note');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await questCommentsAPI.delete(questId, noteId);
      setNotes(notes.filter(n => n.id !== noteId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
    }
  };

  const startEditing = (note: QuestNote) => {
    setEditingId(note.id);
    setEditingText(note.text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingText('');
  };

  if (loading) {
    return <div className="notes-section"><div className="loading">Loading notes...</div></div>;
  }

  return (
    <div className="notes-section">
      <h2>Player Notes</h2>

      {error && <div className="error-message notes-error">{error}</div>}

      <form onSubmit={handleAddNote} className="note-form">
        <textarea
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          placeholder="Add a note..."
          rows={3}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="btn-submit-note"
          disabled={!newNoteText.trim() || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Note'}
        </button>
      </form>

      <div className="notes-list">
        {notes.length === 0 ? (
          <p className="no-notes">No notes yet.</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="note-card">
              {editingId === note.id ? (
                <div className="note-edit-form">
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    rows={3}
                    disabled={isSubmitting}
                  />
                  <div className="note-edit-actions">
                    <button
                      onClick={() => handleUpdateNote(note.id)}
                      className="btn-save-note"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="btn-cancel-note"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="note-header">
                    <span className="note-date">
                      {new Date(note.created_at).toLocaleDateString()} at {new Date(note.created_at).toLocaleTimeString()}
                    </span>
                    {note.updated_at !== note.created_at && (
                      <span className="note-edited">(edited)</span>
                    )}
                    <span className= "note-date">{note.user_name}</span>
                  </div>
                  <p className="note-text">{note.text}</p>
                  {isDM && (
                    <div className="note-actions">
                      <button
                        onClick={() => startEditing(note)}
                        className="btn-edit-note"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="btn-delete-note"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
