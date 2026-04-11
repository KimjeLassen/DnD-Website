import { Router, type Request, type Response } from 'express'
import { itemQueries } from '../queries'

const router = Router()

// GET all items
router.get('/', async (_req: Request, res: Response) => {
  try {
    const items = await itemQueries.getAll()
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items', details: error })
  }
})

// GET item by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const item = await itemQueries.getById(id)
    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }
    res.json(item)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item', details: error })
  }
})

// POST create new item
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, image, price, attunement, type } = req.body
    if (!name) {
      return res.status(400).json({ error: 'Name is required' })
    }
    const item = await itemQueries.create(name, description, image, price, attunement, type)
    res.status(201).json(item)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item', details: error })
  }
})

// PUT update item
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, description, image, price, attunement, type } = req.body
    const item = await itemQueries.update(id, name, description, image, price, attunement, type)
    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }
    res.json(item)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item', details: error })
  }
})

// DELETE item
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deleted = await itemQueries.delete(id)
    if (!deleted) {
      return res.status(404).json({ error: 'Item not found' })
    }
    res.json({ message: 'Item deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item', details: error })
  }
})

export default router
