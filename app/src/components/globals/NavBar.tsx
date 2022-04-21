import clsx from 'clsx'
import { MDialog } from 'components/lib/MDialog'
import { MIcon } from 'components/lib/MIcon'
import { useAtom, useAtomValue } from 'jotai'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { sidebarAtom } from 'stores/config'
import { loggedInAtom, useUser } from 'stores/user'
import { SettingsModal } from './SettingsModal'

interface Props {}

export const NavBar: React.FC<Props> = () => {
  const userData = useUser()
  const isLoggedIn = useAtomValue(loggedInAtom)
  const [settingsModal, setSettingsModal] = useState(false)
  const [sidebar, setSidebar] = useAtom(sidebarAtom)

  return (
    <div className="sticky top-0 z-10 mb-2 w-full border-b border-base-200 bg-opacity-40 text-neutral backdrop-blur">
      <MDialog show={settingsModal} onClose={setSettingsModal}>
        <SettingsModal onClose={setSettingsModal} />
      </MDialog>

      <div className="navbar !h-12 min-h-[0]">
        <div className="mx-2 flex-1">
          <Link href="/">
            <a className="text-lg font-bold text-base-content">Mirai</a>
          </Link>
        </div>
        <div className="flex flex-none items-center gap-2">
          {isLoggedIn === false ? (
            <>
              <button className="btn btn-primary btn-ghost btn-sm ">Contact sales</button>
              <Link href="/login">
                <a className="btn btn-secondary btn-ghost btn-sm ">Login / Signup</a>
              </Link>
            </>
          ) : (
            <>
              <div className="dropdown-end dropdown" onClick={() => setSidebar(false)}>
                <button tabIndex={0} className="placeholder avatar">
                  <div className="h-8 w-8 rounded-full bg-primary text-base-content">
                    <span> {userData.name?.slice(0, 2).toUpperCase()} </span>
                  </div>
                </button>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu rounded-box w-52 space-y-2 border border-base-200 bg-base-200 p-2 shadow-lg"
                >
                  <li>
                    <div className="p-1 text-sm">
                      <span className="font-semibold text-base-content">
                        {userData.name} ({userData.role})
                      </span>
                    </div>
                  </li>

                  <li>
                    <div className="p-0">
                      <button className="btn-outline btn btn-block btn-sm" onClick={() => setSettingsModal(true)}>
                        Settings
                      </button>
                    </div>
                  </li>

                  <li>
                    <div className="p-0">
                      <button
                        className="btn-outline btn btn-block btn-sm"
                        onClick={async () => await signOut({ redirect: true, callbackUrl: '/login' })}
                      >
                        Logout
                      </button>
                    </div>
                  </li>
                </ul>
              </div>

              <label
                htmlFor="mirai-drawer"
                className={clsx([
                  'swap drawer-button swap-rotate text-3xl text-base-content lg:hidden',
                  sidebar === true && 'swap-active',
                ])}
              >
                <MIcon className="swap-off">
                  <IconLaBars />
                </MIcon>

                <MIcon className="swap-on">
                  <IconLaTimes />
                </MIcon>
              </label>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
