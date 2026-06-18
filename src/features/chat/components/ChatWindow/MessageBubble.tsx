import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, CheckCheck, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { ChatMessage, ChatParticipant } from "../../types/chat";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface MessageBubbleProps {
  message: ChatMessage;
  participant?: ChatParticipant;
}

export function MessageBubble({ message, participant }: MessageBubbleProps) {
  const { t, i18n } = useTranslation("common");
  const { user: currentUser } = useAuth();
  const locale = i18n.language || "en";
  const [isImageOpen, setIsImageOpen] = useState(false);
  console.log("message.sender", message.sender);
  const senderId =
    typeof message.sender === "string" ? message.sender : message.sender?._id;
  const isMine = senderId === currentUser?.id;
  const isOptimistic = message._isOptimistic;

  const senderName = participant?.displayName;
  const senderAvatar = participant?.avatar;

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (message.isDeleted) {
    return (
      <div
        className={`my-1 flex max-w-[70%] gap-2 ${isMine ? "ms-auto" : "me-auto"}`}
      >
        <div
          className={`rounded-xl border px-4 py-2 font-sans text-xs italic select-none ${
            isMine
              ? "bg-neutral-100 text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800"
              : "bg-neutral-50 text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900"
          }`}
        >
          {t("chat.deletedMessage", "This message was deleted")}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`animate-fade-in my-1.5 flex max-w-[85%] gap-2 sm:max-w-[70%] ${isMine ? "ms-auto flex-row-reverse" : "me-auto"}`}
    >
      {!isMine && (
        <Avatar className="h-8 w-8 shrink-0 self-end border border-neutral-100 dark:border-neutral-800">
          <AvatarImage src={senderAvatar} alt={senderName} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
            {senderName ? senderName.charAt(0).toUpperCase() : "?"}
          </AvatarFallback>
        </Avatar>
      )}

      <div className="flex flex-col">
        <div
          className={`wrap-break-words relative overflow-hidden px-4 py-2.5 text-sm shadow-sm transition-all duration-200 ${
            isMine
              ? "bg-primary rounded-2xl rounded-ee-sm text-start font-sans text-white"
              : "bg-card border-border text-neutral-850 rounded-2xl rounded-es-sm border text-start font-sans dark:text-neutral-100"
          } ${isOptimistic ? "opacity-75" : ""}`}
        >
          {message.mediaUrl && (
            <div className="mb-2 max-w-sm overflow-hidden rounded-lg border border-black/5 dark:border-white/5">
              <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
                <DialogTrigger
                  render={
                    <img
                      src={message.mediaUrl}
                      alt={t("chat.imageAttachment", "Media attachment")}
                      className="max-h-60 w-full cursor-zoom-in object-cover transition-transform duration-200 hover:scale-[1.02]"
                    />
                  }
                />
                <DialogContent className="flex max-w-4xl items-center justify-center border-none bg-transparent p-0 shadow-none">
                  <img
                    src={message.mediaUrl}
                    alt={t("chat.imageAttachment", "Media attachment")}
                    className="max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl"
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}

          {message.content && (
            <p className="leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          )}

          <div
            className={`mt-1 flex items-center justify-end gap-1 text-[9px] select-none ${
              isMine
                ? "text-primary-100"
                : "text-neutral-400 dark:text-neutral-500"
            }`}
          >
            <span>{formatTime(message.createdAt)}</span>

            {isMine && (
              <span className="flex items-center">
                {isOptimistic ? (
                  <Loader2 className="h-2.5 w-2.5 animate-spin md:h-3 md:w-3" />
                ) : message.readAt ? (
                  <CheckCheck className="text-secondary h-3 w-3 md:h-4 md:w-4" />
                ) : (
                  <Check className="h-3 w-3 md:h-4 md:w-4 text-white/70" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default MessageBubble;
