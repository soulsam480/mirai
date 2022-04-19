/**
 * Use this for listing and data rep. pages
 */

import { MIcon } from 'components/lib/MIcon'
import MLink from 'components/lib/MLink'
import React, { HTMLProps } from 'react'

interface PageWrapperProps extends HTMLProps<HTMLDivElement> {}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, ...rest }) => {
  return <div {...rest}> {children} </div>
}

interface PageHeaderProps extends HTMLProps<HTMLDivElement> {
  createActionUrl: string
  createLabel: string
  headerLabel?: string
}

const PageHeader: React.FC<PageHeaderProps> = ({ createActionUrl, createLabel, headerLabel, ...props }) => {
  return (
    <div className="flex items-center justify-between border-b border-base-200 pb-4" {...props}>
      <div className="text-xl font-medium">{headerLabel}</div>

      <MLink href={createActionUrl}>
        <a className="btn-neutral btn-outline btn btn-sm flex items-center gap-2">
          <MIcon>
            <IconLaPlusCircle />
          </MIcon>
          <span>{createLabel}</span>
        </a>
      </MLink>
    </div>
  )
}

// todo: add footer and content
export default { PageHeader, PageWrapper }
