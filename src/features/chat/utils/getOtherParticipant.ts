import type { ChatParticipant } from "../types/chat";

export function getOtherParticipant(
  participants: ChatParticipant[] = [],
  currentUserId: string | undefined
): ChatParticipant | undefined {
  if (!currentUserId) return participants[0];
  return participants.find((p) => p._id !== currentUserId);
}
