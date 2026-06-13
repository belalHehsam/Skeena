import { useMutation, useQueryClient } from "@tanstack/react-query";
import { togglePostLike } from "../services/togglePostLike";
import { POSTS_QUERY_KEYS } from "../constants/posts-query-keys";
import type { Post } from "../types/post";

export default function useToggleLike(post: Post, activeCategory: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await togglePostLike(post._id);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [POSTS_QUERY_KEYS.POSTS, activeCategory],
      });
      const prevPosts = queryClient.getQueryData([
        POSTS_QUERY_KEYS.POSTS,
        activeCategory,
      ]);
      queryClient.setQueryData(
        [POSTS_QUERY_KEYS.POSTS, activeCategory],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => {
              return {
                ...page,
                data: {
                  ...page.data,
                  posts: page.data.posts.map((p: Post) => {
                    if (p._id === post._id) {
                      return {
                        ...p,
                        isLiked: !p.isLiked,
                        likesCount: p.isLiked
                          ? p.likesCount - 1
                          : p.likesCount + 1,
                      };
                    }
                    return p;
                  }),
                },
              };
            }),
          };
        },
      );
      return { prevPosts };
    },

    onError: (err, _, context) => {
      console.log(err, "error");
      // Rollback to previous data
      if (context?.prevPosts) {
        queryClient.setQueryData(
          [POSTS_QUERY_KEYS.POSTS, activeCategory],
          context.prevPosts,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [POSTS_QUERY_KEYS.POSTS, activeCategory],
      });
    },
  });
}
