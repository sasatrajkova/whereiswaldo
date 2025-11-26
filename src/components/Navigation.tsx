import { useRouterState, useRouter, Link } from '@tanstack/react-router';
import { Button } from './ui/button';
import { ArrowLeftIcon, UsersIcon } from 'lucide-react';

export default function NavigationComponent() {
  const router = useRouter();
  const pathname = useRouterState().location.pathname;

  if (pathname === '/') {
    return <></>;
  }

  return (
    <div className="flex gap-4">
      <Button
        variant="ghost"
        onClick={() => router.history.go(-1)}
        className="shadow-lg"
        size="icon-lg"
      >
        <ArrowLeftIcon className="scale-175" />
      </Button>
      <Link to="/myWaldos">
        <Button variant="ghost" className="shadow-lg" size="icon-lg">
          <UsersIcon className="scale-175" />
        </Button>
      </Link>
    </div>
  );
}
