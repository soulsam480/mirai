import React, { useEffect, useRef, useState } from 'react'
import { useUser } from 'stores/user'
import { defineSidebar, eventBus } from 'utils/helpers'
import MLink from 'lib/MLink'
import { MIcon } from 'components/lib/MIcon'
import { useAtom } from 'jotai'
import { sidebarAtom } from 'stores/config'
import dynamic from 'next/dynamic'
import { OnboardingDialog } from './OnboardingDialog'
import type { Tour } from 'react-shepherd'
import { createBreakpoint } from 'react-use'
import { toggleTour } from 'api'
import type { Role } from '@prisma/client'

const PlatformTour = dynamic(async () => await import('components/globals/PlatformTour'), { ssr: false })

interface Props {}

const sidebarConfig = {
  ADMIN: defineSidebar('/admin').extend([
    {
      label: 'Institutes',
      path: '/institute',
      icon: <IconPhBuildings />,
    },
    {
      label: 'Students',
      path: '/student',
      icon: <IconPhGraduationCap />,
    },
  ]),
  INSTITUTE: defineSidebar('/institute').extend([
    {
      label: 'Departments',
      path: '/department',
      active: (path) => path.includes('/department'),
      icon: <IconPhCirclesThree />,
      id: 'm-inst-departments',
    },
    {
      label: 'Courses',
      path: '/course',
      active: (path) => path.includes('/course'),
      icon: <IconPhBooks />,
      id: 'm-inst-courses',
    },
    {
      label: 'Batches',
      path: '/batch',
      active: (path) => path.includes('/batch'),
      icon: <IconPhUsers />,
      id: 'm-inst-batches',
    },
    {
      label: 'Students',
      path: '/students',
      active: (path) => path.includes('/students'),
      icon: <IconPhStudent />,
      id: 'm-inst-students',
    },
    {
      label: 'Tickets',
      path: '/tickets',
      active: (path) => path.includes('/tickets'),
      icon: <IconPhTicket />,
      id: 'm-inst-tickets',
    },
  ]),
  STUDENT: defineSidebar('/student').extend([
    {
      label: 'Profile',
      path: '/profile',
      active: (path) => path.includes('/profile'),
      icon: <IconPhUser />,
      id: 'm-stu-profile',
    },
    {
      label: 'My Applications',
      path: '/applications',
      active: (path) => path.includes('/applications'),
      icon: <IconPhFiles />,
      id: 'm-stu-applications',
    },
    {
      label: 'Opportunities',
      path: '/opportunities',
      active: (path) => path.includes('/opportunities'),
      icon: <IconPhHandshake />,
      id: 'm-stu-opportunities',
    },
  ]),
}

const useBreakpoint = createBreakpoint({ lg: 1024 })

const enabledRoles: Role[] = ['INSTITUTE', 'STUDENT']

export const SideBar: React.FC<Props> = ({ children }) => {
  const userData = useUser()
  const [sidebar, setSidebar] = useAtom(sidebarAtom)
  const breakpoint = useBreakpoint()

  const tour = useRef<Tour | null>(null)
  const [showDialog, setDialog] = useState(!enabledRoles.includes(userData.role) ? false : userData.showTour ?? false)

  async function onStart() {
    setDialog(false)

    breakpoint === 'lg' && setSidebar(true)
    tour.current?.start()
  }

  useEffect(() => {
    if (userData.id === undefined) return

    eventBus.on('toggle-tour', () => {
      setDialog(true)
      toggleTour({ id: userData?.id, showTour: true })
    })
  }, [userData])

  useEffect(() => {
    tour.current?.on('complete', () => {
      if (userData.id === undefined) return

      toggleTour({ id: userData?.id, showTour: false })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour.current])

  return (
    <div className="drawer drawer-mobile !h-[calc(100vh-57px)] sm:drawer-side">
      <input
        id="mirai-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={sidebar}
        onChange={({ target: { checked } }) => {
          void setSidebar(checked)
        }}
      />
      {children}
      <div className="drawer-side">
        <label htmlFor="mirai-drawer" className="drawer-overlay lg:hidden" />

        <aside className="menu w-60 space-y-1 overflow-y-auto border-r border-base-200 bg-base-100  p-4 pt-0 text-base-content lg:bg-transparent">
          {userData.role !== undefined && (
            <>
              <li className="!hover:bg-transparent mb-1 truncate border-b border-base-200 p-1 text-sm font-semibold">
                {userData.name ?? userData.email ?? 'User'} ({userData.role})
              </li>

              {sidebarConfig[userData.role === 'INSTITUTE_MOD' ? 'INSTITUTE' : userData.role].map((item, key) => {
                return (
                  <li key={key} id={item.id}>
                    <MLink
                      className="flex items-center gap-2 !px-2 !py-1 font-semibold"
                      href={item.path}
                      active={item.active}
                      onClick={() => setSidebar(false)}
                    >
                      {item.icon !== undefined && <MIcon>{item.icon}</MIcon>}
                      <span>{item.label}</span>
                    </MLink>
                  </li>
                )
              })}
            </>
          )}
        </aside>
      </div>

      <OnboardingDialog
        show={showDialog}
        onStart={onStart}
        onDismiss={() => {
          setDialog(false)

          toggleTour({ id: userData?.id, showTour: false })
        }}
      />

      <PlatformTour
        assignRef={(base) => {
          tour.current = base
        }}
        role={userData.role}
      />
    </div>
  )
}
