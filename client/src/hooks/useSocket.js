import { useEffect } from "react";
import socket from "../socket";

export const useSocket = (userId) => {
  useEffect(() => {
    if (!userId) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("userOnline", userId);

    return () => {
      // keep socket alive globally
    };
  }, [userId]);

  return socket;
};
