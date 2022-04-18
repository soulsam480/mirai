import React, { useRef } from 'react'
import { useUser } from 'stores/user'
import { defineSidebar } from 'utils/helpers'
import MLink from 'lib/MLink'
import { MIcon } from 'components/lib/MIcon'

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
    },
    {
      label: 'Courses',
      path: '/course',
      active: (path) => path.includes('/course'),
      icon: <IconLaBook />,
    },
    {
      label: 'Batches',
      path: '/batch',
      active: (path) => path.includes('/batch'),
      icon: <IconLaUserFriends />,
    },
    {
      label: 'Students',
      path: '/student',
      active: (path) => path.includes('/student'),
      icon: <IconLaUserGraduate />,
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

export const SideBar: React.FC<Props> = ({ children }) => {
  const userData = useUser()
  const drawerRef = useRef<HTMLInputElement | null>(null)

  function dismissDrawer() {
    drawerRef.current !== null && (drawerRef.current.checked = false)
  }

  return (
    <div className="drawer-mobile drawer !h-[calc(100vh-57px)] sm:drawer-side">
      <input id="mirai-drawer" type="checkbox" className="drawer-toggle" ref={drawerRef} />
      {children}
      <div className="drawer-side ">
        <label htmlFor="mirai-drawer" className="drawer-overlay lg:hidden" />
        <aside className="menu w-60 space-y-1 overflow-y-auto border-r border-amber-200 bg-amber-50 p-4 pt-0 text-base-content lg:bg-transparent">
          {userData.role !== undefined && (
            <>
              <li className="!hover:bg-transparent mb-1 text-ellipsis border-b border-amber-200 p-1 text-sm font-semibold">
                {userData.name ?? userData.email ?? 'User'} ({userData.role})
              </li>
              {sidebarConfig[userData.role === 'INSTITUTE_MOD' ? 'INSTITUTE' : userData.role].map((item, key) => {
                return (
                  <li key={key}>
                    <MLink
                      className="flex items-center gap-2 !px-2 !py-1"
                      href={item.path}
                      active={item.active}
                      onClick={dismissDrawer}
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
    </div>
  )
}
