import React from 'react';

interface Props {}

export const SideBar: React.FC<Props> = ({ children }) => {
  return (
    <div className="drawer drawer-mobile h-52">
      <input id="mirai-drawer" type="checkbox" className="drawer-toggle" />
      <div className="flex flex-col items-center justify-center drawer-content">{children}</div>
      <div className="drawer-side">
        <label htmlFor="mirai-drawer" className="drawer-overlay lg:hidden"></label>
        <ul className="menu p-4 pt-0 overflow-y-auto bg-amber-50 lg:bg-transparent w-60 text-base-content border-r border-amber-200 space-y-2">
          <li>
            <button className="btn btn-secondary btn-sm">Action</button>
          </li>
          <li>
            <button className="btn btn-secondary btn-sm">Action</button>
          </li>
        </ul>
      </div>
    </div>
  );
};
