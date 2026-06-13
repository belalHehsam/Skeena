import { customFetch } from "@/services/customFetch";
import type { FriendStatusResponse } from "../types/friends";

export const getFriendshipStatus = (userId: string): Promise<FriendStatusResponse> => {
  return customFetch(`/friends/status/${userId}`);
};
