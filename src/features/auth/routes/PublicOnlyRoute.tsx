import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AuthLayoutSkeleton } from "@/components/layout/AuthLayoutSkeleton";

export function PublicOnlyRoute() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <AuthLayoutSkeleton />;
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}