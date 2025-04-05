import React, { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { useHandPose } from "../../../hooks/useHandPose";


const WebcamGetKey = ({
  missionData,
  assets,
  onSuccess,
  publisher,
  roomId,
  userName,
  from,
  setStatusContent,
}) => {
  const videoRef = useRef(null);
  const missionRef = useRef(null);

  // mediapipe Hands로부터 얻은 손 랜드마크를 상태로 관리
  const [handLandmarks, setHandLandmarks] = useState(null);
  const [isHolding, setIsHolding] = useState(false);
  const [holdingStartTime, setHoldStartTime] = useState(null);
  const [missionMessage, setMissionMessage] = useState("");

  // useHandPose 훅은 handLandmarks를 기반으로 손의 중심과 열림 여부를 계산합니다.
  const { getHandCenter, isHandOpen } = useHandPose(handLandmarks);

  // missionData에서 필요한 이미지 URL 추출
  const jailImg = missionData.instructionImages?.[0]; // 철창 이미지
  const keyImg = missionData.instructionImages?.[1]; // 열쇠 이미지
  const HOLD_DURATION = 3000; // 3초

  // mediapipe Hands와 Camera 초기화
  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
    });
    hands.onResults((results) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        setHandLandmarks(results.multiHandLandmarks[0]);
      } else {
        setHandLandmarks(null);
      }
    });

    let camera = null;
    if (videoRef.current) {
      camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await hands.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }

    return () => {
      if (camera) camera.stop();
      hands.close();
    };
  }, []);

  // publisher가 없다면 fallback으로 웹캠 스트림 설정
  useEffect(() => {
    if (!publisher) {
      const setupCam = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
          console.log("웹캠 접근 실패:", err);
        }
      };
      setupCam();
    }
  }, [publisher]);

  // 손의 열림 여부와 중심을 기반으로 열쇠 획득 로직 실행
  useEffect(() => {
    const center = getHandCenter;
    if (isHandOpen && center) {
      if (!isHolding) {
        setIsHolding(true);
        setHoldStartTime(Date.now());
      } else if (Date.now() - holdingStartTime >= HOLD_DURATION) {
        setMissionMessage("✅ 열쇠 획득! 다음 페이지로 이동하세요.");
         setTimeout(() => {
           onSuccess?.();
         }, 5000);
        setIsHolding(false); // 재실행 방지
      }
    } else {
      setIsHolding(false);
      setHoldStartTime(null);
    }
  }, [getHandCenter, isHandOpen, isHolding, holdingStartTime, onSuccess]);

  // 상태 UI 업데이트: 열쇠 획득 전/중/후에 보여줄 안내 메시지 구성
  useEffect(() => {
    if (!setStatusContent) return;
    const ui = (
      <div className="h-[7rem] flex items-center justify-center -mt-8">
        {missionMessage ? (
          <div className="text-2xl text-center font-cafe24 font-bold text-green-700 animate-pulse">
            {missionMessage}
          </div>
        ) : isHolding ? (
          <div className="text-2xl text-center font-cafe24 text-blue-700">
            ⏳ 열쇠 얻는 중...
          </div>
        ) : (
          <div className="text-2xl text-center font-cafe24 text-stone-800 flex items-center justify-center gap-2">
            {assets[keyImg] && (
              <img
                src={assets[keyImg]}
                alt="key"
                className="w-24 h-28 inline-block rotate-90"
              />
            )}
            열쇠를 잡아보세요.
          </div>
        )}
      </div>
    );
    setStatusContent(ui);
  }, [missionMessage, isHolding, setStatusContent, assets, keyImg]);

  return (
    <div>
      <video ref={videoRef} className="hidden" />
  
      {/* 철창 오버레이: 미션 메시지가 없을 때만 표시 */}
      {!missionMessage && assets[jailImg] && (
        <img
          src={assets[jailImg]}
          alt="jail"
          className="absolute inset-0 w-full h-full object-cover z-[40] pointer-events-none"
        />
      )}
      {/* 열쇠 이미지 오버레이: 손이 열리고 중심 좌표가 있으면 표시 */}
      {isHandOpen && getHandCenter && assets[keyImg] && (
        <img
          src={assets[keyImg]}
          alt="key"
          className="absolute w-40 h-50 z-30 pointer-events-none"
          style={{
            left: `${(1 - getHandCenter.x) * 100}%`,
            top: `${getHandCenter.y * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </div>
  );
};

export default WebcamGetKey;
