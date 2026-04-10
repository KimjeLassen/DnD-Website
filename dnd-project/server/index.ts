import cors from 'cors'
import express, { type Request, type Response } from 'express'

const app = express()
const PORT = Number(process.env.PORT) || 3001

app.use(cors({ origin: true }))
app.use(express.json())

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ ok: true, service: 'dnd-project-api' })
})

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
