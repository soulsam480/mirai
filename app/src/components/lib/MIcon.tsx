import React, { HTMLProps } from 'react'

interface Props extends HTMLProps<HTMLSpanElement> {
  children: React.ReactNode
}

export const MIcon = React.forwardRef<HTMLSpanElement, Props>(({ children, ...rest }, ref) => {
  return (
    <span {...rest} ref={ref}>
      {children}
    </span>
  )
})

MIcon.displayName = 'MIcon'
