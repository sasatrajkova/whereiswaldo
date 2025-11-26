import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getFoundUsers, User } from '@/database/database';
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{profile.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <img src={profile.imageBase64} />
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
    <>
      <h1>My waldos</h1>
      {waldos.length === 0 && (
        <small className="font-mono">
          You have not found any waldos yet :(
        </small>
      )}
      {waldos.length > 0 && <h2>You already found {waldos.length} waldos!</h2>}
      <div className="grid grid-cols-3 gap-2 p-4">
        {waldos.map((waldo) => (
          <Link to={"/exploreWaldo"} search={{ id: waldo.id }}><MyWaldoProfileComponent
            profile={waldo}
            key={waldo.id}
          ></MyWaldoProfileComponent></Link>
        ))}
      </div>
      <Link to="/chooseWaldo">
        <Button className="w-100">Find the next Waldo</Button>
      </Link>
    </>
  );
}
