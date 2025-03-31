## KPT

### Keep

- Team 💡

### Problem

- 추후에 single, multi 페이지 private Routes 만들어서 로그인안하면 아예 못 들어가게 막아야함
- MediaPipe 인스턴스는 하나, 그걸 기준으로 여러 훅들이 읽기만 해야함 -> 한 비디오 스트림을 두 인스턴스가 동시 접근하면 미디어파이프 충돌갈비
- 현재 여러 mediapipe 훅들이랑 캡처를 같이 쓰는 구조는 충돌이 날 수 밖에 없음 

### Try
- useHandTrackingCore (MediaPipe + Camera 
- 현재 여러 mediapipe 훅들이랑 캡처를 같이 쓰는 구조는 충돌이 날 수 밖에 없음 

### Try
- useHandTrackingCore (MediaPipe + Camera 1회 생성성)

```
export const useHandTrackingCore = (videoRef) => {
  const [handLandmarks, setHandLandmarks] = useState(null);
  ...
  useEffect(() => {
    const hands = new Hands(...);
    hands.onResults((res) => {
      setHandLandmarks(res.multiHandLandmarks?.[0] || null);
    });

    const cam = new Camera(videoRef.current, {
      onFrame: async () => await hands.send({ image: videoRef.current }),
    });

    cam.start();
    return () => cam.stop();
  }, [videoRef]);

  return { handLandmarks };
};

```
- useThumbPose, useHandPose는 이렇게 읽기만 해야함 
```
export const useThumbPose = (handLandmarks, onThumbUp) => {
  useEffect(() => {
    if (!handLandmarks) return;
    const thumb = handLandmarks[4];
    const index = handLandmarks[8];
    if (thumb.y < index.y - 0.1) onThumbUp?.();
  }, [handLandmarks]);
};

```
---

### 따봉할 때 캡처 + MediaPipe 핸드 모션 
- 저 useHandTrackingCore가 리턴한 handLandmarks을 사용해서 나머지 훅들이 handLandmarks 읽어가서 제스처 판단해야함 .. 
- 그리고 미션 컴포넌트에선 이런식으로 제스처 인식해야함...

```
const { handLandmarks } = useSharedHandTracking(videoRef);
useThumbPose(handLandmarks, () => console.log("엄지척!"));
useHandPose(handLandmarks, () => console.log("손 펴짐"));

```
### 결론
- 각 미션은 자신이 필요한 제스처 훅만 추가해서 사용 ... 
- 베이스 잘 잡아야할 거 같은데 어떡해어떢해어떢해어떡해어떡해













