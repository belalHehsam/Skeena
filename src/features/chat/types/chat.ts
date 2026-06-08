export type MessageType = "text" | "image";

export type ChatParticipant = {
  _id: string;
  name?: string;
  displayName?: string;
  username?: string;
  profileImage?: string;
  avatar?: string;
};

export type ChatMessage = {
  _id: string;
  conversation: string;
  sender: string | ChatParticipant;
  recipient: string;
  content: string;
  type: MessageType;
  isEdited: boolean;
  isDeleted: boolean;
  readAt: string | null;
  mediaUrl?: string;
  mediaPublicId?: string;
  mediaMimeType?: string;
  createdAt: string;
  updatedAt: string;
  _isOptimistic?: boolean;
};

export type Conversation = {
  _id: string;
  participants: ChatParticipant[];
  lastMessage?: ChatMessage;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type SendMessagePayload = {
  recipientId: string;
  content?: string;
  media?: File;
};
