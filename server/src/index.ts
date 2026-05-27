import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000'
}))
app.use(express.json({ limit: '10mb' }))

const MONGO_URI = process.env.MONGO_URI as string

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err: Error) => console.error('MongoDB error:', err.message))

import qrRoutes from './routes/qr'
app.use('/api/qr', qrRoutes)

const PORT = Number(process.env.PORT) || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))