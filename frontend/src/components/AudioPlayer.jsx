import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import colors from '@/constants/colors';
import { useStudy } from '@/context/StudyContext';
import { Pause, Play, Volume2 } from 'lucide-react';

const AudioPlayer = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = React.useRef(null);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const seekTime = e.target.value;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
      <div className="p-4 rounded-none border shadow-md" style={{ backgroundColor: colors.offWhite }}>
          <div style={{display:"flex", justifyContent:"space-between"}}>
      <h3 className="text-lg font-medium mb-3" style={{ color: colors.darkRed }}>
        Audio Recitation
          </h3>
          <div className="flex items-center space-x-2">
        <Volume2 size={16} style={{ color: colors.primaryRed }} />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-24 audio-slider"
          style={{
            height: '4px',
            background: `linear-gradient(to right, ${colors.primaryRed} 0%, ${colors.primaryRed} ${volume * 100}%, ${colors.lightBeige} ${volume * 100}%, ${colors.lightBeige} 100%)`
          }}
        />
              </div>
              </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={handlePlayPause}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: colors.primaryRed, color: 'white' }}
        >
          {isPlaying ? (
            <Pause size={18} />
          ) : (
            <Play size={18} className="ml-1" />
          )}
        </button>
        
        <div className="flex-1 flex items-center space-x-2">
          <span className="text-xs" style={{ color: '#634B2A' }}>
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 audio-slider"
            style={{
              height: '4px',
              background: `linear-gradient(to right, ${colors.darkRed} 0%, ${colors.darkRed} ${(currentTime / duration) * 100}%, ${colors.lightBeige} ${(currentTime / duration) * 100}%, ${colors.lightBeige} 100%)`
            }}
          />
          <span className="text-xs" style={{ color: '#634B2A' }}>
            {formatTime(duration)}
          </span>
        </div>
      </div>
      
      {/* Volume control section */}

      
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
};

export default AudioPlayer;