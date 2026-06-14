import { useMutation, useQueryClient } from '@tanstack/react-query';
import { togglePostLike } from '../services/togglePostLike';
import type{ Post } from '../types/post';

export function useTogglePostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => togglePostLike(postId),
    
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['post', postId] });

      const previousPost = queryClient.getQueryData<Post>(['post', postId]);

      if (previousPost) {
        queryClient.setQueryData<Post>(['post', postId], {
          ...previousPost,
          isLiked: !previousPost.isLiked,
          likesCount: previousPost.isLiked 
            ? previousPost.likesCount - 1 
            : previousPost.likesCount + 1,
        });
      }
      return { previousPost };
    },
    
    onError: (err, postId, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(['post', postId], context.previousPost);
      }
    },
    
    onSettled: (postId) => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
}