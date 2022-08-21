import React, { useMemo } from 'react'
import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'

export interface MLinkProps extends LinkProps {
  className?: string
  active?: (pathname: string) => boolean
  onClick?: () => void
}

export const MLink: React.FC<MLinkProps> = ({ href, children, className, active, onClick, ...rest }) => {
  const { pathname } = useRouter()

  const isActive = useMemo(
    () => (active !== undefined ? active(pathname) : pathname === href),
    [pathname, active, href],
  )

  return (
    <Link href={href} {...rest}>
      <a className={clsx([isActive ? 'active' : '', className])} onClick={onClick}>
        {children}
      </a>
    </Link>
  )
}

MLink.displayName = 'MLink'
