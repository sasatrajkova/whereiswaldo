import { QrCodeIcon, UserCircleIcon } from 'lucide-react';
import { Button } from './ui/button';
import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
  SheetFooter,
  SheetClose,
} from './ui/sheet';
import { useEffect, useState } from 'react';
import { getMe, User } from '@/database/database';
import QRCode from 'react-qr-code';

export default function MyWaldoComponent() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getMe().then((u) => setUser(u));
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild disabled={!user}>
        <Button variant="secondary" className="shadow-lg">
          <QrCodeIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="w-[80%] mx-auto rounded-t-xl">
        {user && (
          <>
            <SheetHeader>
              <SheetTitle>My Waldo</SheetTitle>
              <SheetDescription className="flex flex-col">
                <small className="font-mono">Name: {user.name}</small>
                <small className="font-mono">ID: {user.id}</small>
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col justify-center px-10 gap-5">
              <QRCode
                value={user.id}
                className="w-full"
                bgColor="transparent"
              />
            </div>
          </>
        )}
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="ghost">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
