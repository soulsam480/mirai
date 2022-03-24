import { AppLayout } from 'components/globals/AppLayout'
import { getServerSideAuthGuard } from 'server/lib/auth'
import { NextPageWithLayout } from 'pages/_app'
import { MDialog } from 'components/lib/MDialog'
import { useRouter } from 'next/router'
import { ManageDepartment } from 'components/department/ManageDepartment'
import { useEffect } from 'react'

export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD'])

const Department: NextPageWithLayout = () => {
  const router = useRouter()

  useEffect(() => {
    void router.prefetch('/institute/department')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MDialog show onClose={async () => await router.push('/institute/department')}>
      <div className="inline-block p-6 my-8 overflow-hidden align-middle transition-all transform rounded-lg shadow-lg bg-amber-50">
        <ManageDepartment />
      </div>
    </MDialog>
  )
}

Department.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default Department
