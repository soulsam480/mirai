import { atom } from 'jotai'

export type SidebarTabs = 'basics' | 'course' | 'education' | 'experience' | 'skills' | 'projects' | 'certifications'

export const activeProfileAtom = atom<SidebarTabs | null>(null)
activeProfileAtom.debugLabel = 'activeProfileAtom'
