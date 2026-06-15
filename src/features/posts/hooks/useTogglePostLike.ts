import { useMutation, useQueryClient } from '@tanstack/react-query';
import { togglePostLike } from '../services/togglePostLike';
import type { GetPostByIdResponse } from '../types/post';
import { POSTS_QUERY_KEYS } from '../constants/posts-query-keys';

export function useTogglePostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => togglePostLike(postId),
    
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: [POSTS_QUERY_KEYS.POSTS, postId] });

      const previousData = queryClient.getQueryData<GetPostByIdResponse>([POSTS_QUERY_KEYS.POSTS, postId]);

      if (previousData?.data?.post) {
        const post = previousData.data.post;
        queryClient.setQueryData<GetPostByIdResponse>([POSTS_QUERY_KEYS.POSTS, postId], {
          ...previousData,
          data: {
            ...previousData.data,
            post: {
              ...post,
              isLiked: !post.isLiked,
              likesCount: post.isLiked 
                ? Math.max(0, post.likesCount - 1)
                : post.likesCount + 1,
            }
          }
        });
      }
      return { previousData };
    },
    
    onError: (_err, postId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData([POSTS_QUERY_KEYS.POSTS, postId], context.previousData);
      }
    },
    
    onSettled: (postId) => {
      queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEYS.POSTS, postId] });
      queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEYS.POSTS] });
    },
  });
}