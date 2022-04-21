import { AppLayout } from 'components/globals/AppLayout'
import { NextPageWithLayout } from 'pages/_app'
import { getServerSideAuthGuard } from 'server/lib/auth'
import { ManageInstitute } from 'components/institute/ManageInstitute'
import { useRouter } from 'next/router'
import { MDialog } from 'components/lib/MDialog'
import { useEffect } from 'react'

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
