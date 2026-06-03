import { createBrowserRouter } from "react-router-dom";
import NotFound from "../pages/not-found";
import Home from "../pages/home";
import { MainLayout } from "../components/layout/MainLayout";
import RootErrorBoundary from "@/components/errors/RootErrorBoundary";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import { ProtectedRoute } from "@/features/auth/routes/ProtectedRoute";
import { PublicOnlyRoute } from "@/features/auth/routes/PublicOnlyRoute";

const router = createBrowserRouter([
    {
        element: <PublicOnlyRoute />,
        errorElement: <RootErrorBoundary />,
        children: [
            {
                element: <AuthLayout />,
                children: [
                    {
                        path: "login",
                        element: <LoginPage />,
                    },
                    {
                        path: "register",
                        element: <RegisterPage />,
                    },
                ],
            },
        ],
    },
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        errorElement: <RootErrorBoundary />,
        children: [
            {
                index: true,
                element: <Home />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;