import { customFetch } from "@/services/customFetch";

export async function markConversationRead(conversationId: string) {
  return customFetch(`/api/chats/conversations/${conversationId}/read`, {
    method: "PATCH",
  });
}
