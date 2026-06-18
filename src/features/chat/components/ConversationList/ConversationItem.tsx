import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Conversation } from "../../types/chat";
import { getOtherParticipant } from "../../utils/getOtherParticipant";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
}

export function ConversationItem({
  conversation,
  isActive,
}: ConversationItemProps) {
  const { t, i18n } = useTranslation("common");
  const { user: currentUser } = useAuth();
  const otherParticipant = getOtherParticipant(
    conversation.participants,
    currentUser?.id,
  );
  const locale = i18n.language || "en";

  const lastMessage = conversation.lastMessage;
  const isMine =
    lastMessage &&
    (typeof lastMessage.sender === "string"
      ? lastMessage.sender === currentUser?.id
      : lastMessage.sender?._id === currentUser?.id);

  // Derive unread status
  const hasUnread = lastMessage && !isMine && !lastMessage.readAt;

  // Format last message timestamp
  const formatTime = (isoString?: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString(locale, { month: "short", day: "numeric" });
  };

  const renderMessagePreview = () => {
    if (!lastMessage) return t("chat.noMessages", "No messages yet");

    const prefix = isMine ? `${t("chat.you", "You")}: ` : "";
    if (lastMessage.type === "image") {
      return (
        <span className="text-primary flex items-center gap-1 italic">
          {prefix}📸 {t("chat.image", "Image")}
        </span>
      );
    }
    return `${prefix}${lastMessage.content}`;
  };

  const name =
    otherParticipant?.displayName ||
    otherParticipant?.name ||
    otherParticipant?.username ||
    t("chat.unknownUser", "User");
  const avatarUrl = otherParticipant?.profileImage || otherParticipant?.avatar;

  return (
    <Link
      to={`/chat/${conversation._id}`}
      className={`flex items-center gap-3 rounded-xl p-3.5 transition-all duration-200 ltr:border-r-0 ltr:border-l-4 rtl:border-r-4 rtl:border-l-0 ${
        isActive
          ? "bg-primary/10 border-primary shadow-sm"
          : "border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800"
      }`}
    >
      <div className="relative shrink-0">
        <Avatar className="h-12 w-12 border border-neutral-100 dark:border-neutral-700">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {/* <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-neutral-900 bg-emerald-500" /> */}
      </div>

      <div className="min-w-0 flex-1 text-start">
        <div className="mb-0.5 flex items-center justify-between gap-1">
          <h4 className="text-neutral-850 truncate text-sm font-bold dark:text-neutral-100">
            {name}
          </h4>
          <span className="text-[10px] whitespace-nowrap text-neutral-400 dark:text-neutral-500">
            {formatTime(conversation.lastMessageAt || lastMessage?.createdAt)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p
            className={`truncate font-sans text-xs ${
              hasUnread
                ? "font-semibold text-neutral-900 dark:text-neutral-200"
                : "text-neutral-500 dark:text-neutral-400"
            }`}
          >
            {renderMessagePreview()}
          </p>
          {hasUnread && (
            <Badge className="bg-primary flex h-4.5 min-w-4.5 shrink-0 animate-bounce items-center justify-center rounded-full border-none px-1 text-[10px] text-white"></Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
export default ConversationItem;
