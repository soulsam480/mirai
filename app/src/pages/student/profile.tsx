import { AppLayout } from 'components/globals/AppLayout'
import { ProfileSidebar } from 'components/student/ProfileSidebar'
import { getServerSideAuthGuard } from 'server/lib/auth'
import { NextPageWithLayout } from '../_app'

export const getServerSideProps = getServerSideAuthGuard(['STUDENT'])

const StudentProfile: NextPageWithLayout = () => {
  return (
    <div className="flex space-x-2">
      <div className="flex-grow"></div>
      <div className="hidden max-h-screen px-1 overflow-y-auto sm:sticky sm:top-0 sm:border-l sm:border-amber-200 w-60 sm:block">
        <ProfileSidebar />
      </div>
    </div>
  )
}

StudentProfile.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default StudentProfile
