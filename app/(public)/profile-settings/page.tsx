'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProfileSettingsPage } from '@/components/pages/ProfileSettingsPage'
import { useAuth } from '@/components/providers/AuthProvider'

export default function ProfileSettingsRoute() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // Redirect to auth if not logged in
    if (!user) {
      router.push('/auth?mode=signin')
    }
  }, [user, router])

  // Show nothing while checking auth
  if (!user) {
    return null
  }

  return <ProfileSettingsPage isDashboardDarkMode={false} />
}

