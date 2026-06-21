import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route'
import roomRoutes from './routes/room.route'

dotenv.config()

const app = express()



app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})
app.use('/auth', authRoutes)
app.use('/api', roomRoutes)
export default app;