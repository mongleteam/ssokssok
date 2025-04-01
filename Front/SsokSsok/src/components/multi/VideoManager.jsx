import React, { useEffect, useState, useRef } from "react";
import { OpenVidu } from "openvidu-browser";
import VideoPlayer from "./VideoPlayer";
import { getTokenFromServer } from "../../services/openviduApi";

const VideoManager = ({ roomId, userName }) => {
  const [OV, setOV] = useState(null);
  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);

  const subscribedConnectionIds = useRef(new Set()); // ✅ 중복 구독 방지용
  const alreadyInitialized = useRef(false);


  useEffect(() => {
    const initSession = async () => {
        if (alreadyInitialized.current) return;
        alreadyInitialized.current = true;  

      const OVInstance = new OpenVidu();
      setOV(OVInstance);

      const session = OVInstance.initSession();

      session.off("streamCreated"); // 혹시 남아있는 리스너 제거

      // ✅ 1. 상대방 스트림 수신
      session.on("streamCreated", (event) => {
        const connectionId = event.stream.connection.connectionId;

        if (subscribedConnectionIds.current.has(connectionId)) {
          console.log("이미 구독한 connection입니다:", connectionId);
          return;
        }

        subscribedConnectionIds.current.add(connectionId);
        console.log("Subscribing to", connectionId);

        const subscriber = session.subscribe(event.stream, undefined);
        setSubscribers((prev) => [...prev, subscriber]);
      });

      // 2. 상대방 스트림 제거
      session.on("streamDestroyed", (event) => {
        const leavingStream = event.stream.streamManager;
        setSubscribers((prev) => prev.filter((s) => s !== leavingStream));
      });

      // 3. 예외 핸들링
      session.on("exception", (exception) => {
        console.warn("OpenVidu Exception:", exception);
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
        subscribedConnectionIds.current.clear(); // ✅ 클린업도 함께
        alreadyInitialized.current = false; // 🔁 다시 진입 시 init 허용
      }
    };
  }, [roomId, userName]);

  return (
    <div className="flex flex-col space-y-4">
      {/* 본인 영상 */}
      {publisher && (
        <div>
          <p className="text-center font-semibold">{userName}(나)</p>
          <VideoPlayer streamManager={publisher} isPublisher={true}/>
        </div>
      )}

      {/* 상대방 영상 */}
      {subscribers.map((sub) => (
        <div key={sub.stream.connection.connectionId}>
          <p className="text-center font-semibold">
            {/* 내 역할과 다르면 친구 역할로 출력 */}
            {userName === "헨젤" ? "그레텔" : "헨젤"}(친구)
          </p>
          <VideoPlayer streamManager={sub} isPublisher={false}/>
        </div>
      ))}
    </div>
  );
};

export default VideoManager;
