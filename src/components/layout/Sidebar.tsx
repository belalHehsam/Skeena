import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Compass,
  Users,
  PlusSquare,
  User,
  LogOut,
  X,
  MessageSquare,
  Mic,
  // Bell,
} from "lucide-react";
import { Button } from "../ui/button";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { usePostModal } from "@/features/posts/context/PostModalContext";
import { useTranslation } from "react-i18next";

const navLinks = [
  {
    name: "Home Feed",
    translationKey: "layout.sidebar.home",
    href: "/",
    icon: Home,
  },
  {
    name: "Explore",
    translationKey: "layout.sidebar.explore",
    href: "/explore",
    icon: Compass,
  },
  // { name: "Notifications", translationKey: "layout.sidebar.notifications", href: "/notifications", icon: Bell },
  {
    name: "Friends",
    translationKey: "layout.sidebar.friends",
    href: "/friends",
    icon: Users,
  },
  {
    name: "Chat",
    translationKey: "layout.sidebar.chat",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    name: "Voice",
    translationKey: "layout.sidebar.voice",
    href: "/voice",
    icon: Mic,
  },
  {
    name: "Create Post",
    translationKey: "layout.sidebar.createPost",
    href: "/create",
    icon: PlusSquare,
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const { openCreate } = usePostModal();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation("common");

  const logoutMutation = useLogout({
    onSettled: () => {
      navigate("/login", { replace: true });
    },
  });

  function handleLogout() {
    logoutMutation.mutate();
  }

  return (
    <aside className="bg-white dark:bg-[#182E27] flex h-full w-64 flex-col border-r border-neutral-200 dark:border-neutral-800 rtl:border-r-0 rtl:border-l rtl:border-neutral-200 dark:rtl:border-neutral-800">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 pt-3">
        <Link
          to="/"
          className="font-heading text-primary flex items-center gap-2 text-2xl font-bold"
          onClick={onClose}
        >
          <img src="/logo-icon.png" alt="" className="w-13" />
          {t("layout.appName", "Majlis")}
        </Link>

        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">
              {t("layout.sidebar.close", "Close sidebar")}
            </span>
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-2 p-4">
        {navLinks.map((link) => {
            if (link.name === "Create Post") {
              const Icon = link.icon;
              return (
                <Button
                  key={link.name}
                  variant="ghost"
                  onClick={() => {
                    openCreate();
                    onClose?.();
                  }}
                  className="w-full h-auto justify-start gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
                >
                  <Icon className="size-5" />
                  {t(link.translationKey, link.name)}
                </Button>
              );
            }

          const isActive =
            link.href === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              to={link.href}
              onClick={
                link.name === "Create Post"
                  ? () => {
                      openCreate();
                      onClose?.();
                    }
                  : onClose
              }
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
              }`}
            >
              <Icon className="h-5 w-5" />
              {t(link.translationKey, link.name)}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="mt-auto flex flex-col gap-2 p-4">
        <Link
          to="/profile"
          onClick={onClose}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
            location.pathname === "/profile"
              ? "bg-primary/10 text-primary"
              : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
          }`}
        >
          <User className="h-5 w-5" />
          {t("layout.sidebar.profile", "Profile")}
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-60 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
        >
          <LogOut className="h-5 w-5" />
          {logoutMutation.isPending
            ? t("layout.sidebar.loggingOut", "Logging out...")
            : t("layout.sidebar.logout", "Logout")}
        </button>
      </div>
    </aside>
  );
}
