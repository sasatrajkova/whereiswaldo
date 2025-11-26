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
    <div className="flex flex-col box-border h-full">
      <h1 className="text-center">Find Waldo!</h1>
      <div className="w-full flex flex-col h-full">
        <img
          src={profile.imageBase64}
          className="object-cover rounded-t-xl h-[45%]"
        />
        <div className="w-full rounded-xl h-[45%]">
          <Scanner onScan={handleScanResult} />
        </div>
      </div>
    </div>
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
      <div className="w-full flex flex-col h-full">
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
