import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useVoiceSocket } from "./useVoiceSocket";
import { VOICE_QUERY_KEYS } from "../constants/voice-query-keys";
import type { VoiceChannel, ParticipantJoinedPayload, ParticipantLeftPayload } from "../types/voice";
import { toast } from "sonner";

export function useVoiceChannelSocket(channelId: string, enabled = true) {
  const socket = useVoiceSocket();
  const queryClient = useQueryClient();
  const [channelState, setChannelState] = useState<VoiceChannel | null>(null);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    if (!socket || !channelId || !enabled) return;

    // Join the socket room and request current state.
    socket.emit("voice:join", channelId);

    // Re-join if the socket reconnects after a network drop.
    const handleConnect = () => {
      socket.emit("voice:join", channelId);
    };

    const handleStateChanged = (channel: VoiceChannel) => {
      if (channel._id !== channelId) return;
      setChannelState(channel);
      queryClient.setQueryData(VOICE_QUERY_KEYS.channel(channelId), channel);
      queryClient.invalidateQueries({ queryKey: VOICE_QUERY_KEYS.channels() });
    };

    const handleParticipantJoined = (payload: ParticipantJoinedPayload) => {
      if (payload.channelId !== channelId) return;
      toast(`${payload.participant.username || "Someone"} joined the room`);
    };

    const handleParticipantLeft = (payload: ParticipantLeftPayload) => {
      if (payload.channelId !== channelId) return;
      queryClient.invalidateQueries({ queryKey: VOICE_QUERY_KEYS.channels() });
    };

    const handleChannelEnded = (channel: VoiceChannel) => {
      if (channel._id !== channelId) return;
      setHasEnded(true);
      queryClient.invalidateQueries({ queryKey: VOICE_QUERY_KEYS.all });
    };

    const handleVoiceError = (payload: { channelId: string; message: string }) => {
      if (payload.channelId !== channelId) return;
      console.warn("[voice:error]", payload.message);
      toast.error(payload.message);
    };

    socket.on("connect", handleConnect);
    socket.on("voice:stateChanged", handleStateChanged);
    socket.on("voice:participantJoined", handleParticipantJoined);
    socket.on("voice:participantLeft", handleParticipantLeft);
    socket.on("voice:channelEnded", handleChannelEnded);
    socket.on("voice:error", handleVoiceError);

    return () => {
      // ⚠️ Do NOT emit "voice:leave" here.
      //
      // React Strict Mode runs every effect twice (mount → cleanup → mount).
      // Emitting "voice:leave" in the cleanup causes the backend to remove the
      // user and potentially end the channel before the second mount's "voice:join"
      // fires — producing "Voice channel has ended" immediately on entry.
      //
      // Explicit leave is handled by ChannelRoom.handleLeaveRoom() and
      // ChannelRoom.handleEndRoom() before navigating away.
      // Browser tab closes / refreshes are cleaned up by the backend's
      // "disconnecting" socket event, which calls leaveVoiceChannel automatically.
      socket.off("connect", handleConnect);
      socket.off("voice:stateChanged", handleStateChanged);
      socket.off("voice:participantJoined", handleParticipantJoined);
      socket.off("voice:participantLeft", handleParticipantLeft);
      socket.off("voice:channelEnded", handleChannelEnded);
      socket.off("voice:error", handleVoiceError);
    };
  }, [socket, channelId, enabled, queryClient]);

  return { channelState, hasEnded };
}
