import { AppLayout } from 'components/globals/AppLayout'
import { Basics } from 'components/student/profile/Basics'
import { Education } from 'components/student/profile/Education'
import { Certifications } from 'components/student/profile/Certification'
import { Projects } from 'components/student/profile/Project'
import { Skills } from 'components/student/profile/Skill'
import { WorkExperience } from 'components/student/profile/WorkExperience'
import { ProfileSection } from 'components/student/ProfileSection'
import { ProfileSidebar } from 'components/student/ProfileSidebar'
import { useStudent } from 'contexts/student'
import { getServerSideAuthGuard } from 'server/lib/auth'
import { NextPageWithLayout } from '../_app'
import { useEvent } from 'react-use'
import { activeProfileAtom, SidebarTabs } from 'stores/activeProfile'
import { useCallback } from 'react'
import throttle from 'lodash/throttle'
import { useSetAtom } from 'jotai'

export const getServerSideProps = getServerSideAuthGuard(['STUDENT'])

const StudentProfile: NextPageWithLayout = () => {
  useStudent()

  const setActiveTab = useSetAtom(activeProfileAtom)

  const debouncedHandler = useCallback(
    () =>
      throttle(() => {
        const elements = [
          getElement('experience'),
          getElement('skills'),
          getElement('projects'),
          getElement('certifications'),
        ]

        for (let i = 0; i < elements.length; i++) {
          const curr = elements[i]

          const [active, id] = isSectionActive(curr as any)

          if (active) {
            void setActiveTab(id)
          } else {
            continue
          }
        }

        function getElement(id: SidebarTabs) {
          return document.getElementById(id)
        }

        function isSectionActive(curr: HTMLElement): [boolean, SidebarTabs | null] {
          const { y } = curr.getBoundingClientRect()

          if (y > 0 && y < 150) return [true, curr.id as SidebarTabs]

          return [false, null]
        }
      }, 150)(),
    [setActiveTab],
  )

  useEvent('scroll', debouncedHandler, typeof window !== 'undefined' ? window : undefined, { capture: true })

  return (
    <div className="flex items-start space-x-2">
      <div className="flex flex-col flex-grow gap-2 mb-[100px]">
        <ProfileSection id="basics">
          <Basics />
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

      <div className="hidden max-h-screen p-1 overflow-y-auto rounded-md sm:sticky sm:top-0 sm:shadow sm:shadow-amber-200 w-60 sm:block">
        <ProfileSidebar />
      </div>
    </div>
  )
}

StudentProfile.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default StudentProfile
