import { useEffect } from 'react';
import { OpenVidu } from 'openvidu-browser';
import { useVideoStore } from '../../../stores/videoStore';
import { fetchToken } from '../../../services/openvidu';

export default function SessionManager({ children }) {
  const { setSession, setMyStream, setOtherStream } = useVideoStore();

  useEffect(() => {
    const OV = new OpenVidu();
    const session = OV.initSession();

    session.on('streamCreated', ({ stream }) => {
      const subscriber = session.subscribe(stream, undefined);
      setOtherStream(subscriber);
    });

    const connect = async () => {
      const token = await fetchToken();
      await session.connect(token);

      const publisher = OV.initPublisher(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: '640x480',
        frameRate: 30,
      });

      session.publish(publisher);
      setSession(session);
      setMyStream(publisher);
    };

    connect();

    return () => {
      session.disconnect();
    };
  }, []);

  return children;
}