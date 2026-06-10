import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AdsAudit — Google Ads Audit Tool',
  description: 'Find where your Google Ads budget is leaking. 80+ automated checks.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
