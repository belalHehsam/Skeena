import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { ConversationItem } from "./ConversationItem";
import { NewChatButton } from "../NewChatButton";
import type { Conversation } from "../../types/chat";
import { getOtherParticipant } from "../../utils/getOtherParticipant";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId?: string;
}

export function ConversationList({ conversations, activeConversationId }: ConversationListProps) {
  const { t } = useTranslation("common");
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState("");
console.log(currentUser)
  const filtered = conversations.filter((c) => {
    const other = getOtherParticipant(c.participants, currentUser?.id);
    console.log(other)
    if (!other) return false;
    const searchLower = search.toLowerCase();
    return (
      
      (other.displayName && other.displayName.toLowerCase().includes(searchLower)) ||
      (other.username && other.username.toLowerCase().includes(searchLower))
    );
  });
console.log(filtered)
  return (
    <div className="flex flex-col h-full bg-background border-r border-border rtl:border-l rtl:border-r-0">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-heading text-xl font-bold text-neutral-850 dark:text-neutral-100">
          {t("chat.title", "Chats")}
        </h2>
        <NewChatButton />
      </div>

      {/* Local search bar */}
      <div className="p-3 border-b border-border bg-neutral-50/50 dark:bg-neutral-900/50">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("chat.searchConversations", "Search chats...")}
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* List items */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-sm text-neutral-500 dark:text-neutral-400 font-sans">
            {search ? t("chat.noSearchResults", "No conversations match your search.") : t("chat.noConversations", "No active chats yet.")}
          </div>
        ) : (
          filtered.map((c) => (
            <ConversationItem
              key={c._id}
              conversation={c}
              isActive={c._id === activeConversationId}
            />
          ))
        )}
      </div>
    </div>
  );
}
export default ConversationList;
