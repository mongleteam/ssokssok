import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";
import startBtn from "../../assets/images/btn_green.png";
import stopBtn from "../../assets/images/btn_gold.png";
import { useTrackingCore } from "../../hooks/useTrackingCore";
import { captureCompositeImage } from "../../utils/captureCompositeImage";
import CountdownOverlay from "../webcam/CountdownOverlay";
import PhotoCaptureModal from "../webcam/PhotoCaptureModal";
import CustomAlert from "../CustomAlert";

const TARGET_TEXT = "반짝이는 조약돌을 따라가자";

const WebcamReadTextMission = ({ onComplete, setStatusContent }) => {
  const videoRef = useRef(null);
  const [finished, setFinished] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [matchedLength, setMatchedLength] = useState(0);
  const [missionState, setMissionState] = useState("idle"); // "idle" | "listening" | "success" | "fail"
  const [missionMessage, setMissionMessage] = useState("");
  const {
    previewUrl,
    showModal,
    handleSave,
    countdown,
    setShowModal,
    alertMessage,        // ⬅️ 추가
    setAlertMessage,
  } = useTrackingCore(videoRef, 1, captureCompositeImage, {
    useHands: true,
    useHolistic: false,
  });

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
        setMatchedLength((prev) => Math.min(prev + match, normalizedTarget.length));
      }
    },
    [matchedLength]
  );

  const { startListening, stopListening } = useSpeechRecognition({ onResult });

  useEffect(() => {
    const setupCam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        // console.error("웹캠 접근 실패:", err);
      }
    };
    setupCam();
  }, []);

  useEffect(() => {
    const normalizedTarget = TARGET_TEXT.replace(/\s/g, "");
    if (matchedLength >= normalizedTarget.length && !finished) {
      setFinished(true);
      setMissionState("success");
      stopListening();
      onComplete?.();
    }
  }, [matchedLength, finished, onComplete, stopListening]);

  const coloredText = useMemo(() => {
    const normalizedTarget = TARGET_TEXT.replace(/\s/g, "");
    let count = 0;
    return TARGET_TEXT.split("").map((char, i) => {
      const isSpace = char === " ";
      if (!isSpace) count++;
      const colored = count <= matchedLength;
      return (
        <span key={`char-${i}`} className={colored ? "text-black" : "text-gray-400"}>
          {char}
        </span>
      );
    });
  }, [matchedLength]);

  useEffect(() => {
    if (!setStatusContent) return;
    const statusUI = (
      <div className="text-center text-2xl font-cafe24 leading-relaxed">
        {missionState === "success" ? (
          <div className="text-green-600 font-bold animate-pulse">
            ✅ 성공! 다음 페이지로 넘어가세요.
          </div>
        ) : missionState === "fail" ? (
          <div className="font-bold animate-pulse space-y-4">
            <div className="text-red-600 ">❌ 다시 시도해보세요!</div>
            <button
              onClick={() => {
                setMatchedLength(0);
                setMissionState("idle");         // 상태를 idle로 초기화
                setIsListening(false);   
              }}
              className="relative inline-block"
            >
              <img src={stopBtn} alt="재도전 버튼" className="w-36 mx-auto -mt-7" />
              <span className="absolute inset-0 flex items-center justify-center font-bold text-xl -mt-6">
                재도전
              </span>
            </button>
          </div>
        ) : (
          <>
            "{coloredText}"
            <div className=" -mt-3">
              {!isListening ? (
                <button
                  className="relative px-6 -py-2"
                  onClick={() => {
                    setMatchedLength(0);
                    setIsListening(true);
                    setMissionState("listening");
                    startListening();
                  }}
                >
                  <img src={startBtn} alt="시작 버튼" className="w-36 mx-auto mt-2" />
                  <span className="absolute inset-0 flex items-center justify-center font-bold text-2xl">시작</span>
                </button>
              ) : (
                <button
                  className="relative px-6 -mt-2"
                  onClick={() => {
                    setIsListening(false);
                    stopListening();
                    const normalizedTarget = TARGET_TEXT.replace(/\s/g, "");
                    if (matchedLength >= normalizedTarget.length) {
                      setMissionState("success");
                      onComplete?.();
                    } else {
                      // ✅ fail은 약간 지연시켜서 useEffect가 먼저 처리되도록 유도
                      setTimeout(() => {
                        // 아직 성공하지 않은 상태에서만 fail 처리
                        setMissionState((prev) => {
                          if (prev !== "success") return "fail";
                          return prev;
                        });
                      }, 100); // 100ms 정도 딜레이 주면 충분
                    }
                  }}
                >
                  <img src={stopBtn} alt="종료 버튼" className="w-36 mx-auto mt-3" />
                  <span className="absolute inset-0 flex items-center justify-center font-bold text-2xl mt-3">종료</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    );
    setStatusContent(statusUI);
  }, [coloredText, isListening, missionState]);

  return (
    <div id="capture-container" className="relative w-[48rem] aspect-video torn-effect mb-3 overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        className="w-full h-full object-cover scale-x-[-1]"
      />

      {/* ✅ 엄지 들고 캡처 시 카운트다운 오버레이 */}
      {countdown !== null && <CountdownOverlay count={countdown} />}

      {/* ✅ 캡처 후 사진 미리보기 + 저장 모달 */}
      <PhotoCaptureModal
        isOpen={showModal}
        previewUrl={previewUrl}
        onSave={handleSave}
        onClose={() => setShowModal(false)}
      />

      {alertMessage && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setAlertMessage(null)}
        />
      )}
    </div>
  );
};

export default WebcamReadTextMission;
