import { Badge } from "@/components/ui/badge";
import type { VoiceChannel } from "../../types/voice";
import { getCategoryName } from "@/utils/category";
import { useTranslation } from "react-i18next";

interface RoomHeaderProps {
  channel: VoiceChannel;
}

export function RoomHeader({ channel }: RoomHeaderProps) {
  const { i18n } = useTranslation();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-background/85 backdrop-blur px-6 py-4 sticky top-0 z-10">
      <div className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="font-heading text-lg font-bold text-neutral-900 dark:text-neutral-100">
            {channel.title}
          </h2>
          <Badge
            variant="outline"
            className="border-secondary-500/20 bg-secondary-500/10 text-secondary-600 dark:text-secondary-400 font-semibold px-2 py-0.5 text-[10px]"
          >
            {getCategoryName(channel.category, i18n.language) || "General"}
          </Badge>
        </div>
        <p className="text-xs text-neutral-500">
          Created by <span className="font-medium">@{channel.createdBy?.username || "user"}</span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
        </span>
        <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 font-heading">
          {channel.participantCount || 0} Active
        </span>
      </div>
    </div>
  );
}
