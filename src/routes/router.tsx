import { createBrowserRouter } from "react-router-dom";
import NotFound from "../pages/not-found";
import Home from "../pages/home";
import { MainLayout } from "../components/layout/MainLayout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
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
