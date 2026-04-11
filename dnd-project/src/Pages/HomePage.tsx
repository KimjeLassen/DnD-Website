import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="hero">
        <h1>🐉 D&D Campaign Manager</h1>
        <p>Manage your D&D worlds, quests, NPCs, and characters in one place</p>
      </div>
      <div className="home-grid">
        <div className="home-card" onClick={() => navigate('/npcs')}>
          <h2>NPCs</h2>
          <p>Create and manage Non-Player Characters</p>
        </div>
        <div className="home-card" onClick={() => navigate('/characters')}>
          <h2>Characters</h2>
          <p>Track player characters and their details</p>
        </div>
        <div className="home-card" onClick={() => navigate('/quests')}>
          <h2>Quests</h2>
          <p>Design and manage campaign quests</p>
        </div>
      </div>
    </div>
  );
}
