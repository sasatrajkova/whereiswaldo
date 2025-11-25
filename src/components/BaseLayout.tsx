import React from 'react';

export interface LayoutProps {
  children: React.ReactNode;
}

export default function BaseLayout({ children }: LayoutProps) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-2">
      {children}
    </main>
  );
}
