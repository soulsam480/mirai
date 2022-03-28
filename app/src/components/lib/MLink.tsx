import React, { useMemo } from 'react'
import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'

export interface MLinkProps {
  className?: string
  active?: (pathname: string) => boolean
}

const MLink: React.FC<MLinkProps & LinkProps> = ({ href, children, className, active, ...rest }) => {
  const { pathname } = useRouter()

  const isActive = useMemo(
    () => (active !== undefined ? active(pathname) : pathname === href),
    [pathname, active, href],
  )

  return (
    <Link href={href} {...rest}>
      <a className={clsx([isActive ? 'active' : '', className])}> {children} </a>
    </Link>
  )
}

export default MLink
