import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ChatParticipant } from "../../types/chat";

interface ChatHeaderProps {
  participant?: ChatParticipant;
  onBackClick?: () => void;
}

export function ChatHeader({ participant, onBackClick }: ChatHeaderProps) {
  const { t } = useTranslation("common");

  const name = participant?.displayName || participant?.name || participant?.username || t("chat.loadingUser", "Loading User");
  const avatarUrl = participant?.profileImage || participant?.avatar;

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background/80 backdrop-blur sticky top-0 z-10">
      {onBackClick && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBackClick}
          className="h-8 w-8 rounded-full text-neutral-600 dark:text-neutral-300 cursor-pointer lg:hidden shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}

      <Avatar className="h-10 w-10 border border-neutral-100 dark:border-neutral-800 shrink-0">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback className="bg-primary/10 text-primary font-bold">
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 text-left">
        <h3 className="text-sm font-bold text-neutral-850 dark:text-neutral-100 truncate">
          {name}
        </h3>
        {/* <p className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {t("chat.online", "Online")}
        </p> */}
      </div>
    </div>
  );
}
export default ChatHeader;
