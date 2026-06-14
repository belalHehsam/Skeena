export const EXPLORE_QUERY_KEYS = {
  searchPosts: (query: string) => ["explore", "posts", query] as const,
  searchUsers: (query: string, page: number) =>
    ["explore", "users", query, page] as const,
};
