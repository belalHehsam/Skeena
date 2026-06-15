import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { POSTS_QUERY_KEYS } from "../constants/posts-query-keys";
import { togglePostLike } from "../services/togglePostLike";
import type { Post, GetPostByIdResponse } from "../types/post";

type PageWithPosts = {
  posts?: Post[];

  data?: {
    posts?: Post[];
    [key: string]: unknown;
  };

  [key: string]: unknown;
};

type InfinitePostsData = {
  pages: PageWithPosts[];
  [key: string]: unknown;
};

function togglePostInList(
  posts: Post[] | undefined,
  postId: string,
) {
  return posts?.map((post) => {
    if (post._id !== postId) {
      return post;
    }

    const wasLiked = Boolean(post.isLiked);

    return {
      ...post,
      isLiked: !wasLiked,
      likesCount: Math.max(
        0,
        post.likesCount + (wasLiked ? -1 : 1),
      ),
    };
  });
}

function updateInfinitePosts(
  current: InfinitePostsData | undefined,
  postId: string,
) {
  if (!current) {
    return current;
  }

  return {
    ...current,

    pages: current.pages.map((page) => {
      if (page.data?.posts) {
        return {
          ...page,
          data: {
            ...page.data,
            posts: togglePostInList(
              page.data.posts,
              postId,
            ),
          },
        };
      }

      if (page.posts) {
        return {
          ...page,
          posts: togglePostInList(
            page.posts,
            postId,
          ),
        };
      }

      return page;
    }),
  };
}

export default function useToggleLike(
  post: Post,
  activeCategory?: string,
  customQueryKey?: QueryKey,
) {
  const queryClient = useQueryClient();

  const targetQueryKey =
    customQueryKey ??
    [POSTS_QUERY_KEYS.POSTS, activeCategory, undefined];

  return useMutation({
    mutationFn: async () => {
      await togglePostLike(post._id);
    },

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: targetQueryKey,
      });

      const previousPosts =
        queryClient.getQueryData<InfinitePostsData>(
          targetQueryKey,
        );

      queryClient.setQueryData<InfinitePostsData>(
        targetQueryKey,
        (current) =>
          updateInfinitePosts(
            current,
            post._id,
          ),
      );

      const singlePostQueryKey = [POSTS_QUERY_KEYS.POSTS, post._id];
      const previousSinglePostData = queryClient.getQueryData<GetPostByIdResponse>(singlePostQueryKey);
      if (previousSinglePostData?.data?.post) {
        const singlePost = previousSinglePostData.data.post;
        queryClient.setQueryData<GetPostByIdResponse>(singlePostQueryKey, {
          ...previousSinglePostData,
          data: {
            ...previousSinglePostData.data,
            post: {
              ...singlePost,
              isLiked: !singlePost.isLiked,
              likesCount: Math.max(0, singlePost.likesCount + (singlePost.isLiked ? -1 : 1)),
            }
          }
        });
      }

      return {
        previousPosts,
        previousSinglePostData,
      };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(
          targetQueryKey,
          context.previousPosts,
        );
      }
      if (context?.previousSinglePostData) {
        queryClient.setQueryData(
          [POSTS_QUERY_KEYS.POSTS, post._id],
          context.previousSinglePostData,
        );
      }
    },

    onSettled: () => {
      if (!customQueryKey) {
        queryClient.invalidateQueries({
          queryKey: targetQueryKey,
        });
      }
      queryClient.invalidateQueries({
        queryKey: [POSTS_QUERY_KEYS.POSTS, post._id],
      });
    },
  });
}