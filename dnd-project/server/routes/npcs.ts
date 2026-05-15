import { Router, type Request, type Response } from 'express'
import { npcQueries, npcCommentQueries } from '../queries'
import { dmMiddleware } from '../middleware/auth'

const router = Router()

// GET all NPCs
router.get('/', async (_req: Request, res: Response) => {
  try {
    const npcs = await npcQueries.getAll()
    res.json(npcs)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch NPCs', details: error })
  }
})

// GET NPC by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const npc = await npcQueries.getById(id)
    if (!npc) {
      return res.status(404).json({ error: 'NPC not found' })
    }
    res.json(npc)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch NPC', details: error })
  }
})

// POST create new NPC (DM only)
router.post('/', dmMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, description, image } = req.body
    if (!name) {
      return res.status(400).json({ error: 'Name is required' })
    }
    const npc = await npcQueries.create(name, description, image)
    res.status(201).json(npc)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create NPC', details: error })
  }
})

// PUT update NPC (DM only)
router.put('/:id', dmMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, description, image } = req.body
    const npc = await npcQueries.update(id, name, description, image)
    if (!npc) {
      return res.status(404).json({ error: 'NPC not found' })
    }
    res.json(npc)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update NPC', details: error })
  }
})

// DELETE NPC (DM only)
router.delete('/:id', dmMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deleted = await npcQueries.delete(id)
    if (!deleted) {
      return res.status(404).json({ error: 'NPC not found' })
    }
    res.json({ message: 'NPC deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete NPC', details: error })
  }
})

// GET NPC comments
router.get('/:id/comments', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const comments = await npcCommentQueries.getByNpcId(id)
    res.json(comments)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments', details: error })
  }
})

// POST create NPC comment
router.post('/:id/comments', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { text } = req.body
    const user_id = req.user?.userId
    if (!user_id || !text) {
      return res.status(400).json({ error: 'Text is required' })
    }
    const comment = await npcCommentQueries.create(id, user_id, text)
    res.status(201).json(comment)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create comment', details: error })
  }
})

// DELETE NPC comment
router.delete('/:npcId/comments/:commentId', async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params
    const deleted = await npcCommentQueries.delete(commentId)
    if (!deleted) {
      return res.status(404).json({ error: 'Comment not found' })
    }
    res.json({ message: 'Comment deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment', details: error })
  }
})

export default router
