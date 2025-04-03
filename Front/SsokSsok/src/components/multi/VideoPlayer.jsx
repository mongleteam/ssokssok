// ✅ VideoPlayer.jsx
import React, { useEffect, useRef } from "react";

const VideoPlayer = ({ streamManager, videoRef }) => {
  const internalRef = useRef();

  useEffect(() => {
    const refToUse = videoRef || internalRef;
    if (streamManager && refToUse.current) {
      streamManager.addVideoElement(refToUse.current);
    }
  }, [streamManager]);

  return <video autoPlay ref={videoRef || internalRef} muted playsInline style={{ width: "100%", height: "auto" }} />;
};

export default VideoPlayer;
