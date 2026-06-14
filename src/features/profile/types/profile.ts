import type { UserSettings } from "@/features/auth/types/auth";
import type { Post } from "@/features/posts/types/post";

export type FriendshipStatus =
    | "none"
    | "pending_sent"
    | "pending_received"
    | "friends";

export type ProfileUser = {
    id: string;
    username: string;
    displayName?: string;
    email?: string;
    avatar?: string;
    coverPhoto?: string;
    bio?: string;
    settings?: UserSettings;
    friendshipStatus?: FriendshipStatus;
    isPrivate?: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type ProfilePagination = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export type ProfilePageData = {
    user: ProfileUser;
    posts: Post[];
    pagination: ProfilePagination;
};

export type UpdateProfileInput = {
    displayName: string;
    username: string;
    bio: string;
};

export type UpdateSettingsInput = Partial<UserSettings>;

export type JSendSuccess<TData> = {
    status: "success";
    data: TData;
};