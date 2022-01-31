import React from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';

interface Props {
  className?: string;
}

const MLink: React.FC<Props & LinkProps> = ({ href, children, ...rest }) => {
  const { pathname } = useRouter();

  return (
    <Link href={href} {...rest}>
      <a className={clsx([pathname === href ? 'active' : '', '!px-2 !py-1'])}> {children} </a>
    </Link>
  );
};

export default MLink;
