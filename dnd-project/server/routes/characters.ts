import { Router, type Request, type Response } from 'express'
import { characterQueries, characterSecretQueries } from '../queries'

const router = Router()

// GET all characters
router.get('/', async (_req: Request, res: Response) => {
  try {
    const characters = await characterQueries.getAll()
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

// POST create new character
router.post('/', async (req: Request, res: Response) => {
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

// PUT update character
router.put('/:id', async (req: Request, res: Response) => {
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

// DELETE character
router.delete('/:id', async (req: Request, res: Response) => {
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

// GET character secrets
router.get('/:id/secrets', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const secrets = await characterSecretQueries.getByCharacterId(id)
    res.json(secrets)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch secrets', details: error })
  }
})

// POST create character secret
router.post('/:id/secrets', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { secret, written_by } = req.body
    if (!secret || !written_by) {
      return res.status(400).json({ error: 'Secret and written_by are required' })
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

// PUT update character secret
router.put('/:id/secrets/:secretId', async (req: Request, res: Response) => {
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

// DELETE character secret
router.delete('/:id/secrets/:secretId', async (req: Request, res: Response) => {
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
