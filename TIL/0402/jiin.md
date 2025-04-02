## KPT

### Keep

- Team 💡
- 우앙 4월이다 벌써

### Problem

- 추후에 single, multi 페이지 private Routes 만들어서 로그인안하면 아예 못 들어가게 막아야함
- 싱글 자잘자잘한거 다듬어야함
- 멀티 미션 ... 

### Try
- 멀티 미션 내 생각
- OpenVidu 자기 영상 위에 MediaPipe 인식 로직을 입히는데
- useMediaPipeMultiCore 멀티 전용 공통 훅을 만드는데 여기에다가 그냥 모든 미디어 파이프 동작 인식들 때려박고 그 파일 내에서 멀티 missions 매핑해서 그때그때의 동작들만 사용하면 편할 거 같음 왔다리 갔다리 어떻게 해야할 지 모르겠음 멀티는 영상이 항상 띄워져있어서 

```
// videoRef.current를 외부에서 접근할 수 있도록 ref를 props로 넘겨야함
const VideoPlayer = ({ streamManager, videoRef }) => {
  useEffect(() => {
    if (streamManager && videoRef?.current) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  return <video autoPlay ref={videoRef} />;
};


// VidoeManager 나 MultiPage에서 영상 DOM을 MediaPipe에 전달하고 useMediaPipeMultiCore훅에 videoRef 넘겨서 MediaPipe 인식하기 
const myVideoRef = useRef();

<VideoPlayer streamManager={publisher} videoRef={myVideoRef} />


// 이렇게 .. ? 
useMediaPipeMultiCore({
  videoRef: myVideoRef,
  onThumbsUp: () => { /* 따봉 인식 */ },
  onDraw: (landmarks) => { /* 그리기 인식 */ },
  onSwipe: (landmarks) => { /* 좌우 스와이프 */ },
});


```
---

### Today
- 앨범 무한스크롤로 사진 불러오는데 이거... 사진 짤리고 id container 기준으로 캡처하니까 사진 크기가 다 다름 ^ㅡ^ 진짜 어떡함
- 사진 하나 누르면 그 사진 전체 확인할 수 있는 모달도 만들어야하나 .. 고민중
- 캡처를 해버리니까 사진 크기를 확실하게 정할 수 있나 슬픔

















