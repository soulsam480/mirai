import { AppLayout } from 'components/globals/AppLayout'
import { getServerSideAuthGuard } from 'server/lib/auth'
import { NextPageWithLayout } from 'pages/_app'
import { ManageCourse } from 'components/institute/course/ManageCourse'
import { MDialog } from 'components/lib/MDialog'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD'])

const CreateCourse: NextPageWithLayout = () => {
  const router = useRouter()

  useEffect(() => {
    void router.prefetch('/institute/course')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MDialog show onClose={() => null} noEscape>
      <ManageCourse />
    </MDialog>
  )
}

CreateCourse.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default CreateCourse
