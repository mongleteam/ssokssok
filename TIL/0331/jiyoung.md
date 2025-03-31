## KPT

### Keep

- ^^

### Problem

- `prevNext` 소켓 이벤트로 페이지는 동기화되지만, 미션 페이지 진입은 따로 처리 필요해서 딱 맞지 않음
- invitee 초대 수락 후 MultiPage 진입 시 데이터 로딩 꽤 걸림...

### Try

- `prevNext` 수신 시 핸들러 자체를 직접 실행시키는 방향으로 다시 시도하기
- MultiPage 진입 전 로딩 창이나 스피너 따로 둬서 UX 보완
- hook 작성 시 순서 주의

## 오늘
- 함께 읽기 요청 보낸 유저(Inviter)와 수락하는 유저(Invitee) 분기해서 멀티페이지 로직 처리
    - `Inviter` 흐름
        1. 역할/친구 선택 후 초대 요청 -> `roomId` 받음
        2. `multiPage` 이동 후 소켓 연결 & `joinRoom`
        3. `inviteeJoined` 수신 -> 상대방 입장 확인
        4. `sendStartInfo` 전송 (시작 페이지, 역할 정보 포함)
        5. 시작 페이지부터 렌더링

    - `Invitee` 흐름
        1. 알림함에서 초대 수락 -> `roomId` 받음
        2. `multiPage` 이동 후 소켓 연결 & `joinRoom`
        3. `inviteeJoined` 전송 -> `Inviter`에게 입장 알림
        4. `sendStartInfo` 수신 -> 시작 페이지, 역할 설정
        5. 시작 페이지부터 렌더링

- 진행상황 생성 및 업데이트 API 연결(Inviter만 API 요청 가능)
- 이어 읽기 통해 진입 시 진행 상황 정보에 맞게 초대 요청 및 시작 페이지 설정
- 상태 동기화는 동작 자체를 동기화하는게 더 정확하다
- `useCallback`, `useMemo`, `useEffect` 순서대로 주의해서 작성! 