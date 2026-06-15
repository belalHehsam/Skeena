export type UserRole = "user" | "moderator" | "admin";

export type AccountStatus = "active" | "suspended" | "deleted";

export type UserSettings = {
    theme: "light" | "dark" | "system";
    language: "en" | "ar";
    isPrivateProfile: boolean;
    allowFriendRequests: boolean;
    showEmail: boolean;
    notificationsEnabled: boolean;
    showOnlineStatus: boolean;
};

export type AuthUser = {
    id: string;
    username: string;
    displayName?: string;
    email: string;
    avatar?: string;
    coverPhoto?: string;
    bio?: string;
    role: UserRole;
    accountStatus: AccountStatus;
    settings: UserSettings;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
};

export type LoginRequest = {
    email: string;
    password: string;
};

export type RegisterRequest = {
    username: string;
    displayName?: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export type AuthPayload = {
    token: string;
    user: AuthUser;
};

export type MePayload = {
    user: AuthUser;
};

export type JSendSuccess<TData> = {
    status: "success";
    data: TData;
};
