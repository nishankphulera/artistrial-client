import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  audioUrl?: string;
  coverImage: string;
}

interface FloatingAudioPlayerProps {
  track: AudioTrack | null;
  isVisible: boolean;
  onClose: () => void;
  isDarkMode?: boolean; // Keep for compatibility but won't use
}

export const FloatingAudioPlayer: React.FC<FloatingAudioPlayerProps> = ({
  track,
  isVisible,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isDragging, setIsDragging] = useState<'progress' | 'volume' | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  // Convert duration string to seconds for progress calculation
  const durationInSeconds = track ? 
    parseInt(track.duration.split(':')[0]) * 60 + parseInt(track.duration.split(':')[1]) : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const updateProgress = useCallback((clientX: number) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const newTime = percentage * durationInSeconds;
      
      setCurrentTime(newTime);
      
      // Only update audio currentTime if we're not actively dragging
      // When dragging ends, we'll update the audio position
      if (!isDragging && audioRef.current) {
        audioRef.current.currentTime = newTime;
      }
    }
  }, [durationInSeconds, isDragging]);

  const updateVolume = useCallback((clientX: number) => {
    if (volumeRef.current && audioRef.current) {
      const rect = volumeRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const newVolume = percentage * 100;
      
      setVolume(newVolume);
      audioRef.current.volume = percentage;
    }
  }, []);

  const handleProgressInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) {
      updateProgress(e.clientX);
      // For clicks (not drags), immediately update audio position
      if (audioRef.current && progressRef.current) {
        const rect = progressRef.current.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const newTime = percentage * durationInSeconds;
        audioRef.current.currentTime = newTime;
      }
    }
  };

  const handleVolumeInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    updateVolume(e.clientX);
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging('progress');
    updateProgress(e.clientX);
  };

  const handleVolumeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging('volume');
    updateVolume(e.clientX);
  };

  const skipTime = (seconds: number) => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(durationInSeconds, currentTime + seconds));
      setCurrentTime(newTime);
      audioRef.current.currentTime = newTime;
    }
  };

  // Handle dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      if (isDragging === 'progress') {
        updateProgress(e.clientX);
      } else if (isDragging === 'volume') {
        updateVolume(e.clientX);
      }
    };

    const handleMouseUp = () => {
      // When dragging ends, update the audio position to match the visual position
      if (isDragging === 'progress' && audioRef.current) {
        audioRef.current.currentTime = currentTime;
      }
      setIsDragging(null);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, updateProgress, updateVolume, currentTime]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateTime = () => {
        // Only update currentTime state from audio if we're not actively dragging
        if (isDragging !== 'progress') {
          setCurrentTime(audio.currentTime);
        }
      };
      const handleEnded = () => setIsPlaying(false);
      
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [track, isDragging]);

  // Set initial volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [track]);

  if (!isVisible || !track) return null;

  const progressPercentage = durationInSeconds > 0 ? (currentTime / durationInSeconds) * 100 : 0;

  return (
    <>
      {/* Audio element for actual playback */}
      <audio
        ref={audioRef}
        src={track.audioUrl}
        preload="metadata"
      />

      {/* Floating Player */}
      <div className="fixed bottom-4 left-4 right-4 z-50 max-w-4xl mx-auto">
        {/* Progress Bar Container - outside main container to avoid clipping */}
        <div className="relative mb-0 group">
          <div 
            ref={progressRef}
            className="h-2 bg-muted cursor-pointer relative rounded-t-xl"
            onClick={handleProgressInteraction}
            onMouseDown={handleProgressMouseDown}
          >
            <div 
              className="h-full bg-[#FF8D28] transition-all duration-100 rounded-t-xl"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {/* Seek Handle - positioned absolutely outside the progress bar */}
          <div 
            className="absolute top-1/2 w-4 h-4 bg-[#FF8D28] rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border-2 border-white z-10 pointer-events-none"
            style={{ 
              left: `${progressPercentage}%`, 
              transform: 'translateX(-50%) translateY(-50%)'
            }}
          />
        </div>
        
        <div className="bg-card border border-border rounded-b-xl rounded-t-none shadow-2xl backdrop-blur-sm overflow-hidden">

          {/* Main Player Content */}
          <div className="p-4">
            <div className="flex items-center gap-4">
              {/* Track Info & Cover */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                  <img
                    src={track.coverImage}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-title text-sm font-medium truncate text-foreground">
                    {track.title}
                  </h4>
                  <p className="text-xs truncate text-muted-foreground font-body">
                    {track.artist}
                  </p>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-8 h-8 p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => skipTime(-10)}
                >
                  <SkipBack className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  className="w-10 h-10 rounded-full bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white p-0 shadow-lg"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="w-8 h-8 p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => skipTime(10)}
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              {/* Time Display */}
              <div className="text-xs font-mono text-muted-foreground font-body">
                {formatTime(currentTime)} / {track.duration}
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-2 w-24">
                <Volume2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 relative group">
                  <div 
                    ref={volumeRef}
                    className="h-2 bg-muted rounded-full cursor-pointer relative"
                    onClick={handleVolumeInteraction}
                    onMouseDown={handleVolumeMouseDown}
                  >
                    <div 
                      className="h-full bg-[#FF8D28] rounded-full transition-all duration-100"
                      style={{ width: `${volume}%` }}
                    />
                  </div>
                  {/* Volume Handle - positioned outside to avoid clipping */}
                  <div 
                    className="absolute top-1/2 w-3 h-3 bg-[#FF8D28] rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border border-white z-10 pointer-events-none"
                    style={{ 
                      left: `${volume}%`, 
                      transform: 'translateX(-50%) translateY(-50%)'
                    }}
                  />
                </div>
              </div>

              {/* Close Button */}
              <Button
                size="sm"
                variant="ghost"
                className="w-8 h-8 p-0 text-muted-foreground hover:text-foreground"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

