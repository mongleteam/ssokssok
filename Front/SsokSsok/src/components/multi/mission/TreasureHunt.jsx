import React, { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { sendMessage } from "../../../services/socket";

const HOLD_DURATION = 3000; // 3초 머물기
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 360;

const TreasureHunt = ({ onSuccess, setStatusContent, missionData, assets, userName, roomId }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // 손가락 위치 관련 상태
  const [fingerPos, setFingerPos] = useState(null);
  const [hoveredDoor, setHoveredDoor] = useState(null);
  const [hoverStartTime, setHoverStartTime] = useState(null);
  const [selectedDoor, setSelectedDoor] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [showNotice, setShowNotice] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const doors = ["left", "mid", "right"];
  const [treasureDoor, setTreasureDoor] = useState(null);

  // 이미지 객체들을 미리 로드
  const [baseImgObj, setBaseImgObj] = useState(null);
  const [noticeImgObj, setNoticeImgObj] = useState(null);
  const [resultImgObj, setResultImgObj] = useState(null);

  useEffect(() => {
    const rand = Math.floor(Math.random() * 3);
    setTreasureDoor(doors[rand]);
  }, []);

  useEffect(() => {
    if (assets["page35_interaction.jpg"]) {
      const img = new Image();
      img.src = assets["page35_interaction.jpg"];
      img.onload = () => setBaseImgObj(img);
    }
  }, [assets]);

  useEffect(() => {
    if (assets["page35_interaction_notice.png"]) {
      const img = new Image();
      img.src = assets["page35_interaction_notice.png"];
      img.onload = () => setNoticeImgObj(img);
    }
  }, [assets]);

  useEffect(() => {
    if (resultImage) {
      const img = new Image();
      img.src = resultImage;
      img.onload = () => setResultImgObj(img);
    }
  }, [resultImage]);

  // Mediapipe Hands와 Camera 초기화
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
        const landmarks = results.multiHandLandmarks[0];
        // index finger tip (landmark[8])를 사용하여 손 위치 계산
        const finger = landmarks[8];
        const x = (1 - finger.x) * CANVAS_WIDTH;
        const y = finger.y * CANVAS_HEIGHT;
        setFingerPos({ x, y });
      } else {
        setFingerPos(null);
      }
    });

    let camera = null;
    if (videoRef.current) {
      camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await hands.send({ image: videoRef.current });
        },
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
      });
      camera.start();
    }
    return () => {
      if (camera) camera.stop();
      hands.close();
    };
  }, []);

  // fallback: 웹캠 스트림 직접 설정 (publisher 사용하지 않을 경우)
  useEffect(() => {
    if (!videoRef.current.srcObject) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => console.log("웹캠 접근 실패:", err));
    }
  }, []);

  // 도어 영역 계산: fingerPos를 이용해 left, mid, right 결정
  const getDoorZone = () => {
    if (!fingerPos) return null;
    const normalizedX = fingerPos.x / CANVAS_WIDTH;
    if (normalizedX < 0.33) return "left";
    if (normalizedX < 0.66) return "mid";
    return "right";
  };

  // 손가락 위치 감지: 3초 이상 머무르면 해당 문 선택
  useEffect(() => {
    if (!fingerPos || selectedDoor || isCompleted) return;
    const currentDoor = getDoorZone();
    if (currentDoor !== hoveredDoor) {
      setHoveredDoor(currentDoor);
      setHoverStartTime(Date.now());
    } else {
      const now = Date.now();
      if (hoverStartTime && now - hoverStartTime >= HOLD_DURATION) {
        handleDoorClick(currentDoor);
        setHoverStartTime(null);
      }
    }
  }, [fingerPos, hoveredDoor, hoverStartTime, selectedDoor, isCompleted]);

  const handleDoorClick = (door) => {
    if (isCompleted || selectedDoor) return;
    setSelectedDoor(door);

    const soundFail = missionData.soundEffect?.[0];
    const soundSuccess = missionData.soundEffect?.[1];

    if (door === treasureDoor) {
      const imgMap = {
        left: "page35_interaction_left.jpg",
        mid: "page35_interaction_mid.jpg",
        right: "page35_interaction_right.jpg",
      };
      setResultImage(assets[imgMap[door]]);
      setIsCompleted(true);
      if (soundSuccess && assets[soundSuccess]) {
        const audio = new Audio(assets[soundSuccess]);
        audio.play().catch(() => {});
      }
      setTimeout(() => {
        onSuccess?.();
        sendMessage("isSuccess", {
          senderName: userName,
          roomId,
          isSuccess: "성공",
        });
      }, 1000);
    } else {
      setShowNotice(true);
      if (soundFail && assets[soundFail]) {
        const audio = new Audio(assets[soundFail]);
        audio.play().catch(() => {});
      }
      setTimeout(() => setShowNotice(false), 2000);
      setSelectedDoor(null);
    }
  };

  // 캔버스에 합성된 영상을 그리는 animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const draw = () => {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 배경 이미지 그리기: resultImage가 있으면 사용, 없으면 기본 이미지
      if (resultImgObj) {
        ctx.drawImage(resultImgObj, 0, 0, canvas.width, canvas.height);
      } else if (baseImgObj) {
        ctx.drawImage(baseImgObj, 0, 0, canvas.width, canvas.height);
      }
      // 실패시 notice 이미지 그리기
      if (showNotice && noticeImgObj) {
        const noticeWidth = 352;
        const noticeHeight =
          (noticeWidth * noticeImgObj.height) / noticeImgObj.width;
        ctx.drawImage(
          noticeImgObj,
          (canvas.width - noticeWidth) / 2,
          -0.16 * canvas.height,
          noticeWidth,
          noticeHeight
        );
      }
      // 손 아이콘 그리기
      if (fingerPos) {
        ctx.font = "60px sans-serif";
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillText("✋", fingerPos.x - 30, fingerPos.y + 20);
      }
      requestAnimationFrame(draw);
    };
    draw();
  }, [baseImgObj, noticeImgObj, fingerPos, resultImgObj, showNotice]);

  // 상태 UI 업데이트: 텍스트 안내 메시지
  useEffect(() => {
    if (!setStatusContent) return;
    const ui = isCompleted ? (
      <div className="text-2xl font-bold text-green-700 animate-pulse">
        보물을 찾았어요! 🎉
      </div>
    ) : showNotice ? (
      <div className="text-2xl font-cafe24 text-red-600 animate-shake">
        다시 시도해보세요!
      </div>
    ) : (
      <div className="text-2xl text-gray-700 font-cafe24">
        문 위에 3초간 손을 머물러 보세요!
      </div>
    );
    setStatusContent(ui);
  }, [isCompleted, showNotice, setStatusContent]);

  return (
    <div
      className="relative w-[640px] h-[480px] overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-10" />
      <video ref={videoRef} className="hidden" autoPlay muted />
    </div>
  );
};

export default TreasureHunt;
