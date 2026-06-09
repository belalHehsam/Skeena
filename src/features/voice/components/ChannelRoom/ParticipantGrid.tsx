import { useEffect, useRef } from "react";
import type { VoiceParticipant } from "../../types/voice";
import { ParticipantTile } from "./ParticipantTile";

function RemoteAudio({ stream, isDeafened }: { stream: MediaStream; isDeafened: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.srcObject = stream;
      audioRef.current.play().catch((err) => {
        console.warn("Audio autoplay blocked or failed:", err);
      });
    }
  }, [stream]);

  return (
    <audio
      ref={audioRef}
      autoPlay
      playsInline
      muted={isDeafened}
      className="hidden"
    />
  );
}

interface ParticipantGridProps {
  participants: VoiceParticipant[];
  currentUserId: string;
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  isDeafened: boolean;
}

export function ParticipantGrid({
  participants,
  currentUserId,
  localStream,
  remoteStreams,
  isDeafened,
}: ParticipantGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 p-6 overflow-y-auto max-h-[calc(100vh-250px)] md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 scrollbar-none">
      {participants.map((participant) => {
        const isSelf = participant.user?._id === currentUserId;
        const stream = isSelf ? localStream : remoteStreams.get(participant.user?._id) || null;

        return (
          <div key={participant._id}>
            <ParticipantTile
              participant={participant}
              isSelf={isSelf}
              stream={stream}
            />
            {!isSelf && stream && (
              <RemoteAudio stream={stream} isDeafened={isDeafened} />
            )}
          </div>
        );
      })}
    </div>
  );
}
