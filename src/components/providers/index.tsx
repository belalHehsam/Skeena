import { type ReactNode } from "react";
import { Toaster } from "sonner";
import TanstackQueryProvider from "@/components/providers/TanstackQueryProvider";
import { DarkModeProvider } from "@/components/context/DarkModeContext";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import SocketProvider from "./SocketProvider";

type ProvidersProps = {
  children: ReactNode;
};

function Providers({ children }: ProvidersProps) {
  return (
    <DarkModeProvider>
      <TanstackQueryProvider>
        <AuthProvider>
          <SocketProvider>
            {children}
            <Toaster richColors position="bottom-right" />
          </SocketProvider>
        </AuthProvider>
      </TanstackQueryProvider>
    </DarkModeProvider>
  );
}

export default Providers;
