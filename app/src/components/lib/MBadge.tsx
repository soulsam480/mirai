import clsx from 'clsx'
import React, { HTMLProps } from 'react'
import { MIcon } from './MIcon'

interface Props extends HTMLProps<HTMLDivElement> {
  icon?: React.ReactNode
}

export const MBadge = React.forwardRef<HTMLDivElement, Props>(({ children, icon, className, ...rest }, ref) => {
  return (
    <div className={clsx(['badge', className, icon !== undefined && 'gap-2'])} ref={ref} {...rest}>
      {icon !== undefined && <MIcon>{icon}</MIcon>}
      <span>{children}</span>
    </div>
  )
})

MBadge.displayName = 'MBadge'
