import { Button } from '@/components/ui/button';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/askWaldo')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Link to="/myWaldos">
        <Button>My Waldos</Button>
      </Link>
    </>
  );
}
