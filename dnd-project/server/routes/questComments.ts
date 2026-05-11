import { Router, type Request, type Response } from 'express'
import { questNoteQueries } from '../queries'
import { authMiddleware } from '../middleware/auth'

const router = Router()

// GET all comments for a quest
router.get('/:questId', async (req: Request, res: Response) => {
  try {
    const { questId } = req.params
    const comments = await questNoteQueries.getByQuestId(questId)
    res.json(comments)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quest comments', details: error })
  }
})

// GET a specific comment by ID
router.get('/:questId/comment/:commentId', async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params
    const comment = await questNoteQueries.getById(commentId)
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' })
    }
    res.json(comment)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comment', details: error })
  }
})

// POST create a new comment
router.post('/:questId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { questId } = req.params
    const { text } = req.body
    const userId = req.user?.userId

    if (!text || !userId) {
      return res.status(400).json({ error: 'Text and user ID are required' })
    }

    const comment = await questNoteQueries.create(questId, userId, text)
    res.status(201).json(comment)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create comment', details: error })
  }
})

// PUT update a comment
router.put('/:questId/comment/:commentId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params
    const { text } = req.body

    if (!text) {
      return res.status(400).json({ error: 'Text is required' })
    }

    const comment = await questNoteQueries.update(commentId, text)
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' })
    }
    res.json(comment)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update comment', details: error })
  }
})

// DELETE a comment
router.delete('/:questId/comment/:commentId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params
    const deleted = await questNoteQueries.delete(commentId)
    if (!deleted) {
      return res.status(404).json({ error: 'Comment not found' })
    }
    res.json({ message: 'Comment deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment', details: error })
  }
})

export default router
