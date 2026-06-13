import { NotificationLayout, type BaseNotificationItemProps } from "./NotificationLayout";
import type { ICommentNotification } from "../../types/notification";

export const CommentNotificationItem = ({
  notification,
  variant,
  onClick,
}: BaseNotificationItemProps) => {
  const commentNotification = notification as ICommentNotification;

  return (
    <NotificationLayout notification={notification} variant={variant} onClick={onClick}>
      {commentNotification.commentText && (
        <p className="mt-1.5 truncate border-s-2 border-neutral-200 ps-2 text-xs text-neutral-500 italic dark:border-neutral-700 dark:text-neutral-400">
          {commentNotification.commentText}
        </p>
      )}
    </NotificationLayout>
  );
};
