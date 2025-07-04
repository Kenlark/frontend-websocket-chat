import { io } from "socket.io-client";

const host = window.location.hostname;
const socketUrl =
  host === "localhost" || host === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://backend-websocket-chat.fly.dev/";

export const socket = io(socketUrl);
