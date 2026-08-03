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
  return (
    <div className='flex h-full w-full min-h-0 overflow-hidden'>
      {children}
    </div>
  );
}
