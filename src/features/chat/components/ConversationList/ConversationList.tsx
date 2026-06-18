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

export function ConversationList({
  conversations,
  activeConversationId,
}: ConversationListProps) {
  const { t } = useTranslation("common");
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState("");
  console.log(currentUser);
  const filtered = conversations.filter((c) => {
    const other = getOtherParticipant(c.participants, currentUser?.id);
    console.log(other);
    if (!other) return false;
    const searchLower = search.toLowerCase();
    return (
      (other.displayName &&
        other.displayName.toLowerCase().includes(searchLower)) ||
      (other.username && other.username.toLowerCase().includes(searchLower))
    );
  });
  console.log(filtered);
  return (
    <div className="bg-background border-border flex h-full flex-col border-r rtl:border-r-0 rtl:border-l">
      <div className="border-border flex items-center justify-between border-b p-4">
        <h2 className="font-heading text-neutral-850 text-xl font-bold dark:text-neutral-100">
          {t("chat.title", "Chats")}
        </h2>
        <NewChatButton />
      </div>

      <div className="border-border border-b bg-neutral-50/50 p-3 dark:bg-neutral-900/50">
        <div className="relative">
          <Search className="absolute top-3 h-4 w-4 text-neutral-400 ltr:left-3 rtl:right-3" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("chat.searchConversations", "Search chats...")}
            className="border-border bg-background focus:border-primary focus:ring-primary/30 w-full rounded-lg border py-2 text-sm transition-all outline-none focus:ring-1 ltr:pr-4 ltr:pl-9 rtl:pr-9 rtl:pl-4"
          />
        </div>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <div className="py-8 text-center font-sans text-sm text-neutral-500 dark:text-neutral-400">
            {search
              ? t("chat.noSearchResults", "No conversations match your search.")
              : t("chat.noConversations", "No active chats yet.")}
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
