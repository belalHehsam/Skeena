import type { Post } from "@/features/posts/types/post";

// ── Shared pagination shape ────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
}

// ── Post search ────────────────────────────────────────────────────────────────

export interface SearchPostsResponse {
  status: string;
  data: {
    posts: Post[];
    pagination: PaginationMeta;
  };
}

// ── User search ────────────────────────────────────────────────────────────────

export interface SearchUser {
  _id: string;
  username: string;
  avatar?: string;
}

export interface SearchUsersResponse {
  status: string;
  data: {
    users: SearchUser[];
    pagination: PaginationMeta;
  };
}
