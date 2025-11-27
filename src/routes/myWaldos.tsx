import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getFoundUsers, User } from '@/database/database';
import { getRarityOutline, getRarityTextColor } from '@/lib/utils';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';

export const Route = createFileRoute('/myWaldos')({
  component: RouteComponent,
});

type MyWaldoProfileComponentProps = {
  profile: User;
};

function MyWaldoProfileComponent({ profile }: MyWaldoProfileComponentProps) {
  return (
    <Card
      className={`w-full cursor-pointer ${getRarityOutline(profile.rarity)}`}
    >
      <CardHeader>
        <CardTitle className="h-12 flex flex-col">
          <span className="overflow-hidden text-ellipsis">{profile.name}</span>
          {profile.rarity && (
            <span
              className={`text-sm font-semibold capitalize ${getRarityTextColor(profile.rarity)}`}
            >
              {profile.rarity}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <img
          src={profile.imageBase64}
          className="w-30 h-30 object-cover justify-self-center"
        />
      </CardContent>
    </Card>
  );
}

function RouteComponent() {
  const [waldos, setWaldos] = useState<User[]>([]);

  useEffect(() => {
    getFoundUsers().then((res) => setWaldos(res.filter((user) => !!user)));
  }, []);

  return (
    <div className="w-full flex flex-col gap-4 h-full">
      <h1>My waldos</h1>
      {waldos.length === 0 && (
        <small className="font-mono">
          You have not found any waldos yet :(
        </small>
      )}
      {waldos.length > 0 && <h2>You already found {waldos.length} waldos!</h2>}
      <div className="overflow-auto">
        <div className="w-full grid gap-4 grid-cols-[repeat(auto-fit,minmax(120px,1fr))] overflow-auto p-1">
          {waldos.map((waldo) => (
            <Link to={'/exploreWaldo'} search={{ id: waldo.id }}>
              <MyWaldoProfileComponent
                profile={waldo}
                key={waldo.id}
              ></MyWaldoProfileComponent>
            </Link>
          ))}
        </div>
      </div>
      <Link to="/chooseWaldo">
        <Button variant="secondary" className="w-full">
          Find the next Waldo
        </Button>
      </Link>
    </div>
  );
}
