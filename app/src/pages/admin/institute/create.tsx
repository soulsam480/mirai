import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { ManageInstitute } from '../../../components/admin/institute/ManageInstitute'
import { AppLayout } from '../../../components/globals/AppLayout'
import { MDialog } from '../../../components/lib'
import { getServerSideAuthGuard } from '../../../server/lib/auth'
import { NextPageWithLayout } from '../../_app'

export const getServerSideProps = getServerSideAuthGuard(['ADMIN'])

const CreateInstitute: NextPageWithLayout = () => {
  const router = useRouter()

  useEffect(() => {
    void router.prefetch('/admin/institute')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MDialog show onClose={() => null} noEscape>
      <ManageInstitute />
    </MDialog>
  )
}

CreateInstitute.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default CreateInstitute
