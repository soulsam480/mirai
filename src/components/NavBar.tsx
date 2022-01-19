import { Menu, Transition } from '@headlessui/react';
import { useAtom } from 'jotai';
import Link from 'next/link';
import React, { Fragment } from 'react';
import { loggedInAtom, userAtom } from 'stores/user';
import { ChevronDownIcon } from '@heroicons/react/solid';

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
          <Menu as="div" className="dropdown dropdown-left ">
            <Menu.Button as="button" className="btn btn-sm btn-ghost hover:bg-primary btn-primary">
              {userData.name}
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                as="ul"
                tabIndex={0}
                className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
              >
                <Menu.Item as="li" className="px-1 py-1">
                  {() => <> Hello </>}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>
    </div>
  );
};
