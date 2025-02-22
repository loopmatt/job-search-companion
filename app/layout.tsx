import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Job Search Companion',
  description: 'A mindful job search analysis tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}