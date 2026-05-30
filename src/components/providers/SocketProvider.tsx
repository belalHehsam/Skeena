import socket from '@/lib/socket';
import { type ReactNode, useEffect } from 'react';

type Props = { children: ReactNode }

function SocketProvider({ children }: Props) {
  const user = localStorage.getItem("token");
  // const user = null;
  console.log("provider reRendered")

  useEffect(() => {
    if (!user) return;

    socket.connect();

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('connect_error', (err) => {
      console.log('Connection error occurred: ', err.message);
    });

    return () => {
      socket.disconnect();
    }
  }, [user])

  return <>{children}</>
}

export default SocketProvider