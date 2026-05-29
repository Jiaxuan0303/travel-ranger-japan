import { Shell } from '@/components/layout';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Shell>{children}</Shell>;
}
