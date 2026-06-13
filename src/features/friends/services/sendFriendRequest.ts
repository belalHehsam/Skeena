import { customFetch } from "@/services/customFetch";

export const sendFriendRequest = (recipientId: string) => {
  return customFetch("/friends/request", {
    method: "POST",
    body: JSON.stringify({ recipientId }),
  });
};
