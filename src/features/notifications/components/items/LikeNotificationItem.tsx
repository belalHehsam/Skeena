import { NotificationLayout, type BaseNotificationItemProps } from "./NotificationLayout";
import type { ILikeNotification } from "../../types/notification";

export const LikeNotificationItem = ({
  notification,
  variant,
  onClick,
}: BaseNotificationItemProps) => {
  const likeNotification = notification as ILikeNotification;
  const content = (likeNotification.post as unknown as { content?: string })?.content;

  return (
    <NotificationLayout notification={notification} variant={variant} onClick={onClick}>
      {content && (
        <p className="mt-1.5 truncate border-s-2 border-neutral-200 ps-2 text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
          {content}
        </p>
      )}
    </NotificationLayout>
  );
};
