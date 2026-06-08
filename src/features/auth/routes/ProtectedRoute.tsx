import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { SocketProvider } from "@/features/chat/context/SocketContext";

type ProtectedRouteProps = {
    children?: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-neutral-50">
                <LoaderCircle className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <SocketProvider>
            {children ?? <Outlet />}
        </SocketProvider>
    );
}