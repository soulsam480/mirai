import type { NextPageWithLayout } from '../_app'
import { useEvent } from 'react-use'
import { useCallback, useEffect } from 'react'
import { useSetAtom } from 'jotai'
import debounce from 'lodash/debounce'
import { getServerSideAuthGuard } from '../../server/lib/auth'
import { useStudent } from '../../contexts'
import { activeProfileAtom, SidebarTabs } from '../../stores'
import {
  Basics,
  Certifications,
  Course,
  Education,
  ProfileSection,
  ProfileSidebar,
  Projects,
  Skills,
  WorkExperience,
} from '../../components/student'
import { MIcon } from '../../components/lib'
import { AppLayout } from '../../components/globals/AppLayout'
import IconPhUser from '~icons/ph/user.jsx'

export const getServerSideProps = getServerSideAuthGuard(['STUDENT'])

const StudentProfile: NextPageWithLayout = () => {
  useStudent()

  const setActiveTab = useSetAtom(activeProfileAtom)

  useEffect(() => {
    void setActiveTab('basics')
  })

  const debouncedHandler = useCallback(
    () =>
      // debounce makes sure we invoke the scroll check after some delay
      debounce(() => {
        const elements = [
          getElement('basics'),
          getElement('course'),
          getElement('education'),
          getElement('experience'),
          getElement('skills'),
          getElement('projects'),
          getElement('certifications'),
        ]

        for (let i = 0; i < elements.length; i++) {
          const curr = elements[i]
          const prev = elements[i - 1]

          const [active, id] = isSectionActive(curr as any, prev as any)

          if (active) {
            void setActiveTab(id)
          } else {
            continue
          }
        }

        function getElement(id: SidebarTabs) {
          return document.getElementById(id)
        }

        function isSectionActive(curr: HTMLElement, next: HTMLElement): [boolean, SidebarTabs | null] {
          const { y } = curr.getBoundingClientRect()

          if (y > 120 && next !== undefined && next.getBoundingClientRect().y < 200)
            return [true, next.id as SidebarTabs]

          if (y > 0 && y < 120) return [true, curr.id as SidebarTabs]

          return [false, null]
        }
      }, 150)(),
    [setActiveTab],
  )

  useEvent('scroll', debouncedHandler, typeof window !== 'undefined' ? window : undefined, {
    capture: true,
    passive: true,
  })

  function closeDrawer(tab: SidebarTabs) {
    // dismiss the dropdown
    document.activeElement instanceof HTMLElement && document.activeElement?.blur()

    // we're not using route anchors as it's hard to pin active tab
    document.getElementById(tab)?.scrollIntoView({ behavior: 'smooth' })
    void setActiveTab(tab)
  }

  return (
    <div className="flex items-start gap-2">
      <div className="mb-[100px] flex flex-grow flex-col gap-2">
        <ProfileSection id="basics">
          <Basics />
        </ProfileSection>

        <ProfileSection id="course">
          <Course />
        </ProfileSection>

        <ProfileSection id="education">
          <Education />
        </ProfileSection>

        <ProfileSection id="experience">
          <WorkExperience />
        </ProfileSection>

        <ProfileSection id="skills">
          <Skills />
        </ProfileSection>

        <ProfileSection id="projects">
          <Projects />
        </ProfileSection>

        <ProfileSection id="certifications">
          <Certifications />
        </ProfileSection>
      </div>

      <div className="hidden max-h-screen w-60 overflow-y-auto rounded-sm bg-base-200 p-1 sm:sticky sm:top-0 sm:block sm:shadow-md">
        <ProfileSidebar onClick={closeDrawer} />
      </div>

      {/* bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex h-12 w-full justify-center border-t border-base-300 bg-base-200 transition-all duration-300 ease-in-out sm:hidden">
        <div className="dropdown dropdown-top w-full">
          <label tabIndex={0} className="btn btn-ghost btn-block flex gap-2 rounded-none">
            <MIcon className="text-lg">
              <IconPhUser />
            </MIcon>

            <span>Profile menu</span>
          </label>

          <ProfileSidebar
            tabIndex={0}
            className="dropdown-content inset-0 bg-base-200 p-2 shadow"
            onClick={closeDrawer}
          />
        </div>
      </div>
    </div>
  )
}

StudentProfile.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default StudentProfile
