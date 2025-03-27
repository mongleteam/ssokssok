import { useEffect, useRef } from 'react';
import { useVideoStore } from '../../../stores/videoStore';

export default function RemoteVideo() {
  const videoRef = useRef();
  const { otherStream } = useVideoStore();

  useEffect(() => {
    if (otherStream && videoRef.current) {
      otherStream.addVideoElement(videoRef.current);
    }
  }, [otherStream]);

  return <video autoPlay playsInline ref={videoRef} className="rounded-xl shadow w-[240px]" />;
}