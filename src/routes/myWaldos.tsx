import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

type MyWaldoProfileComponentProps = {
  profile: WaldoProfile;
};

function MyWaldoProfileComponent({ profile }: MyWaldoProfileComponentProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{profile.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <img src={profile.image} />
      </CardContent>
    </Card>
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
      <h2>You already found {waldos.length} waldos!</h2>
      <div className="grid grid-cols-3 gap-2">
        {waldos.map((waldo) => (
          <MyWaldoProfileComponent
            profile={waldo}
            key={waldo.id}
          ></MyWaldoProfileComponent>
        ))}
      </div>
      <Link to="/chooseWaldo">
        <Button className="w-100">Find the next Waldo</Button>
      </Link>
    </>
  );
}
