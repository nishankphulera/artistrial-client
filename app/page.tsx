'use client'

import { HomePage } from '@/components/pages/HomePage'
import { useAudioPlayer } from '@/components/providers/AudioPlayerProvider'
import { FloatingAudioPlayer } from '@/components/shared/FloatingAudioPlayer'

export default function RootPage() {
  const { currentTrack, isPlayerVisible, closePlayer } = useAudioPlayer()

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <HomePage />
      </main>
      <FloatingAudioPlayer
        track={currentTrack}
        isVisible={isPlayerVisible}
        onClose={closePlayer}
      />
    </div>
  )
}