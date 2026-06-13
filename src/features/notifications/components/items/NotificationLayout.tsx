import { UserAvatar } from "@/components/shared/UserAvatar";
import { formatDistanceToNow } from "@/utils/formatDistanceToNow";
import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useMarkNotificationRead } from "../../hooks/useMarkNotificationRead";
import type { INotification } from "../../types/notification";
import { getNotificationPath } from "../../utils/getNotificationPath";
import { getNotificationText } from "../../utils/getNotificationText";

export interface BaseNotificationItemProps {
  notification: INotification;
  variant?: "default" | "dropdown";
  onClick?: () => void;
}

interface NotificationLayoutProps extends BaseNotificationItemProps {
  children?: React.ReactNode;
}

export const NotificationLayout = ({
  notification,
  variant = "default",
  onClick,
  children,
}: NotificationLayoutProps) => {
  const { t } = useTranslation("notifications");
  const { mutate: markAsRead } = useMarkNotificationRead();

  const handleItemClick = () => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    onClick?.();
  };

  const containerClasses =
    variant === "dropdown"
      ? "flex cursor-pointer items-start gap-3 text-start transition-all select-none focus:outline-none w-full px-2 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 rounded-lg"
      : "flex cursor-pointer items-start gap-3 text-start transition-all select-none focus:outline-none w-full rounded-xl border px-4 py-3 border-neutral-100 bg-white hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800/30";

  return (
    <Link
      to={getNotificationPath(notification)}
      onClick={handleItemClick}
      className={containerClasses}
    >
      {notification.sender ? (
        <UserAvatar
          src={notification.sender.avatar}
          username={notification.sender.username}
          size="sm"
        />
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
          <Bell className="size-4" />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col text-sm">
        <span className="leading-snug font-medium wrap-break-word text-neutral-900 dark:text-neutral-100">
          {notification.sender ? (
            <span className="font-normal text-neutral-500 dark:text-neutral-400">
              {t(`actionText.${notification.type}`, {
                username: notification.sender.username,
              })}
            </span>
          ) : (
            <span className="font-normal text-neutral-900 dark:text-neutral-100">
              {getNotificationText(notification)}
            </span>
          )}
        </span>
        <span className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
          {formatDistanceToNow(notification.createdAt)}
        </span>

        {children}
      </div>

      {!notification.isRead && (
        <div className="flex h-5 items-center shrink-0 self-center ml-2 rtl:mr-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary ring-4 ring-primary-100/50 dark:ring-primary-950/30" />
        </div>
      )}
    </Link>
  );
};
