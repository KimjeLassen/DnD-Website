import { Router, type Request, type Response } from 'express'
import { userQueries } from '../queries'

const router = Router()

// GET all users
router.get('/', async (_req: Request, res: Response) => {
  try {
    const users = await userQueries.getAll()
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', details: error })
  }
})

// GET user by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = await userQueries.getById(id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user', details: error })
  }
})

// POST create new user
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, password, role_id } = req.body
    if (!name || !password || !role_id) {
      return res.status(400).json({ error: 'Name, password, and role_id are required' })
    }
    const user = await userQueries.create(name, password, role_id)
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user', details: error })
  }
})

// PUT update user
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, password, role_id } = req.body
    const user = await userQueries.update(id, name, password, role_id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user', details: error })
  }
})

// DELETE user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deleted = await userQueries.delete(id)
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user', details: error })
  }
})

export default router
