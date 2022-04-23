import { AppLayout } from 'components/globals/AppLayout'
import { getServerSideAuthGuard } from 'server/lib/auth'
import { NextPageWithLayout } from 'pages/_app'
import { ManageDepartment } from 'components/institute/department/ManageDepartment'

export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD'])

const Department: NextPageWithLayout = () => {
  return <ManageDepartment />
}

Department.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default Department
