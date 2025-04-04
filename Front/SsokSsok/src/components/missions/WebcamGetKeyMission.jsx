import React, { useEffect,  useRef,  useState } from "react";
import { useTrackingCore } from "../../hooks/useTrackingCore";
import { captureWithVideoOverlay } from "../../utils/captureWithVideoOverlay";
import { useHandPose } from "../../hooks/useHandPose";
import CountdownOverlay from "../webcam/CountdownOverlay";
import PhotoCaptureModal from "../webcam/PhotoCaptureModal";

const WebcamGetKeyMission = ({ onComplete, setStatusContent, missionProps, assets }) => {
    const videoRef = useRef(null);
    const missionRef = useRef(null);

    const [isHolding, setIsHolding] = useState(false);
    const [holdingStartTime, setHoldStartTime] = useState(null);
    const [missionMessage, setMissionMessage] = useState("");

    const { handLandmarks, showModal, previewUrl, handleSave, countdown, setShowModal } =
    useTrackingCore(videoRef, 1, captureWithVideoOverlay);

    const { getHandCenter, isHandOpen } = useHandPose(handLandmarks);

    const jailImg = missionProps.instructionImages?.[0]  // 철창이미지지
    const keyImg = missionProps.instructionImages?.[1]; // 키 이미지
    const HOLD_DURATION = 3000;  // 3초 

    useEffect(() => {
        const setupCam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true});
                if (videoRef.current) videoRef.current.srcObject = stream;
            } catch (err) {
                console.log("웹캠 접근 실패 : ", err)
            }
        };
        setupCam();
    }, []);

    useEffect(() => {
        const center = getHandCenter;
        if (isHandOpen && center) {
            if (!isHolding) {
                setIsHolding(true);
                setHoldStartTime(Date.now());
            } else if (Date.now() - holdingStartTime >= HOLD_DURATION) {
                setMissionMessage("✅ 열쇠 획득! 다음 페이지로 이동하세요.");
                onComplete?.();
                setIsHolding(false); // prevent re-trigger
            }
        } else {
            setIsHolding(false);
            setHoldStartTime(null);
        }
    }, [getHandCenter, isHandOpen]);

    useEffect(() => {
        if (!setStatusContent) return;
      
        const ui = (
          <div className="h-[7rem] flex items-center justify-center">
            {missionMessage ? (
              <div className="text-3xl text-center font-cafe24 font-bold text-green-700 animate-pulse">
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
      }, [missionMessage, isHolding]);
      
    
      return (
        <div id="capture-container" ref={missionRef} className="relative w-[54rem] aspect-video torn-effect mt-6 mb-3 overflow-hidden">
          <video ref={videoRef} autoPlay muted className="w-full h-full object-cover scale-x-[-1]" />
          {countdown !== null && <CountdownOverlay count={countdown} />}

           {/* 🔒 철창 오버레이 - 항상 맨 위 */}
            {!missionMessage && assets[jailImg] && (
            <img
                src={assets[jailImg]}
                alt="jail"
                className="absolute inset-0 w-full h-full object-cover z-[40] pointer-events-none"
            />
            )}
    
          {/* 열쇠 이미지 오버레이 */}
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
    
          <PhotoCaptureModal
            isOpen={showModal}
            previewUrl={previewUrl}
            onSave={handleSave}
            onClose={() => setShowModal(false)}
          />
        </div>
      );
    };
    

export default WebcamGetKeyMission;