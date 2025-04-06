import React, { useEffect, useRef, useState } from "react";
import * as handPose from "@mediapipe/hands";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import {
  sendMessage, onSocketEvent, offSocketEvent } from "../../../services/socket";

const CollectStoneOverlay = ({
  missionData,
  assets,
  onSuccess,
  publisher,
  roomId,
  userName,
  from,
}) => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  const [stones, setStones] = useState([]);
  const [collectedIds, setCollectedIds] = useState(new Set());
  const [success, setSuccess] = useState(false);
  const [stoneCountReady, setStoneCountReady] = useState(false);

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
        if (distance < 50 && !collectedIds.has(stone.id)) {
          setCollectedIds((prevSet) => new Set(prevSet).add(stone.id));
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

    const initialStones = generateRandomStones(5).map((stone) => ({
      ...stone,
      owner: userName,
    }));
    setStones(initialStones);
    setStoneCountReady(true);

    // 돌 생성 후 emit
    // sendMessage("initStones", {
    //   roomId,
    //   senderName: userName,
    //   stones: initialStones,
    // });
  }, [missionData, assets, publisher]);

  // useEffect(() => {
  //   const handleInitStones = ({ senderName, stones: incomingStones }) => {
  //     if (senderName !== userName) {
  //       setStones((prev) => [...prev, ...incomingStones]);
  //     }
  //   };

  //   onSocketEvent("initStones", handleInitStones);
  //   return () => offSocketEvent("initStones");
  // }, [userName, roomId]);

  useEffect(() => {
    const handleRemoveStone = ({ senderName, stoneId }) => {
      console.log("📩 removeStone received", { senderName, stoneId });
      setStones((prev) =>
        prev.filter(
          (stone) => !(stone.owner === senderName && stone.id === stoneId)
        )
      );
    };

    onSocketEvent("removeStone", handleRemoveStone);
    return () => offSocketEvent("removeStone");
  }, [roomId]);

  useEffect(() => {
    if (stoneCountReady && stones.length === 0 && !success) {
      setSuccess(true);
      sendMessage("isSuccess", {
        senderName: userName,
        roomId,
        isSuccess: "성공",
      });
      setTimeout(() => onSuccess?.(), 1000);
    }
  }, [stones, stoneCountReady, success, onSuccess]);

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
    </>
  );
};

export default CollectStoneOverlay;
