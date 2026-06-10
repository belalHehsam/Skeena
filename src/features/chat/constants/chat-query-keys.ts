export const CHAT_QUERY_KEYS = {
  all: ["chat"] as const,
  conversations: () => ["chat", "conversations"] as const,
  conversation: (userId: string) => ["chat", "conversation", userId] as const,
  messages: (conversationId: string) => ["chat", "messages", conversationId] as const,
};
