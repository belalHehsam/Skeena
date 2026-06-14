export const PROFILE_QUERY_KEYS = {
    all: ["profile"] as const,
    detail: (profileKey: string) => ["profile", "detail", profileKey] as const,
};