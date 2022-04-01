import { AppLayout } from 'components/globals/AppLayout'
import { getServerSideAuthGuard } from 'server/lib/auth'
import { NextPageWithLayout } from 'pages/_app'
import { ManageCourse } from 'components/course/ManageCourse'

export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD'])

const UpdateCourse: NextPageWithLayout = () => {
  return <ManageCourse />
}

UpdateCourse.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default UpdateCourse
