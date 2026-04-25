import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { DMProvider } from './context/DMContext';
import { HomePage } from './Pages/HomePage';
import { QuestsPage } from './Pages/QuestsPage';
import { NPCsPage } from './Pages/NPCsPage';
import { CharactersPage } from './Pages/CharactersPage';
import { QuestDetailPage } from './Pages/QuestDetailPage';
import { DMPasswordModal } from './components/DMPasswordModal';
import './App.css';

function AppContent() {
  const navigate = useNavigate();
  const [isDMModalOpen, setIsDMModalOpen] = useState(false);

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">
          <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>D&D Manager</h1>
        </div>
        <ul className="nav-menu">
          <li>
            <button onClick={() => navigate('/')}>Home</button>
          </li>
          <li>
            <button onClick={() => navigate('/npcs')}>NPCs</button>
          </li>
          <li>
            <button onClick={() => navigate('/characters')}>Characters</button>
          </li>
          <li>
            <button onClick={() => navigate('/quests')}>Quests</button>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quests" element={<QuestsPage />} />
          <Route path="/quests/:id" element={<QuestDetailPage />} />
          <Route path="/npcs" element={<NPCsPage />} />
          <Route path="/characters" element={<CharactersPage />} />
        </Routes>
      </main>

      <footer className="footer" onClick={() => setIsDMModalOpen(true)} style={{ cursor: 'pointer' }}>
        <p>&copy; 2024 D&D Campaign Manager. Created with React & TypeScript.</p>
      </footer>

      <DMPasswordModal
        isOpen={isDMModalOpen}
        onClose={() => setIsDMModalOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <DMProvider>
        <AppContent />
      </DMProvider>
    </BrowserRouter>
  );
}

export default App;
