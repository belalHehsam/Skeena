import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetVoiceChannels } from "@/features/voice/hooks/useGetVoiceChannels";
import { useCreateVoiceChannel } from "@/features/voice/hooks/useCreateVoiceChannel";
import { CategoryFilter } from "@/features/voice/components/CategoryFilter";
import { ChannelList } from "@/features/voice/components/ChannelList/ChannelList";
import { ChannelRoom } from "@/features/voice/components/ChannelRoom/ChannelRoom";
import { CreateChannelDialog } from "@/features/voice/components/CreateChannelDialog/CreateChannelDialog";
import { Button } from "@/components/ui/button";
import { Plus, Headphones } from "lucide-react";
import { useGetCategories } from "@/hooks/useGetCategories";

export function VoicePage() {
  const { channelId } = useParams<{ channelId?: string }>();
  const navigate = useNavigate();

  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Queries
  const { data: channels, isLoading: isChannelsLoading } = useGetVoiceChannels();
  const { data: categories = [] } = useGetCategories();
  const createMutation = useCreateVoiceChannel();

  const handleCreateChannelSubmit = (values: { title: string; categoryId: string }) => {
    createMutation.mutate(values, {
      onSuccess: (newChannel) => {
        setIsCreateDialogOpen(false);
        navigate(`/voice/${newChannel._id}`);
      },
    });
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
      {/* Left panel: Channels List */}
      <div
        className={`w-full lg:w-80 flex-col border-r bg-background shrink-0 px-4 py-4 ${
          channelId ? "hidden lg:flex" : "flex"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-heading text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Voice Rooms
          </h1>
          <Button
            size="sm"
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-1.5 cursor-pointer font-heading font-semibold"
          >
            <Plus className="h-4 w-4" />
            New Room
          </Button>
        </div>

        {/* Category filters */}
        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />

        {/* Channels List */}
        <div className="mt-3 flex-1 overflow-hidden">
          <ChannelList
            channels={channels}
            isLoading={isChannelsLoading}
            activeChannelId={channelId}
            selectedCategoryId={selectedCategoryId}
            onCreateClick={() => setIsCreateDialogOpen(true)}
          />
        </div>
      </div>

      {/* Right panel: Active Room Details */}
      <div
        className={`flex-1 flex-col h-full p-4 lg:p-6 bg-neutral-50 dark:bg-neutral-900/10 ${
          channelId ? "flex animate-in fade-in slide-in-from-right-5 duration-300" : "hidden lg:flex items-center justify-center text-center"
        }`}
      >
        {channelId ? (
          <ChannelRoom channelId={channelId} />
        ) : (
          <div className="max-w-md p-8 rounded-2xl border border-dashed bg-card/60 backdrop-blur shadow-sm">
            <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <Headphones className="h-7 w-7" />
            </div>
            <h3 className="font-heading text-lg font-bold text-neutral-800 dark:text-neutral-200">
              No voice room selected
            </h3>
            <p className="text-sm text-neutral-500 mt-2 dark:text-neutral-400">
              Select an active discussion room from the list on the left, or create a brand new room to start talking with friends!
            </p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="mt-6 font-heading font-semibold cursor-pointer"
            >
              Start a New Room
            </Button>
          </div>
        )}
      </div>

      {/* Create Room Dialog */}
      <CreateChannelDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        categories={categories}
        onSubmit={handleCreateChannelSubmit}
        isPending={createMutation.isPending}
      />
    </div>
  );
}
