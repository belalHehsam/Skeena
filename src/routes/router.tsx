import { createBrowserRouter } from "react-router-dom";
import NotFound from "../pages/not-found";
import Home from "../pages/home";
import { MainLayout } from "../components/layout/MainLayout";
import RootErrorBoundary from "@/components/errors/RootErrorBoundary";

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
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;
