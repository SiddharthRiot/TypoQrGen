import path from 'path'
import dotenv from 'dotenv'
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

const app = express()

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://typo-qr-gen.vercel.app',
    process.env.CLIENT_URL || ''
  ].filter(Boolean)
}))
app.use(express.json({ limit: '10mb' }))

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('MongoDB connected'))
  .catch((err: Error) => console.error('MongoDB error:', err.message))

import qrRoutes from './routes/qr'
import authRoutes from './routes/auth'

app.use('/api/qr', qrRoutes)
app.use('/api/auth', authRoutes)

const PORT = Number(process.env.PORT) || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))