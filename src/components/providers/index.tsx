import { type ReactNode } from "react";
import { Toaster } from "sonner";
import TanstackQueryProvider from "@/components/providers/TanstackQueryProvider";
import { DarkModeProvider } from "@/components/context/DarkModeContext";
import { AuthProvider } from "@/features/auth/context/AuthContext";

type ProvidersProps = {
    children: ReactNode;
};

function Providers({ children }: ProvidersProps) {
    return (
        <DarkModeProvider>
            <AuthProvider>
                <TanstackQueryProvider>{children}</TanstackQueryProvider>
                <Toaster richColors position="bottom-right" />
            </AuthProvider>
        </DarkModeProvider>
    );
}

export default Providers;