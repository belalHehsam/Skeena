import { customFetch } from "@/services/customFetch";
import type { FriendRequestsResponse } from "../types/friends";

export const getFriendRequests = (): Promise<FriendRequestsResponse> => {
  return customFetch("/friends/request", {
    method: "GET",
  });
};
