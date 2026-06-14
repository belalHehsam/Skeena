import { useQuery } from '@tanstack/react-query';
import { getPostById } from '../services/getPostById';

export function useGetPostDetails(postId: string) {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId, 
  });
}