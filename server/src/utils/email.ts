import { Resend } from 'resend'

export async function sendOTP(email: string, otp: string) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  
  await resend.emails.send({
    from: 'QR Studio <onboarding@resend.dev>',
    to: email,
    subject: 'Your QR Studio OTP',
    html: `
      <div style="font-family: monospace; background: #080808; color: white; padding: 40px; border-radius: 12px;">
        <h1 style="color: #4ade80; font-size: 24px; margin-bottom: 8px;">QR Studio</h1>
        <p style="color: #737373; margin-bottom: 24px;">Your verification code:</p>
        <h2 style="font-size: 48px; letter-spacing: 12px; color: white; margin: 0;">${otp}</h2>
        <p style="color: #525252; margin-top: 24px; font-size: 12px;">Expires in 10 minutes. Do not share this code.</p>
      </div>
    `
  })
}