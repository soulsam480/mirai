import React from 'react'
import { useUser } from 'stores/user'
import { defineSidebar } from 'utils/helpers'
import MLink from 'lib/MLink'

interface Props {}

const sidebarConfig = {
  ADMIN: defineSidebar('/admin').extend([
    {
      label: 'Institutes',
      path: '/institute',
    },
    {
      label: 'Students',
      path: '/student',
    },
  ]),
  INSTITUTE: defineSidebar('/institute').extend([
    {
      label: 'Departments',
      path: '/department',
      active: (path) => path.includes('/department'),
    },
    {
      label: 'Courses',
      path: '/course',
    },
    {
      label: 'Batches',
      path: '/batch',
    },
    {
      label: 'Students',
      path: '/student',
    },
  ]),
  STUDENT: [],
}

export const SideBar: React.FC<Props> = ({ children }) => {
  const userData = useUser()

  return (
    <div className="drawer drawer-mobile sm:drawer-side !h-[calc(100vh-57px)]">
      <input id="mirai-drawer" type="checkbox" className="drawer-toggle" />
      {children}
      <div className="drawer-side ">
        <label htmlFor="mirai-drawer" className="drawer-overlay lg:hidden" />
        <aside className="p-4 pt-0 space-y-1 overflow-y-auto border-r menu bg-amber-50 lg:bg-transparent w-60 text-base-content border-amber-200">
          {userData.role !== undefined &&
            sidebarConfig[userData.role === 'INSTITUTE_MOD' ? 'INSTITUTE' : userData.role].map((item, key) => {
              return (
                <li key={key}>
                  <MLink className="!px-2 !py-1" href={item.path} active={item.active}>
                    {item.label}
                  </MLink>
                </li>
              )
            })}
        </aside>
      </div>
    </div>
  )
}