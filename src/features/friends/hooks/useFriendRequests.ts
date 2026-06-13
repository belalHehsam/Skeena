import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../services/getFriendRequests";
import { FRIENDS_QUERY_KEYS } from "../constants/friends-query-keys";

export const useFriendRequests = () => {
  return useQuery({
    queryKey: FRIENDS_QUERY_KEYS.pendingRequests,
    queryFn: getFriendRequests,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 1,
  });
};
