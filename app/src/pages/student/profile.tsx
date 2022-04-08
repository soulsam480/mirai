import { AppLayout } from 'components/globals/AppLayout'
import { Basics } from 'components/student/profile/Basics'
import { WorkExperience } from 'components/student/profile/WorkExperience'
import { ProfileSection } from 'components/student/ProfileSection'
import { ProfileSidebar } from 'components/student/ProfileSidebar'
import { useStudent } from 'contexts/student'
import { getServerSideAuthGuard } from 'server/lib/auth'
import { NextPageWithLayout } from '../_app'

export const getServerSideProps = getServerSideAuthGuard(['STUDENT'])

const StudentProfile: NextPageWithLayout = () => {
  useStudent()

  return (
    <div className="flex space-x-2">
      <div className="flex-grow">
        <ProfileSection>
          <Basics />
          <WorkExperience />
        </ProfileSection>
      </div>
      <div className="hidden max-h-screen px-1 overflow-y-auto rounded-md sm:sticky sm:top-0 sm:shadow sm:shadow-amber-200 w-60 sm:block">
        <ProfileSidebar />
      </div>
    </div>
  )
}

StudentProfile.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default StudentProfile
