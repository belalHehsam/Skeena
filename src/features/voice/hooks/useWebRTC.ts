import { useEffect, useRef, useState, useCallback } from "react";
import { useVoiceSocket } from "./useVoiceSocket";
import type { ParticipantJoinedPayload, ParticipantLeftPayload } from "../types/voice";

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

export function useWebRTC(
  channelId: string,
  localStream: MediaStream | null,
  currentUserId: string
) {
  const socket = useVoiceSocket();
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const pendingCandidates = useRef<Map<string, RTCIceCandidateInit[]>>(new Map());
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());

  // ── Helpers ───────────────────────────────────────────────────────────────

  const closePeer = useCallback((userId: string) => {
    const pc = peersRef.current.get(userId);
    if (pc) {
      pc.close();
      peersRef.current.delete(userId);
    }
    pendingCandidates.current.delete(userId);
    setRemoteStreams((prev) => {
      if (!prev.has(userId)) return prev;
      const next = new Map(prev);
      next.delete(userId);
      return next;
    });
  }, []);

  const createPeerConnection = useCallback(
    (targetUserId: string): RTCPeerConnection => {
      // Close any existing connection for this peer cleanly
      const existing = peersRef.current.get(targetUserId);
      if (existing) {
        existing.close();
        peersRef.current.delete(targetUserId);
      }

      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

      // Add local audio tracks
      localStream?.getTracks().forEach((track) => pc.addTrack(track, localStream));

      pc.ontrack = (event) => {
        const stream =
          event.streams && event.streams[0]
            ? event.streams[0]
            : new MediaStream([event.track]);
        setRemoteStreams((prev) => {
          const next = new Map(prev);
          next.set(targetUserId, stream);
          return next;
        });
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket?.emit("voice:signal:ice", {
            targetUserId,
            channelId,
            candidate: event.candidate,
          });
        }
      };

      pc.onconnectionstatechange = () => {
        if (["disconnected", "failed", "closed"].includes(pc.connectionState)) {
          closePeer(targetUserId);
        }
      };

      peersRef.current.set(targetUserId, pc);
      return pc;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [socket, channelId, localStream, closePeer]
  );

  const initiateCall = useCallback(
    async (targetUserId: string) => {
      try {
        const pc = createPeerConnection(targetUserId);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket?.emit("voice:signal:offer", { targetUserId, channelId, sdp: offer });
      } catch (err) {
        console.error("[WebRTC] Error initiating call to:", targetUserId, err);
      }
    },
    [createPeerConnection, socket, channelId]
  );

  // ── Update local tracks on existing connections when stream changes ────────
  useEffect(() => {
    if (!localStream) return;
    peersRef.current.forEach((pc) => {
      const senders = pc.getSenders();
      localStream.getTracks().forEach((track) => {
        const sender = senders.find((s) => s.track?.kind === track.kind);
        if (sender) {
          sender.replaceTrack(track).catch((e) =>
            console.warn("[WebRTC] replaceTrack failed:", e)
          );
        } else {
          pc.addTrack(track, localStream);
        }
      });
    });
  }, [localStream]);

  // ── Signaling event listeners ──────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleOffer = async ({
      fromUserId,
      sdp,
    }: {
      fromUserId: string;
      sdp: RTCSessionDescriptionInit;
    }) => {
      try {
        const pc = createPeerConnection(fromUserId);
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("voice:signal:answer", { targetUserId: fromUserId, channelId, sdp: answer });

        // Drain any ICE candidates that arrived before the remote description
        const queue = pendingCandidates.current.get(fromUserId) ?? [];
        for (const cand of queue) {
          await pc.addIceCandidate(new RTCIceCandidate(cand)).catch((e) =>
            console.warn("[WebRTC] queued ICE candidate error:", e)
          );
        }
        pendingCandidates.current.delete(fromUserId);
      } catch (err) {
        console.error("[WebRTC] Error handling offer from:", fromUserId, err);
      }
    };

    const handleAnswer = async ({
      fromUserId,
      sdp,
    }: {
      fromUserId: string;
      sdp: RTCSessionDescriptionInit;
    }) => {
      try {
        const pc = peersRef.current.get(fromUserId);
        if (!pc) return;
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));

        const queue = pendingCandidates.current.get(fromUserId) ?? [];
        for (const cand of queue) {
          await pc.addIceCandidate(new RTCIceCandidate(cand)).catch((e) =>
            console.warn("[WebRTC] queued ICE candidate error:", e)
          );
        }
        pendingCandidates.current.delete(fromUserId);
      } catch (err) {
        console.error("[WebRTC] Error handling answer from:", fromUserId, err);
      }
    };

    const handleIce = async ({
      fromUserId,
      candidate,
    }: {
      fromUserId: string;
      candidate: RTCIceCandidateInit;
    }) => {
      const pc = peersRef.current.get(fromUserId);
      if (pc?.remoteDescription) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((e) =>
          console.warn("[WebRTC] addIceCandidate error:", e)
        );
      } else {
        const queue = pendingCandidates.current.get(fromUserId) ?? [];
        queue.push(candidate);
        pendingCandidates.current.set(fromUserId, queue);
      }
    };

    socket.on("voice:signal:offer", handleOffer);
    socket.on("voice:signal:answer", handleAnswer);
    socket.on("voice:signal:ice", handleIce);

    return () => {
      socket.off("voice:signal:offer", handleOffer);
      socket.off("voice:signal:answer", handleAnswer);
      socket.off("voice:signal:ice", handleIce);
    };
  }, [socket, channelId, createPeerConnection]);

  // ── Participant join / leave events ────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleParticipantJoined = (payload: ParticipantJoinedPayload) => {
      if (payload.participant._id === currentUserId) return;
      // Small delay lets the new peer's socket handlers set up before we send the offer
      setTimeout(() => initiateCall(payload.participant._id), 500);
    };

    const handleParticipantLeft = (payload: ParticipantLeftPayload) => {
      closePeer(payload.participantId);
    };

    socket.on("voice:participantJoined", handleParticipantJoined);
    socket.on("voice:participantLeft", handleParticipantLeft);

    return () => {
      socket.off("voice:participantJoined", handleParticipantJoined);
      socket.off("voice:participantLeft", handleParticipantLeft);
    };
  }, [socket, currentUserId, initiateCall, closePeer]);

  // ── Cleanup all peers on unmount ───────────────────────────────────────────
  useEffect(() => {
    return () => {
      peersRef.current.forEach((pc) => pc.close());
      peersRef.current.clear();
      pendingCandidates.current.clear();
      setRemoteStreams(new Map());
    };
  }, []);

  return { remoteStreams, initiateCall, closePeer };
}
