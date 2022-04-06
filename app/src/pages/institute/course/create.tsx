import { AppLayout } from 'components/globals/AppLayout'
import { getServerSideAuthGuard } from 'server/lib/auth'
import { NextPageWithLayout } from 'pages/_app'
import { ManageCourse } from 'components/course/ManageCourse'
import { MDialog } from 'components/lib/MDialog'
import { useRouter } from 'next/router'

export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD'])

const CreateCourse: NextPageWithLayout = () => {
  const router = useRouter()

  return (
    <MDialog show onClose={async () => await router.push('/institute/course')}>
      <ManageCourse />
    </MDialog>
  )
}

CreateCourse.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default CreateCourse
