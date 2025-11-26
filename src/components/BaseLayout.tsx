import React from 'react';
import MyWaldoComponent from './MyWaldo.tsx';
import NavigationComponent from './Navigation.tsx';

export interface LayoutProps {
  children: React.ReactNode;
}

export default function BaseLayout({ children }: LayoutProps) {
  return (
    <>
      <main className="relative flex flex-col items-center justify-start h-full gap-4 p-2">
        {children}
      </main>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-3">
        <MyWaldoComponent />
      </div>
      <div className="absolute bottom-0 left-0 ms-3 mb-3">
        <NavigationComponent />
      </div>
    </>
  );
}
