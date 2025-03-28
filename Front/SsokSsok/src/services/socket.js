import { io } from "socket.io-client";

let socket = null; // 소켓 인스턴스를 외부에서 접근 가능하게 저장

/**
 * 소켓 연결 시작
 * @param {string} roomId - 방 ID
 */
export const connectSocket = (roomId) => {
  if (socket) return; // 중복 연결 방지

  socket = io("ws://3.36.67.192:9092/", {
    path: "/socket.io", // 백엔드에서 특별한 path 설정했으면 수정
    query: { roomId },   // 쿼리로 roomId 전달
    transports: ["websocket"],
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("✅ 소켓 연결 성공:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("❌ 소켓 연결 종료");
  });

  // 필요한 추가 이벤트 리스너는 여기서 등록
  socket.on("receive_message", (data) => {
    console.log("📩 메시지 수신:", data);
  });
};

/**
 * 소켓 연결 종료
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * 소켓 emit
 */
export const sendMessage = (eventName, data) => {
  if (!socket) return;
  socket.emit(eventName, data);
};

/**
 * 소켓 이벤트 수신 등록
 */
export const onSocketEvent = (eventName, callback) => {
  if (!socket) return;
  socket.on(eventName, callback);
};
