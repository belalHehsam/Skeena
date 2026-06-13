import { customFetch } from "@/services/customFetch";

export const cancelFriendRequest = (id: string) => {
  return customFetch(`/friends/request/${id}/cancel`, {
    method: "DELETE",
  });
};
