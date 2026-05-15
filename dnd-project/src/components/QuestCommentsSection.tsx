import { useState, useCallback } from 'react';
import type { QuestNote } from '../types';
import { questCommentsAPI } from '../services/api';
import { useAsyncEffect } from '../hooks/useAsyncEffect';
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
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const { isDM } = useDM();

  const loadNotes = useCallback(
    async (isActive: () => boolean) => {
      try {
        setLoading(true);
        const data = await questCommentsAPI.getByQuestId(questId);
        if (!isActive()) return;
        setNotes(data);
        setError(null);
      } catch (err) {
        if (!isActive()) return;
        setError(err instanceof Error ? err.message : 'Failed to load notes');
      } finally {
        if (isActive()) setLoading(false);
      }
    },
    [questId],
  );

  useAsyncEffect(loadNotes, [loadNotes]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    try {
      setIsAdding(true);
      const newNote = await questCommentsAPI.create(questId, newNoteText);
      setNotes((prev) => [newNote, ...prev]);
      setNewNoteText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add note');
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateNote = async (noteId: string) => {
    if (!editingText.trim()) return;

    try {
      setIsEditing(true);
      const updatedNote = await questCommentsAPI.update(
        questId,
        noteId,
        editingText,
      );
      setNotes((prev) => prev.map((n) => (n.id === noteId ? updatedNote : n)));
      setEditingId(null);
      setEditingText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update note');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await questCommentsAPI.delete(questId, noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
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
    return (
      <div className="notes-section">
        <div className="loading">Loading notes...</div>
      </div>
    );
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
          disabled={isAdding}
        />
        <button
          type="submit"
          className="btn-submit-note"
          disabled={!newNoteText.trim() || isAdding}
        >
          {isAdding ? 'Saving...' : 'Save Note'}
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
                    disabled={isEditing}
                  />
                  <div className="note-edit-actions">
                    <button
                      onClick={() => handleUpdateNote(note.id)}
                      className="btn-save-note"
                      disabled={isEditing}
                    >
                      {isEditing ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="btn-cancel-note"
                      disabled={isEditing}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="note-header">
                    <span className="note-date">
                      {new Date(note.created_at).toLocaleDateString()} at{' '}
                      {new Date(note.created_at).toLocaleTimeString()}
                    </span>
                    {note.updated_at !== note.created_at && (
                      <span className="note-edited">(edited)</span>
                    )}
                    <span className="note-date">{note.user_name}</span>
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
