import React from 'react'

interface Props {}

export const ProfileSection: React.FC<Props> = ({ children }) => {
  return <div className="p-2 rounded-md xl:w-[70%] transition-all duration-200">{children}</div>
}
