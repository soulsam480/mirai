import React from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';

interface Props {
  className?: string;
}

const MLink: React.FC<Props & LinkProps> = ({ href, children, ...rest }) => {
  const { pathname } = useRouter();

  return (
    <Link href={href} {...rest}>
      <a className={pathname === href ? 'active' : ''}> {children} </a>
    </Link>
  );
};

export default MLink;
