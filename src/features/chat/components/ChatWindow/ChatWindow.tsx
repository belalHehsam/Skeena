import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetConversations } from "../../hooks/useGetConversations";
import { useGetMessages } from "../../hooks/useGetMessages";
import { useChatSocket } from "../../hooks/useChatSocket";
import { useMarkAsRead } from "../../hooks/useMarkAsRead";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "../MessageInput/MessageInput";
import { EmptyState } from "../EmptyState";
import { MessageListSkeleton } from "./MessageListSkeleton";
import { getOtherParticipant } from "../../utils/getOtherParticipant";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface ChatWindowProps {
  onBack?: () => void;
}

export function ChatWindow({ onBack }: ChatWindowProps) {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user: currentUser } = useAuth();

  const { data: conversations = [], isLoading: isLoadingConversations } = useGetConversations();
  const activeConversation = conversations.find((c) => c._id === conversationId);
  const otherParticipant = activeConversation
    ? getOtherParticipant(activeConversation.participants, currentUser?.id)
    : undefined;

  // Sockets and Queries
  const { isTyping } = useChatSocket(conversationId || "");
  const {
    data,
    isLoading: isLoadingMessages,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetMessages(conversationId || "");

  const markAsReadMutation = useMarkAsRead(conversationId || "");

  // Flatten infinite query pages
  const messages = data?.pages.flatMap((page) => page) || [];

  // Automatically mark as read when new messages are loaded or received
  useEffect(() => {
    if (conversationId && messages.length > 0) {
      // Find the latest message by sorting by date
      const latestMessage = [...messages].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];

      if (latestMessage) {
        const isMine = typeof latestMessage.sender === "string" 
          ? latestMessage.sender === currentUser?.id 
          : latestMessage.sender?._id === currentUser?.id;

        // Only mark read if the last message is incoming and unread
        if (!isMine && !latestMessage.readAt) {
          markAsReadMutation.mutate();
        }
      }
    }
  }, [conversationId, messages.length, currentUser?.id]);

  if (!conversationId) {
    return <EmptyState onStartNewChat={onBack} />;
  }

  if (isLoadingConversations || (isLoadingMessages && messages.length === 0)) {
    return (
      <div className="flex flex-col h-full bg-background border-none">
        <ChatHeader onBackClick={onBack} />
        <MessageListSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background relative border-none">
      <ChatHeader
        participant={otherParticipant}
        onBackClick={onBack}
      />
      
      <MessageList
        messages={messages}
        isTyping={isTyping}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />

      <MessageInput
        conversationId={conversationId}
        recipientId={otherParticipant?._id || ""}
      />
    </div>
  );
}
export default ChatWindow;
