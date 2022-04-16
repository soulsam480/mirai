import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import React from 'react'
import { activeProfileAtom, SidebarTabs } from 'stores/activeProfile'

interface Props {
  className?: string
  onClick?: (anchor: SidebarTabs) => void
  tabIndex?: number
}

const STUDENT_PROFILE_SIDEBAR = [
  {
    label: 'Basics',
    anchor: 'basics',
  },
  {
    label: 'Score',
    anchor: 'score',
  },
  {
    label: 'Education',
    anchor: 'education',
  },
  {
    label: 'Experience',
    anchor: 'experience',
  },
  {
    label: 'Skills',
    anchor: 'skills',
  },
  {
    label: 'Projects',
    anchor: 'projects',
  },
  {
    label: 'Certifications',
    anchor: 'certifications',
  },
]

export const ProfileSidebar: React.FC<Props> = ({ className, onClick, tabIndex }) => {
  const activeTab = useAtomValue(activeProfileAtom)

  return (
    <ul className={clsx(['menu menu-compact gap-1', className ?? ''])} tabIndex={tabIndex}>
      {STUDENT_PROFILE_SIDEBAR.map((section) => (
        <li key={section.anchor}>
          <button
            className={clsx([
              'rounded-md !text-base hover:rounded-md',
              activeTab !== null && activeTab === section.anchor && 'active',
            ])}
            onClick={() => onClick?.(section.anchor as SidebarTabs)}
          >
            {section.label}
          </button>
        </li>
      ))}
    </ul>
  )
}
