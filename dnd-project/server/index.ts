import cors from 'cors'
import express, { type Request, type Response } from 'express'
import { dbConfig } from './db'
import rolesRouter from './routes/roles'
import usersRouter from './routes/users'
import questsRouter from './routes/quests'
import questStepsRouter from './routes/questSteps'
import charactersRouter from './routes/characters'
import npcsRouter from './routes/npcs'
import itemsRouter from './routes/items'
import questRewardsRouter from './routes/questRewards'
import questCommentsRouter from './routes/questComments'

const app = express()
const PORT = Number(process.env.PORT) || 3001

app.use(cors({ origin: true }))
app.use(express.json())

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ ok: true, service: 'dnd-project-api' })
})

// API Routes
app.use('/api/roles', rolesRouter)
app.use('/api/users', usersRouter)
app.use('/api/quests', questsRouter)
app.use('/api/quest-steps', questStepsRouter)
app.use('/api/characters', charactersRouter)
app.use('/api/npcs', npcsRouter)
app.use('/api/items', itemsRouter)
app.use('/api/quest-rewards', questRewardsRouter)
app.use('/api/quest-comments', questCommentsRouter)

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
