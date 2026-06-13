import NotificationPopover from "@/features/notifications/components/NotificationDropdown";
import { Menu, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { UserAvatar } from "../shared/UserAvatar";
import { GlobalSearch } from "@/features/explore/components/GlobalSearch";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user } = useAuth();

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
        <GlobalSearch />
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center gap-4">
        <NotificationPopover />

        <Button variant="ghost" size="icon" className="text-neutral-600">
          <Settings className="size-5" />
          <span className="sr-only">Settings</span>
        </Button>

        {user ? (
          <UserAvatar
            src={user.avatar}
            username={user.username}
            size={36}
            className="cursor-pointer"
          />
        ) : (
          <div className="bg-primary/20 text-primary hover:bg-primary/30 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sm font-bold transition-colors">
            ?
          </div>
        )}
      </div>
    </header>
  );
}
