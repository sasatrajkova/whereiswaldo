import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAvailableWaldos, User } from '@/database/database';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/chooseWaldo')({
  component: RouteComponent,
});

type WaldoProfileComponentProps = {
  profile: User;
};

function WaldoProfileComponent({ profile }: WaldoProfileComponentProps) {
  return (
    <Link to="/findWaldo" search={{ id: profile.id }}>
      <Card className="w-full cursor-pointer">
        <CardHeader>
          <CardTitle className="overflow-hidden text-ellipsis">
            {profile.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <img src={profile.imageBase64} className="w-30 h-30 object-cover" />
        </CardContent>
      </Card>
    </Link>
  );
}

function RouteComponent() {
  const [waldos, setWaldos] = useState<User[]>([]);

  useEffect(() => {
    getAvailableWaldos().then((waldos) => setWaldos(waldos));
  }, []);

  return (
    <div className='p-2'>
      <h1>Choose your next Waldo</h1>
      {waldos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 overflow-auto">
          {waldos.map((waldo) => (
            <WaldoProfileComponent
              profile={waldo}
              key={waldo.id}
            ></WaldoProfileComponent>
          ))}
        </div>
      )}
      {waldos.length === 0 && (
        <div className="flex justify-center align-center">
          <small className="font-mono">No waldos available :(</small>
        </div>
      )}
    </div>
  );
}
