import { useState } from 'react';
import '../styles/modal.css';

interface QuestStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string, canSee: boolean) => Promise<void>;
  isLoading?: boolean;
}

export function QuestStepModal({ isOpen, onClose, onSubmit, isLoading = false }: QuestStepModalProps) {
  const [stepText, setStepText] = useState('');
  const [canSee, setCanSee] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stepText.trim()) {
      setError('Step text cannot be empty');
      return;
    }

    try {
      setError(null);
      await onSubmit(stepText, canSee);
      setStepText('');
      setCanSee(false);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create step');
    }
  };

  const handleClose = () => {
    setStepText('');
    setCanSee(false);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Quest Step</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="stepText">Step Text *</label>
            <textarea
              id="stepText"
              value={stepText}
              onChange={(e) => setStepText(e.target.value)}
              placeholder="Describe the quest step..."
              rows={5}
              disabled={isLoading}
            />
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="canSee"
              checked={canSee}
              onChange={(e) => setCanSee(e.target.checked)}
              disabled={isLoading}
            />
            <label htmlFor="canSee">Visible to Players</label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Step'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
