import React from 'react';
import MyWaldoComponent from './MyWaldo.tsx';
import NavigationComponent from './Navigation.tsx';

export interface LayoutProps {
  children: React.ReactNode;
}

export default function BaseLayout({ children }: LayoutProps) {
  return (
    <>
      <main className="relative flex flex-col items-center justify-center h-full gap-4 p-8">
        {children}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-10">
          <MyWaldoComponent />
        </div>
        <div className="absolute bottom-0 left-0 ms-10 mb-10">
          <NavigationComponent />
        </div>
      </main>
    </>
  );
}
