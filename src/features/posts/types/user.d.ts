export type User = {
  status: string;
  data: {
    user: {
      id: string;
      username: string;
      displayName: type;
      settings: {
        theme: string;
        language: string;
        isPrivateProfile: boolean;
        allowFriendRequests: boolean;
        showEmail: boolean;
      };
      createdAt: string;
      updatedAt: string;
    };
  };
};
