import MLink from 'components/lib/MLink'
import { useRouter } from 'next/router'
import React from 'react'

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

  return (
    <ul className="gap-1 menu menu-compact">
      {STUDENT_PROFILE_SIDEBAR.map((section) => (
        <li key={section.anchor}>
          <MLink href={`${pathname}#${section.anchor}`} className="hover:rounded-md rounded-md !text-base">
            {section.label}
          </MLink>
        </li>
      ))}
    </ul>
  )
}
