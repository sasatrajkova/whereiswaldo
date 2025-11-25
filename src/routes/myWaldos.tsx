import { Button } from '@/components/ui/button';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/myWaldos')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Link to="/chooseWaldo">
        <Button>Choose Waldos</Button>
      </Link>
    </>
  );
}
