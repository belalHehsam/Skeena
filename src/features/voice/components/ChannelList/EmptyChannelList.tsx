import { Mic, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyChannelListProps {
  onCreateClick: () => void;
}

export function EmptyChannelList({ onCreateClick }: EmptyChannelListProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center bg-card/50 backdrop-blur-sm shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 animate-pulse">
        <Mic className="h-8 w-8" />
      </div>
      <h3 className="font-heading text-lg font-bold text-neutral-800 dark:text-neutral-200">
        No active voice rooms
      </h3>
      <p className="mt-2 text-sm text-neutral-500 max-w-sm dark:text-neutral-400">
        There are currently no active discussion rooms. Start a new voice channel and invite others to discuss.
      </p>
      <Button
        onClick={onCreateClick}
        className="mt-6 flex items-center gap-2 cursor-pointer font-heading font-semibold"
      >
        <Plus className="h-4 w-4" />
        Create Voice Room
      </Button>
    </div>
  );
}
