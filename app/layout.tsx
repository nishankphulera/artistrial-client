import type { Metadata } from 'next'
import { ReactNode } from 'react'
import '../styles/globals.css'
import { SupabaseProvider } from '@/components/providers/SupabaseProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { AudioPlayerProvider } from '@/components/providers/AudioPlayerProvider'
import { ConditionalNavigation, ConditionalFooter } from '@/components/ConditionalNavigation'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Project - Artistrial',
  description: 'Artist collaboration and marketplace platform',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>
          <AuthProvider>
            <AudioPlayerProvider>
              <ConditionalNavigation />
              {children}
              <ConditionalFooter />
              <Toaster 
                position="top-right" 
                closeButton 
                richColors
                expand={true}
              />
            </AudioPlayerProvider>
          </AuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}