import { useQuery } from "@tanstack/react-query";
import { getFriendsList } from "../services/getFriendsList";
import { FRIENDS_QUERY_KEYS } from "../constants/friends-query-keys";

export const useFriendsList = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: FRIENDS_QUERY_KEYS.list(page, limit),
    queryFn: () => getFriendsList(page, limit),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};
