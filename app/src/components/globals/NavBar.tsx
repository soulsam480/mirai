/* eslint-disable prettier/prettier */
import type { NotificationPayload } from '@mirai/api'
import clsx from 'clsx'
import { useWS } from '../../contexts'
import { useAtom, useAtomValue } from 'jotai'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { loggedInAtom, sidebarAtom, useUser } from '../../stores'
// import { trpc } from 'utils/trpc'
import { SettingsModal } from './SettingsModal'
import { MDialog, MIcon } from '../lib'
import IconPhList from '~icons/ph/list'
import IconPhX from '~icons/ph/x'

interface Props {}

export const NavBar: React.FC<Props> = () => {
  const userData = useUser()
  const isLoggedIn = useAtomValue(loggedInAtom)
  const [settingsModal, setSettingsModal] = useState(false)
  const [sidebar, setSidebar] = useAtom(sidebarAtom)

  // const { data } = trpc.useQuery(['notification.get_all', { ts }])

  const ws = useWS()

  useEffect(() => {
    if (ws.conn === null) return

    const unsub = ws.conn.subscribe<NotificationPayload>('notification', (d) => {
      // eslint-disable-next-line no-console
      console.log(d)

      /**
       * Handle notifications here
       * when there is a new notification fetch notifications
       * listing API with the timestamp which will act as a cursor
       * uncomment the query above and try performing an action
       */
    })

    return unsub
  }, [ws])

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
          {!isLoggedIn ? (
            <>
              <button className="btn-primary btn-ghost btn-sm btn ">Contact sales</button>
              <Link href="/login">
                <a className="btn-secondary btn-ghost btn-sm btn ">Login / Signup</a>
              </Link>
            </>
          ) : (
            <>
              <div className="dropdown-end dropdown" onClick={() => setSidebar(false)}>
                <button tabIndex={0} className="placeholder avatar">
                  <div className="h-8 w-8 rounded-full bg-base-200 text-sm shadow">
                    <span> {(userData.name ?? userData?.tenant?.basics?.name)?.slice(0, 2).toUpperCase()} </span>
                  </div>
                </button>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu rounded-box w-52 space-y-2 border border-base-200 bg-base-200 p-2 shadow-lg"
                >
                  <li>
                    <div className="p-1 text-sm">
                      <span className="font-semibold text-base-content">
                        {userData.name ?? userData?.tenant?.basics?.name} ({userData.role})
                      </span>
                    </div>
                  </li>

                  <li>
                    <div className="p-0">
                      <button className="btn-outline btn-block btn-sm btn" onClick={() => setSettingsModal(true)}>
                        Settings
                      </button>
                    </div>
                  </li>

                  <li>
                    <div className="p-0">
                      <button
                        className="btn-outline btn-block btn-sm btn"
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
                  sidebar && 'swap-active',
                ])}
              >
                <MIcon className="swap-off">
                  <IconPhList />
                </MIcon>

                <MIcon className="swap-on">
                  <IconPhX />
                </MIcon>
              </label>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
