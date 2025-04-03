
// ✅ VideoManager.jsx
import React, { useEffect, useRef, useState } from "react";
import { OpenVidu } from "openvidu-browser";
import VideoPlayer from "./VideoPlayer";
import { getTokenFromServer } from "../../services/openviduApi";
import { useMediaPipeMultiCore } from "../../hooks/useMediaPipeMultiCore";
import { missionHandlerMap } from "../../utils/missionHandlerMap";

const VideoManagerWithMediaPipe = ({ roomId, userName, missionType, fairytalePk = 1, onMissionSuccess }) => {
  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const myVideoRef = useRef(null);

  const missionHandler = missionHandlerMap[missionType] || (() => {});
  const { showModal, previewUrl, countdown, setShowModal, handleSave } = useMediaPipeMultiCore(myVideoRef, { fairytalePk, onMissionSuccess, missionHandler });

  useEffect(() => {
    const initSession = async () => {
      const OV = new OpenVidu();
      const session = OV.initSession();

      session.on("streamCreated", (e) => {
        const subscriber = session.subscribe(e.stream, undefined);
        setSubscribers((prev) => [...prev, subscriber]);
      });

      session.on("streamDestroyed", (e) => {
        setSubscribers((subs) => subs.filter((s) => s !== e.stream.streamManager));
      });

      const token = await getTokenFromServer(roomId);
      await session.connect(token, { clientData: userName });
      const publisher = await OV.initPublisherAsync(undefined, {
        videoSource: undefined,
        audioSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: "640x480",
        frameRate: 30,
        insertMode: "APPEND",
        mirror: false,
      });

      session.publish(publisher);
      setSession(session);
      setPublisher(publisher);
    };

    initSession();
    return () => session?.disconnect();
  }, []);

  return (
    <div className="flex flex-col">
      {publisher && (
        <div>
          <p>{userName} (나)</p>
          <VideoPlayer streamManager={publisher} videoRef={myVideoRef} />
        </div>
      )}
      {subscribers.map((s) => (
        <div key={s.stream.connection.connectionId}>
          <p>친구</p>
          <VideoPlayer streamManager={s} />
        </div>
      ))}

      {showModal && previewUrl && (
        <div className="modal">
          <img src={previewUrl} alt="preview" />
          <button onClick={handleSave}>저장</button>
          <button onClick={() => setShowModal(false)}>닫기</button>
        </div>
      )}
      {countdown && <div className="countdown">{countdown}</div>}
    </div>
  );
};

export default VideoManagerWithMediaPipe;