import { AppLayout } from '../../components/globals/AppLayout'
import { getServerSideAuthGuard } from '../../server/lib/auth'
import { NextPageWithLayout } from '../_app'

export const getServerSideProps = getServerSideAuthGuard(['STUDENT'])

const Student: NextPageWithLayout = () => {
  return <div>Student Feed home</div>
}

Student.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default Student
