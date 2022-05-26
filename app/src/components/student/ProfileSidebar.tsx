import clsx from 'clsx'
import { MIcon } from 'components/lib/MIcon'
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
    icon: <IconLaPassport />,
  },
  {
    label: 'Course',
    icon: <IconLaBook />,
  },
  {
    label: 'Education',
    icon: <IconLaSchool />,
  },
  {
    label: 'Experience',
    icon: <IconLaBuilding />,
  },
  {
    label: 'Skills',
    icon: <IconLaShieldAlt />,
  },
  {
    label: 'Projects',
    icon: <IconLaRocket />,
  },
  {
    label: 'Certifications',
    icon: <IconLaUserGraduate />,
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
              'btn btn-ghost btn-sm flex h-[2.5rem] items-center justify-start gap-2 !px-2 !py-2 text-base font-semibold',
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
