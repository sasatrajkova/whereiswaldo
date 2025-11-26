import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getAvailableWaldos, User } from '@/database/database';
import { getRarityOutline, getRarityTextColor } from '@/lib/utils';
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
      <Card
        className={`w-full cursor-pointer ${getRarityOutline(profile.rarity)}`}
      >
        <CardHeader>
          <CardTitle className="h-12 flex flex-col">
            <span className="overflow-hidden text-ellipsis">
              {profile.name}
            </span>
            {profile.rarity && (
              <span
                className={`text-sm font-semibold capitalize ${getRarityTextColor(profile.rarity)}`}
              >
                {profile.rarity}
              </span>
            )}
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <img
            src={profile.imageBase64}
            className="w-30 h-30 object-cover justify-self-center"
          />
        </CardContent>
      </Card>
    </Link>
  );
}

function sortByRarestFirst(rarity?: string): number {
  switch (rarity) {
    case 'rare':
      return 0;
    case 'uncommon':
      return 1;
    case 'common':
      return 2;
    default:
      return 3;
  }
}

function RouteComponent() {
  const [waldos, setWaldos] = useState<User[]>([]);

  useEffect(() => {
    getAvailableWaldos().then((waldos) => {
      const sorted = [...waldos].sort(
        (a, b) => sortByRarestFirst(a.rarity) - sortByRarestFirst(b.rarity)
      );
      setWaldos(sorted);
    });
  }, []);

  return (
    <div className="p-2 h-full flex flex-col">
      <h1>Choose your next Waldo</h1>
      <div className="overflow-auto">
        {waldos.length > 0 && (
          <div className="w-full grid gap-4 grid-cols-[repeat(auto-fit,minmax(120px,1fr))] overflow-auto p-1">
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
    </div>
  );
}
