import Link from 'next/link'
import { AppLayout } from '../../../components/globals/AppLayout'
import { getServerSideAuthGuard } from '../../../server/lib/auth'
import { NextPageWithLayout } from '../../_app'

export const getServerSideProps = getServerSideAuthGuard(['ADMIN'])

const Institutes: NextPageWithLayout = () => {
  return (
    <div>
      <div className="flex justify-end">
        <Link href={'/admin/student/manage'}>
          <a className="btn btn-primary btn-sm">Create new</a>
        </Link>
      </div>
    </div>
  )
}

Institutes.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default Institutes
