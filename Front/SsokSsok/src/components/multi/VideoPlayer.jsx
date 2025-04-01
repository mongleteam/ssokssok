// VideoPlayer.jsx
// 개별 영상 담당 (프레젠테이셔널)
import React, { useEffect, useRef } from 'react';

const VideoPlayer = ({ streamManager, isPublisher }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (streamManager && videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  return (
    // <div className="rounded-xl overflow-hidden shadow-md">
    <div className="overflow-hidden shadow-md">
      <video
        autoPlay
        ref={videoRef}
        style={{ width: '100%', height: 'auto', transform: isPublisher ? "scaleX(-1)" : "none", }} // 좌우반전 추가
        muted={isPublisher} // 내 영상은 무조건 음소거
        playsInline
      />
    </div>
  );
};

export default VideoPlayer;
