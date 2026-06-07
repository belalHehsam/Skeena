export const queryKeys = {
    auth: {
        all: ["auth"] as const,
        me: ["auth", "me"] as const,
        login: ["auth", "login"] as const,
        register: ["auth", "register"] as const,
        logout: ["auth", "logout"] as const,
    },
    posts: {
        all: ["posts"] as const,
        detail: (postId: string) => ["posts", postId] as const,
    },
};