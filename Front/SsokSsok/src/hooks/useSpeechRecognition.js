import { useEffect, useRef, useCallback } from "react";

const useSpeechRecognition = ({ onResult }) => {
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const restartTimeout = useRef(null);

  const startListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || isRecognizingRef.current) return;
    try {
      recognition.start();
      isRecognizingRef.current = true;
      // console.log("🎤 인식 시작");
    } catch (err) {
      // console.warn("🎤 start 실패 (중복 or 에러):", err);
    }
  }, []);

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || !isRecognizingRef.current) return;
    try {
      recognition.stop();
      isRecognizingRef.current = false;
      // console.log("🛑 인식 중단");
    } catch (err) {
      // console.warn("🛑 stop 실패:", err);
    }
    clearTimeout(restartTimeout.current);
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // console.warn("❌ 브라우저가 SpeechRecognition을 지원하지 않음");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ko-KR";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = onResult;

    recognition.onerror = (e) => {
      // console.error("SpeechRecognition 오류", e);

      isRecognizingRef.current = false;

      // no-speech or aborted 시 재시도
      if (e.error === "aborted" || e.error === "no-speech") {
        clearTimeout(restartTimeout.current);
        restartTimeout.current = setTimeout(() => {
          if (!isRecognizingRef.current) {
            try {
              recognition.start();
              isRecognizingRef.current = true;
              // console.log("🎤 오류 후 재시작");
            } catch (err) {
              // console.warn("재시작 실패:", err);
            }
          }
        }, 1000);
      }
    };

    recognition.onend = () => {
      // console.log("🎤 음성 인식 종료됨");
      isRecognizingRef.current = false;
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {}
      isRecognizingRef.current = false;
      clearTimeout(restartTimeout.current);
      recognitionRef.current = null;
    };
  }, [onResult]);

  return { startListening, stopListening };
};

export default useSpeechRecognition;
