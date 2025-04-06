// VideoPlayer.jsx
// 개별 영상 담당 (프레젠테이셔널)
import React, { useEffect, useRef } from 'react';

const VideoPlayer = ({ streamManager }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (streamManager && videoRef.current) {
      videoRef.current.innerHTML = '';
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  if (!streamManager) return null;

  return (
    <div className="rounded-xl overflow-hidden shadow-md">
      <video
        autoPlay
        ref={videoRef}
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
};

export default VideoPlayer;
