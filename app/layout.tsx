import type { Metadata, Viewport } from 'next';
import { GameProvider } from '@/lib/store';
import './globals.css';

export const metadata: Metadata = {
  title: 'Travel Ranger | 游侠养成计划',
  description: '通过观看日本旅行视频，学习旅行知识，像RPG游戏一样升级并解锁城市。',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
