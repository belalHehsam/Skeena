import { useQuery } from "@tanstack/react-query";
import { getFriendshipStatus } from "../services/getFriendshipStatus";
import { FRIENDS_QUERY_KEYS } from "../constants/friends-query-keys";
import type { FriendStatusResponse } from "../types/friends";

export const useFriendshipStatus = (
  userId: string,
  initialData?: FriendStatusResponse["data"]
) => {
  return useQuery({
    queryKey: FRIENDS_QUERY_KEYS.status(userId),
    queryFn: () => getFriendshipStatus(userId),
    staleTime: Infinity,
    initialData: initialData
      ? {
          status: "success",
          data: initialData,
        }
      : undefined,
  });
};
