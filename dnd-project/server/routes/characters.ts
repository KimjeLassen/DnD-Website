import { Router, type Request, type Response } from 'express'
import { characterQueries, characterSecretQueries } from '../queries'
import { dmMiddleware } from '../middleware/auth'

const router = Router()

// GET all characters (optional ?user_id= filter)
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.query.user_id as string | undefined
    const characters = userId
      ? await characterQueries.getByUserId(userId)
      : await characterQueries.getAll()
    res.json(characters)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch characters', details: error })
  }
})

// GET character by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const character = await characterQueries.getById(id)
    if (!character) {
      return res.status(404).json({ error: 'Character not found' })
    }
    res.json(character)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch character', details: error })
  }
})

// POST create new character (DM only)
router.post('/', dmMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, user_id, notes, campaign_id } = req.body
    if (!name || !user_id) {
      return res.status(400).json({ error: 'Name and user_id are required' })
    }
    const character = await characterQueries.create(name, user_id, notes, campaign_id)
    res.status(201).json(character)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create character', details: error })
  }
})

// PUT update character (DM only)
router.put('/:id', dmMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, notes, campaign_id } = req.body
    const character = await characterQueries.update(id, name, notes, campaign_id)
    if (!character) {
      return res.status(404).json({ error: 'Character not found' })
    }
    res.json(character)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update character', details: error })
  }
})

// DELETE character (DM only)
router.delete('/:id', dmMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deleted = await characterQueries.delete(id)
    if (!deleted) {
      return res.status(404).json({ error: 'Character not found' })
    }
    res.json({ message: 'Character deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete character', details: error })
  }
})

// GET character secrets (DM only)
router.get('/:id/secrets', dmMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const secrets = await characterSecretQueries.getByCharacterId(id)
    res.json(secrets)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch secrets', details: error })
  }
})

// POST create character secret (DM only)
router.post('/:id/secrets', dmMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { secret } = req.body
    const written_by = req.user?.userId
    if (!secret || !written_by) {
      return res.status(400).json({ error: 'Secret is required' })
    }
    const characterSecret = await characterSecretQueries.create(id, secret, written_by)
    res.status(201).json(characterSecret)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create secret', details: error })
  }
})

// GET character secret by ID
router.get('/:id/secrets/:secretId', async (req: Request, res: Response) => {
  try {
    const { secretId } = req.params
    const secret = await characterSecretQueries.getById(secretId)
    if (!secret) {
      return res.status(404).json({ error: 'Secret not found' })
    }
    res.json(secret)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch secret', details: error })
  }
})

// PUT update character secret (DM only)
router.put('/:id/secrets/:secretId', dmMiddleware, async (req: Request, res: Response) => {
  try {
    const { secretId } = req.params
    const { secret } = req.body
    if (!secret) {
      return res.status(400).json({ error: 'Secret is required' })
    }
    const updated = await characterSecretQueries.update(secretId, secret)
    if (!updated) {
      return res.status(404).json({ error: 'Secret not found' })
    }
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update secret', details: error })
  }
})

// DELETE character secret (DM only)
router.delete('/:id/secrets/:secretId', dmMiddleware, async (req: Request, res: Response) => {
  try {
    const { secretId } = req.params
    const deleted = await characterSecretQueries.delete(secretId)
    if (!deleted) {
      return res.status(404).json({ error: 'Secret not found' })
    }
    res.json({ message: 'Secret deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete secret', details: error })
  }
})

export default router
