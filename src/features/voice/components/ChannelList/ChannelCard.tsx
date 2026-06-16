import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getCategoryName } from "@/utils/category";
import type { VoiceChannel } from "../../types/voice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

interface ChannelCardProps {
  channel: VoiceChannel;
  isActive: boolean;
}

export function ChannelCard({ channel, isActive }: ChannelCardProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("common");
  const isEnded = channel.status === "ended";

  const displayedParticipants = channel.participants || [];
  const participantCount = channel.participantCount || displayedParticipants.length;
  const slicedParticipants = displayedParticipants.slice(0, 4);
  const overflowCount = Math.max(0, participantCount - 4);

  return (
    <div
      onClick={() => !isEnded && navigate(`/voice/${channel._id}`)}
      className={`group relative overflow-hidden rounded-xl border bg-card p-4 transition-all duration-300 shadow-sm ${
        isEnded
          ? "opacity-60 cursor-not-allowed"
          : "cursor-pointer border-l-4 border-l-transparent hover:border-l-primary hover:shadow-md dark:hover:bg-neutral-800/40"
      } ${isActive ? "border-l-4 border-l-primary bg-primary/5" : ""}`}
    >
      <div className="flex items-center justify-between mb-2">
        <Badge
          variant="outline"
          className="border-secondary-500/20 bg-secondary-500/10 text-secondary-600 dark:text-secondary-400 font-semibold px-2 py-0.5 text-[10px]"
        >
          {getCategoryName(channel.category, i18n.language) || "General"}
        </Badge>

        {!isEnded && (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            <span className="text-[11px] font-medium text-primary-600 dark:text-primary-400">
              {t("voice.live", { count: participantCount })}
            </span>
          </div>
        )}
      </div>

      <h4 className="font-heading text-sm font-bold text-neutral-800 dark:text-neutral-100 group-hover:text-primary transition-colors line-clamp-1 mb-1 text-left">
        {channel.title}
      </h4>

      <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mb-4 text-left">
        {t("voice.createdBy")}{" "}
        <span className="font-medium text-neutral-600 dark:text-neutral-400">
          @{channel.createdBy?.username || "user"}
        </span>
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center">
          {slicedParticipants.length > 0 ? (
            <div className="flex -space-x-2">
              {slicedParticipants.map((p) => (
                <Avatar key={p._id} className="h-7 w-7 border-2 border-background shadow-sm">
                  <AvatarImage src={p.user?.avatar} alt={p.user?.username} />
                  <AvatarFallback className="text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                    {(p.user?.username || "U").substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {overflowCount > 0 && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[9px] font-bold text-neutral-600 dark:text-neutral-400 shadow-sm">
                  +{overflowCount}
                </div>
              )}
            </div>
          ) : (
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 italic">
              {t("voice.emptyChannel")}
            </span>
          )}
        </div>

        {!isEnded && (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-3 text-xs lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-200 text-primary bg-primary/10 lg:text-neutral-500 lg:bg-transparent hover:bg-primary hover:text-white dark:hover:bg-primary font-heading font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
          >
            <LogIn className="h-3 w-3" />
            {t("voice.join")}
          </Button>
        )}
      </div>
    </div>
  );
}
