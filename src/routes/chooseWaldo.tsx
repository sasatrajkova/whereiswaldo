import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/chooseWaldo')({
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
      {
        image: 'https://picsum.photos/100',
        title: 'Waldo 5',
        id: '888',
      },
      {
        image: 'https://picsum.photos/100',
        title: 'Waldo 6',
        id: '999',
      },
    ]).then((waldos) => setWaldos(waldos));
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
