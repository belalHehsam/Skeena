import { SOCKET_BASE_URL } from "@/constants/backendAPIsConfig";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { token, isAuthenticated } = useAuthContext();
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
      return;
    }


    const socketInstance = io(SOCKET_BASE_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [isAuthenticated, token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
