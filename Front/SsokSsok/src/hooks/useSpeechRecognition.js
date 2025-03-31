// hooks/useSpeechRecognition.js
import { useEffect, useRef, useCallback } from "react";

const useSpeechRecognition = ({ onResult }) => {
  const recognitionRef = useRef(null);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("❌ SpeechRecognition 지원되지 않음");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ko-KR";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = onResult;
    recognition.onerror = (e) => {
      console.error("SpeechRecognition 오류", e);
      if (e.error === "aborted" || e.error === "no-speech") {
        recognition.stop();
        setTimeout(() => recognition.start(), 1000);
      }
    };
    recognition.onend = () => {
      console.log("🎤 음성 인식 종료됨");
    };

    recognitionRef.current = recognition;

    return () => {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    };
  }, [onResult]);

  return { startListening, stopListening };
};

export default useSpeechRecognition;
