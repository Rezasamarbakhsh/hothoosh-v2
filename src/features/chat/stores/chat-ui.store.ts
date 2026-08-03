import { create } from 'zustand';
import { MOCK_SESSIONS, type ChatSession, type ChatMessage } from '@/features/chat/types/chat.types';

interface ChatUIState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  activeAgentId: string;
  isStreaming: boolean;
  messagesMap: Record<string, ChatMessage[]>;
  actions: {
    setSessions: (s: ChatSession[]) => void;
    setActiveSessionId: (id: string | null) => void;
    deleteSession: (id: string) => void;
    createSession: (title?: string) => string;
    addMessage: (sessionId: string, msg: ChatMessage) => void;
    setActiveAgentId: (id: string) => void;
    setStreaming: (v: boolean) => void;
  };
}

export const useChatUIStore = create<ChatUIState>((set, get) => ({
  sessions: MOCK_SESSIONS.filter((s) => s.status !== 'deleted'),
  activeSessionId: null,
  activeAgentId: 'auto',
  isStreaming: false,
  messagesMap: {},
  actions: {
    setSessions: (sessions) => set({ sessions }),
    setActiveSessionId: (id) => set({ activeSessionId: id }),
    deleteSession: (id) => {
      const { activeSessionId, messagesMap } = get();
      const newMap = { ...messagesMap };
      delete newMap[id];
      set({
        sessions: get().sessions.filter((s) => s.id !== id),
        activeSessionId: activeSessionId === id ? null : activeSessionId,
        messagesMap: newMap,
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
    addMessage: (sessionId, msg) => {
      const map = get().messagesMap;
      const existing = map[sessionId] ?? [];
      set({
        messagesMap: { ...map, [sessionId]: [...existing, msg] },
      });
      // Update session title and preview
      if (msg.role === 'user') {
        set({
          sessions: get().sessions.map((s) =>
            s.id === sessionId
              ? { ...s, title: s.id.startsWith('new-') ? msg.content.slice(0, 40) : s.title, lastMessagePreview: msg.content.slice(0, 60), updatedAt: new Date().toISOString(), messageCount: s.messageCount + 1 }
              : s,
          ),
        });
      }
    },
    setActiveAgentId: (id) => set({ activeAgentId: id }),
    setStreaming: (v) => set({ isStreaming: v }),
  },
}));
