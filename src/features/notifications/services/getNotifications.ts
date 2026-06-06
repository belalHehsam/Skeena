import { customFetch } from "@/services/customFetch";
import type { NotificationsResponse } from "../types/notification";

export const getNotifications = (params?: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}) => {
  const query = new URLSearchParams();

  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.unreadOnly) query.set("unreadOnly", String(params.unreadOnly));

  const queryString = query.toString();
  return customFetch<NotificationsResponse>(
    `/notifications${queryString ? `?${queryString}` : ""}`,
  );
};
