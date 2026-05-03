import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { DMProvider, useDM } from './context/DMContext';
import { LoginPage } from './Pages/LoginPage';
import { HomePage } from './Pages/HomePage';
import { QuestsPage } from './Pages/QuestsPage';
import { NPCsPage } from './Pages/NPCsPage';
import { CharactersPage } from './Pages/CharactersPage';
import { QuestDetailPage } from './Pages/QuestDetailPage';
import { UsersPage } from './Pages/UsersPage';
import { DMPasswordModal } from './components/DMPasswordModal';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ProtectedDMRoute } from './components/ProtectedDMRoute';
import './App.css';

function AppContent() {
  const navigate = useNavigate();
  const { isLoggedIn, logout, currentUser, isDM } = useDM();
  const [isDMModalOpen, setIsDMModalOpen] = useState(false);

  // If not logged in, don't show navbar
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">
          <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>D&D</h1>
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
          {isDM && (
            <li>
              <button onClick={() => navigate('/users')}>Users</button>
            </li>
          )}
        </ul>
        <div className="nav-user">
          <span className="user-name">{currentUser?.name}</span>
          {isDM && <span className="dm-badge">DM</span>}
          <button className="logout-button" onClick={() => {
            logout();
            navigate('/login');
          }}>Logout</button>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />
          <Route path="/quests" element={<ProtectedRoute element={<QuestsPage />} />} />
          <Route path="/quests/:id" element={<ProtectedRoute element={<QuestDetailPage />} />} />
          <Route path="/npcs" element={<ProtectedRoute element={<NPCsPage />} />} />
          <Route path="/characters" element={<ProtectedRoute element={<CharactersPage />} />} />
          <Route path="/users" element={<ProtectedDMRoute element={<UsersPage />} />} />
          <Route path="*" element={<ProtectedRoute element={<HomePage />} />} />
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
