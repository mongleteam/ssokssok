// VideoPlayer.jsx
// 개별 영상 담당 (프레젠테이셔널)
import React, { useEffect, useRef } from 'react';

const VideoPlayer = ({ streamManager, isPublisher, className = "" }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (streamManager && videoRef.current) {
      videoRef.current.innerHTML = '';
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  if (!streamManager) return null;

  return (
    <div className="overflow-hidden">
      <video
        autoPlay
        playsInline
        ref={videoRef}
        muted={isPublisher}
        className={`transform ${className}`}
        style={{ width: '100%', height: 'auto', transform: 'scaleX(-1)' }}
      />
    </div>
  );
};

export default VideoPlayer;
