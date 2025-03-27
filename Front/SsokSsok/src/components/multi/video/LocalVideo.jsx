import { useEffect, useRef } from 'react';
import { useVideoStore } from '../../../stores/videoStore';

export default function LocalVideo() {
  const videoRef = useRef();
  const { myStream } = useVideoStore();

  useEffect(() => {
    if (myStream && videoRef.current) {
      myStream.addVideoElement(videoRef.current);
    }
  }, [myStream]);

  return <video autoPlay muted playsInline ref={videoRef} className="rounded-xl shadow w-[240px]" />;
}
