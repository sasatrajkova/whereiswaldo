import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getUser, type User } from '@/database/database';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner';

export const Route = createFileRoute('/findWaldo')({
  component: RouteComponent,
  validateSearch: (search) => ({
    id: search.id ?? '',
  }),
});

type FindWaldoComponentProps = {
  profile: User;
};

function FindWaldoComponent({ profile }: FindWaldoComponentProps) {
  const { id } = Route.useSearch();
  const navigate = useNavigate();

  function handleScanResult(result: IDetectedBarcode[]) {
    if (id === result[0].rawValue) {
      navigate({ to: '/askWaldo', search: { id: profile.id } });
    } else {
      navigate({ to: '/badWaldo', search: { id: profile.id } });
    }
  }

  return (
    <>
      <h1 className="mt-10 text-center">Find Waldo!</h1>
      <div className="h-dvh w-full flex flex-col pb-30">
        <div className="w-full flex-1 flex h-[50%]">
          <img
            src={profile.imageBase64}
            className="object-cover flex-1 rounded-t-xl"
          />
        </div>
        <div className="w-full flex-1 flex h-[50%] rounded-xl">
          <Scanner onScan={handleScanResult} />
        </div>
      </div>
    </>
  );
}

function RouteComponent() {
  const { id } = Route.useSearch();
  const [user, setUser] = useState<User | null>(null);
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    getUser(id as string).then((response) =>
      response ? setUser(response) : null
    );
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="h-dvh w-full flex flex-col">
        <FindWaldoComponent profile={user} />

        {isDev && (
          <div className="absolute flex gap-2 bottom-0 pb-12 right-0 pe-8">
            <Link to="/askWaldo" search={{ id }}>
              <Button type="submit">Found waldo (cheat)</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
