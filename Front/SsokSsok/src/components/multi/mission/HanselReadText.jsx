import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import useSpeechRecognition from "../../../hooks/useSpeechRecognition";
import startBtn from "../../../assets/images/btn_green.png";
import stopBtn from "../../../assets/images/btn_gold.png";

const TARGET_TEXT = "반짝이는 조약돌을 따라가자";

const HanselReadText = ({
  onSuccess,
  setStatusContent,
  roomId,
  userName,
  publisher,
  missionData,
}) => {
  const videoRef = useRef(null);
  const [finished, setFinished] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [matchedLength, setMatchedLength] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const onResult = useCallback(
    (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }
      console.log("🗣 인식된 음성:", transcript);

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
        console.error("웹캠 접근 실패:", err);
      }
    };
    setupCam();
  }, [publisher]);

  useEffect(() => {
    const normalizedTarget = TARGET_TEXT.replace(/\s/g, "");
    if (matchedLength >= normalizedTarget.length && !finished) {
      setFinished(true);
      setShowSuccess(true);
      stopListening();
      onSuccess?.();
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
    if (!setStatusContent) return;
    const statusUI = (
      <div className="text-center text-2xl font-cafe24 leading-relaxed">
        {showSuccess ? (
          <div className="text-green-600 font-bold animate-pulse">
            ✅ 성공! 다음 페이지로 넘어가세요.
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
                    startListening();
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
                    stopListening();
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
          </>
        )}
      </div>
    );
    setStatusContent(statusUI);
  }, [coloredText, isListening, showSuccess]);

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
