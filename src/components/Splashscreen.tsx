import { Link } from '@tanstack/react-router';
import { Button } from './ui/button';
import { getMe, User } from '@/database/database';
import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    getMe().then((value) => {
      if (value) {
        setUser(value);
      }
    });
  }, []);
  return (
    <>
      {user && (
        <>
          <h1>{'Welcome back ' + user.name + '!'}</h1>
          <img className="w-60 rounded-xl" src={user.imageBase64} />
          <Link to="/chooseWaldo">
            <Button>Continue the adventure</Button>
          </Link>
        </>
      )}
      {!user && (
        <>
          <h1>{"Where's Waldo?"}</h1>
          <Link to="/createAvatar">
            <Button>Start the adventure</Button>
          </Link>
          <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-md mx-auto leading-relaxed">
            {'Embark on a jungle adventure and find Waldo hidden in the wild!'}
          </p>
        </>
      )}
    </>
  );
}
