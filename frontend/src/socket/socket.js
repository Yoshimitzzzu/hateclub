import { io } from "socket.io-client";

export const createSocket = () => {

  const token =
    localStorage.getItem("token");

  return io(
    "http://localhost:3000",
    {
      auth: {
        token,
      },

      transports: [
        "websocket",
        "polling",
      ],
    }
  );
};