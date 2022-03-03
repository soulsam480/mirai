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
    <div className="navbar min-h-12 mb-2 rounded-none text-neutral border-b border-amber-200">
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
          <>
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="avatar placeholder">
                <div className="bg-primary text-neutral rounded-full w-8 h-8">
                  <span className="text-base"> {userData.name?.slice(0, 2).toUpperCase()} </span>
                </div>
              </button>
              <ul
                tabIndex={0}
                className="p-2 shadow-lg menu dropdown-content bg-amber-50 border border-amber-200 rounded-box w-52 space-y-2"
              >
                <li>
                  <div className="text-sm p-1">
                    <span className="font-semibold">
                      {' '}
                      {userData.name} ({userData.role})
                    </span>
                  </div>{' '}
                </li>

                <li>
                  <button className="btn btn-sm btn-outline">Settings</button>
                </li>

                <li>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => signOut({ redirect: true, callbackUrl: '/login' })}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <label htmlFor="mirai-drawer" className="drawer-button lg:hidden">
                <IconLaBars className="text-3xl" />
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
