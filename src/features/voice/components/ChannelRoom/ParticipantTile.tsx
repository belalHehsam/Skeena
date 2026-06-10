import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MicOff, VolumeX } from "lucide-react";
import type { VoiceParticipant } from "../../types/voice";
import { useSpeakingDetection } from "../../hooks/useSpeakingDetection";

interface ParticipantTileProps {
  participant: VoiceParticipant;
  isSelf: boolean;
  stream: MediaStream | null;
}

export function ParticipantTile({ participant, isSelf, stream }: ParticipantTileProps) {
  const isSpeaking = useSpeakingDetection(stream);

  return (
    <div className="relative flex flex-col items-center justify-center rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md aspect-square">
      <div className="relative mb-3">
        <div
          className={`rounded-full p-1 transition-all duration-300 ${
            isSpeaking
              ? "ring-4 ring-emerald-400 animate-pulse shadow-[0_0_15px_rgba(52,211,153,0.5)]"
              : "ring-2 ring-transparent"
          }`}
        >
          <Avatar className="h-20 w-20 shadow-inner">
            <AvatarImage src={participant.user?.avatar} alt={participant.user?.username} />
            <AvatarFallback className="text-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold">
              {(participant.user?.username || "U").substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="absolute -bottom-1 -right-1 flex gap-1">
          {participant.isDeafened && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-sm border-2 border-background">
              <VolumeX className="h-3 w-3" />
            </div>
          )}
          {participant.isMuted && !participant.isDeafened && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-sm border-2 border-background">
              <MicOff className="h-3 w-3" />
            </div>
          )}
        </div>
      </div>

      <span className="font-heading text-sm font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
        {participant.user?.username || "user"}
        {isSelf && (
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary font-sans">
            You
          </span>
        )}
      </span>
    </div>
  );
}
