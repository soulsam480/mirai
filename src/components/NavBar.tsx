import { useAtom } from 'jotai';
import { signOut } from 'next-auth/react';
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
        {!isLoggedIn ? (
          <>
            <button className="btn btn-sm btn-ghost hover:bg-primary btn-primary">Contact sales</button>
            <Link href="/login">
              <a className="btn btn-sm btn-ghost hover:bg-primary btn-secondary">Login / Signup</a>
            </Link>
          </>
        ) : (
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="m-1 btn btn-sm btn-primary">
              {userData.role} : {userData.name}
            </button>
            <ul tabIndex={0} className="p-2 shadow-lg menu dropdown-content bg-amber-50 rounded-box w-52 space-y-2">
              <li>
                <button className="btn btn-sm btn-outline">Settings</button>
              </li>

              <li>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => signOut({ redirect: true, callbackUrl: 'http://localhost:3000/login' })}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
