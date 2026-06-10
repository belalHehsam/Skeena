import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import { BACKEND_BASE_URL } from "@/constants/backendAPIsConfig";

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

    // Standardize socket connection url (remove trailing /api)
    let socketUrl = BACKEND_BASE_URL;
    try {
      if (BACKEND_BASE_URL.startsWith("http")) {
        const url = new URL(BACKEND_BASE_URL);
        if (url.pathname.endsWith("/api") || url.pathname.endsWith("/api/")) {
          socketUrl = url.origin;
        }
      }
    } catch (e) {
      console.error("Error formatting socket URL:", e);
    }

    const socketInstance = io(socketUrl, {
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
