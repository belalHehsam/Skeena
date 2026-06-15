import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePost } from "../services/updatePost";
import { POSTS_QUERY_KEYS } from "../constants/posts-query-keys";

export function useUpdatePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updatePost,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [POSTS_QUERY_KEYS.POSTS],
			});
		},
	});
}
