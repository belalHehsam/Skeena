import { customFetch } from "@/services/customFetch";
import type { FriendsListResponse } from "../types/friends";

export const getFriendsList = (
  page: number,
  limit: number,
): Promise<FriendsListResponse> => {
  return customFetch(`/friends?page=${page}&limit=${limit}`, {
    method: "GET",
  });
};
