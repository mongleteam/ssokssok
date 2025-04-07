import React, { useEffect, useRef, useState } from "react";
import * as handPose from "@mediapipe/hands";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { sendMessage, onSocketEvent, offSocketEvent } from "../../../services/socket";

const CollectStoneOverlay = ({
  missionData,
  assets,
  onSuccess,
  publisher,
  roomId,
  userName,
  setStatusContent,
  from,
}) => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  const [stones, setStones] = useState([]);
  const collectedIdsRef = useRef(new Set());
  const [success, setSuccess] = useState(false);
  const [stoneCountReady, setStoneCountReady] = useState(false);
  const [peerStones, setPeerStones] = useState([]);
  const stoneInitRef = useRef(false);
  const [peerCollectedCount, setPeerCollectedCount] = useState(0);


  const stoneImage = missionData?.instructionImages?.length
    ? assets[missionData.instructionImages[0]]
    : null;

  const generateRandomStones = (count) => {
    const generated = [];
    for (let i = 0; i < count; i++) {
      generated.push({
        id: i,
        x: Math.random() * 500 + 70,
        y: Math.random() * 300 + 70,
      });
    }
    return generated;
  };

  const isHandClosed = (landmarks) => {
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const dx = thumbTip.x - indexTip.x;
    const dy = thumbTip.y - indexTip.y;
    return Math.sqrt(dx * dx + dy * dy) < 0.05;
  };

  const checkCollision = (landmarks) => {
    const handX = landmarks[9].x * 640;
    const handY = landmarks[9].y * 480;

    setStones((prev) =>
      prev.filter((stone) => {
        const distance = Math.sqrt(
          (stone.x - handX) ** 2 + (stone.y - handY) ** 2
        );
        if (distance < 50 && !collectedIdsRef.current.has(stone.id)) {
          collectedIdsRef.current.add(stone.id);
          sendMessage("removeStone", {
            roomId,
            senderName: userName,
            stoneId: stone.id,
          });
          console.log("🪨 removeStone sent", {
            roomId,
            senderName: userName,
            stoneId: stone.id,
          });
          if (missionData.soundEffect?.length) {
            const sound = new Audio(assets[missionData.soundEffect[0]]);
            sound.play();
          }
          return false;
        }
        return true;
      })
    );
  };

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = 640;
      canvas.height = 480;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        drawConnectors(ctx, landmarks, handPose.HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 2,
        });
        drawLandmarks(ctx, landmarks, { color: "#FF0000", lineWidth: 1 });

        if (isHandClosed(landmarks)) {
          checkCollision(landmarks);
        }
      }
    });

    const setupCamera = async () => {
      if (videoRef.current && publisher?.stream) {
        const mediaStream = publisher.stream.getMediaStream();
        videoRef.current.srcObject = mediaStream;

        try {
          await videoRef.current.play(); // ✅ 명확히 play 완료 대기

          const camera = new Camera(videoRef.current, {
            onFrame: async () => {
              await hands.send({ image: videoRef.current });
            },
            width: 640,
            height: 480,
          });

          camera.start();
        } catch (err) {
          console.error("🎥 Video play error:", err);
        }
      }
    };

    setupCamera();

  }, [missionData, assets, publisher]);

  // useEffect(() => {
  //   if (!missionData || !assets || !publisher) return;
  //   if (stoneInitRef.current) return; // ✅ 이미 한 번 실행했으면 무시
  
  //   const initialStones = generateRandomStones(5).map((stone, i) => ({
  //     ...stone,
  //     id: `${userName}_stone_${i}`,
  //     owner: userName,
  //   }));
  //   setStones(initialStones);
  //   stoneInitRef.current = true; // ✅ 실행 플래그 설정
  
  //   console.log("📦 내 조약돌 위치 전송 전 확인:", initialStones);
  
  //   // emit 전송을 약간 늦춰줌 (3000ms 정도)
  //   setTimeout(() => {
  //     const normalizedStones = initialStones.map(({ id, x, y }) => ({
  //       id,
  //       x: x / 640,
  //       y: y / 480,
  //     }));
    
  //     sendMessage("initStones", {
  //       senderName: userName,
  //       roomId,
  //       stones: normalizedStones,
  //     });
    
  //     // ✅ emit 직후 로그
  //     console.log("🚀 initStones emitted:", normalizedStones);
  //   }, 3000);    

  // }, [missionData, assets, publisher, userName, roomId]);
  


  useEffect(() => {
    const handleInitStones = ({ senderName, stones: incomingStones }) => {
      if (senderName !== userName) {
        console.log("📩 initStones received from", senderName, "→", incomingStones);
        setPeerStones(incomingStones);
      }
    };
  
    onSocketEvent("initStones", handleInitStones);
  
    // ✅ emit은 리스너 등록 이후에 실행
    if (!stoneInitRef.current && missionData && publisher && assets) {
      const initialStones = generateRandomStones(5).map((stone, i) => ({
        ...stone,
        id: i,
        owner: userName,
      }));
  
      setStones(initialStones);
      setStoneCountReady(true);        // 곧바로 준비 완료 플래그 설정! ← 여기 중요
      stoneInitRef.current = true;
  
      const normalizedStones = initialStones.map(({ id, x, y }) => ({
        id,
        x: x / 640,
        y: y / 480,
      }));
  
      // ✅ emit은 리스너 이후에 실행되므로 안전
      setTimeout(() => {
        sendMessage("initStones", {
          senderName: userName,
          roomId,
          stones: normalizedStones,
        });
        console.log("🚀 initStones emitted:", normalizedStones);
      }, 1000); // 🔥 타이밍 보정 (필요시)
    }
  
    return () => offSocketEvent("initStones");
  }, [missionData, assets, publisher, userName, roomId]);
  
  

  useEffect(() => {
    // 🔒 중복 체크용 ref 생성
    const receivedStonesRef = new Set();
  
    const handleRemoveStone = ({ senderName, stoneId }) => {
      console.log("📩 removeStone received", { senderName, stoneId });
  
      // 상대방이 주운 돌이고, 아직 안받은 돌이면 처리
      if (senderName !== userName) {
        const key = `${senderName}_${stoneId}`;
        if (!receivedStonesRef.has(key)) {
          receivedStonesRef.add(key);
  
          const updated = receivedStonesRef.size;
          const text =
          updated < 5
            ? `${senderName}이 조약돌 줍는 중... (${updated}/5)`
            : `${senderName}이 조약돌을 모두 주웠어요!`;

          // 안전하게 상태 업데이트
          setPeerCollectedCount(updated);
          setStatusContent(<p className="text-lg font-bold">{text}</p>);
        }
      }
  
      // 내 돌 제거는 그대로 유지
      setStones((prev) =>
        prev.filter(
          (stone) => !(stone.owner === senderName && stone.id === stoneId)
        )
      );
    };
  
    onSocketEvent("removeStone", handleRemoveStone);
    return () => offSocketEvent("removeStone");
  }, [userName, setStatusContent]);
  
  

  useEffect(() => {
    if (stoneCountReady && stones.length === 0 && !success) {
      setSuccess(true);
  
      console.log("✅ isSuccess emit!");
      sendMessage("isSuccess", {
        senderName: userName,
        roomId,
        isSuccess: "성공",
      });
  
      setTimeout(() => {
        onSuccess?.();
      }, 1000);
    }
  }, [stones, stoneCountReady, success, onSuccess, userName, roomId]);
  

  return (
    <>
      <video ref={videoRef} className="hidden" />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-10"
      />
      {stoneImage &&
        stones.map((stone) => (
          <img
            key={stone.id}
            src={stoneImage}
            alt="stone"
            className="absolute w-12 h-12 z-20"
            style={{
              left: `${(stone.x / 640) * 100}%`,
              top: `${(stone.y / 480) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

        {stoneImage &&
          peerStones.map((stone) => (
            <img
              key={stone.id}
              src={stoneImage}
              alt="peer-stone"
              className="absolute w-12 h-12 z-10 opacity-70"
              style={{
                left: `${(stone.x / 640) * 100}%`,
                top: `${(stone.y / 480) * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
        ))}

    </>
  );
};

export default CollectStoneOverlay;
