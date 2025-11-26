import { Link } from '@tanstack/react-router';
import { Button } from './ui/button';
import { getMe, User } from '@/database/database';
import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User>();
  useEffect(() => {
    getMe().then((value) => {
      if (value) {
        setUser(value);
      }

      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <span className="font-mono">Thinking...</span>;
  }

  return (
    <>
      {user?.imageBase64 && (
        <>
          <h1>{'Welcome back ' + user.name + '!'}</h1>
          <img
            className="w-60 h-60 object-cover rounded-xl mb-8"
            src={user.imageBase64}
          />
          <Link to="/chooseWaldo" className="w-full">
            <Button className="w-full">Continue the adventure</Button>
          </Link>
        </>
      )}
      {!user?.imageBase64 && (
        <>
          <h1>{"Where's Waldo?"}</h1>
          <Link to="/createAvatar" className="w-full">
            <Button className="w-full">Start the adventure</Button>
          </Link>
          <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-md mx-auto leading-relaxed">
            {'Embark on a jungle adventure and find Waldo hidden in the wild!'}
          </p>
        </>
      )}
    </>
  );
}
