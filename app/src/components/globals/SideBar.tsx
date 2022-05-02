import React, { useRef, useState } from 'react'
import { useUser } from 'stores/user'
import { defineSidebar } from 'utils/helpers'
import MLink from 'lib/MLink'
import { MIcon } from 'components/lib/MIcon'
import { useAtom } from 'jotai'
import { sidebarAtom } from 'stores/config'
import dynamic from 'next/dynamic'
import { OnboardingDialog } from './OnboardingDialog'
import type { Tour } from 'react-shepherd'
import { createBreakpoint } from 'react-use'

const PlatformTour = dynamic(async () => await import('components/globals/PlatformTour'), { ssr: false })

interface Props {}

const sidebarConfig = {
  ADMIN: defineSidebar('/admin').extend([
    {
      label: 'Institutes',
      path: '/institute',
      icon: <IconLaUniversity />,
    },
    {
      label: 'Students',
      path: '/student',
      icon: <IconLaUserGraduate />,
    },
  ]),
  INSTITUTE: defineSidebar('/institute').extend([
    {
      label: 'Departments',
      path: '/department',
      active: (path) => path.includes('/department'),
      icon: <IconLaSitemap />,
      id: 'm-inst-departments',
    },
    {
      label: 'Courses',
      path: '/course',
      active: (path) => path.includes('/course'),
      icon: <IconLaBook />,
      id: 'm-inst-courses',
    },
    {
      label: 'Batches',
      path: '/batch',
      active: (path) => path.includes('/batch'),
      icon: <IconLaUserFriends />,
      id: 'm-inst-batches',
    },
    {
      label: 'Students',
      path: '/students',
      active: (path) => path.includes('/students'),
      icon: <IconLaUserGraduate />,
      id: 'm-inst-students',
    },
  ]),
  STUDENT: defineSidebar('/student').extend([
    {
      label: 'Profile',
      path: '/profile',
      icon: <IconLaUserCircle />,
    },
    {
      label: 'My Applications',
      path: '/applications',
      icon: <IconLaFileAltSolid />,
    },
    {
      label: 'Opportunities',
      path: '/opportunities',
      icon: <IconLaHandsHelping />,
    },
  ]),
}

const useBreakpoint = createBreakpoint({ lg: 1024 })

export const SideBar: React.FC<Props> = ({ children }) => {
  const userData = useUser()
  const [sidebar, setSidebar] = useAtom(sidebarAtom)
  const breakpoint = useBreakpoint()

  const tour = useRef<Tour | null>(null)
  const [showDialog, setDialog] = useState(true)

  async function onStart() {
    setDialog(false)

    breakpoint === 'lg' && setSidebar(true)
    tour.current?.start()
  }

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

      <OnboardingDialog show={showDialog} onStart={onStart} onDismiss={() => setDialog(false)} />

      <PlatformTour
        assignRef={(base) => {
          tour.current = base
        }}
      />
    </div>
  )
}
