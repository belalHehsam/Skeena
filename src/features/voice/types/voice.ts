export type VoiceChannelStatus = 'active' | 'ended';

export type VoiceCategory = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
};

export type VoiceChannelCreator = {
  _id: string;
  username: string;
  avatar?: string;
};

export type VoiceParticipant = {
  _id: string;         // participant record ID
  user: {
    _id: string;
    username: string;
    avatar?: string;
  };
  joinedAt: string;
  isMuted: boolean;
  isDeafened: boolean;
};

export type VoiceChannel = {
  _id: string;
  title: string;
  category: VoiceCategory;
  createdBy: VoiceChannelCreator;
  participants: VoiceParticipant[];
  status: VoiceChannelStatus;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
  participantCount: number;
};

export type CreateVoiceChannelPayload = {
  title: string;
  categoryId: string;
};

// Socket event payloads
export type ParticipantJoinedPayload = {
  channelId: string;
  participant: { _id: string; username: string; avatar?: string };
  participantCount: number;
};

export type ParticipantLeftPayload = {
  channelId: string;
  participantId: string;
  participantCount: number;
};

// WebRTC local state per peer
export type PeerState = {
  userId: string;
  stream: MediaStream | null;
  isSpeaking: boolean;
  connection: RTCPeerConnection;
};
