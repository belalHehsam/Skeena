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
            <TanstackQueryProvider>
                <AuthProvider>
                    {children}
                </AuthProvider>
                <Toaster richColors position="bottom-right" />
            </TanstackQueryProvider>
        </DarkModeProvider>
    );
}

export default Providers;