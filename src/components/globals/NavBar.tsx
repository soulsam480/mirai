import { useAtomValue } from 'jotai'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { loggedInAtom, useUser } from 'stores/user'

interface Props {}

export const NavBar: React.FC<Props> = () => {
  const userData = useUser()
  const isLoggedIn = useAtomValue(loggedInAtom)

  return (
    <div className="sticky top-0 z-30 w-full mb-2 border-b text-neutral border-amber-200 bg-opacity-40 backdrop-blur">
      <div className="navbar min-h-[0] !h-12">
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
                  <div className="w-8 h-8 rounded-full bg-primary text-neutral">
                    <span className="text-base"> {userData.name?.slice(0, 2).toUpperCase()} </span>
                  </div>
                </button>
                <ul
                  tabIndex={0}
                  className="p-2 space-y-2 border shadow-lg menu dropdown-content bg-amber-50 border-amber-200 rounded-box w-52"
                >
                  <li>
                    <div className="p-1 text-sm">
                      <span className="font-semibold">
                        {' '}
                        {userData.name} ({userData.role})
                      </span>
                    </div>{' '}
                  </li>

                  <li>
                    <div className="p-0">
                      <button className="btn btn-sm btn-outline btn-block">Settings</button>
                    </div>{' '}
                  </li>

                  <li>
                    <div className="p-0">
                      <button
                        className="btn btn-sm btn-outline btn-block"
                        onClick={async () => await signOut({ redirect: true, callbackUrl: '/login' })}
                      >
                        Logout
                      </button>
                    </div>
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
    </div>
  )
}
