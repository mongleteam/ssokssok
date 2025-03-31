// import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
// import useSpeechRecognition from "../../hooks/useSpeechRecognition";
// import startBtn from "../../assets/images/btn_green.png";
// import stopBtn from "../../assets/images/btn_gold.png";

// const TARGET_TEXT = "반짝이는 조약돌을 따라가자";

// const WebcamReadTextMission = ({ onComplete, setStatusContent }) => {
//   const videoRef = useRef(null);
//   const [finished, setFinished] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const [matchedLength, setMatchedLength] = useState(0);

//   const onResult = useCallback((event) => {
//     let transcript = "";
//     for (let i = event.resultIndex; i < event.results.length; ++i) {
//       if (event.results[i].isFinal) {
//         transcript += event.results[i][0].transcript;
//       }
//     }
//     console.log("🗣 인식된 음성:", transcript);

//     const normalizedTarget = TARGET_TEXT.replace(/\s/g, "");
//     const normalizedTranscript = transcript.replace(/\s/g, "");

//     let match = 0;
//     for (let i = 0; i < normalizedTranscript.length; i++) {
//       if (normalizedTranscript[i] === normalizedTarget[matchedLength + i]) {
//         match++;
//       } else {
//         break;
//       }
//     }

//     if (match > 0) {
//       setMatchedLength((prev) => Math.min(prev + match, normalizedTarget.length));
//     }
//   }, [matchedLength]);

//   const { startListening, stopListening } = useSpeechRecognition({ onResult });

//   useEffect(() => {
//     const setupCam = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
//       } catch (err) {
//         console.error("웹캠 접근 실패:", err);
//       }
//     };
//     setupCam();
//   }, []);

//   useEffect(() => {
//     const normalizedTarget = TARGET_TEXT.replace(/\s/g, "");
//     if (matchedLength >= normalizedTarget.length && !finished) {
//       setFinished(true);
//       stopListening();
//       onComplete?.();
//     }
//   }, [matchedLength, finished, onComplete, stopListening]);

//   const coloredText = useMemo(() => {
//     const normalizedTarget = TARGET_TEXT.replace(/\s/g, "");
//     let count = 0;
//     return TARGET_TEXT.split("").map((char, i) => {
//       const isSpace = char === " ";
//       if (!isSpace) count++;
//       const colored = count <= matchedLength;
//       return (
//         <span key={`char-${i}`} className={colored ? "text-black" : "text-gray-400"}>
//           {char}
//         </span>
//       );
//     });
//   }, [matchedLength]);

//   useEffect(() => {
//     if (!setStatusContent) return;
//     const statusUI = (
//       <div className="text-center text-4xl font-cafe24 leading-relaxed">
//         {coloredText}
//         <div className="mt-3">
//           {!isListening ? (
//             <button
//               className="relative px-6 py-2"
//               onClick={() => {
//                 setMatchedLength(0);
//                 setIsListening(true);
//                 startListening();
//               }}
//             >
//               <img src={startBtn} alt="시작 버튼" className="w-48 mx-auto" />
//               <span className="absolute inset-0 flex items-center justify-center font-bold text-3xl mb-2">시작</span>
//             </button>
//           ) : (
//             <button
//               className="relative px-6"
//               onClick={() => {
//                 setIsListening(false);
//                 stopListening();
//               }}
//             >
//               <img src={stopBtn} alt="종료료 버튼" className="w-48 mx-auto" />
//               <span className="absolute inset-0 flex items-center justify-center font-bold text-3xl">종료</span>
//             </button>
//           )}
//         </div>
//       </div>
//     );
//     setStatusContent(statusUI);
//   }, [coloredText, isListening]);

//   return (
//     <div className="relative w-[56rem] aspect-video torn-effect mt-6 mb-3 overflow-hidden">
//       <video
//         ref={videoRef}
//         autoPlay
//         muted
//         className="w-full h-full object-cover scale-x-[-1]"
//       />
//     </div>
//   );
// };

// export default WebcamReadTextMission;



import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";
import startBtn from "../../assets/images/btn_green.png";
import stopBtn from "../../assets/images/btn_gold.png";

const TARGET_TEXT = "반짝이는 조약돌을 따라가자";

const WebcamReadTextMission = ({ onComplete, setStatusContent }) => {
  const videoRef = useRef(null);
  const [finished, setFinished] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [matchedLength, setMatchedLength] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false); // ✅ 추가

  const onResult = useCallback((event) => {
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
      setMatchedLength((prev) => Math.min(prev + match, normalizedTarget.length));
    }
  }, [matchedLength]);

  const { startListening, stopListening } = useSpeechRecognition({ onResult });

  useEffect(() => {
    const setupCam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("웹캠 접근 실패:", err);
      }
    };
    setupCam();
  }, []);

  useEffect(() => {
    const normalizedTarget = TARGET_TEXT.replace(/\s/g, "");
    if (matchedLength >= normalizedTarget.length && !finished) {
      setFinished(true);
      setShowSuccess(true); // ✅ 성공 메시지 표시
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
      <div className="text-center text-4xl font-cafe24 leading-relaxed">
        {showSuccess ? (
          <div className="text-green-600 font-bold animate-pulse mt-2 mb-3">
            ✅ 성공! 다음 페이지로 넘어가세요.
          </div>
        ) : (
          <>
            "{coloredText}"
            <div className="mt-3">
              {!isListening ? (
                <button
                  className="relative px-6 py-2"
                  onClick={() => {
                    setMatchedLength(0);
                    setIsListening(true);
                    startListening();
                  }}
                >
                  <img src={startBtn} alt="시작 버튼" className="w-48 mx-auto" />
                  <span className="absolute inset-0 flex items-center justify-center font-bold text-3xl mb-2">시작</span>
                </button>
              ) : (
                <button
                  className="relative px-6"
                  onClick={() => {
                    setIsListening(false);
                    stopListening();
                  }}
                >
                  <img src={stopBtn} alt="종료 버튼" className="w-48 mx-auto" />
                  <span className="absolute inset-0 flex items-center justify-center font-bold text-3xl">종료</span>
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
    <div className="relative w-[56rem] aspect-video torn-effect mt-6 mb-3 overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        className="w-full h-full object-cover scale-x-[-1]"
      />
    </div>
  );
};

export default WebcamReadTextMission;
