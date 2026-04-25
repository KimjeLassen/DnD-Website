import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Quest } from '../types';
import { questsAPI } from '../services/api';
import '../styles/entities.css';
import { useDM } from '../context/DMContext';

export function QuestsList() {
  const navigate = useNavigate();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newQuest, setNewQuest] = useState("");
  const { isDM } = useDM();

  useEffect(() => {
    loadQuests();
  }, []);

  const loadQuests = async () => {
    try {
      setLoading(true);
      const data = await questsAPI.getAll();
      setQuests(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quests");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuest.trim()) return;

    try {
      const created = await questsAPI.create({ name: newQuest });
      setQuests([...quests, created]);
      setNewQuest("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create quest");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await questsAPI.delete(id);
      setQuests(quests.filter((quest) => quest.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete quest");
    }
  };

  if (loading) return <div>Loading quests...</div>;

  return (
    <div className="entities-container">
      <h2>Quests</h2>

      {error && <div className="error-message">{error}</div>}

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

      <div className="entities-list">
        {quests.length === 0 ? (
          <p>No quests yet. Create one to get started!</p>
        ) : (
          quests.map((quest) => (
            <div
              key={quest.id}
              className="entity-card quest-card"
              onClick={() => navigate(`/quests/${quest.id}`)}
            >
              <div className="entity-header">
                <h3>{quest.name}</h3>
              {isDM &&(
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(quest.id);
                  }}
                  className="delete-btn"
                >
                  Delete
                </button>)}
              </div>
              <p className="quest-meta">
                Created: {new Date(quest.created_at).toLocaleDateString()}
              </p>
              <p className="click-hint">Click to view details</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
