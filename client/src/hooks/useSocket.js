import { useEffect, useRef } from "react";
import socket from "../socket";

export const useSocket = (userId) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (!userId) return;
    if (initialized.current) return;

    initialized.current = true;

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