import { ReactNode } from 'react';
import SiteHeader from '../SiteHeader';
import SiteFooter from '../SiteFooter';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background arcade-bg">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
