import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface VideoExpansionModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoData: {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    artist: string;
    timestamp: string;
    likes: number;
    comments: number;
    shares: number;
  };
  isDarkMode?: boolean;
}

export const VideoExpansionModal: React.FC<VideoExpansionModalProps> = ({
  isOpen,
  onClose,
  videoData,
  isDarkMode = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const updateTime = () => setCurrentTime(video.currentTime);
      const updateDuration = () => setDuration(video.duration);
      
      video.addEventListener('timeupdate', updateTime);
      video.addEventListener('loadedmetadata', updateDuration);
      video.addEventListener('ended', () => setIsPlaying(false));
      
      return () => {
        video.removeEventListener('timeupdate', updateTime);
        video.removeEventListener('loadedmetadata', updateDuration);
        video.removeEventListener('ended', () => setIsPlaying(false));
      };
    }
  }, [videoData]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const progressBar = e.currentTarget;
    if (video && progressBar) {
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;
      video.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const volumeBar = e.currentTarget;
    if (video && volumeBar) {
      const rect = volumeBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      video.volume = percentage;
      setVolume(percentage);
      setIsMuted(percentage === 0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="h-full flex items-center justify-center p-4">
        <div 
          ref={containerRef}
          className={`w-full max-w-4xl max-h-full ${isFullscreen ? 'fixed inset-0 max-w-none p-0' : ''}`}
        >
          <Card className={`${isDarkMode ? 'bg-[#171717] border-gray-700' : 'bg-white border-gray-200'} overflow-hidden ${isFullscreen ? 'rounded-none h-full' : 'rounded-xl'}`}>
            {/* Video Header */}
            <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div>
                <h3 className={`font-title text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {videoData.title}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  by {videoData.artist} • {videoData.timestamp}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative group">
              <video
                ref={videoRef}
                className={`w-full ${isFullscreen ? 'h-screen object-cover' : 'aspect-video object-contain'} bg-black`}
                poster={videoData.thumbnailUrl}
                onClick={togglePlayPause}
              >
                <source src={videoData.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Video Controls Overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Play/Pause Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="bg-black/50 hover:bg-black/70 text-white border-none w-16 h-16 rounded-full"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                  </Button>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  {/* Progress Bar */}
                  <div 
                    className="w-full h-2 bg-white/30 rounded-full cursor-pointer mb-4 relative group"
                    onClick={handleSeek}
                  >
                    <div 
                      className="h-full bg-[#FF8D28] rounded-full relative"
                      style={{ width: `${progressPercentage}%` }}
                    >
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-[#FF8D28] rounded-full opacity-0 group-hover:opacity-100 transition-opacity translate-x-1/2" />
                    </div>
                  </div>

                  {/* Control Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={togglePlayPause}
                        className="text-white hover:text-white/80"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleMute}
                          className="text-white hover:text-white/80"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </Button>
                        
                        <div 
                          className="w-20 h-1 bg-white/30 rounded-full cursor-pointer relative group"
                          onClick={handleVolumeChange}
                        >
                          <div 
                            className="h-full bg-white rounded-full relative"
                            style={{ width: `${volume * 100}%` }}
                          >
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity translate-x-1/2" />
                          </div>
                        </div>
                      </div>
                      
                      <span className="text-white text-sm font-mono">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="text-white hover:text-white/80"
                    >
                      {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Description */}
            {!isFullscreen && (
              <CardContent className="p-6">
                <p className={`text-sm leading-relaxed mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {videoData.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="p-0">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full" />
                          </div>
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {videoData.likes}
                          </span>
                        </div>
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="p-0">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {videoData.comments}
                          </span>
                        </div>
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="p-0">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {videoData.shares}
                          </span>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

