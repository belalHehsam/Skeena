import { useQuery } from "@tanstack/react-query";
import { getPostById } from "../services/getPostById";
import { POSTS_QUERY_KEYS } from "../constants/posts-query-keys";

export function useGetPostById(id?: string) {
	return useQuery({
		queryKey: [POSTS_QUERY_KEYS.POSTS, id],
		queryFn: () => getPostById(id!),
		enabled: !!id,
		staleTime: 1000 * 60 * 5,
	});
}
