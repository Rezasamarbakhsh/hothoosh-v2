import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'گفتگو — هات‌هوش',
  description: 'گفتگوی هوشمند با دستیاران AI',
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className='h-dvh'>{children}</div>;
}
