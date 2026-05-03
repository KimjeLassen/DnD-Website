import { useState, useEffect } from 'react';
import type { Character, Campaign, User } from '../types';
import { charactersAPI, campaignsAPI, usersAPI } from '../services/api';
import '../styles/entities.css';
import { useDM } from '../context/DMContext';

export function CharactersList() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCharacter, setNewCharacter] = useState({
    name: "",
    user_id: "",
    campaign_id: "",
    notes: "",
  });
  const { isDM } = useDM();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [chars, camps, usrs] = await Promise.all([
        charactersAPI.getAll(),
        campaignsAPI.getAll(),
        usersAPI.getAll(),
      ]);
      setCharacters(chars);
      setCampaigns(camps);
      setUsers(usrs);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharacter.name.trim() || !newCharacter.user_id) return;

    try {
      const created = await charactersAPI.create({
        name: newCharacter.name,
        user_id: newCharacter.user_id,
        campaign_id: newCharacter.campaign_id || undefined,
        notes: newCharacter.notes || undefined,
      });
      setCharacters([...characters, created]);
      setNewCharacter({ name: "", user_id: "", campaign_id: "", notes: "" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create character",
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await charactersAPI.delete(id);
      setCharacters(characters.filter((char) => char.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete character",
      );
    }
  };

  const getCampaignName = (campaignId?: string) => {
    if (!campaignId) return "No Campaign";
    return campaigns.find((c) => c.id === campaignId)?.name || "Unknown";
  };

  const getUserName = (userId: string) => {
    return users.find((u) => u.id === userId)?.name || "Unknown";
  };

  if (loading) return <div style={{color: "black"}}>Loading characters...</div>;

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
          <select
            value={newCharacter.campaign_id}
            onChange={(e) =>
              setNewCharacter({ ...newCharacter, campaign_id: e.target.value })
            }
          >
            <option value="">Select a Campaign (Optional)</option>
            {campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
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
        {(
          characters.map((character) => (
            <div key={character.id} className="entity-card">
              <div className="entity-header">
                <h3>{character.name}</h3>
                <button
                  onClick={() => handleDelete(character.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
              <p>
                <strong>Player:</strong> {getUserName(character.user_id)}
              </p>
              <p>
                <strong>Campaign:</strong>{" "}
                {getCampaignName(character.campaign_id)}
              </p>
              {character.notes && (
                <p>
                  <strong>Notes:</strong> {character.notes}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
