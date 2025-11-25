import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { getUser, User } from '@/database/database';

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
  const [profile, setProfile] = useState<User | null>(null);

  function handleScanResult(result: IDetectedBarcode[]) {
    console.log(result);
  }

  useEffect(() => {
    const loadUser = async () => {
      const user = await getUser(id);
      setProfile(user);
    };
    loadUser();
  }, [id]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="h-dvh w-full flex flex-col">
        <FindWaldoComponent profile={profile} />

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
