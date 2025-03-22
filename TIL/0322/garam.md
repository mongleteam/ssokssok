
### KPT 작성

#### `Keep` : 현재 만족하고 있는 부분, 계속 이어갔으면 하는 부분

- Team

#### `Problem` : 불편하게 느끼는 부분, 개선이 필요하다고 생각되는 부분

- 백엔드 쪽에서 하고 있는 업무나 진행 상황에 대한 공유를 소홀하게 해서 서로 어떤 일 하고 있는지 알 수가 없었다. 죄송함돠
- webRTC + socket.io 사용하는 부분이 우리 젤 우선순위라 이걸 젤 최우선적으로 개발 바로 들어가야함


#### `Try` : problem에 대한 해결책, 다음 회고 때 판별 가능한 것, 당장 실행 가능한 것

- TIL에 오늘 했던 업무, 현재까지 진행 상황 등을 자세하게 기록하고 소통할 때 모두에게 똑같이 자세하게 전달하기

---

### Today


- fairytale-service 서버에 관한 yml 파일 작성했고 아직 gateway 설정에는 추가하지 않음. 로컬로 api 테스트 해보고 gateway의 yml 파일이랑 fairytale-service yml 파일 적용하면 될듯
- 동화 정보 조회하는 API 개발, 



- webRTC와 webSocket 라이브러리인 socket.io를 사용하는 경우에 nodejs로 socket.io 시그널링 서버를 여는 방법과 spring에서 socket.io 시그널링 서버를 여는 2가지 방법이 있다. 

    - socket.io가 node.js 기반 라이브러리라 시그널링 서버를 여는 것이 성능과 안정성 면에서 이슈가 적다. 근데 그러면 node.js 서버를 새로 배포해야 하고 Gateway랑 연동이 안되서 JWT 인증 절차를 node.js에서 또 새로 해줘야함

    - spring + netty-socket.io를 사용하면 멀티스레드 처리 부분에서 좋고 이미 Spring으로 서버 관리를 다 하고 있기 때문에 익숙함. 그런데 netty는 오픈 소스라 react에서 사용하는 socket.io client와 버전 호환이 잘 안될 수 있어서 버전과의 호환성 문제가 있을 수 있음. 






