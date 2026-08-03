import { create } from 'zustand';

interface ChatUIState {
  /** Whether AI is currently streaming a response */
  isStreaming: boolean;
  /** Whether the conversation list panel is visible (mobile) */
  isListOpen: boolean;
  /** Currently selected agent ID for new conversations */
  activeAgentId: string;
  actions: {
    setStreaming: (v: boolean) => void;
    setListOpen: (v: boolean) => void;
    toggleList: () => void;
    setActiveAgentId: (id: string) => void;
  };
}

export const useChatUIStore = create<ChatUIState>((set) => ({
  isStreaming: false,
  isListOpen: false,
  activeAgentId: 'auto',
  actions: {
    setStreaming: (v) => set({ isStreaming: v }),
    setListOpen: (v) => set({ isListOpen: v }),
    toggleList: () => set((s) => ({ isListOpen: !s.isListOpen })),
    setActiveAgentId: (id) => set({ activeAgentId: id }),
  },
}));

/** Selector hook — prevents unnecessary re-renders */
export function useChatStreaming() {
  return useChatUIStore((s) => s.isStreaming);
}

export function useChatListOpen() {
  return useChatUIStore((s) => s.isListOpen);
}

export function useChatActiveAgent() {
  return useChatUIStore((s) => s.activeAgentId);
}