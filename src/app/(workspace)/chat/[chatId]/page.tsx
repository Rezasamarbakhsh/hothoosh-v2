import ChatSessionClient from './chat-session-client';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ chatId: string }>;
}

export default async function ChatSessionPage({ params }: Props) {
  const { chatId } = await params;
  return <ChatSessionClient chatId={chatId} />;
}
