import { Button } from '@/components/ui/button';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/findWaldo')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Link to="/askWaldo">
        <Button>Ask Waldo</Button>
      </Link>
    </>
  );
}
