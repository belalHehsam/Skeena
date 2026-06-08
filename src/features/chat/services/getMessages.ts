import { customFetch } from "@/services/customFetch";
import type { ChatMessage } from "../types/chat";
import type { JSendSuccess } from "@/features/auth/types/auth";

export async function getMessages(conversationId: string, page = 1, limit = 20) {
  const res = await customFetch<JSendSuccess<{ data: ChatMessage[] }>>(
    `/api/chats/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
  );
  return res.data.data;
}
