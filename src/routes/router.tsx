import { createBrowserRouter } from "react-router-dom";
import RootErrorBoundary from "@/components/errors/RootErrorBoundary";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProtectedRoute } from "@/features/auth/routes/ProtectedRoute";
import { PublicOnlyRoute } from "@/features/auth/routes/PublicOnlyRoute";
import AuthLayout from "@/pages/auth/AuthLayout";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import { ChatPage } from "@/pages/ChatPage";

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
            {
                path: "chat",
                element: <ChatPage />,
            },
            {
                path: "chat/:conversationId",
                element: <ChatPage />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;