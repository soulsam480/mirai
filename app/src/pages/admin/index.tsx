import { AppLayout } from '../../components/globals/AppLayout'
import { getServerSideAuthGuard } from '../../server/lib/auth'
import { NextPageWithLayout } from '../_app'

export const getServerSideProps = getServerSideAuthGuard(['ADMIN'])

const Admin: NextPageWithLayout = () => {
  return <div>Admin</div>
}

Admin.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default Admin
