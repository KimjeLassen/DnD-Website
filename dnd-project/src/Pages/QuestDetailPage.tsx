import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Quest, QuestStep } from '../types';
import { questsAPI, questStepsAPI } from '../services/api';
import { QuestStepModal } from '../components/QuestStepModal';
import { QuestCommentsSection } from '../components/QuestCommentsSection';
import '../styles/questDetail.css';
import { useDM } from '../context/DMContext';

export function QuestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [steps, setSteps] = useState<QuestStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingStep, setIsCreatingStep] = useState(false);
  const { isDM } = useDM();

  useEffect(() => {
    const loadQuestDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const questData = await questsAPI.getById(id);
        setQuest(questData);

        const stepsData = await questStepsAPI.getByQuestId(id);
        setSteps(stepsData.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load quest details');
      } finally {
        setLoading(false);
      }
    };

    loadQuestDetails();
  }, [id]);

  const handleCreateStep = async (text: string, canSee: boolean) => {
    if (!id) return;

    try {
      setIsCreatingStep(true);
      const newStep = await questStepsAPI.create(id, text, canSee);
      setSteps([...steps, newStep].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)));
    } catch (err) {
      throw err;
    } finally {
      setIsCreatingStep(false);
    }
  };

  const handleDeleteStep = async (stepId: string) => {
    if (!id) return;

    try {
      await questStepsAPI.delete(id, stepId);
      setSteps(steps.filter(step => step.id !== stepId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete step');
    }
  };

  if (loading) return <div className="quest-detail-container"><div>Loading quest details...</div></div>;

  if (error) {
    return (
      <div className="quest-detail-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/quests')} className="back-button">
          ← Back to Quests
        </button>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="quest-detail-container">
        <div className="error-message">Quest not found</div>
        <button onClick={() => navigate('/quests')} className="back-button">
          ← Back to Quests
        </button>
      </div>
    );
  }

  return (
    <div className="quest-detail-container">
      <button onClick={() => navigate('/quests')} className="back-button">
        ← Back to Quests
      </button>

      <div className="quest-detail-header">
        <h1>{quest.name}</h1>
      </div>

      <div className="quest-steps-section">
        <div className="quest-steps-header">
          <h2>Quest Steps</h2>
          {isDM && (
          <button 
            className="btn-add-step"
            onClick={() => setIsModalOpen(true)}
          >
            + Add Step
          </button>)}
        </div>
        {steps.length === 0 ? (
          <p className="no-steps">No steps added to this quest yet.</p>
        ) : (
          <div className="steps-list">
            {steps.map((step, index) => (
              <div key={step.id} className="step-card">
                <div className="step-number">{index + 1}</div>
                <div className="step-content">
                  <p>{step.text}</p>
                  {step.can_see && <span className="visible-badge">Visible to Players</span>}
                </div>
                {isDM && (
                  <button 
                    className="btn-delete-step"
                    onClick={() => handleDeleteStep(step.id)}
                    title="Delete step"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
{isDM &&(
      <QuestStepModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateStep}
        isLoading={isCreatingStep}
      />)}

      {id && <QuestCommentsSection questId={id} />}
    </div>
  );
}
