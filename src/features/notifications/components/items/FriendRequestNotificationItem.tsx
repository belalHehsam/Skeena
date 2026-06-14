import { NotificationLayout, type BaseNotificationItemProps } from "./NotificationLayout";
import { FriendshipActions } from "../../../friends/components/FriendshipActions";

export const FriendRequestNotificationItem = ({
  notification,
  variant,
  onClick,
}: BaseNotificationItemProps) => {
  return (
    <NotificationLayout notification={notification} variant={variant} onClick={onClick}>
      <div className="mt-2 flex gap-2">
        <FriendshipActions userId={notification.sender._id} className="w-auto" />
      </div>
    </NotificationLayout>
  );
};

