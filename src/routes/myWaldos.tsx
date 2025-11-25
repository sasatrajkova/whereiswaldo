import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';

export const Route = createFileRoute('/myWaldos')({
  component: RouteComponent,
});

type WaldoProfile = {
  image: string;
  title: string;
  id: string;
};
type WaldoProfileComponentProps = {
  profile: WaldoProfile;
};

function WaldoProfileComponent({ profile }: WaldoProfileComponentProps) {
  return (
    <Link to="/findWaldo" search={{ id: profile.id }}>
      <Card className="w-full cursor-pointer">
        <CardHeader>
          <CardTitle>{profile.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <img src={profile.image} />
        </CardContent>
      </Card>
    </Link>
  );
}

function RouteComponent() {
  const [waldos, setWaldos] = useState<WaldoProfile[]>([]);

  useEffect(() => {
    Promise.resolve([
      {
        image: 'https://picsum.photos/100',
        title: 'Waldo 1',
        id: '444',
      },
      {
        image: 'https://picsum.photos/100',
        title: 'Waldo 2',
        id: '555',
      },
      {
        image: 'https://picsum.photos/100',
        title: 'Waldo 3',
        id: '666',
      },
      {
        image: 'https://picsum.photos/100',
        title: 'Waldo 4',
        id: '777',
      },
    ]).then((waldos) => setWaldos(waldos));
  }, []);

  return (
    <>
      <h1>My waldos!</h1>
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
