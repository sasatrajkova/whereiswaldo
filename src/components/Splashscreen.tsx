import { Link } from '@tanstack/react-router';
import { Button } from './ui/button';
import { getMe, User } from '@/database/database';
import { useEffect, useState } from 'react';
import CurvedLoop from './CurvedLoop';

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
    <div className="relative h-full w-full overflow-hidden">
      {user?.imageBase64 && (
        <div className="h-full flex flex-col justify-between">
          <h1 className="pt-3">{'Welcome back ' + user.name + '!'}</h1>
          <img
            className="w-60 h-60 object-cover rounded-xl mb-8 self-center"
            src={user.imageBase64}
          />
          <div className="absolute top-40 h-full w-full">
            <CurvedLoop
              marqueeText="*jungle jungle * where's waldo?*"
              curveAmount={800}
              interactive={false}
            />
          </div>
          <Link to="/chooseWaldo" className="w-full z-10">
            <Button className="w-full mb-3">Continue the adventure</Button>
          </Link>
        </div>
      )}
      {!user?.imageBase64 && (
        <div className="h-full flex flex-col justify-between">
          <h1 className="pt-3">{"Where's Waldo?"}</h1>
          <div className="absolute -top-40 h-full w-full">
            <CurvedLoop
              marqueeText="**** collect * all * the * waldo's! ****"
              curveAmount={300}
              interactive={false}
            />
          </div>
          <Link to="/createAvatar" className="w-full z-10">
            <Button className="w-full">Start the adventure</Button>
          </Link>
          <div></div>
        </div>
      )}
    </div>
  );
}
