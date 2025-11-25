import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUsers, User } from '@/database/database';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/chooseWaldo')({
  component: RouteComponent,
});

// type WaldoProfile = {
//   image: string;
//   title: string;
//   id: string;
// };

type WaldoProfileComponentProps = {
  profile: User;
};

function WaldoProfileComponent({ profile }: WaldoProfileComponentProps) {
  return (
    <Link to="/findWaldo" search={{ id: profile.id }}>
      <Card className="w-full cursor-pointer">
        <CardHeader>
          <CardTitle>{profile.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <img src={profile.imageBase64} />
        </CardContent>
      </Card>
    </Link>
  );
}

function RouteComponent() {
  const [waldos, setWaldos] = useState<User[]>([]);

  useEffect(() => {
    getUsers().then((waldos) => setWaldos(waldos));
  }, []);

  return (
    <>
      <h1>Choose your next Waldo</h1>
      <div className="grid grid-cols-3 gap-2">
        {waldos.map((waldo) => (
          <WaldoProfileComponent
            profile={waldo}
            key={waldo.id}
          ></WaldoProfileComponent>
        ))}
      </div>
    </>
  );
}
