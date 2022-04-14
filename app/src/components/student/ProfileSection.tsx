import clsx from 'clsx'
import React, { HTMLProps } from 'react'

interface Props extends HTMLProps<HTMLDivElement> {}

export const ProfileSection = React.forwardRef<HTMLDivElement, Props>(
  ({ children, className: _className = '', ...rest }, ref) => {
    return (
      <div {...rest} className={clsx(['p-2 rounded-md xl:w-[70%] transition-all duration-200', _className])} ref={ref}>
        {children}
      </div>
    )
  },
)
