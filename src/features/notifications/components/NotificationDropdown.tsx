import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotificationStore } from "@/store/notificationStore";
import { Bell, CheckCheckIcon } from "lucide-react";
import type { FC } from "react";
import { useNotifications } from "../hooks/useNotifications";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

// interface NotificationDropdownProps {

// }

const NotificationDropdown: FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  console.log('is mobile: ', isMobile)
  const { data, isLoading, isError } = useNotifications({ limit: 5 });
  const unreadNotifications = useNotificationStore(
    (state) => state.unreadCount,
  );
  const notificationLabel =
    unreadNotifications > 9 ? "9+" : String(unreadNotifications);

  const handleMarkAllAsRead = async () => {};

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "relative overflow-visible text-neutral-600",
        )}
        aria-label={`Notifications (${unreadNotifications})`}
      >
        <Bell className="size-5" />
        {unreadNotifications > 0 && (
          <span className="ring-background absolute -top-1.5 -right-2 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 text-xs leading-none text-white ring-2">
            {notificationLabel}
          </span>
        )}
        <span className="sr-only">Notifications</span>
      </PopoverTrigger>
      <PopoverContent align={isMobile ? "center" : "end"}>
        <div className="flex items-center justify-between">
          <PopoverHeader>Notifications</PopoverHeader>
          <Button variant="link" size="sm" onClick={handleMarkAllAsRead}>
            <CheckCheckIcon className="size-4" />
            Mark all as read
          </Button>
        </div>
        {isLoading && <p>Loading notifications...</p>}
        {isError && <p>Error loading notifications</p>}
        {data?.data.notifications.length === 0 && <p>No notifications</p>}
        {data?.data.notifications.map((notification) => (
          <div key={notification._id}>
            {!notification.isRead && (
              <div className="h-2 w-2 rounded-full bg-amber-400"></div>
            )}
            <p>{notification.type}</p>
            <p>{notification.sender?.username}</p>
            <p>{notification.createdAt}</p>
          </div>
        ))}
        <Button onClick={() => navigate("/notifications")}>
          View All Notifications
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;
