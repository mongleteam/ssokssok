import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import useSpeechRecognition from "../../../hooks/useSpeechRecognition";
import startBtn from "../../../assets/images/btn_green.png";
import stopBtn from "../../../assets/images/btn_gold.png";
import { sendMessage, onSocketEvent, offSocketEvent } from "../../../services/socket";

const TARGET_TEXT = "반짝이는 조약돌을 따라가자";

const HanselReadText = ({ onSuccess, setStatusContent, roomId, userName, publisher, missionData }) => {
  const videoRef = useRef(null);
  const [finished, setFinished] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [matchedLength, setMatchedLength] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const isMyMission = userName === "헨젤";
  const [peerSuccess, setPeerSuccess] = useState(false);

  const onResult = useCallback(
    (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }
      // console.log("🗣 인식된 음성:", transcript);

      const normalizedTarget = TARGET_TEXT.replace(/\s/g, "");
      const normalizedTranscript = transcript.replace(/\s/g, "");

      let match = 0;
      for (let i = 0; i < normalizedTranscript.length; i++) {
        if (normalizedTranscript[i] === normalizedTarget[matchedLength + i]) {
          match++;
        } else {
          break;
        }
      }

      if (match > 0) {
        setMatchedLength((prev) =>
          Math.min(prev + match, normalizedTarget.length)
        );
      }
    },
    [matchedLength]
  );

  const { startListening, stopListening } = useSpeechRecognition({ onResult });

  // isListening 변화 감지해서 start/stop 한 번만 호출
  useEffect(() => {
    if (isListening) {
      setMatchedLength(0);
      startListening();
    } else {
      stopListening();
    }
  }, [isListening, startListening, stopListening]);

  // 카메라 스트림 바인딩 부분을 SilentMission처럼 publisher 스트림을 사용하도록 수정
  useEffect(() => {
    const setupCam = async () => {
      try {
        if (publisher?.stream) {
          const stream = publisher.stream.getMediaStream();
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        // console.error("웹캠 접근 실패:", err);
      }
    };
    setupCam();
  }, [publisher]);

  useEffect(() => {
    const normalizedTarget = TARGET_TEXT.replace(/\s/g, "");
    if (matchedLength >= normalizedTarget.length && !finished) {
      setFinished(true);
      setShowSuccess(true);
      setIsListening(false);
      onSuccess?.();

      sendMessage("isSuccess", {
        roomId,
        senderName: userName,
        isSuccess: "성공",
      });

      sendMessage("objectCount", {
        roomId,
        senderName: userName,
        objectCount: 1,
      });
    }
  }, [matchedLength, finished, onSuccess, stopListening]);

  const coloredText = useMemo(() => {
    const normalizedTarget = TARGET_TEXT.replace(/\s/g, "");
    let count = 0;
    return TARGET_TEXT.split("").map((char, i) => {
      const isSpace = char === " ";
      if (!isSpace) count++;
      const colored = count <= matchedLength;
      return (
        <span
          key={`char-${i}`}
          className={colored ? "text-black" : "text-gray-400"}
        >
          {char}
        </span>
      );
    });
  }, [matchedLength]);

  useEffect(() => {
    const handlePeerSuccess = ({ senderName, objectCount }) => {
      if (senderName !== userName && objectCount === 1) {
        setPeerSuccess(true);
      }
    };

    onSocketEvent("objectCount", handlePeerSuccess);
    return () => offSocketEvent("objectCount", handlePeerSuccess);
  }, [userName]);

  useEffect(() => {
    if (!setStatusContent) return;

    let statusUI;

    if (isMyMission) {
      if (showSuccess) {
        statusUI = (
          <div className="text-green-600 font-bold animate-pulse text-2xl font-cafe24 text-center">
            ✅ 미션 성공! 멋지게 읽었어요!
          </div>
        );
      } else {
        statusUI = (
          <div className="text-center text-2xl font-cafe24 leading-relaxed">
            "{coloredText}"
            <div className=" -mt-3">
              {!isListening ? (
                <button
                  className="relative px-6 -py-2"
                  onClick={() => {
                    setMatchedLength(0);
                    setIsListening(true);               
                  }}
                >
                  <img
                    src={startBtn}
                    alt="시작 버튼"
                    className="w-36 mx-auto mt-2"
                  />
                  <span className="absolute inset-0 flex items-center justify-center font-bold text-2xl">
                    시작
                  </span>
                </button>
              ) : (
                <button
                  className="relative px-6 -mt-2"
                  onClick={() => {
                    setIsListening(false);
                  }}
                >
                  <img
                    src={stopBtn}
                    alt="종료 버튼"
                    className="w-36 mx-auto mt-3"
                  />
                  <span className="absolute inset-0 flex items-center justify-center font-bold text-2xl mt-3">
                    종료
                  </span>
                </button>
              )}
            </div>
          </div>
        );
      }
    } else {
      // 헨젤이 아니면 (그레텔)
      statusUI = peerSuccess ? (
        <div className="text-indigo-600 font-bold animate-pulse text-2xl font-cafe24 text-center">
          🎉 친구가 미션을 성공했어요!
        </div>
      ) : (
        <div className="text-gray-500 text-xl font-cafe24 text-center">
          친구가 미션을 하고 있어요.
        </div>
      );
    }

    setStatusContent(statusUI);
  }, [coloredText, isListening, showSuccess, isMyMission, peerSuccess]);

  return (
    <div className="relative w-[48rem] aspect-video torn-effect overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        className="w-full h-full object-cover scale-x-[-1] hidden"
      />
    </div>
  );
};

export default HanselReadText;
