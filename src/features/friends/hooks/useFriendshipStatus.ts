import { useQuery } from "@tanstack/react-query";
import { getFriendshipStatus } from "../services/getFriendshipStatus";
import { FRIENDS_QUERY_KEYS } from "../constants/friends-query-keys";

export const useFriendshipStatus = (userId: string) => {
  return useQuery({
    queryKey: FRIENDS_QUERY_KEYS.status(userId),
    queryFn: () => getFriendshipStatus(userId),
    staleTime: Infinity,
  });
};
