import './globals.css'
import { Inter } from 'next/font/google'
import { Shield } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Scalix Internal Admin',
  description: 'Internal Administration Portal - Team Members Only',
  robots: 'noindex, nofollow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          {/* Security Warning Banner */}
          <div className="bg-red-600 text-white px-4 py-2 text-center text-sm">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>INTERNAL SYSTEM - AUTHORIZED PERSONNEL ONLY</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative">
            {children}
          </div>

          {/* Footer */}
          <footer className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between text-sm text-white/60">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Scalix Internal Administration</span>
                </div>
                <div>
                  Access logged and monitored
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
