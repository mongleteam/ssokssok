import React, { useEffect, useRef, useState } from "react";
import { useMicVolume } from "../../hooks/useMicVolume";
import speackIcon from "../../assets/images/speack_icon.png";
import { useTrackingCore } from "../../hooks/useTrackingCore";
import CountdownOverlay from "../webcam/captureCompositeImage";
import PhotoCaptureModal from "../webcam/PhotoCaptureModal";


const WebcamSilentMission = ({ onComplete, setStatusContent }) => {
  const videoRef = useRef(null);

  const {
    handLandmarks,
    showModal,
    countdown,
    previewUrl,
    setShowModal,
    handleSave,
  } = useTrackingCore(videoRef, 1);

  const volume = useMicVolume();
  const [isSuccess, setIsSuccess] = useState(false);
  const [quietDuration, setQuietDuration] = useState(0);
  const [missionStarted, setMissionStarted] = useState(false);
  const [overlayCount, setOverlayCount] = useState(3);
  const QUIET_THRESHOLD = 0.04;
  const REQUIRED_DURATION = 5000;
  const [missionMessage, setMissionMessage] = useState("");

  const secondsLeft = Math.max(0, Math.ceil((REQUIRED_DURATION - quietDuration) / 1000));

  const thumbHoldStart = useRef(null);
  const captureTriggered = useRef(false);


  useEffect(() => {
    if (!handLandmarks) return;
  
    const thumb = handLandmarks[4];
    const index = handLandmarks[8];
  
    const isThumbUp = thumb?.y < index?.y - 0.1;
  
    if (isThumbUp) {
      if (!thumbHoldStart.current) {
        thumbHoldStart.current = Date.now();
      } else {
        const elapsed = Date.now() - thumbHoldStart.current;
        if (elapsed >= 2000 && !captureTriggered.current) {
          captureTriggered.current = true;
          console.log("👍 엄지 2초 유지됨! 캡처 시작");
          // 캡처 실행은 useTrackingCore 내부에서 처리됨
        }
      }
    } else {
      thumbHoldStart.current = null;
      captureTriggered.current = false;
    }
  }, [handLandmarks]);
  

  useEffect(() => {
    const setupCam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("📷 웹캠 접근 실패:", err);
      }
    };
    setupCam();
  }, []);

  const volumeRef = useRef(volume);
  useEffect(() => {
    volumeRef.current = volume;
  }, []);

  useEffect(() => {
    if (!missionStarted) return;

    if (isSuccess) return;

    const interval = setInterval(() => {
      const currentVolume = volumeRef.current;
      if (currentVolume < QUIET_THRESHOLD) {
        setQuietDuration((prev) => prev + 100);
      } else {
        setQuietDuration(0);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [missionStarted, isSuccess]);




  useEffect(() => {
    if (quietDuration >= REQUIRED_DURATION && !isSuccess) {
      setIsSuccess(true);
      setMissionMessage("✅ 성공! 다음 페이지로 넘어가세요.")
      onComplete?.();
    }
  }, [quietDuration, isSuccess, onComplete]);

  useEffect(() => {
    if (!setStatusContent) return;
  
    const statusUI = (
      <div className="flex flex-col items-center justify-center gap-4 mt-6">
        {isSuccess ? (
          <div className="text-3xl font-bold text-green-700 animate-pulse">
            ✅ 성공! 다음 페이지로 넘어가세요.
          </div>
        ) : (
          <div className="flex items-start justify-center gap-16">
            <div className="w-24 h-24 -mt-5 rounded-full border-4 border-black flex items-center justify-center text-5xl font-bold">
              {secondsLeft}
            </div>
            <div className="flex items-center gap-2">
              <img src={speackIcon} alt="소리 아이콘" className="w-14 h-14" />
              <div className="flex items-end gap-[7px] -mt-5">
                {Array.from({ length: 12 }, (_, i) => {
                  const level = Math.pow(i / 12, 2);
                  const isActive = volume >= level;
                  const barColor = isActive ? getBarColor(level) : "bg-white";
                  const height = 12 + i * 6;
                  return (
                    <div
                      key={i}
                      className={`${barColor} w-4 transition-all duration-100 rounded-sm`}
                      style={{ height: `${height}px` }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  
    setStatusContent(statusUI);
  }, []);
  

  useEffect(() => {
    if (overlayCount > 0) {
      const timer = setTimeout(() => {
        setOverlayCount((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setMissionStarted(true);
    }
  }, [overlayCount]);

  const getBarColor = (level) => {
    if (level < 0.1) return "bg-green-500";
    if (level < 0.6) return "bg-yellow-400";
    return "bg-red-600";
  };

  return (
    <div id="capture-container" className="relative w-[54rem] aspect-video torn-effect mt-4 mb-3 overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        className="w-full h-full object-cover scale-x-[-1]"
      />

      {!missionStarted && overlayCount > 0 && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
          <span className="text-white text-9xl font-bold animate-pingSlow">{overlayCount}</span>
        </div>
      )}

      {/* 📸 엄지 제스처 캡처용 모달 */}
      {countdown !== null && <CountdownOverlay count={countdown} />}
      <PhotoCaptureModal
        isOpen={showModal}
        previewUrl={previewUrl}
        onSave={handleSave}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default WebcamSilentMission;
