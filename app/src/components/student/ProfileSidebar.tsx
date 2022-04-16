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
    anchor: 'basics',
    icon: <IconLaPassport />,
  },
  {
    label: 'Education',
    anchor: 'education',
    icon: <IconLaSchool />,
  },
  {
    label: 'Score',
    anchor: 'score',
    icon: <IconLaFileInvoice />,
  },
  {
    label: 'Experience',
    anchor: 'experience',
    icon: <IconLaBuilding />,
  },
  {
    label: 'Skills',
    anchor: 'skills',
    icon: <IconLaShieldAlt />,
  },
  {
    label: 'Projects',
    anchor: 'projects',
    icon: <IconLaRocket />,
  },
  {
    label: 'Certifications',
    anchor: 'certifications',
    icon: <IconLaUserGraduate />,
  },
]

export const ProfileSidebar: React.FC<Props> = ({ className, onClick, tabIndex }) => {
  const activeTab = useAtomValue(activeProfileAtom)

  return (
    <ul className={clsx(['menu gap-1', className ?? ''])} tabIndex={tabIndex}>
      {STUDENT_PROFILE_SIDEBAR.map((section) => (
        <li key={section.anchor}>
          <button
            className={clsx([
              'btn btn-ghost btn-sm flex h-[2.5rem] items-center justify-start gap-2 rounded-lg !px-2 !py-2 text-base font-normal',
              activeTab !== null && activeTab === section.anchor && '!btn-secondary',
            ])}
            onClick={() => onClick?.(section.anchor as SidebarTabs)}
          >
            <MIcon>{section.icon}</MIcon>
            <span> {section.label}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
