import React from 'react'

const Parent: React.FC = ({ children }) => {
  return (
    <div className="relative flex flex-col justify-between gap-1 rounded-md bg-amber-100 p-2 transition-shadow duration-200 ease-in-out hover:shadow">
      {children}
    </div>
  )
}

const Body: React.FC = ({ children }) => {
  return <div className="flex flex-col gap-1">{children}</div>
}

const Footer: React.FC = ({ children }) => {
  return <div className="flex justify-end gap-2">{children}</div>
}

export default { Body, Parent, Footer }
