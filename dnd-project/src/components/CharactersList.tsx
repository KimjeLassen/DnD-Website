import { useState, useCallback } from 'react';
import type { Character, User } from '../types';
import { charactersAPI, usersAPI } from '../services/api';
import { useAsyncEffect } from '../hooks/useAsyncEffect';
import '../styles/entities.css';
import { useDM } from '../context/DMContext';

export function CharactersList() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    user_id: '',
    notes: '',
  });
  const { isDM } = useDM();

  const loadData = useCallback(
    async (isActive: () => boolean) => {
      try {
        setLoading(true);
        const chars = await charactersAPI.getAll();
        if (!isActive()) return;
        setCharacters(chars);

        if (isDM) {
          const usrs = await usersAPI.getAll();
          if (!isActive()) return;
          setUsers(usrs);
        } else {
          setUsers([]);
        }

        setError(null);
      } catch (err) {
        if (!isActive()) return;
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        if (isActive()) setLoading(false);
      }
    },
    [isDM],
  );

  useAsyncEffect(loadData, [loadData]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharacter.name.trim() || !newCharacter.user_id) return;

    try {
      const created = await charactersAPI.create({
        name: newCharacter.name,
        user_id: newCharacter.user_id,
        notes: newCharacter.notes || undefined,
      });
      setCharacters((prev) => [...prev, created]);
      setNewCharacter({ name: '', user_id: '', notes: '' });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create character',
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await charactersAPI.delete(id);
      setCharacters((prev) => prev.filter((char) => char.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete character',
      );
    }
  };

  const getUserName = (userId: string) => {
    return users.find((u) => u.id === userId)?.name || 'Unknown';
  };

  if (loading) return <div style={{ color: 'black' }}>Loading characters...</div>;

  return (
    <div className="entities-container">
      <h2>Player Characters</h2>

      {error && <div className="error-message">{error}</div>}

      {isDM && (
        <form onSubmit={handleCreate} className="create-form">
          <input
            type="text"
            placeholder="Character Name"
            value={newCharacter.name}
            onChange={(e) =>
              setNewCharacter({ ...newCharacter, name: e.target.value })
            }
            required
          />
          <select
            value={newCharacter.user_id}
            onChange={(e) =>
              setNewCharacter({ ...newCharacter, user_id: e.target.value })
            }
            required
          >
            <option value="">Select a Player</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Character Notes"
            value={newCharacter.notes}
            onChange={(e) =>
              setNewCharacter({ ...newCharacter, notes: e.target.value })
            }
          />
          <button type="submit">Add Character</button>
        </form>
      )}

      <div className="entities-list">
        {characters.map((character) => (
          <div key={character.id} className="entity-card">
            <div className="entity-header">
              <h3>{character.name}</h3>
              {isDM && (
                <button
                  onClick={() => handleDelete(character.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              )}
            </div>
            <p>
              <strong>Player:</strong> {getUserName(character.user_id)}
            </p>
            {character.notes && (
              <p>
                <strong>Notes:</strong> {character.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
