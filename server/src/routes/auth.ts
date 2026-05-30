import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import OTP from '../models/OTP'
import { sendOTP } from '../utils/email'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET as string

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

router.post('/send-otp', async (req: Request, res: Response) => {
    
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email required' })

    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ error: 'Email already in use' })

    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await OTP.deleteMany({ email })
    await OTP.create({ email, otp, expiresAt })
    await sendOTP(email, otp)
    console.log(`OTP for ${email}: ${otp}`)

    res.json({ success: true, message: 'OTP sent' })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})


router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password, otp } = req.body

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ error: 'All fields required' })
    }

    const otpRecord = await OTP.findOne({ email })
    if (!otpRecord) return res.status(400).json({ error: 'OTP not found. Request a new one.' })
    if (otpRecord.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' })
    if (otpRecord.expiresAt < new Date()) return res.status(400).json({ error: 'OTP expired' })

    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ error: 'Email already in use' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashed })

    await OTP.deleteMany({ email })

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// Signin
router.post('/signin', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

export default router