import { AppLayout } from 'components/globals/AppLayout'
import { getServerSideAuthGuard } from 'server/lib/auth'
import { NextPageWithLayout } from 'pages/_app'
import { Batch } from '@prisma/client'
import { Column, MTable } from 'components/lib/MTable'
import PageLayout from 'components/globals/PageLayout'
import { useMemo } from 'react'
import MLink from 'components/lib/MLink'
import { MDialog } from 'components/lib/MDialog'
import { useRouter } from 'next/router'
import { useBatches } from 'contexts/useBatch'
import ManageBatch from 'components/batch/ManageBatch'

// TODO: add support for admin view
export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD'])

const Batches: NextPageWithLayout = () => {
  const router = useRouter()
  const { batches, isLoading } = useBatches()

  const columns = useMemo<Array<Column<Batch>>>(
    () => [
      {
        field: 'id',
        label: 'ID',
        headerClasses: '!bg-primary',
        classes: 'bg-amber-100',
      },
      {
        field: 'name',
        label: 'Name',
        headerClasses: '!bg-primary',
        classes: 'bg-amber-100',
      },
      {
        field: 'duration',
        label: 'Duration',
        headerClasses: '!bg-primary',
        classes: 'bg-amber-100',
        // format: ({ inCharge }) => <>{inCharge ?? '-'}</>,
      },
      {
        field: 'status',
        label: 'Status',
        headerClasses: '!bg-primary',
        classes: 'bg-amber-100',
        // format: ({ inCharge }) => <>{inCharge ?? '-'}</>,
      },
      {
        field: 'edit',
        label: 'Edit',
        headerClasses: '!bg-primary',
        classes: 'bg-amber-100',
        format: ({ id }) => (
          <MLink href={`/institute/batch?batchId=${id as number}`} as={`/institute/batch/${id as number}`}>
            <IconLaPenSquare className="text-lg" />
          </MLink>
        ),
      },
    ],
    [],
  )

  return (
    <PageLayout.PageWrapper>
      <PageLayout.PageHeader createActionUrl="/institute/batch/create" createLabel="Create new" headerLabel="Batch" />

      <MTable
        className="mt-4"
        columns={columns}
        rows={batches}
        compact
        noDataLabel={'No batches were found !'}
        loading={isLoading}
      />

      <MDialog show={router.query.batchId !== undefined} onClose={async () => await router.push('/institute/batch')}>
        <ManageBatch />
      </MDialog>
    </PageLayout.PageWrapper>
  )
}

Batches.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default Batches
