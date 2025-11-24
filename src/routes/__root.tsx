import * as React from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import BaseLayout from '@/components/BaseLayout';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <BaseLayout>
        <Outlet />
      </BaseLayout>
    </React.Fragment>
  );
}
