import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { SocketProvider } from "@/features/chat/context/SocketContext";
import { GlobalLayoutSkeleton } from "@/components/layout/GlobalLayoutSkeleton";

type ProtectedRouteProps = {
    children?: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <GlobalLayoutSkeleton />;
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