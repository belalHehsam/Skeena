import { useQuery } from "@tanstack/react-query";
import getCurrentUser from "../services/getCurrentUser";

export default function useGetCurrentUser() {
  return useQuery({
    queryKey: ["auth/me"],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    retry: 1,
  });
}
