import { Router, type Request, type Response } from 'express'
import { roleQueries } from '../queries'

const router = Router()

// GET all roles
router.get('/', async (_req: Request, res: Response) => {
  try {
    const roles = await roleQueries.getAll()
    res.json(roles)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch roles', details: error })
  }
})

// GET role by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const role = await roleQueries.getById(id)
    if (!role) {
      return res.status(404).json({ error: 'Role not found' })
    }
    res.json(role)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch role', details: error })
  }
})

// POST create new role
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name } = req.body
    if (!name) {
      return res.status(400).json({ error: 'Name is required' })
    }
    const role = await roleQueries.create(name)
    res.status(201).json(role)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create role', details: error })
  }
})

// PUT update role
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name } = req.body
    if (!name) {
      return res.status(400).json({ error: 'Name is required' })
    }
    const role = await roleQueries.update(id, name)
    if (!role) {
      return res.status(404).json({ error: 'Role not found' })
    }
    res.json(role)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update role', details: error })
  }
})

// DELETE role
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deleted = await roleQueries.delete(id)
    if (!deleted) {
      return res.status(404).json({ error: 'Role not found' })
    }
    res.json({ message: 'Role deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete role', details: error })
  }
})

export default router
