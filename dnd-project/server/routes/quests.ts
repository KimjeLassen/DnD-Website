import { Router, type Request, type Response } from 'express'
import { questQueries, questStepQueries, questNoteQueries } from '../queries'

const router = Router()

// GET all quests
router.get('/', async (_req: Request, res: Response) => {
  try {
    const quests = await questQueries.getAll()
    res.json(quests)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quests', details: error })
  }
})

// GET quest by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const quest = await questQueries.getById(id)
    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' })
    }
    res.json(quest)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quest', details: error })
  }
})

// POST create new quest
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name } = req.body
    if (!name) {
      return res.status(400).json({ error: 'Name is required' })
    }
    const quest = await questQueries.create(name)
    res.status(201).json(quest)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create quest', details: error })
  }
})

// PUT update quest
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name } = req.body
    if (!name) {
      return res.status(400).json({ error: 'Name is required' })
    }
    const quest = await questQueries.update(id, name)
    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' })
    }
    res.json(quest)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update quest', details: error })
  }
})

// DELETE quest
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deleted = await questQueries.delete(id)
    if (!deleted) {
      return res.status(404).json({ error: 'Quest not found' })
    }
    res.json({ message: 'Quest deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete quest', details: error })
  }
})

router.put('/:id/visibility', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { can_see } = req.body
    if (typeof can_see !== 'boolean') {
      return res.status(400).json({ error: 'can_see must be a boolean' })
    }
    const quest = await questQueries.setVisibility(id, can_see)
    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' })
    }
    res.json(quest)
    } catch (error) {
    res.status(500).json({ error: 'Failed to update quest visibility', details: error })
  }
})

// GET quest steps for a quest
router.get('/:id/steps', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const steps = await questStepQueries.getByQuestId(id)
    res.json(steps)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quest steps', details: error })
  }
})

// POST create quest step
router.post('/:id/steps', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { text, can_see, display_order } = req.body
    if (!text) {
      return res.status(400).json({ error: 'Text is required' })
    }
    const step = await questStepQueries.create(id, text, can_see, display_order)
    res.status(201).json(step)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create quest step', details: error })
  }
})

// DELETE quest step
router.delete('/:id/steps/:stepId', async (req: Request, res: Response) => {
  try {
    const { stepId } = req.params
    if (!stepId) {
      return res.status(400).json({ error: 'Quest step ID is required' })
    }
    const deleted = await questStepQueries.delete(stepId)
    if (!deleted) {
      return res.status(404).json({ error: 'Quest step not found' })
    }
    res.json({ message: 'Quest step deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete quest step', details: error })
  }
})

// GET quest notes
router.get('/:id/notes', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const notes = await questNoteQueries.getByQuestId(id)
    res.json(notes)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quest notes', details: error })
  }
})

// POST create quest note
router.post('/:id/notes', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { user_id, text } = req.body
    if (!user_id || !text) {
      return res.status(400).json({ error: 'User ID and text are required' })
    }
    const note = await questNoteQueries.create(id, user_id, text)
    res.status(201).json(note)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create quest note', details: error })
  }
})

export default router
