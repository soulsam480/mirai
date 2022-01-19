import { useAtom } from 'jotai';
import Link from 'next/link';
import React from 'react';
import { loggedInAtom, userAtom } from 'stores/user';

interface Props {}

export const NavBar: React.FC<Props> = () => {
  const [userData] = useAtom(userAtom);
  const [isLoggedIn] = useAtom(loggedInAtom);

  return (
    <div className="navbar min-h-12 mb-2 rounded-none text-neutral">
      <div className="flex-1 mx-2">
        <Link href="/">
          <a className="text-lg font-bold">Mirai</a>
        </Link>
      </div>
      <div className="flex-none space-x-2">
        <button className="btn btn-sm btn-ghost hover:bg-primary btn-primary">Contact sales</button>
        {!isLoggedIn ? (
          <Link href="/login">
            <a className="btn btn-sm btn-ghost hover:bg-primary btn-secondary">Login / Signup</a>
          </Link>
        ) : (
          <div> {userData.name} </div>
        )}
      </div>
    </div>
  );
};
