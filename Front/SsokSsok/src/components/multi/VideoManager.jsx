// ✅ VideoManager.jsx
import React, { useEffect, useState, useRef } from "react";
import { OpenVidu } from "openvidu-browser";
import VideoPlayer from "./VideoPlayer";
import { getTokenFromServer } from "../../services/openviduApi";

const VideoManager = ({ roomId, userName, onVideoRefReady }) => {
  const [OV, setOV] = useState(null);
  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);

  const subscribedConnectionIds = useRef(new Set());
  const alreadyInitialized = useRef(false);

  const myVideoRef = useRef(); // ✅ 내 영상 DOM

  useEffect(() => {
    const initSession = async () => {
      if (alreadyInitialized.current) return;
      alreadyInitialized.current = true;

      const OVInstance = new OpenVidu();
      setOV(OVInstance);

      const session = OVInstance.initSession();

      session.on("streamCreated", (event) => {
        const connectionId = event.stream.connection.connectionId;
        if (subscribedConnectionIds.current.has(connectionId)) return;

        subscribedConnectionIds.current.add(connectionId);
        const subscriber = session.subscribe(event.stream, undefined);
        setSubscribers((prev) => [...prev, subscriber]);
      });

      session.on("streamDestroyed", (event) => {
        const leavingStream = event.stream.streamManager;
        setSubscribers((prev) => prev.filter((s) => s !== leavingStream));
      });

      try {
        const token = await getTokenFromServer(roomId);
        await session.connect(token, { clientData: userName });

        const publisher = await OVInstance.initPublisherAsync(undefined, {
          audioSource: undefined,
          videoSource: undefined,
          publishAudio: true,
          publishVideo: true,
          resolution: "640x480",
          frameRate: 30,
          insertMode: "APPEND",
          mirror: false,
        });

        session.publish(publisher);
        setPublisher(publisher);
        setSession(session);
      } catch (error) {
        console.error("❌ OpenVidu 연결 실패:", error);
      }
    };

    initSession();

    return () => {
      if (session) {
        session.disconnect();
        setSession(null);
        setPublisher(null);
        setSubscribers([]);
        subscribedConnectionIds.current.clear();
        alreadyInitialized.current = false;
      }
    };
  }, [roomId, userName]);

  useEffect(() => {
    if (myVideoRef.current && onVideoRefReady) {
      onVideoRefReady(myVideoRef); // ✅ 외부에 비디오 ref 전달
    }
  }, [myVideoRef.current]);

  return (
    <div className="flex flex-col space-y-4">
      {publisher && (
        <div>
          <p className="text-center font-semibold">{userName}(나)</p>
          <VideoPlayer streamManager={publisher} videoRef={myVideoRef} />
        </div>
      )}

      {subscribers.map((sub) => (
        <div key={sub.stream.connection.connectionId}>
          <p className="text-center font-semibold">
            {userName === "헨젤" ? "그레텔" : "헨젤"}(친구)
          </p>
          <VideoPlayer streamManager={sub} />
        </div>
      ))}
    </div>
  );
};

export default VideoManager;
