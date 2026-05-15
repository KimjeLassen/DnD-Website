import { Router, type Request, type Response } from 'express'
import { questRewardQueries } from '../queries'
import { dmMiddleware } from '../middleware/auth'

const router = Router()

// GET all quest rewards
router.get('/', async (_req: Request, res: Response) => {
  try {
    const rewards = await questRewardQueries.getAll()
    res.json(rewards)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quest rewards', details: error })
  }
})

// GET quest reward by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const reward = await questRewardQueries.getById(id)
    if (!reward) {
      return res.status(404).json({ error: 'Quest reward not found' })
    }
    res.json(reward)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quest reward', details: error })
  }
})

// DELETE quest reward
router.delete('/:id', dmMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deleted = await questRewardQueries.delete(id)
    if (!deleted) {
      return res.status(404).json({ error: 'Quest reward not found' })
    }
    res.json({ message: 'Quest reward deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete quest reward', details: error })
  }
})

// PUT update quest reward
router.put('/:id', dmMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { quantity } = req.body
    if (!quantity) {
      return res.status(400).json({ error: 'Quantity is required' })
    }
    const reward = await questRewardQueries.update(id, quantity)
    if (!reward) {
      return res.status(404).json({ error: 'Quest reward not found' })
    }
    res.json(reward)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update quest reward', details: error })
  }
})

export default router
