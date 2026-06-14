export const FRIENDS_QUERY_KEYS = {
  suggestions: ["friends", "suggestions"] as const,
  pendingRequests: ["friends", "requests", "pending"] as const,
  listBase: ["friends", "list"] as const,
  list: (page: number, limit: number) =>
    ["friends", "list", { page, limit }] as const,
  status: (userId: string) => ["friends", "status", userId] as const,
};
