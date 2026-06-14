import { customFetch } from "@/services/customFetch";

export const rejectFriendRequest = (id: string) => {
  return customFetch(`/friends/request/${id}/reject`, {
    method: "DELETE",
  });
};