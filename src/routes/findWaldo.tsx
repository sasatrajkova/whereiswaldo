import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getUser, type User } from '@/database/database';
import { createFileRoute, Link } from '@tanstack/react-router';
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
  return (
    <>
      <div className="h-dvh w-full flex flex-col">
        <div className="w-full flex-1 bg-white flex h-50">
          <img src={profile.imageBase64} className="object-cover flex-1" />
        </div>
        <div className="w-full flex-1 bg-black h-50">
          <Scanner onScan={(result) => handleScanResult(result)} />
        </div>
      </div>
    </>
  );
}

function RouteComponent() {
  const { id } = Route.useSearch();
  const [user, setUser] = useState<User>();

  function handleScanResult(result: IDetectedBarcode[]) {
    console.log(result);
  }

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

        <div className="absolute flex gap-2">
          <Link to="/askWaldo" search={{ id }}>
            <Button type="submit">Found waldo</Button>
          </Link>
          <Link to="/chooseWaldo">
            <Button type="button">Go Back</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
