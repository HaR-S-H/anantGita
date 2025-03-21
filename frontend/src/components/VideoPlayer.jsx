import React, { useState, useRef, useEffect } from 'react';
import { Play, X } from 'lucide-react';

const VideoPlayer = ({ videoUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 20);
    
    return () => clearInterval(interval);
  }, []);

  const closeDialog = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Circular button with rotating effect */}
      <div className="flex justify-center items-center my-4">
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex justify-center items-center w-16 h-16 rounded-full bg-red-600 text-white shadow-lg transition-transform hover:scale-110 focus:outline-none"
        >
          {/* Circulating effect - fixed rotation */}
          <div
            className="absolute w-20 h-20 rounded-full border-2 border-red-400"
            style={{
              borderTopColor: '#f87171', /* red-400 */
              transform: `rotate(${rotation}deg)`
            }}
          ></div>
          
          {/* Secondary circulating ring - fixed rotation */}
          <div
            className="absolute w-24 h-24 rounded-full border border-red-300"
            style={{
              borderBottomColor: '#ef4444', /* red-500 */
              transform: `rotate(${-rotation * 0.7}deg)`
            }}
          ></div>
          
          {/* Inner circle with icon */}
          <div className="relative z-10">
            <Play size={24} fill="white" />
          </div>
        </button>
      </div>

      {/* Video Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-90"
            onClick={closeDialog}
          />
          
          {/* Video Container */}
          <div className="relative w-full max-w-4xl max-h-[80vh] bg-black rounded-lg overflow-hidden z-10">
            {/* Close button */}
            <button
              onClick={closeDialog}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors z-20"
            >
              <X size={20} />
            </button>
            
            {/* Video element with native controls */}
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-auto max-h-[80vh] object-contain"
              controls
              controlsList="nodownload"
              preload="metadata"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default VideoPlayer;