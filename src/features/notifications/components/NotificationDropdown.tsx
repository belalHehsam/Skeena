import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useNotificationStore } from "@/store/notificationStore";
import { Bell, CheckCheckIcon } from "lucide-react";
import { type FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMarkAllNotificationsRead } from "../hooks/useMarkAllNotificationsRead";
import { NotificationList } from "./NotificationList";
import { useTranslation } from "react-i18next";

const NotificationDropdown: FC = () => {
  const { t } = useTranslation("notifications");
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const { mutate: markAllNotificationsRead } = useMarkAllNotificationsRead();

  const unreadNotifications = useNotificationStore(
    (state) => state.unreadCount,
  );
  const notificationLabel =
    unreadNotifications > 9 ? "9+" : String(unreadNotifications);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "relative overflow-visible text-neutral-600 dark:text-neutral-300",
        )}
        aria-label={`${t("title")} (${unreadNotifications})`}
      >
        <Bell className="size-5" />
        {unreadNotifications > 0 && (
          <span className="ring-background absolute inset-e-2 top-1.5 flex h-4 min-w-4 translate-x-1 rtl:-translate-x-1 -translate-y-1 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] leading-none font-bold text-white ring-2">
            {notificationLabel}
          </span>
        )}
        <span className="sr-only">{t("title")}</span>
      </PopoverTrigger>
      <PopoverContent align={isMobile ? "center" : "end"} className="p-0 flex flex-col gap-0 w-72 sm:w-80">
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
          <PopoverHeader className="p-0 font-semibold text-neutral-900 dark:text-neutral-100">{t("title")}</PopoverHeader>
          {unreadNotifications > 0 && (
            <Button
              variant="link"
              size="sm"
              onClick={() => markAllNotificationsRead()}
              className="text-xs h-auto p-0 flex items-center gap-1 text-primary hover:text-primary/80"
            >
              <CheckCheckIcon className="size-3.5" />
              {t("markAllRead")}
            </Button>
          )}
        </div>

        <NotificationList onItemClick={() => setOpen(false)} />

        <div className="px-4 py-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20">
          <Button
            variant="outline"
            className="w-full border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-medium"
            onClick={() => {
              setOpen(false);
              navigate("/notifications");
            }}
          >
            {t("viewAll")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;
