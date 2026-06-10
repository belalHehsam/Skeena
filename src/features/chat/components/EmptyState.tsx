import { useTranslation } from "react-i18next";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onStartNewChat?: () => void;
}

export function EmptyState({ onStartNewChat }: EmptyStateProps) {
  const { t } = useTranslation("common");

  return (
    <div className="majlis-page-pattern flex h-full flex-1 flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary animate-pulse">
        <MessageSquarePlus className="h-12 w-12" />
        <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-secondary animate-ping" />
      </div>
      <h3 className="mb-2 font-heading text-2xl font-bold text-neutral-850 dark:text-neutral-100">
        {t("chat.emptyTitle", "Your Majlis Chat")}
      </h3>
      <p className="mx-auto mb-6 max-w-md text-sm text-neutral-500 dark:text-neutral-450 font-sans leading-relaxed">
        {t("chat.emptySubtitle", "Connect with your friends in real-time. Start a new direct conversation to share messages and media.")}
      </p>
      {onStartNewChat && (
        <Button
          onClick={onStartNewChat}
          className="bg-primary hover:bg-primary/90 text-white font-heading font-semibold shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          {t("chat.startNewChat", "Start Conversation")}
        </Button>
      )}
    </div>
  );
}
export default EmptyState;
