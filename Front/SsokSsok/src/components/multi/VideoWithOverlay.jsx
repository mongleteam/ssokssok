import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { OpenVidu } from "openvidu-browser";
import VideoPlayer from "./VideoPlayer";
import { getTokenFromServer } from "../../services/openviduApi";

const VideoWithOverlay = ({ roomId, userName, children, peerOverlay }) => {
  const [OV, setOV] = useState(null);
  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);

  const videoRef = useRef(null);
  const overlayRefs = useRef({}); // ✅ 모든 subscriber overlayRef 저장
  const subscribedConnectionIds = useRef(new Set());
  const alreadyInitialized = useRef(false);

  // ✅ 렌더링 이후 video 엘리먼트에 연결
  useLayoutEffect(() => {
    if (publisher && videoRef.current) {
      publisher.addVideoElement(videoRef.current);
    }
  }, [publisher]);

  useEffect(() => {
    const initSession = async () => {
      if (alreadyInitialized.current) return;
      alreadyInitialized.current = true;

      const OVInstance = new OpenVidu();
      OVInstance.setLogLevel("ERROR");
      setOV(OVInstance);

      const newSession = OVInstance.initSession();

      newSession.on("streamCreated", (event) => {
        const connectionId = event.stream.connection.connectionId;
        if (subscribedConnectionIds.current.has(connectionId)) return;
        subscribedConnectionIds.current.add(connectionId);

        const subscriber = newSession.subscribe(event.stream, undefined);
        setSubscribers((prev) => [...prev, subscriber]);
      });

      newSession.on("streamDestroyed", (event) => {
        const leavingStream = event.stream.streamManager;
        setSubscribers((prev) => prev.filter((s) => s !== leavingStream));
      });

      try {
        const token = await getTokenFromServer(roomId);
        await newSession.connect(token, { clientData: userName });

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

        newSession.publish(publisher);
        setPublisher(publisher);
        setSession(newSession);
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
  }, [roomId, userName, session]);

  return (
    <div className="relative w-full aspect-video">
      {/* 본인 영상 */}
      {publisher && (
        <div className="relative m-2">
          {/* <p className="text-center font-semibold font-cafe24">{userName}(나)</p> */}
          <div className="relative">
            <video
              autoPlay
              playsInline
              muted
              ref={videoRef}
              className="w-full h-auto rounded-3xl shadow-lg"
              style={{ transform: "scaleX(-1)" }}
            />
            <div className="absolute top-2 right-2 bg-white/50 text-black px-3 py-1 rounded-3xl text-base font-semibold shadow-md pointer-events-none z-50 font-cafe24">
              {userName}
            </div>
            {/* 오버레이 요소 */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {typeof children === "function" ? children(publisher) : children}
            </div>
          </div>
        </div>
      )}

      {/* 상대방 영상 */}
      {subscribers.map((sub) => {
        const connectionId = sub.stream.connection.connectionId;

        if (!overlayRefs.current[connectionId]) {
          overlayRefs.current[connectionId] = React.createRef();
        }

        return (
          <div key={connectionId} className="relative m-2">
            {/* <p className="text-center font-semibold font-cafe24">
              {userName === "헨젤" ? "그레텔" : "헨젤"}(친구)
            </p> */}
            <VideoPlayer 
              streamManager={sub}
              className="w-full h-auto rounded-3xl shadow-lg"
            />
            {/* 역할 오버레이 */}
            <div className="absolute top-2 right-2 bg-white/50 text-black px-3 py-1 rounded-3xl text-base font-semibold shadow-md pointer-events-none z-50 font-cafe24">
              {userName === "헨젤" ? "그레텔" : "헨젤"}
            </div>
            <div
              ref={overlayRefs.current[connectionId]}
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-20"
            >
              {typeof peerOverlay === "function" &&
                peerOverlay(sub, overlayRefs.current[connectionId])}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VideoWithOverlay;
