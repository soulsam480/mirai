import { ManageInstitute } from '../../../components/admin/institute/ManageInstitute'
import { AppLayout } from '../../../components/globals/AppLayout'
import { getServerSideAuthGuard } from '../../../server/lib/auth'
import { NextPageWithLayout } from '../../_app'

export const getServerSideProps = getServerSideAuthGuard(['ADMIN'])

const Institute: NextPageWithLayout = () => {
  return <ManageInstitute />
}

Institute.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default Institute
