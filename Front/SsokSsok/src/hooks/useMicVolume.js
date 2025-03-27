import { useEffect, useRef, useState } from "react";


// 마이크 입력의 볼륨(RMS)를 측정해주는 커스텀 훅훅
export const useMicVolume = () => {
  const [volume, setVolume] = useState(0);  // 현재 볼륨(0~1 사이 실수)
  const audioContextRef = useRef(null);  // 오디오 컨텍스트
  const analyserRef = useRef(null);   // 주파수 분석기
  const streamRef = useRef(null);    // 마이크 스트림림

  useEffect(() => {

    //마이크와 오디오 분석기 초기화 함수
    const setupMic = async () => {
      try {
        // 사용자 마이크 접근 요청청
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        // web audio api 사용 : 오디오 컨텍스트 생성
        const audioContext = new AudioContext();

        // 마이크 스트림을 오디오 입력으로 연결
        const source = audioContext.createMediaStreamSource(stream);
        
        // 오디오 분석기 생성 및 설정
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;  // 분석 정확도 조절절


        // 분석기/컨텍스트 저장장
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        source.connect(analyser);

        // 분석용 버퍼
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        // 분석 루프(requestAnimationFrame으로 실시간 분석석)
        const tick = () => {
          analyser.getByteTimeDomainData(dataArray);
        
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const normalized = (dataArray[i] - 128) / 128;
            sum += normalized * normalized;
          }

          const rms = Math.sqrt(sum / dataArray.length);
          setVolume(rms);

          requestAnimationFrame(tick);
        };

        // 루프 시작작
        tick();
      } catch (err) {
        console.error("🎤 마이크 사용 실패:", err);
      }
    };

    // 마운트 시 바로 실행행
    setupMic();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      audioContextRef.current?.close();
    };
  }, []);

  return volume; // 0 ~ 1 사이 볼륨 값 현재 실시간 볼륨 값 반환환
};
