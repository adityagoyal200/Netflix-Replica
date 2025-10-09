import React, { useRef, useState, useEffect } from 'react';
import { 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon,
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
  muted?: boolean;
  loop?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  autoPlay = false,
  className = "",
  muted = false,
  loop = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(muted ? 0 : 0.7);
  const [isMuted, setIsMuted] = useState(muted);
  const [showControls, setShowControls] = useState(!autoPlay);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [currentQuality, setCurrentQuality] = useState('auto');
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Quality options - for demo purposes, we'll use the same source but add quality parameters
  const qualityOptions = [
    { label: 'Auto', value: 'auto', src: src },
    { label: '1080p', value: '1080', src: src + '?quality=1080' },
    { label: '720p', value: '720', src: src + '?quality=720' },
    { label: '480p', value: '480', src: src + '?quality=480' },
    { label: '240p', value: '240', src: src + '?quality=240' }
  ];

  const speedOptions = [
    { label: '0.5x', value: 0.5 },
    { label: '0.75x', value: 0.75 },
    { label: '1x', value: 1 },
    { label: '1.25x', value: 1.25 },
    { label: '1.5x', value: 1.5 },
    { label: '2x', value: 2 }
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Initialize video properties
    video.muted = muted;
    video.volume = muted ? 0 : 0.7;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);
    const handleCanPlay = () => {
      if (autoPlay && !muted) {
        // For autoplay with sound, we need user interaction
        video.play().catch(() => {
          // If autoplay fails, set to muted and try again
          video.muted = true;
          setIsMuted(true);
          video.play();
        });
      }
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [autoPlay, muted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = volume;
    video.muted = isMuted;
  }, [volume, isMuted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play();
    } else {
      video.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = playbackRate;
  }, [playbackRate]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    // Mark that user has interacted
    setHasUserInteracted(true);
    showControlsTemporarily();

    if (!isPlaying) {
      // When starting playback, ensure we can play with sound if not muted
      if (!isMuted) {
        video.muted = false;
        setIsMuted(false);
      }
      video.play().catch((error) => {
        console.log('Play failed:', error);
        // If play fails, try muted
        if (!isMuted) {
          video.muted = true;
          setIsMuted(true);
          video.play();
        }
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const time = parseFloat(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
    showControlsTemporarily();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    // Mark that user has interacted
    setHasUserInteracted(true);
    showControlsTemporarily();
    
    // Enable sound after user interaction
    if (newVolume > 0 && isMuted) {
      video.muted = false;
      setIsMuted(false);
    }
    
    console.log('Volume changed to:', newVolume, 'Muted:', newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    // Mark that user has interacted
    setHasUserInteracted(true);
    showControlsTemporarily();

    if (isMuted) {
      setVolume(0.7);
      setIsMuted(false);
      video.muted = false;
    } else {
      setIsMuted(true);
      video.muted = true;
    }
  };

  const handleVideoClick = () => {
    setHasUserInteracted(true);
    togglePlay();
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const hideControls = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(false);
  };

  const skipTime = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
    showControlsTemporarily();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleQualityChange = (quality: string) => {
    const video = videoRef.current;
    if (!video) return;

    const qualityOption = qualityOptions.find(opt => opt.value === quality);
    if (qualityOption) {
      const currentTime = video.currentTime;
      const wasPlaying = !video.paused;
      
      video.src = qualityOption.src;
      video.load();
      
      video.addEventListener('loadeddata', () => {
        video.currentTime = currentTime;
        if (wasPlaying) {
          video.play().catch(() => {
            // If play fails, try muted
            video.muted = true;
            setIsMuted(true);
            video.play();
          });
        }
      }, { once: true });
    }
    
    setCurrentQuality(quality);
    setShowSettings(false);
    console.log('Quality changed to:', quality);
  };

  const handleSpeedChange = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;

    // Mark that user has interacted
    setHasUserInteracted(true);
    
    setPlaybackRate(speed);
    video.playbackRate = speed;
    setShowSettings(false);
    console.log('Speed changed to:', speed, 'x');
  };

  return (
    <div 
      className={`relative group ${className}`}
      onMouseEnter={showControlsTemporarily}
      onMouseLeave={hideControls}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        preload="metadata"
        onClick={handleVideoClick}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Controls Overlay */}
      <div 
        className={`absolute inset-0 bg-black bg-opacity-30 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Unmute Button - Show when muted and user hasn't interacted */}
        {isMuted && !hasUserInteracted && (
          <div className="absolute top-4 right-4">
            <button
              onClick={toggleMute}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
            >
              <SpeakerXMarkIcon className="w-5 h-5" />
              <span>Click to unmute</span>
            </button>
          </div>
        )}

        {/* Center Play/Pause Button - Only show when not playing or when controls are shown */}
        {(!isPlaying || showControls) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="bg-black bg-opacity-50 rounded-full p-4 hover:bg-opacity-70 transition-all"
            >
              {isPlaying ? (
                <PauseIcon className="w-12 h-12 text-white" />
              ) : (
                <PlayIcon className="w-12 h-12 text-white" />
              )}
            </button>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #e50914 0%, #e50914 ${(currentTime / duration) * 100}%, #666 ${(currentTime / duration) * 100}%, #666 100%)`
              }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isPlaying ? (
                  <PauseIcon className="w-6 h-6" />
                ) : (
                  <PlayIcon className="w-6 h-6" />
                )}
              </button>

              {/* Skip Buttons */}
              <button
                onClick={() => skipTime(-10)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <BackwardIcon className="w-6 h-6" />
              </button>
              <button
                onClick={() => skipTime(10)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <ForwardIcon className="w-6 h-6" />
              </button>

              {/* Volume Control */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <SpeakerXMarkIcon className="w-6 h-6" />
                  ) : (
                    <SpeakerWaveIcon className="w-6 h-6" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Time Display */}
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Settings Button */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <Cog6ToothIcon className="w-6 h-6" />
                </button>

                {/* Settings Dropdown */}
                {showSettings && (
                  <div className="absolute bottom-8 right-0 bg-black bg-opacity-90 rounded-md p-4 min-w-[200px]">
                    {/* Quality Selection */}
                    <div className="mb-4">
                      <h3 className="text-white text-sm font-semibold mb-2">Quality</h3>
                      <div className="space-y-1">
                        {qualityOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleQualityChange(option.value)}
                            className={`w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                              currentQuality === option.value
                                ? 'bg-red-600 text-white'
                                : 'text-gray-300 hover:text-white hover:bg-gray-700'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Speed Selection */}
                    <div>
                      <h3 className="text-white text-sm font-semibold mb-2">Speed</h3>
                      <div className="space-y-1">
                        {speedOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleSpeedChange(option.value)}
                            className={`w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                              playbackRate === option.value
                                ? 'bg-red-600 text-white'
                                : 'text-gray-300 hover:text-white hover:bg-gray-700'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #e50914;
          cursor: pointer;
          border: 2px solid #fff;
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #e50914;
          cursor: pointer;
          border: 2px solid #fff;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;
