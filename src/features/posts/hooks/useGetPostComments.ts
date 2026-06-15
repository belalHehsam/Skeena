import { useInfiniteQuery } from '@tanstack/react-query';
import { getPostComments } from '../services/getPostComments';

export function useGetPostComments(postId: string) {
  return useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam = 1 }) => getPostComments(postId, pageParam),
    initialPageParam: 1, 
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.data.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    enabled: !!postId,
  });
}