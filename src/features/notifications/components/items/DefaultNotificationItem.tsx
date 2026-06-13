import { NotificationLayout, type BaseNotificationItemProps } from "./NotificationLayout";

export const DefaultNotificationItem = ({
  notification,
  variant,
  onClick,
}: BaseNotificationItemProps) => {
  return (
    <NotificationLayout notification={notification} variant={variant} onClick={onClick}>
      {/* Default notifications just render the top text and time */}
    </NotificationLayout>
  );
};
