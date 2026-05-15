import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Quest } from '../types';
import { questsAPI } from '../services/api';
import { useAsyncEffect } from '../hooks/useAsyncEffect';
import '../styles/entities.css';
import { useDM } from '../context/DMContext';

export function QuestsList() {
  const navigate = useNavigate();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newQuest, setNewQuest] = useState('');
  const { isDM } = useDM();

  const loadQuests = useCallback(
    async (isActive: () => boolean) => {
      try {
        setLoading(true);
        const data = isDM
          ? await questsAPI.getAll()
          : await questsAPI.getVisible();
        if (!isActive()) return;
        setQuests(data);
        setError(null);
      } catch (err) {
        if (!isActive()) return;
        setError(err instanceof Error ? err.message : 'Failed to load quests');
      } finally {
        if (isActive()) setLoading(false);
      }
    },
    [isDM],
  );

  useAsyncEffect(loadQuests, [loadQuests]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuest.trim()) return;

    try {
      const created = await questsAPI.create({ name: newQuest });
      setQuests((prev) => [...prev, created]);
      setNewQuest('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quest');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await questsAPI.delete(id);
      setQuests((prev) => prev.filter((quest) => quest.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete quest');
    }
  };

  if (loading) return <div style={{ color: 'black' }}>Loading quests...</div>;

  return (
    <div className="entities-container">
      <h2>Quests</h2>

      {error && <div className="error-message">{error}</div>}

      {isDM && (
        <form onSubmit={handleCreate} className="create-form">
          <input
            type="text"
            placeholder="Quest Name"
            value={newQuest}
            onChange={(e) => setNewQuest(e.target.value)}
            required
          />
          <button type="submit">Add Quest</button>
        </form>
      )}

      <div className="entities-list">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className="entity-card quest-card"
            onClick={() => navigate(`/quests/${quest.id}`)}
          >
            <div className="entity-header">
              <h3>{quest.name}</h3>
              {isDM && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(quest.id);
                  }}
                  className="delete-btn"
                >
                  Delete
                </button>
              )}
            </div>
            <p className="click-hint">Click to view details</p>
          </div>
        ))}
      </div>
    </div>
  );
}
