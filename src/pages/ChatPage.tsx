import { useParams, useNavigate } from "react-router-dom";
import { useGetConversations } from "../features/chat/hooks/useGetConversations";
import { ConversationList } from "../features/chat/components/ConversationList/ConversationList";
import { ChatWindow } from "../features/chat/components/ChatWindow/ChatWindow";
import { ConversationListSkeleton } from "../features/chat/components/ConversationList/ConversationListSkeleton";
import { EmptyState } from "../features/chat/components/EmptyState";

export function ChatPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { data: conversations = [], isLoading } = useGetConversations();
  console.log(conversations)
  const handleBackToList = () => {
    navigate("/chat");
  };

  return (
    <div className="flex h-[calc(100vh-7.5rem)] w-full overflow-hidden bg-background border border-border rounded-xl shadow-sm">
      {/* List panel */}
      <div className={`w-full lg:w-80 flex-shrink-0 h-full ${
        conversationId ? "hidden lg:block" : "block"
      }`}>
        {isLoading ? (
          <ConversationListSkeleton />
        ) : (
          <ConversationList
            conversations={conversations}
            activeConversationId={conversationId}
          />
        )}
      </div>

      {/* Chat Window panel */}
      <div className={`flex-1 h-full ${
        conversationId ? "block" : "hidden lg:block bg-neutral-50/20 dark:bg-neutral-900/10"
      }`}>
        {conversationId ? (
          <ChatWindow onBack={handleBackToList} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
export default ChatPage;
