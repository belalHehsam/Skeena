import { customFetch } from "@/services/customFetch";

export const acceptFriendRequest = (id: string) => {
  return customFetch(`/friends/request/${id}/accept`, {
    method: "PATCH",
  });
};
