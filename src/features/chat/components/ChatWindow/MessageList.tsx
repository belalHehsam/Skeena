import { useEffect, useRef, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { MessageBubble } from "./MessageBubble";
import { DateDivider } from "./DateDivider";
import { TypingIndicator } from "./TypingIndicator";
import { groupMessagesByDate } from "../../utils/groupMessagesByDate";
import type { ChatMessage, ChatParticipant } from "../../types/chat";
import { Loader2 } from "lucide-react";

interface MessageListProps {
  conversationId: string;
  messages: ChatMessage[];
  isTyping: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  participant?: ChatParticipant;
}

export function MessageList({
  conversationId,
  messages,
  isTyping,
  hasNextPage,
  participant,
  isFetchingNextPage,
  fetchNextPage,
}: MessageListProps) {
  const { t } = useTranslation("common");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const lastScrollHeightRef = useRef<number>(0);
  const lastScrollTopRef = useRef<number>(0);
  const lastNewestMessageIdRef = useRef<string | null>(null);
  const activeConversationIdRef = useRef<string | null>(null);
  const lastIsTypingRef = useRef<boolean>(isTyping);
  const isInitialScrollDone = useRef<boolean>(false);

  const messageGroups = groupMessagesByDate(messages);

  const scrollToBottomInstant = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "auto" });
      lastScrollTopRef.current = container.scrollTop;
      lastScrollHeightRef.current = container.scrollHeight;
    }
  };

  const scrollToBottomSmooth = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      lastScrollTopRef.current = container.scrollTop;
      lastScrollHeightRef.current = container.scrollHeight;
    }
  };

  // Keep track of scroll positions during manual scrolls
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    lastScrollTopRef.current = container.scrollTop;
    lastScrollHeightRef.current = container.scrollHeight;
  };

  // Adjust scroll position after prepending older messages (history)
  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (lastScrollHeightRef.current > 0 && messages.length > 0) {
      const heightDiff = container.scrollHeight - lastScrollHeightRef.current;
      if (heightDiff > 0) {
        container.scrollTop = lastScrollTopRef.current + heightDiff;
      }
    }

    lastScrollHeightRef.current = container.scrollHeight;
    lastScrollTopRef.current = container.scrollTop;
  }, [messages]);

  // Handle scroll-to-bottom for conversation load or new messages
  useEffect(() => {
    if (!conversationId) return;

    const newestMessage = messages[0];
    const newestMessageId = newestMessage?._id || null;

    // 1. If conversation changed
    if (activeConversationIdRef.current !== conversationId) {
      activeConversationIdRef.current = conversationId;
      lastNewestMessageIdRef.current = newestMessageId;
      isInitialScrollDone.current = false;
      if (messages.length > 0) {
        scrollToBottomInstant();
        isInitialScrollDone.current = true;
      }
      return;
    }

    // 2. If messages loaded for the first time in the current conversation
    if (messages.length > 0 && !lastNewestMessageIdRef.current) {
      lastNewestMessageIdRef.current = newestMessageId;
      scrollToBottomInstant();
      isInitialScrollDone.current = true;
      return;
    }

    // 3. If a new message was added (e.g. sent or received)
    if (newestMessageId && newestMessageId !== lastNewestMessageIdRef.current) {
      lastNewestMessageIdRef.current = newestMessageId;
      scrollToBottomSmooth();
    }
  }, [messages, conversationId]);

  // Handle typing indicator scroll
  useEffect(() => {
    if (isTyping && !lastIsTypingRef.current) {
      scrollToBottomSmooth();
    }
    lastIsTypingRef.current = isTyping;
  }, [isTyping]);

  // Infinite scroll observer setup
  useEffect(() => {
    const observerTarget = observerRef.current;
    if (!observerTarget || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage && isInitialScrollDone.current) {
          fetchNextPage();
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
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col bg-neutral-50/20 dark:bg-neutral-900/10"
    >
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

      {Object.entries(messageGroups).map(([dateStr, groupMessages]) => (
        <div key={dateStr} className="space-y-1">
          <DateDivider dateString={dateStr} />
          {groupMessages.map((msg) => (
            <MessageBubble participant={participant} key={msg._id} message={msg} />
          ))}
        </div>
      ))}

      {isTyping && (
        <div className="pt-2">
          <TypingIndicator participant={participant} />
        </div>
      )}
    </div>
  );
}
export default MessageList;
