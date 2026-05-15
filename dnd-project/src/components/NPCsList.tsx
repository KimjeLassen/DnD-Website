import { useState, useCallback } from 'react';
import type { NPC } from '../types';
import { npcsAPI } from '../services/api';
import { useAsyncEffect } from '../hooks/useAsyncEffect';
import '../styles/entities.css';
import { useDM } from '../context/DMContext';

export function NPCsList() {
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNPC, setNewNPC] = useState({ name: '', description: '' });
  const { isDM } = useDM();

  const loadNPCs = useCallback(async (isActive: () => boolean) => {
    try {
      setLoading(true);
      const data = await npcsAPI.getAll();
      if (!isActive()) return;
      setNpcs(data);
      setError(null);
    } catch (err) {
      if (!isActive()) return;
      setError(err instanceof Error ? err.message : 'Failed to load NPCs');
    } finally {
      if (isActive()) setLoading(false);
    }
  }, []);

  useAsyncEffect(loadNPCs, [loadNPCs]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNPC.name.trim()) return;

    try {
      const created = await npcsAPI.create({
        name: newNPC.name,
        description: newNPC.description || undefined,
      });
      setNpcs((prev) => [...prev, created]);
      setNewNPC({ name: '', description: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create NPC');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await npcsAPI.delete(id);
      setNpcs((prev) => prev.filter((npc) => npc.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete NPC');
    }
  };

  if (loading) return <div style={{ color: 'black' }}>Loading NPCs...</div>;

  return (
    <div className="entities-container">
      <h2>Non-Player Characters</h2>

      {error && <div className="error-message">{error}</div>}

      {isDM && (
        <form onSubmit={handleCreate} className="create-form">
          <input
            type="text"
            placeholder="NPC Name"
            value={newNPC.name}
            onChange={(e) => setNewNPC({ ...newNPC, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={newNPC.description}
            onChange={(e) =>
              setNewNPC({ ...newNPC, description: e.target.value })
            }
          />
          <button type="submit">Add NPC</button>
        </form>
      )}

      <div className="entities-list">
        {npcs.map((npc) => (
          <div key={npc.id} className="entity-card">
            <div className="entity-header">
              <h3>{npc.name}</h3>
              {isDM && (
                <button
                  onClick={() => handleDelete(npc.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              )}
            </div>
            {npc.description && <p>{npc.description}</p>}
            {npc.image && <img src={npc.image} alt={npc.name} />}
          </div>
        ))}
      </div>
    </div>
  );
}
