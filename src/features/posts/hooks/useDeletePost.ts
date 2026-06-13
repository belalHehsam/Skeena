import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post } from "../types/post";
import deletePost from "../services/deletePost";
import { POSTS_QUERY_KEYS } from "../constants/posts-query-keys";

export default function useDeletePost(post: Post, activeCategory: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await deletePost(post._id);
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
                  posts: page.data.posts.filter((p: Post) => {
                    return p._id !== post._id;
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
      console.log("Errorrrrrrrrrrrrrrrrrrrrr on deleting Post", err);
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
