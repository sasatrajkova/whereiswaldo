import { Link } from '@tanstack/react-router';
import { Button } from './ui/button';
import { getMe, User } from '@/database/database';
import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    getMe().then((value) => { if (value) { setUser(value) }})
  }, [])
  return (
    <>
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-foreground mb-4 leading-tight">
        <span className="inline-block animate-wiggle">{"Where's"}</span>
        <br />
        <span
          className="inline-block text-transparent bg-clip-text bg-primary animate-pulse"
          style={{
            WebkitTextStroke: 'px currentColor',
            paintOrder: 'stroke fill',
          }}
        >
          {user?.name ?? ' Waldo?'}
        </span>
      </h1>

      { user?.imageBase64 && <img className='w-200px' src={user?.imageBase64} /> }

      <Link to="/createAvatar">
        <Button>Start the adventure</Button>
      </Link>

      <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-md mx-auto leading-relaxed">
        {'Embark on a jungle adventure and find Waldo hidden in the wild!'}
      </p>
    </>
  );
}
