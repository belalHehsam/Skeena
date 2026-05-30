import { type ReactNode } from "react";
import TanstackQueryProvider from "@/components/providers/TanstackQueryProvider";
import { DarkModeProvider } from "@/components/context/DarkModeContext";
import { Toaster } from 'sonner'
import SocketProvider from "./SocketProvider";

type ProvidersProps = {
    children: ReactNode;
};

function Providers({ children }: ProvidersProps) {
    return (
        <DarkModeProvider>
            <Toaster richColors position="bottom-right" />
            <TanstackQueryProvider>
                <SocketProvider>
                    {children}
                </SocketProvider>
            </TanstackQueryProvider>
        </DarkModeProvider>
    );
}

export default Providers;
