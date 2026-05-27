import { Router, Request, Response } from 'express'
import QRCode from 'qrcode'
import QR from '../models/QR'

const router = Router()

const QR_OPTIONS = {
  errorCorrectionLevel: 'M' as const,
  width: 300,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#ffffff'
  }
}

router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { type, content, label } = req.body

    if (!type || !content) {
      return res.status(400).json({ error: 'type and content required' })
    }

    const qrDataUrl = await QRCode.toDataURL(content, QR_OPTIONS)

    const qr = await QR.create({
      type,
      content,
      label: label || '',
      qrDataUrl
    })

    res.status(201).json({ success: true, data: qr })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/all', async (_req: Request, res: Response) => {
  try {
    const qrs = await QR.find().sort({ createdAt: -1 })
    res.json({ success: true, data: qrs })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await QR.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

export default router