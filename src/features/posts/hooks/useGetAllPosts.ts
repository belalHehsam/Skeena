import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { getAllPosts } from "../services/getAllPosts";

export function useGetAllPosts() {
	return useQuery({
		queryKey: queryKeys.posts.all,
		queryFn: getAllPosts,
	});
}