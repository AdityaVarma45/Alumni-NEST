import { useEffect, useRef } from "react";
import socket from "../socket";

export const useSocket = (userId) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (!userId) return;

    // prevent duplicate registration
    if (initialized.current) return;
    initialized.current = true;

    if (!socket.connected) {
      socket.connect();
    }

    // register user for notifications + online presence
    socket.emit("userOnline", userId);

    return () => {
      // keep socket globally alive
    };
  }, [userId]);

  return socket;
};