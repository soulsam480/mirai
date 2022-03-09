import { useAtom } from 'jotai';
import React from 'react';
import { userAtom } from 'stores/user';
import { defineSidebar } from 'utils/helpers';
import MLink from './lib/MLink';

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
    },
    {
      label: 'Programs',
      path: '/program',
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
};

export const SideBar: React.FC<Props> = ({ children }) => {
  const [userData] = useAtom(userAtom);

  return (
    <div className="drawer drawer-mobile">
      <input id="mirai-drawer" type="checkbox" className="drawer-toggle" />
      {children}
      <div className="drawer-side min-h-[calc(100vh-57px)]">
        <label htmlFor="mirai-drawer" className="drawer-overlay lg:hidden" />
        <aside className="menu p-4 pt-0 overflow-y-auto bg-amber-50 lg:bg-transparent w-60 text-base-content border-r border-amber-200 space-y-1">
          {userData.role &&
            sidebarConfig[userData.role === 'INSTITUTE_MOD' ? 'INSTITUTE' : userData.role].map((item, key) => {
              return (
                <li key={key}>
                  <MLink className="!px-2 !py-1" href={item.path}>
                    {item.label}
                  </MLink>
                </li>
              );
            })}
        </aside>
      </div>
    </div>
  );
};
