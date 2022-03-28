import { AppLayout } from 'components/globals/AppLayout'
import Link from 'next/link'
import { NextPageWithLayout } from 'pages/_app'
import { getServerSideAuthGuard } from 'server/lib/auth'

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
