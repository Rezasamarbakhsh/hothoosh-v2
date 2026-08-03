import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'گفتگو — هات‌هوش',
  description: 'گفتگوی هوشمند با دستیارهای AI',
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100dvh-57px)] overflow-hidden">
      {children}
    </div>
  );
}
