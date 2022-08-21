import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { AppLayout } from '../../../components/globals/AppLayout'
import ManageBatch from '../../../components/institute/batch/ManageBatch'
import { MDialog } from '../../../components/lib'
import { getServerSideAuthGuard } from '../../../server/lib/auth'
import { NextPageWithLayout } from '../../_app'

export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD'])

const Batch: NextPageWithLayout = () => {
  const router = useRouter()

  useEffect(() => {
    void router.prefetch('/institute/batch')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MDialog show onClose={() => null} noEscape>
      <ManageBatch />
    </MDialog>
  )
}

Batch.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default Batch
