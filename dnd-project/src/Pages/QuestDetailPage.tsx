import { useParams, useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';
import type { Quest, QuestStep } from '../types';
import { questsAPI, questStepsAPI } from '../services/api';
import { QuestStepModal } from '../components/QuestStepModal';
import { QuestCommentsSection } from '../components/QuestCommentsSection';
import { Eye, EyeClosed } from 'lucide-react';
import { useAsyncEffect } from '../hooks/useAsyncEffect';
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
  const [canSeeQuest, setCanSeeQuest] = useState(false);
  const { isDM } = useDM();

  const loadQuestDetails = useCallback(
    async (isActive: () => boolean) => {
      if (!id) return;

      try {
        setLoading(true);
        const questData = await questsAPI.getById(id);
        if (!isActive()) return;

        setQuest(questData);
        setCanSeeQuest(questData.can_see);

        if (!questData.can_see && !isDM) {
          setSteps([]);
          setError(null);
          return;
        }

        const stepsData = await questStepsAPI.getByQuestId(id);
        if (!isActive()) return;

        setSteps(
          stepsData.sort(
            (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
          ),
        );
        setError(null);
      } catch (err) {
        if (!isActive()) return;
        setError(
          err instanceof Error ? err.message : 'Failed to load quest details',
        );
      } finally {
        if (isActive()) setLoading(false);
      }
    },
    [id, isDM],
  );

  useAsyncEffect(loadQuestDetails, [loadQuestDetails]);

  const handleCreateStep = async (text: string, canSee: boolean) => {
    if (!id) return;

    setIsCreatingStep(true);
    try {
      const newStep = await questStepsAPI.create(id, text, canSee);
      setSteps((prev) =>
        [...prev, newStep].sort(
          (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
        ),
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to create step';
      setError(message);
      throw err;
    } finally {
      setIsCreatingStep(false);
    }
  };

  const handleDeleteStep = async (stepId: string) => {
    if (!id) return;

    try {
      await questStepsAPI.delete(id, stepId);
      setSteps((prev) => prev.filter((step) => step.id !== stepId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete step');
    }
  };

  const handleChangeVisibility = async () => {
    if (!id) return;

    const previousVisibility = canSeeQuest;
    const newVisibility = !canSeeQuest;
    setCanSeeQuest(newVisibility);

    try {
      await questsAPI.changeVisibility(id, newVisibility);
    } catch (err) {
      setCanSeeQuest(previousVisibility);
      setError(
        err instanceof Error ? err.message : 'Failed to change visibility',
      );
    }
  };

  const handleStepVisibility = async (stepId: string) => {
    if (!id || !stepId) return;

    const step = steps.find((s) => s.id === stepId);
    if (!step) return;

    try {
      const updatedStep = await questStepsAPI.update(id, stepId, {
        can_see: !step.can_see,
      });
      setSteps((prev) =>
        prev.map((s) => (s.id === stepId ? updatedStep : s)),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to change step visibility',
      );
    }
  };

  if (loading) {
    return (
      <div className="quest-detail-container">
        <div>Loading quest details...</div>
      </div>
    );
  }

  if (error && !quest) {
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

  const visibleSteps = steps.filter((step) => isDM || step.can_see);

  return (
    <div className="quest-detail-container">
      <button onClick={() => navigate('/quests')} className="back-button">
        ← Back to Quests
      </button>

      {error && <div className="error-message">{error}</div>}

      {(canSeeQuest || isDM) && (
        <>
          <div className="quest-detail-header">
            <h1>
              {quest.name}
              {isDM && (
                <button
                  onClick={() => handleChangeVisibility()}
                  style={{ marginLeft: '12px' }}
                >
                  {canSeeQuest ? <Eye /> : <EyeClosed />}
                </button>
              )}
            </h1>
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
                </button>
              )}
            </div>
            {visibleSteps.length === 0 ? (
              <p className="no-steps">No steps added to this quest yet.</p>
            ) : (
              <div className="steps-list">
                {visibleSteps.map((step, index) => (
                  <div key={step.id} className="step-card">
                    <div className="step-number">{index + 1}</div>
                    <div className="step-content">
                      <p>{step.text}</p>
                    </div>
                    <div>
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
                    <div>
                      {isDM && (
                        <button
                          className="btn-visible-step"
                          onClick={() => handleStepVisibility(step.id)}
                          title="Toggle step visibility"
                        >
                          {step.can_see ? <Eye /> : <EyeClosed />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {!canSeeQuest && !isDM && (
        <p className="no-steps">This quest is not visible to players yet.</p>
      )}

      {isDM && (
        <QuestStepModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateStep}
          isLoading={isCreatingStep}
        />
      )}

      {id && (canSeeQuest || isDM) && <QuestCommentsSection questId={id} />}
    </div>
  );
}
