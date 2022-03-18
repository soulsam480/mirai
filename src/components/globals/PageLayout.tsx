/**
 * Use this for listing and data rep. pages
 */

import Link from 'next/link';
import React, { HTMLProps } from 'react';

interface PageWrapperProps extends HTMLProps<HTMLDivElement> {}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, ...rest }) => {
  return <div {...rest}> {children} </div>;
};

interface PageHeaderProps extends HTMLProps<HTMLDivElement> {
  createActionUrl: string;
  createLabel: string;
  headerLabel?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ createActionUrl, createLabel, headerLabel, ...props }) => {
  return (
    <div className="flex justify-between items-center border-b border-amber-200 pb-4" {...props}>
      <div className="text-xl font-medium">{headerLabel}</div>

      <Link href={createActionUrl}>
        <a className="btn btn-primary btn-sm"> {createLabel} </a>
      </Link>
    </div>
  );
};

//todo: add footer and content
export default { PageHeader, PageWrapper };
