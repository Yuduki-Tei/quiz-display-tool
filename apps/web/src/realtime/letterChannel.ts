// Centralized channel names for letter sync
export const LetterChannels = {
  RequestSnapshot: "letter:snapshot:request",
  Snapshot: "letter:snapshot",
  Patch: "letter:patch",
} as const;

export type LetterChannelEvent =
  (typeof LetterChannels)[keyof typeof LetterChannels];
