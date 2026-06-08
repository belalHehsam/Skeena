import { customFetch } from "@/services/customFetch";
import type { Conversation } from "../types/chat";
import type { JSendSuccess } from "@/features/auth/types/auth";

export async function getConversations() {
  const res = await customFetch<JSendSuccess<{ data: Conversation[] }>>(
    "/api/chats/conversations"
  );
  return res.data.data;
}
