import mongoose, { Document, Schema } from 'mongoose'

export interface IQR extends Document {
  type: 'text' | 'link' | 'image' | 'video'
  content: string
  label: string
  qrDataUrl: string
  createdAt: Date
}

const QRSchema = new Schema<IQR>({
  type: {
    type: String,
    enum: ['text', 'link', 'image', 'video'],
    required: true
  },
  content: { type: String, required: true },
  label: { type: String, default: '' },
  qrDataUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<IQR>('QR', QRSchema)