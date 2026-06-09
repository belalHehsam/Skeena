import { ScrollArea } from "@/components/ui/scroll-area";
import type { VoiceChannel } from "../../types/voice";
import { ChannelCard } from "./ChannelCard";
import { ChannelListSkeleton } from "./ChannelListSkeleton";
import { EmptyChannelList } from "./EmptyChannelList";

interface ChannelListProps {
  channels: VoiceChannel[] | undefined;
  isLoading: boolean;
  activeChannelId?: string;
  selectedCategoryId: string;
  onCreateClick: () => void;
}

export function ChannelList({
  channels,
  isLoading,
  activeChannelId,
  selectedCategoryId,
  onCreateClick,
}: ChannelListProps) {
  if (isLoading) {
    return <ChannelListSkeleton />;
  }

  const filteredChannels = channels
    ? channels.filter((c) => {
        if (selectedCategoryId === "all") return true;
        return c.category?._id === selectedCategoryId;
      })
    : [];

  if (filteredChannels.length === 0) {
    return <EmptyChannelList onCreateClick={onCreateClick} />;
  }

  return (
    <ScrollArea className="h-[calc(100vh-180px)] pr-3">
      <div className="flex flex-col gap-3 pb-4">
        {filteredChannels.map((channel) => (
          <ChannelCard
            key={channel._id}
            channel={channel}
            isActive={channel._id === activeChannelId}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
