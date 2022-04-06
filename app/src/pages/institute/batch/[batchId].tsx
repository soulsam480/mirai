import { AppLayout } from 'components/globals/AppLayout'
import { getServerSideAuthGuard } from 'server/lib/auth'
import { NextPageWithLayout } from 'pages/_app'
import ManageBatch from 'components/batch/ManageBatch'

export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD'])

const UpdateBatch: NextPageWithLayout = () => {
  return <ManageBatch />
}

UpdateBatch.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default UpdateBatch
