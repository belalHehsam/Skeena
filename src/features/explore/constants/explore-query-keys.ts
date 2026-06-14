export const EXPLORE_QUERY_KEYS = {
  searchUsers: (query: string, page: number) =>
    ["explore", "users", query, page] as const,
};
