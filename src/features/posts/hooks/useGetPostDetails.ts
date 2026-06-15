import { useQuery } from '@tanstack/react-query';
import { getPostById } from '../services/getPostById';
import { POSTS_QUERY_KEYS } from '../constants/posts-query-keys';

export function useGetPostDetails(postId: string) {
  return useQuery({
    queryKey: [POSTS_QUERY_KEYS.POST_DETAILS, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId, 
  });
}