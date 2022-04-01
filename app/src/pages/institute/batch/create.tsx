import ManageBatch from 'components/batch/ManageBatch'
import { AppLayout } from 'components/globals/AppLayout'
import { MDialog } from 'components/lib/MDialog'
import { useRouter } from 'next/router'
import { NextPageWithLayout } from 'pages/_app'
import { useEffect } from 'react'
import { getServerSideAuthGuard } from 'server/lib/auth'

export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD'])

const Batch: NextPageWithLayout = () => {
  const router = useRouter()

  useEffect(() => {
    void router.prefetch('/institute/batch')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MDialog show onClose={async () => await router.push('institute/batch')}>
      <div className="inline-block p-6 my-8 overflow-hidden align-middle transition-all transform rounded-lg shadow-lg bg-amber-50">
        <ManageBatch />
      </div>
    </MDialog>
  )
}

Batch.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default Batch
