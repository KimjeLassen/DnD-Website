import { useState } from 'react';
import { useDM } from '../context/DMContext';
import '../styles/modal.css';

interface DMPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DM_PASSWORD = 'dm2026';

export function DMPasswordModal({ isOpen, onClose }: DMPasswordModalProps) {
  const { unlockDM } = useDM();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === DM_PASSWORD) {
      setError(null);
      setPassword('');
      unlockDM();
      onClose();
    } else {
      setError('Incorrect Dungeon Master password');
      setPassword('');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Dungeon Master Access</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="dm-password">Enter Dungeon Master Password:</label>
            <input
              id="dm-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="modal-footer">
            <button type="button" onClick={handleClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Unlock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
