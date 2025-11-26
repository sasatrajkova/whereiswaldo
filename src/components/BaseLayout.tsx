import React from 'react';
import MyWaldoComponent from './MyWaldo.tsx';

export interface LayoutProps {
  children: React.ReactNode;
}

export default function BaseLayout({ children }: LayoutProps) {
  return (
    <>
      <main className="relative flex flex-col items-center justify-center h-full gap-4 p-8">
        {children}
        <div className="absolute bottom-0 right-0 me-10 mb-10">
          <MyWaldoComponent></MyWaldoComponent>
        </div>
      </main>
    </>
  );
}
