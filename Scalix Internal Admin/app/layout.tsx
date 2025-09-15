import { AuthProvider } from '@/lib/auth-context'
import { NotificationProvider } from '@/lib/notification-context'
import { AuditProvider } from '@/lib/audit-context'
import { ThemeProvider } from '@/lib/theme-context'
import { ToastProvider } from '@/components/ui/toast'
import './globals.css'

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
      <body className="antialiased bg-background text-foreground">
        {/* Security Warning Banner */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-1 text-center text-sm font-medium shadow-lg border-b border-red-800">
          <div className="flex items-center justify-center space-x-2">
            <span className="font-bold animate-pulse">🔒</span>
            <span>INTERNAL SYSTEM - AUTHORIZED PERSONNEL ONLY</span>
          </div>
        </div>

        <ToastProvider>
          <ThemeProvider>
            <AuthProvider>
              <AuditProvider>
                <NotificationProvider>
                  {children}
                </NotificationProvider>
              </AuditProvider>
            </AuthProvider>
          </ThemeProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
