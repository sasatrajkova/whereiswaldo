import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import badWaldo from '@/assets/WrongQRCodeReaction.webp';

export const Route = createFileRoute('/badWaldo')({
  component: RouteComponent,
  validateSearch: (search) => ({
    id: search.id ?? '',
  }),
});

function RouteComponent() {
  const { id } = Route.useSearch();

  return (
    <>
      <div className="h-dvh w-full flex flex-col">
        <div className="h-dvh w-full flex flex-col">
          <div className="w-full flex-1 bg-white flex h-50">
            <img src={badWaldo} className="object-cover flex-1" />
          </div>
        </div>
        <div className="absolute flex gap-2">
          <Link to="/findWaldo" search={{ id }}>
            <Button type="button">Try again</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
