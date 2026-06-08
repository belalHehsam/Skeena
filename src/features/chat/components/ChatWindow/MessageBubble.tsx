import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, CheckCheck, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { ChatMessage } from "../../types/chat";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { t, i18n } = useTranslation("common");
  const { user: currentUser } = useAuth();
  const locale = i18n.language || "en";
  const [isImageOpen, setIsImageOpen] = useState(false);

  const senderId = typeof message.sender === "string" ? message.sender : message.sender?._id;
  const isMine = senderId === currentUser?.id;
  const isOptimistic = message._isOptimistic;

  const senderName = typeof message.sender === "string" 
    ? "" 
    : message.sender?.displayName || message.sender?.name || message.sender?.username;
  const senderAvatar = typeof message.sender === "string" ? "" : message.sender?.avatar || message.sender?.profileImage;

  // Format time (e.g. 10:45 AM)
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (message.isDeleted) {
    return (
      <div className={`flex gap-2 my-1 max-w-[70%] ${isMine ? "ml-auto" : "mr-auto"}`}>
        <div
          className={`px-4 py-2 text-xs rounded-xl italic font-sans select-none border ${
            isMine
              ? "bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:border-neutral-700"
              : "bg-neutral-50 text-neutral-400 dark:bg-neutral-900 dark:border-neutral-800"
          }`}
        >
          {t("chat.deletedMessage", "This message was deleted")}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-2 my-1.5 max-w-[85%] sm:max-w-[70%] animate-fade-in ${isMine ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
      {/* Show avatar for incoming messages */}
      {!isMine && (
        <Avatar className="h-8 w-8 border border-neutral-100 dark:border-neutral-800 shrink-0 self-end">
          <AvatarImage src={senderAvatar} alt={senderName} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
            {senderName ? senderName.charAt(0).toUpperCase() : "?"}
          </AvatarFallback>
        </Avatar>
      )}

      <div className="flex flex-col">
        {/* Bubble */}
        <div
          className={`relative px-4 py-2.5 shadow-sm text-sm overflow-hidden break-words transition-all duration-200 ${
            isMine
              ? "bg-primary text-white rounded-[18px_18px_4px_18px] text-right font-sans"
              : "bg-card border border-border text-neutral-850 dark:text-neutral-100 rounded-[18px_18px_18px_4px] text-left font-sans"
          } ${isOptimistic ? "opacity-75" : ""}`}
        >
          {/* Media image */}
          {message.mediaUrl && (
            <div className="mb-2 max-w-sm rounded-lg overflow-hidden border border-black/5 dark:border-white/5">
              <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
                <DialogTrigger
                  render={
                    <img
                      src={message.mediaUrl}
                      alt={t("chat.imageAttachment", "Media attachment")}
                      className="max-h-60 w-full object-cover cursor-zoom-in hover:scale-[1.02] transition-transform duration-200"
                    />
                  }
                />
                <DialogContent className="max-w-4xl p-0 border-none bg-transparent shadow-none flex justify-center items-center">
                  <img
                    src={message.mediaUrl}
                    alt={t("chat.imageAttachment", "Media attachment")}
                    className="max-h-[90vh] max-w-full object-contain rounded-lg shadow-2xl"
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Text Content */}
          {message.content && (
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          )}

          {/* Bottom row: Time + Status Ticks */}
          <div
            className={`flex items-center justify-end gap-1 mt-1 text-[9px] select-none ${
              isMine ? "text-primary-100" : "text-neutral-400 dark:text-neutral-500"
            }`}
          >
            <span>{formatTime(message.createdAt)}</span>
            
            {isMine && (
              <span className="flex items-center">
                {isOptimistic ? (
                  <Loader2 className="h-2.5 w-2.5 animate-spin" />
                ) : message.readAt ? (
                  <CheckCheck className="h-3 w-3 text-secondary" />
                ) : (
                  <Check className="h-3 w-3 text-white/70" />
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
