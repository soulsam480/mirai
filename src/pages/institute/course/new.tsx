import { AppLayout } from 'components/globals/AppLayout'
import { getServerSideAuthGuard } from 'server/lib/auth'
import { NextPageWithLayout } from 'pages/_app'

export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD'])

const CreateCourse: NextPageWithLayout = () => {
  return <div>Department info</div>
}

CreateCourse.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default CreateCourse
