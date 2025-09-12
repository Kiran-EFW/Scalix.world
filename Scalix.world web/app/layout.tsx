import type { Metadata } from 'next'
import '../styles/globals.css'
import { DevModeIndicator } from '@/components/auth/DevModeIndicator'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: 'Scalix - Local AI App Builder',
  description: 'Free, local, open-source AI app builder. Build AI applications with ease, no vendor lock-in.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
          <DevModeIndicator />
        </Providers>
      </body>
    </html>
  )
}