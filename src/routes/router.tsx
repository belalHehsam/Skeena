import { createBrowserRouter } from "react-router-dom";
import NotFound from "../pages/not-found";
import Home from "../pages/home";
import { MainLayout } from "../components/layout/MainLayout";
import RootErrorBoundary from "@/components/errors/RootErrorBoundary";
import Notifications from "@/pages/notifications";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <RootErrorBoundary />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "notifications",
                element: <Notifications />
            }
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;
