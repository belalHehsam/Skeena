import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../services/getAllPosts";
import { queryKeys } from "@/constants/queryKeys";

export function useGetAllPosts() {
  return useQuery({
    queryKey: queryKeys.posts.all,
    queryFn: getAllPosts,
  });
}
