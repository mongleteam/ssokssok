## KPT

### Keep

- ^^

### Problem

- `OpenVidu`랑 `Livekit`은 다른 거야?.....
- `Livekit`으로 통신 중인 화면에 `MediaPipe` 입히려니까 손 랜드마크 인식이 안됨.
- `MediaPipe`에서 기본으로 제공했던 7가지 손동작 모델을 리액트에서 바로 사용할 수 없는 것 같음
- 파이썬 연결하거나 각 동작의 판별 코드 작성해야 함 => 좀 더 알아보기
- `OpenVidu` 다시 츄라이해봄
    - api 써서 가상 배경 쉽게 입혀지는데 손, 팔 움직임에 예민하지 않아서 손동작 감지할 때 화면에 잘 안보임
    - 사진찍을 때만 on/off하게 할까?

### Try

- webRTC 환경에 미디어파이프 적용해보기
- 손동작 모델 데이터 어떻게 넣어줄 수 있는지 알아보기


## 오늘
### `OpenVidu`-`Livekit`
- [openvidu-local-deployment](https://github.com/OpenVidu/openvidu-local-deployment)
- [openvidu-livekit-tutorials](https://github.com/OpenVidu/openvidu-livekit-tutorials)

1. `OpenVidu` 사용하려면 Docker 컨테이너 실행부터!
    ```bash
    git clone https://github.com/OpenVidu/openvidu-local-deployment
    cd openvidu-local-deployment/community
    ```
    ```powershell
    # IP 구성 스크립트 실행
    # powershell에서 실행해야 되더라
    & .\configure_lan_private_ip_windows.bat
    ```
    ```bash
    # OpenVidu 서버 실행
    docker compose up
    ```

- 실제 EC2 개발 환경에서 OpenVidu 라이브러리 사용하려면 OpenVidu 서버를 통해 세션 생성하고 연결 관리해야 함
    ```bash
    # 예시
    docker run -p 4443:4443 --rm -e OPENVIDU_SECRET=MY_SECRET openvidu/openvidu-dev:2.31.0
    ```

2. `Node.js` 서버 실행
    - advanced-features/openvidu-recording-advanced-node 디렉토리로 이동해서
    ```bash
    npm install
    npm start
    ```

3. `React` 클라이언트 실행
    - application-client/openvidu-react 디렉토리로 이동해서서
    ```bash
    npm install
    npm start
    ```

### `OpenVidu`
- [OpenVidu V2](https://docs.openvidu.io/en/stable/tutorials/openvidu-react/)
- V3 tutorial은 angular만 있어서 v2로 실행

1. 똑같이 도커 컨테이너 실행해주고
2. `Node.js` 서버 실행
    ```bash
    git clone https://github.com/OpenVidu/openvidu-tutorials.git -b v2.31.0
    cd openvidu-tutorials/openvidu-basic-node
    npm install
    node index.js
    ```

3. `React` 클라이언트 실행
    ```bash
    # Using the same repository openvidu-tutorials from step 2

    cd openvidu-tutorials/openvidu-react
    npm install
    npm start
    ```
    
    - 여기서 제대로 빌드 안되면 스크립트 최신 버전으로 업그레이드하거나(이거로 해결 완)
    - node 버전 16으로 다운그레이드
    ```bash
    npm install --save react-scripts@latest
    ```