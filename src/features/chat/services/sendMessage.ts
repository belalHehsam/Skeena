import { customFetch } from "@/services/customFetch";
import type { ChatMessage, SendMessagePayload } from "../types/chat";
import type { JSendSuccess } from "@/features/auth/types/auth";

export async function sendMessage(payload: SendMessagePayload) {
  const formData = new FormData();
  formData.append("recipientId", payload.recipientId);
  if (payload.content) formData.append("content", payload.content);
  if (payload.media) formData.append("media", payload.media);

  const res = await customFetch<JSendSuccess<{ data: ChatMessage }>>(
    "/api/chats/messages",
    {
      method: "POST",
      body: formData,
    }
  );
  return res.data.data;
}
