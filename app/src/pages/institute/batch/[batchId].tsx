import { AppLayout } from '../../../components/globals/AppLayout'
import ManageBatch from '../../../components/institute/batch/ManageBatch'
import { getServerSideAuthGuard } from '../../../server/lib/auth'
import { NextPageWithLayout } from '../../_app'

export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD'])

const UpdateBatch: NextPageWithLayout = () => {
  return <ManageBatch />
}

UpdateBatch.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default UpdateBatch
