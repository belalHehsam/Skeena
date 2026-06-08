import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MessageBubble } from "./MessageBubble";
import { DateDivider } from "./DateDivider";
import { TypingIndicator } from "./TypingIndicator";
import { groupMessagesByDate } from "../../utils/groupMessagesByDate";
import type { ChatMessage } from "../../types/chat";
import { Loader2 } from "lucide-react";

interface MessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export function MessageList({
  messages,
  isTyping,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: MessageListProps) {
  const { t } = useTranslation("common");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  const messageGroups = groupMessagesByDate(messages);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  // Scroll to bottom on initial render and when new messages/typing events occur
  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isTyping]);

  // Infinite scroll observer setup
  useEffect(() => {
    const observerTarget = observerRef.current;
    if (!observerTarget || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          // Record current scroll position to preserve anchor after load
          const container = scrollContainerRef.current;
          const previousScrollHeight = container ? container.scrollHeight : 0;
          const previousScrollTop = container ? container.scrollTop : 0;

          fetchNextPage();

          // Reposition scroll to avoid jump
          setTimeout(() => {
            if (container) {
              const heightDiff = container.scrollHeight - previousScrollHeight;
              container.scrollTop = previousScrollTop + heightDiff;
            }
          }, 100);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerTarget);
    return () => {
      if (observerTarget) observer.unobserve(observerTarget);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col scroll-smooth bg-neutral-50/20 dark:bg-neutral-900/10"
    >
      {/* Scroll scrollback load trigger */}
      {hasNextPage && (
        <div ref={observerRef} className="flex justify-center p-2">
          {isFetchingNextPage ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : (
            <span className="text-[10px] text-neutral-400 font-sans">
              {t("chat.loadMore", "Loading history...")}
            </span>
          )}
        </div>
      )}

      {/* Grouped message nodes */}
      {Object.entries(messageGroups).map(([dateStr, groupMessages]) => (
        <div key={dateStr} className="space-y-1">
          <DateDivider dateString={dateStr} />
          {groupMessages.map((msg) => (
            <MessageBubble key={msg._id} message={msg} />
          ))}
        </div>
      ))}

      {/* Real-time typing indicators */}
      {isTyping && (
        <div className="pt-2">
          <TypingIndicator />
        </div>
      )}
    </div>
  );
}
export default MessageList;
