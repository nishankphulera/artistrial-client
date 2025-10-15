'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  audioUrl?: string;
  coverImage: string;
}

interface AudioPlayerContextType {
  currentTrack: AudioTrack | null;
  isPlayerVisible: boolean;
  playTrack: (track: AudioTrack) => void;
  closePlayer: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};

interface AudioPlayerProviderProps {
  children: ReactNode;
}

export const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  const playTrack = (track: AudioTrack) => {
    setCurrentTrack(track);
    setIsPlayerVisible(true);
  };

  const closePlayer = () => {
    setIsPlayerVisible(false);
    setCurrentTrack(null);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlayerVisible,
        playTrack,
        closePlayer,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

