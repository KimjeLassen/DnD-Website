import { Router, type Request, type Response } from 'express'
import { questStepQueries, questRewardQueries } from '../queries'
import { dmMiddleware } from '../middleware/auth'

const router = Router()

// GET all quest steps
router.get('/', async (_req: Request, res: Response) => {
  try {
    const steps = await questStepQueries.getAll()
    res.json(steps)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quest steps', details: error })
  }
})

// GET quest step by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const step = await questStepQueries.getById(id)
    if (!step) {
      return res.status(404).json({ error: 'Quest step not found' })
    }
    res.json(step)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quest step', details: error })
  }
})

// PUT update quest step
router.put('/:id', dmMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { text, can_see, display_order } = req.body
    const step = await questStepQueries.update(id, text, can_see, display_order)
    if (!step) {
      return res.status(404).json({ error: 'Quest step not found' })
    }
    res.json(step)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update quest step', details: error })
  }
})

// DELETE quest step
router.delete('/:id', dmMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deleted = await questStepQueries.delete(id)
    if (!deleted) {
      return res.status(404).json({ error: 'Quest step not found' })
    }
    res.json({ message: 'Quest step deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete quest step', details: error })
  }
})

// GET rewards for quest step
router.get('/:id/rewards', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const rewards = await questRewardQueries.getByQuestStepId(id)
    res.json(rewards)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rewards', details: error })
  }
})

// POST add reward to quest step
router.post('/:id/rewards', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { reward_id, quantity } = req.body
    if (!reward_id) {
      return res.status(400).json({ error: 'Reward ID is required' })
    }
    const reward = await questRewardQueries.create(id, reward_id, quantity)
    res.status(201).json(reward)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reward', details: error })
  }
})

export default router
