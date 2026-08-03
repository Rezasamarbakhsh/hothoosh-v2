import { create } from 'zustand';
import { MOCK_SESSIONS, type ChatSession } from '@/features/chat/types/chat.types';

interface ChatUIState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  activeAgentId: string;
  isStreaming: boolean;
  isListOpen: boolean;
  actions: {
    setSessions: (s: ChatSession[]) => void;
    setActiveSessionId: (id: string | null) => void;
    deleteSession: (id: string) => void;
    createSession: (title?: string) => string;
    setActiveAgentId: (id: string) => void;
    setStreaming: (v: boolean) => void;
    setListOpen: (v: boolean) => void;
    toggleList: () => void;
  };
}

export const useChatUIStore = create<ChatUIState>((set, get) => ({
  sessions: MOCK_SESSIONS.filter((s) => s.status !== 'deleted'),
  activeSessionId: null,
  activeAgentId: 'auto',
  isStreaming: false,
  isListOpen: false,
  actions: {
    setSessions: (sessions) => set({ sessions }),
    setActiveSessionId: (id) => set({ activeSessionId: id }),
    deleteSession: (id) => {
      const { activeSessionId } = get();
      set({
        sessions: get().sessions.filter((s) => s.id !== id),
        activeSessionId: activeSessionId === id ? null : activeSessionId,
      });
    },
    createSession: (title) => {
      const id = 'new-' + Date.now();
      const agent = get().activeAgentId;
      const agentObj = MOCK_SESSIONS.find((s) => s.agentId === agent);
      const newSession: ChatSession = {
        id,
        workspaceId: 'ws-1',
        userId: 'user-1',
        agentId: agent,
        agentName: agent === 'auto' ? 'تشخیص خودکار' : (agentObj?.agentName ?? 'PTA'),
        agentAvatarUrl: null,
        title: title ?? 'گفتگوی جدید',
        messageCount: 0,
        totalInputTokens: 0,
        totalOutputTokens: 0,
        status: 'active',
        lastMessageAt: new Date().toISOString(),
        lastMessagePreview: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set({ sessions: [newSession, ...get().sessions], activeSessionId: id });
      return id;
    },
    setActiveAgentId: (id) => set({ activeAgentId: id }),
    setStreaming: (v) => set({ isStreaming: v }),
    setListOpen: (v) => set({ isListOpen: v }),
    toggleList: () => set((s) => ({ isListOpen: !s.isListOpen })),
  },
}));
