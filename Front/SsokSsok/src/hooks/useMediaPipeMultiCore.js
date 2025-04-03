import { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Holistic } from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import { captureCompositeImage } from "../utils/captureCompositeImage";
import { sendThumbImage } from "../apis/bookStartApi";
import { useMicVolume } from "./useMicVolume";

export const useMediaPipeMultiCore = (videoRef, {
  fairytalePk = 1,
  onMissionSuccess = () => {},
  missionHandler = () => {},
} = {}) => {
  const [handLandmarks, setHandLandmarks] = useState(null); // ✋ 손 랜드마크
  const [faceLandmarks, setFaceLandmarks] = useState(null); // 😄 얼굴 랜드마크
  const [previewUrl, setPreviewUrl] = useState(null);       // 📸 캡처 이미지 URL
  const [showModal, setShowModal] = useState(false);        // 📸 저장 모달 표시 여부
  const [countdown, setCountdown] = useState(null);         // 📸 캡처 카운트다운

  const captureTriggered = useRef(false);          // 📸 캡처 한 번만 수행 플래그
  const cameraRef = useRef(null);                  // 📷 미디어파이프용 카메라 객체
  const thumbHoldStart = useRef(null);             // 👍 엄지 시작 시간
  const holisticRef = useRef(null);                // 🧠 전체 관절 (Holistic) 객체
  const handsRef = useRef(null);                   // ✋ 손 추적 객체

  const micVolume = useMicVolume(); // 🎤 마이크 볼륨 측정용 훅

  // 📸 엄지 2초 유지 → 카운트다운 후 캡처
  const startCountdownAndCapture = async () => {
    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await new Promise((r) => setTimeout(r, 1000));
    }
    setCountdown(null);
    await new Promise((r) => setTimeout(r, 500));

    const { url } = await captureCompositeImage("capture-container");
    setPreviewUrl(url);
    setShowModal(true);
    captureTriggered.current = false;
  };

  // 📸 서버로 이미지 저장
  const handleSave = async () => {
    const res = await fetch(previewUrl);
    const blob = await res.blob();
    const formData = new FormData();
    formData.append("file", blob, "thumb-capture.png");
    formData.append("fairytalePk", fairytalePk);
    await sendThumbImage(formData);
    alert("✅ 저장 완료!");
    setShowModal(false);
    setPreviewUrl(null);
  };

  // 📌 유틸 함수 모음 -------------------------------------
  const checkThumbPose = (landmarks) => {
    const thumb = landmarks?.[4];
    const index = landmarks?.[8];
    return thumb && index && thumb.y < index.y - 0.1;
  };

  const checkMouthOpen = (landmarks) => {
    if (!landmarks || landmarks.length < 20) return false;
    const upperLip = landmarks[13];
    const lowerLip = landmarks[14];
    return Math.abs(upperLip.y - lowerLip.y) > 0.02;
  };

  const checkSilent = (volume, threshold = 0.01) => {
    return volume < threshold;
  };

  const isHandShaking = (() => {
    let prevX = null;
    let direction = null;
    let changeCount = 0;
    return (landmarks) => {
      if (!landmarks) return false;
      const wrist = landmarks[0];
      if (prevX === null) {
        prevX = wrist.x;
        return false;
      }
      const deltaX = wrist.x - prevX;
      const newDirection = deltaX > 0 ? "right" : "left";
      if (direction && newDirection !== direction) {
        changeCount++;
      }
      direction = newDirection;
      prevX = wrist.x;
      return changeCount >= 4;
    };
  })();
  // ----------------------------------------------------

  // 📦 미디어파이프 세팅 + 처리 루프 시작
  useEffect(() => {
    if (!videoRef.current || cameraRef.current) return;

    // ✋ 손 모듈
    const hands = new Hands({
      locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
    });

    // 🧠 전체 관절 모듈 (얼굴 + 손 + 몸)
    const holistic = new Holistic({
      locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${f}`,
    });

    handsRef.current = hands;
    holisticRef.current = holistic;

    // 손 추적 세팅
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.8,
      minTrackingConfidence: 0.7,
    });

    // 홀리스틱 세팅
    holistic.setOptions({
      modelComplexity: 1,
      refineFaceLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    // 📌 손 결과 수신 시 처리
    hands.onResults((res) => {
      const landmarks = res.multiHandLandmarks?.[0] || null;

      // ✋ 손 랜드마크 업데이트
      setHandLandmarks((prev) =>
        JSON.stringify(prev) !== JSON.stringify(landmarks) ? landmarks : prev
      );

      // ✅ 엄지척 인식 (4번 → 엄지, 8번 → 검지)
      // const thumb = landmarks?.[4];
      // const index = landmarks?.[8];

      if (checkThumbPose(landmarks)) {
        if (!thumbHoldStart.current) {
          thumbHoldStart.current = Date.now();
        } else {
          const elapsed = Date.now() - thumbHoldStart.current;
          if (elapsed >= 2000 && !captureTriggered.current) {
            captureTriggered.current = true;
            console.log("👍 엄지 2초 유지됨! 캡처 시작");
            startCountdownAndCapture();
          }
        }
      } else {
        thumbHoldStart.current = null;
      }
    });

    // 📌 얼굴 추적 결과 수신 시
    holistic.onResults((res) => {
      setFaceLandmarks(res.faceLandmarks || null);
    });

    // 🎥 카메라 + 분석 루프 시작
    cameraRef.current = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current?.readyState >= 2) {
          await hands.send({ image: videoRef.current });
          await holistic.send({ image: videoRef.current });

          // 🧩 외부에서 전달받은 미션 핸들러 호출
          missionHandler({
            handLandmarks,
            faceLandmarks,
            micVolume,
            utils: {
              checkMouthOpen,
              checkSilent,
              isHandShaking,
              checkThumbPose,
            },
            onSuccess: onMissionSuccess,
          });
        }
      },
      width: 640,
      height: 480,
    });

    cameraRef.current.start();

    return () => cameraRef.current.stop(); // 정리
  }, [videoRef]);

  return {
    handLandmarks,      // ✋ 손 추적 결과
    faceLandmarks,      // 😊 얼굴 추적 결과
    micVolume,          // 🎤 마이크 볼륨 (0 ~ 1)
    countdown,          // 📸 카운트다운 숫자
    previewUrl,         // 📸 캡처 미리보기 URL
    showModal,          // 📸 모달 상태
    setShowModal,       // 📸 모달 열고닫기 제어
    handleSave,         // 📸 저장 실행 함수
  };
};
