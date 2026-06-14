import NotificationPopover from "@/features/notifications/components/NotificationDropdown";
import { Menu, Search, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { UserAvatar } from "../shared/UserAvatar";
import {
  Link,
  useNavigate,
} from "react-router-dom";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-background sticky top-0 z-40 flex h-16 w-full shrink-0 items-center justify-between border-b px-4 lg:px-6">
      {/* Mobile Menu Button & Search */}
      <div className="flex flex-1 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-neutral-600 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="size-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="relative hidden w-full max-w-md sm:block">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search..."
            className="border-input dark:border-neutral-800 focus-visible:ring-ring h-9 w-full rounded-full border bg-neutral-50 dark:bg-neutral-900 px-9 py-1 text-sm text-neutral-900 dark:text-neutral-100 transition-colors placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:outline-none focus:bg-white dark:focus:bg-neutral-950"
          />
        </div>
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center gap-4">
        <NotificationPopover />

        <Button
          variant="ghost"
          size="icon"
          className="text-neutral-600 dark:text-neutral-300"
          onClick={() => {
            navigate("/settings");
          }}
        >
          <Settings className="size-5" />
          <span className="sr-only">
            Settings
          </span>
        </Button>

        {user ? (
          <Link
            to="/profile"
            aria-label="Open profile"
          >
            <UserAvatar
              key={
                user.avatar ??
                user.username
              }
              src={user.avatar}
              username={
                user.displayName ??
                user.username
              }
              size={36}
              className="cursor-pointer ring-2 ring-transparent transition hover:ring-primary/30"
            />
          </Link>
        ) : (
          <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary transition-colors hover:bg-primary/30">
            ?
          </div>
        )}
      </div>
    </header>
  );
}
