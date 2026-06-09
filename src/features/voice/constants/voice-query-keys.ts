export const VOICE_QUERY_KEYS = {
  all: ['voice'] as const,
  categories: () => ['voice', 'categories'] as const,
  channels: (categoryId?: string) => ['voice', 'channels', categoryId ?? 'all'] as const,
  channel: (channelId: string) => ['voice', 'channel', channelId] as const,
};
