import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import React from 'react'
import { activeProfileAtom, SidebarTabs } from '../../stores'
import { MIcon } from '../lib'

interface Props {
  className?: string
  onClick?: (anchor: SidebarTabs) => void
  tabIndex?: number
}

const STUDENT_PROFILE_SIDEBAR = [
  {
    label: 'Basics',
    icon: <IconPhIdentificationCard />,
  },
  {
    label: 'Course',
    icon: <IconPhBooks />,
  },
  {
    label: 'Education',
    icon: <IconPhBookOpen />,
  },
  {
    label: 'Experience',
    icon: <IconPhBuildings />,
  },
  {
    label: 'Skills',
    icon: <IconPhShieldCheckered />,
  },
  {
    label: 'Projects',
    icon: <IconPhRocket />,
  },
  {
    label: 'Certifications',
    icon: <IconPhGraduationCap />,
  },
]

export const ProfileSidebar: React.FC<Props> = ({ className, onClick, tabIndex }) => {
  const activeTab = useAtomValue(activeProfileAtom)

  return (
    <ul className={clsx(['menu gap-1', className ?? ''])} tabIndex={tabIndex}>
      {STUDENT_PROFILE_SIDEBAR.map((section) => (
        <li key={section.label}>
          <button
            className={clsx([
              'btn btn-ghost btn-sm flex h-[2.5rem] items-center justify-start gap-2 !rounded-[4px] !px-2 !py-2 text-base font-semibold',
              activeTab !== null && activeTab === section.label.toLowerCase() && '!btn-primary',
            ])}
            onClick={() => onClick?.(section.label.toLowerCase() as SidebarTabs)}
          >
            <MIcon>{section.icon}</MIcon>
            <span> {section.label}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
