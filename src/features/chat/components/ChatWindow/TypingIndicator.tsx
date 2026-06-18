import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ChatParticipant } from "../../types/chat";

interface TypingIndicatorProps {
  participant?: ChatParticipant;
}

export function TypingIndicator({ participant }: TypingIndicatorProps) {
  const name = participant?.displayName || participant?.name || participant?.username || "?";
  const avatarUrl = participant?.profileImage || participant?.avatar;

  return (
    <div className="flex gap-2 items-end max-w-[85%] sm:max-w-[70%] animate-fade-in me-auto">
      <Avatar className="h-8 w-8 border border-neutral-100 dark:border-neutral-800 shrink-0">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="bg-card border border-border rounded-2xl rounded-es-sm px-3.5 py-2.5 shadow-sm">
        <div className="flex gap-1.5 items-center h-4 py-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-primary/70 animate-bounce" />
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
