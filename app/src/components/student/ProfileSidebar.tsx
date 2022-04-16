import MLink from 'components/lib/MLink'
import { useAtomValue } from 'jotai'
import { useRouter } from 'next/router'
import React from 'react'
import { activeProfileAtom } from 'stores/activeProfile'

interface Props {}

// TODO: scroll synced route change and navigation

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

export const ProfileSidebar: React.FC<Props> = () => {
  const { pathname } = useRouter()
  const activeTab = useAtomValue(activeProfileAtom)

  return (
    <ul className="menu menu-compact gap-1">
      {STUDENT_PROFILE_SIDEBAR.map((section) => (
        <li key={section.anchor}>
          <MLink
            href={`${pathname}#${section.anchor}`}
            className="rounded-md !text-base hover:rounded-md"
            active={() => activeTab !== null && activeTab === section.anchor}
          >
            {section.label}
          </MLink>
        </li>
      ))}
    </ul>
  )
}
