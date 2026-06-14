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
import { VoicePage } from "@/pages/VoicePage";
import Notifications from "@/pages/notifications";
import Friends from "@/pages/friends";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";
import Explore from "@/pages/explore";
import SinglePost from "@/pages/SinglePost";

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
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "profile/:id",
        element: <ProfilePage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
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
      {
        path: "voice",
        element: <VoicePage />,
      },
      {
        path: "voice/:channelId",
        element: <VoicePage />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "friends",
        element: <Friends />,
      },
      {
        path: "explore",
        element: <Explore />,
      },
      {
        path: "posts/:postId",
        element: <SinglePost />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
