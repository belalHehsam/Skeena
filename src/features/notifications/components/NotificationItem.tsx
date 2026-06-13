import type { INotification } from "../types/notification";
import { LikeNotificationItem } from "./items/LikeNotificationItem";
import { CommentNotificationItem } from "./items/CommentNotificationItem";
import { FriendRequestNotificationItem } from "./items/FriendRequestNotificationItem";
import { DefaultNotificationItem } from "./items/DefaultNotificationItem";

interface NotificationItemProps {
  notification: INotification;
  variant?: "default" | "dropdown";
  onClick?: () => void;
}

const NotificationTypeMap: Record<string, React.ElementType> = {
  like: LikeNotificationItem,
  comment: CommentNotificationItem,
  friend_request: FriendRequestNotificationItem,
  friend_accept: DefaultNotificationItem,
  new_message: DefaultNotificationItem,
};

const NotificationItem = ({
  notification,
  variant = "default",
  onClick,
}: NotificationItemProps) => {
  const Component = NotificationTypeMap[notification.type] || DefaultNotificationItem;

  return (
    <Component
      notification={notification}
      variant={variant}
      onClick={onClick}
    />
  );
};

export default NotificationItem;
