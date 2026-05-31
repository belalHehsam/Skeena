import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../services/createPost";
import { POSTS_QUERY_KEYS } from "../constants/posts-query-keys";

export function useCreatePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createPost,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [POSTS_QUERY_KEYS.POSTS],
			});
		},
	});
}
