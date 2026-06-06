export interface INotificationSender {
  _id: string;
  username: string;
  avatar?: string;
}

export interface INotification {
  _id: string;
  recipient: string;
  sender: INotificationSender;
  type: "like" | "comment" | "friend_request" | "friend_accept";
  post?: { _id: string };
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NotificationsResponse {
  status: string;
  data: {
    notifications: INotification[];
    meta: NotificationsMeta;
  };
}

export interface UnreadCountResponse {
  status: string;
  data: {
    unreadCount: number;
  };
}
