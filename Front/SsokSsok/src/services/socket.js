import { io } from "socket.io-client";

let socket = null; // 소켓 인스턴스를 외부에서 접근 가능하게 저장

/**
 * 소켓 연결 시작
 * @param {string} roomId - 방 ID
 */
export const connectSocket = () => {
  if (socket) return; // 중복 연결 방지

  socket = io("wss://j12e201.p.ssafy.io/multi/", {
  // socket = io("ws://3.36.67.192:19092/", {
    path: "/socket.io",
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

export const joinRoom = (roomId) => {
  if (socket) {
    socket.emit("joinRoom", { roomId });
    console.log("🚪 joinRoom emitted:", roomId);
  }
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
export const onSocketEvent = (event, callback) => {
  if (!socket) return;
  socket.on(event, callback);
};

export const offSocketEvent = (event) => {
  if (socket) socket.off(event);
};
