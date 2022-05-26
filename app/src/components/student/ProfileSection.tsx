import clsx from 'clsx'
import React, { HTMLProps } from 'react'

interface Props extends HTMLProps<HTMLDivElement> {}

export const ProfileSection = React.forwardRef<HTMLDivElement, Props>(
  ({ children, className: _className = '', ...rest }, ref) => {
    return (
      <div
        {...rest}
        className={clsx(['max-w-full rounded-md p-2 transition-all duration-200 xl:w-[70%]', _className])}
        ref={ref}
      >
        {children}
      </div>
    )
  },
)
