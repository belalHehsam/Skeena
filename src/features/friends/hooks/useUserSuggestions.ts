import { useQuery } from "@tanstack/react-query";
import { getUserSuggestions } from "../services/getUserSuggestions";
import { FRIENDS_QUERY_KEYS } from "../constants/friends-query-keys";

export const useUserSuggestions = () => {
  return useQuery({
    queryKey: FRIENDS_QUERY_KEYS.suggestions,
    queryFn: getUserSuggestions,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
};
