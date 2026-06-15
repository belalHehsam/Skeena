import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { PostModal } from "@/features/posts/components/PostModal";
import { PostModalProvider } from "@/features/posts/context/PostModalContext";
import { useGlobalChatSocket } from "@/features/chat/hooks/useGlobalChatSocket";

export function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Register global socket listener for chat message notifications
  useGlobalChatSocket();

  return (
    <PostModalProvider>
      <div className="flex h-screen w-full overflow-hidden bg-neutral-50 dark:bg-neutral-950">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out lg:relative lg:flex lg:w-64 lg:flex-shrink-0 lg:translate-x-0 lg:opacity-100 rtl:right-0 rtl:left-auto lg:rtl:translate-x-0 ${
            isSidebarOpen
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0 rtl:translate-x-full"
          }`}
        >
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>

        {/* Main content wrapper */}
        <div className="flex-col overflow-hidden flex min-w-0 flex-1">
          <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

          <main
            id="main-scroll-container"
            className="flex-1 overflow-y-auto p-6"
          >
            <Outlet />
          </main>
        </div>

        {/* Global Modals */}
        <PostModal />
      </div>
    </PostModalProvider>
  );
}
