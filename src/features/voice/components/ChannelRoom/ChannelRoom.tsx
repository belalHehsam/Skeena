import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useGetVoiceChannel } from "../../hooks/useGetVoiceChannel";
import { useVoiceChannelSocket } from "../../hooks/useVoiceChannelSocket";
import { useLocalMedia } from "../../hooks/useLocalMedia";
import { useWebRTC } from "../../hooks/useWebRTC";
import { useEndVoiceChannel } from "../../hooks/useEndVoiceChannel";
import { useVoiceSocket } from "../../hooks/useVoiceSocket";
import { RoomHeader } from "./RoomHeader";
import { ParticipantGrid } from "./ParticipantGrid";
import { RoomControls } from "./RoomControls";
import { RoomEndedOverlay } from "./RoomEndedOverlay";
import { Skeleton } from "@/components/ui/skeleton";

interface ChannelRoomProps {
  channelId: string;
}

// ─── Inner Room (only mounts after media is resolved) ─────────────────────────

interface ChannelRoomInnerProps {
  channelId: string;
  localStream: MediaStream | null;
  mediaError: string | null;
  isMuted: boolean;
  isDeafened: boolean;
  toggleMute: () => void;
  toggleDeafen: () => void;
  stopMedia: () => void;
}

function ChannelRoomInner({
  channelId,
  localStream,
  mediaError,
  isMuted,
  isDeafened,
  toggleMute,
  toggleDeafen,
  stopMedia,
}: ChannelRoomInnerProps) {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const socket = useVoiceSocket();

  const { data: initialChannel, isLoading: isQueryLoading } = useGetVoiceChannel(channelId);
  const { channelState, hasEnded } = useVoiceChannelSocket(channelId);
  const endMutation = useEndVoiceChannel(channelId);

  const channel = channelState ?? initialChannel;
  const currentUserId = currentUser?.id ?? "";

  const { remoteStreams } = useWebRTC(channelId, localStream, currentUserId);

  // Emit the inverted value immediately — React state updates are async,
  // so reading `isMuted` here would be the stale pre-toggle value.
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    toggleMute();
    socket?.emit("voice:mute", channelId, nextMuted);
  };

  const handleToggleDeafen = () => {
    const nextDeafened = !isDeafened;
    toggleDeafen();
    socket?.emit("voice:deafen", channelId, nextDeafened);
  };

  const handleLeaveRoom = () => {
    // Explicitly tell the backend we are leaving this channel before navigating.
    // (The backend's "disconnecting" event handles tab closes / refreshes.)
    socket?.emit("voice:leave", channelId);
    stopMedia();
    navigate("/voice");
  };

  const handleEndRoom = () => {
    endMutation.mutate();
  };

  if (isQueryLoading && !channel) {
    return <RoomSkeleton />;
  }

  if (!channel) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <p className="text-neutral-500 font-medium">
          Voice channel not found or has already ended.
        </p>
        <button
          onClick={() => navigate("/voice")}
          className="mt-4 text-sm font-semibold text-primary hover:underline cursor-pointer"
        >
          Go back to channels list
        </button>
      </div>
    );
  }

  const isOwner = channel.createdBy?._id === currentUserId;
  const isRoomEnded = hasEnded || channel.status === "ended";
  const participants = channel.participants ?? [];

  return (
    <div className="relative flex flex-col h-full bg-background border rounded-xl overflow-hidden shadow-sm">
      <RoomHeader channel={channel} />

      {mediaError && (
        <div className="bg-red-500/10 border-b border-red-500/20 text-red-500 px-6 py-2 text-xs font-medium text-center">
          {mediaError}. Please check your browser microphone permission settings.
        </div>
      )}

      <div className="flex-1 overflow-y-auto bg-neutral-50/50 dark:bg-neutral-900/10">
        <ParticipantGrid
          participants={participants}
          currentUserId={currentUserId}
          localStream={localStream}
          remoteStreams={remoteStreams}
          isDeafened={isDeafened}
        />
      </div>

      <div className="p-6">
        <RoomControls
          isMuted={isMuted}
          isDeafened={isDeafened}
          isOwner={isOwner}
          onToggleMute={handleToggleMute}
          onToggleDeafen={handleToggleDeafen}
          onLeave={handleLeaveRoom}
          onEnd={handleEndRoom}
        />
      </div>

      {isRoomEnded && <RoomEndedOverlay />}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function RoomSkeleton() {
  return (
    <div className="flex flex-col h-full bg-background p-6 space-y-6">
      <Skeleton className="h-16 w-full rounded-xl" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="aspect-square rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

// ─── Outer shell: acquires mic, then renders inner room ───────────────────────

export function ChannelRoom({ channelId }: ChannelRoomProps) {
  const {
    stream: localStream,
    isMuted,
    isDeafened,
    error: mediaError,
    startMedia,
    toggleMute,
    toggleDeafen,
    stopMedia,
    stopTracksSilently,
  } = useLocalMedia();

  useEffect(() => {
    startMedia();

    return () => {
      // Use stopTracksSilently (no setStream(null)) so that `localStream` stays
      // non-null in React state during Strict Mode's cleanup-then-remount cycle.
      // Without this, ChannelRoomInner would unmount on cleanup, its
      // useVoiceChannelSocket would emit voice:join, the backend would end
      // the channel (last participant left), and the second mount would receive
      // "Voice channel has ended".
      //
      // The next startMedia() call replaces the streamRef with a fresh stream.
      // If this is a true unmount (not Strict Mode double-invoke), the tracks
      // are already stopped here, which is correct.
      stopTracksSilently();
    };
    // startMedia and stopTracksSilently are stable useCallback refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show skeleton only while mic permission prompt is pending (stream AND error are both null).
  const isReady = localStream !== null || mediaError !== null;

  if (!isReady) {
    return <RoomSkeleton />;
  }

  return (
    <ChannelRoomInner
      channelId={channelId}
      localStream={localStream}
      mediaError={mediaError}
      isMuted={isMuted}
      isDeafened={isDeafened}
      toggleMute={toggleMute}
      toggleDeafen={toggleDeafen}
      stopMedia={stopMedia}
    />
  );
}
