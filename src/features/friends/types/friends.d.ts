export type FriendsTabs = "list" | "requests" | "suggestions";

export type FriendsFilterOption = {
  id: FriendsTabs;
  label: string;
};

export type FriendshipStatus = "none" | "pending_sent" | "pending_received" | "accepted";

export interface RequestUser {
  _id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  createdAt: string;
  friendshipStatus: FriendshipStatus;
  friendshipRequestId: string | null;
}

export interface UserSuggestionsResponse {
  status: string;
  data: {
    count: number;
    suggestions: RequestUser[];
  };
}

export interface FriendRequest {
  _id: string;
  requester: {
    _id: string;
    username: string;
    displayName?: string;
    avatar?: string;
    friendshipStatus: FriendshipStatus;
    friendshipRequestId: string | null;
  };
  recipient: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface FriendRequestsResponse {
  status: string;
  data: {
    data: number;
    requests: FriendRequest[];
  };
}

export interface FriendsListResponse {
  status: string;
  data: {
    friends: RequestUser[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}



export interface FriendStatusResponse {
  status: string;
  data: {
    status: FriendshipStatus;
    requestId: string | null;
  };
}
