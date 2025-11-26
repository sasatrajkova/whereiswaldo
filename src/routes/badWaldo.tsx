import { createFileRoute, Link } from '@tanstack/react-router';
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
      <div>
        <div className="relative w-full h-full p-8 flex flex-col gap-2">
          <img
            src={badWaldo}
            className="object-cover flex-1 h-full animate-fade-in rounded-xl"
          />
          <h2 className="absolute inset-0 flex self-center justify-center text-red-600 font-bold text-5xl animate-zoom-in translate-y-[-150px]">
            <span className="absolute top-[12px] text-red-200 scale-[95%]">
              WRONG WALDO!!
            </span>
            <span className="absolute top-[10px] text-red-300 scale-[96%]">
              WRONG WALDO!!
            </span>
            <span className="absolute top-[8px] text-red-300 scale-[97%]">
              WRONG WALDO!!
            </span>
            <span className="absolute top-[6px] text-red-400 scale-[98%]">
              WRONG WALDO!!
            </span>
            <span className="absolute top-[4px] text-red-400 scale-[99%]">
              WRONG WALDO!!
            </span>
            <span className="absolute top-[2px] text-red-400 scale-[99%]">
              WRONG WALDO!!
            </span>
            <span className="absolute top-0">WRONG WALDO!!</span>
          </h2>
          <Link to="/findWaldo" search={{ id }} className="w-full">
            <Button type="button" className="w-full">
              Try again
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
