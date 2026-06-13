export const AUTH_QUERY_KEYS = {
  all: ["auth"] as const,
  me: ["auth", "me"] as const,
  login: ["auth", "login"] as const,
  register: ["auth", "register"] as const,
  logout: ["auth", "logout"] as const,
};
